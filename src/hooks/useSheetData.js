import { useState, useCallback, useEffect } from "react";
import { INITIAL_DATA, SHEETS_ID, SHEETS_GID } from "../data/initialData";

function parseCSV(csv) {
  const lines = [];
  let cur = "", inQuote = false;
  const cells = [];

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') {
      if (inQuote && csv[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      cells.push(cur); cur = "";
    } else if ((ch === '\n' || ch === '\r') && !inQuote) {
      cells.push(cur); cur = "";
      if (cells.some(c => c.trim())) lines.push([...cells]);
      cells.length = 0;
      if (ch === '\r' && csv[i + 1] === '\n') i++;
    } else {
      cur += ch;
    }
  }
  if (cur || cells.length) { cells.push(cur); if (cells.some(c => c.trim())) lines.push(cells); }
  return lines;
}

function findCol(headers, ...terms) {
  return headers.findIndex(h =>
    terms.some(t => h.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .includes(t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")))
  );
}

function parseMoney(v) {
  if (!v) return 0;
  return parseFloat(String(v).replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".")) || 0;
}

const PT_MONTHS = { jan:1,fev:2,mar:3,abr:4,mai:5,jun:6,jul:7,ago:8,set:9,out:10,nov:11,dez:12 };

function parseDate(v) {
  if (!v) return "";
  const s = v.trim();
  // DD/MM/YYYY
  const slash = s.split("/");
  if (slash.length === 3) return `${slash[2]}-${slash[1].padStart(2,"0")}-${slash[0].padStart(2,"0")}`;
  // D-mmm.-YYYY or D-mmm-YYYY (e.g. "7-jul.-2025")
  const dash = s.match(/^(\d{1,2})-([a-záéíóúâãêôç.]+)-(\d{4})$/i);
  if (dash) {
    const mon = PT_MONTHS[dash[2].toLowerCase().replace(/\./g,"").slice(0,3)];
    if (mon) return `${dash[3]}-${String(mon).padStart(2,"0")}-${dash[1].padStart(2,"0")}`;
  }
  return s;
}

function rowsToData(lines) {
  if (lines.length < 2) return null;
  const headers = lines[0].map(h => h.trim());

  const iSquad    = findCol(headers, "squad");
  const iEntrada  = findCol(headers, "data inicio", "data início", "inicio", "entrada");
  const iCliente  = findCol(headers, "name", "nome", "cliente", "projeto");
  const iStatus   = findCol(headers, "status");
  const iRenov    = findCol(headers, "churn", "renova");
  const iTipo     = findCol(headers, "categoria_produto", "categoria produto", "categoria", "tipo");
  const iMrrTotal = findCol(headers, "valor do contrato", "valor contrato", "mrr total", "mrr_total");
  const iMeses    = findCol(headers, "compromisso", "meses", "n de meses", "n. de meses");
  const iMrrMens  = findCol(headers, "mensal", "mensalidade");
  const iCloser   = findCol(headers, "closer");
  const iGp       = findCol(headers, "coordenador", "gp");
  const iGt       = findCol(headers, "gt");
  const iDesigner = findCol(headers, "designer");
  const iCopy     = findCol(headers, "copy");

  const result = lines.slice(1).map(row => ({
    squad:          row[iSquad]    ?? "",
    dataEntrada:    parseDate(row[iEntrada]  ?? ""),
    cliente:        row[iCliente]  ?? "",
    status:         row[iStatus]   ?? "",
    dataRenovacao:  parseDate(row[iRenov]    ?? ""),
    tipoContrato:   row[iTipo]     ?? "",
    mrrTotal:       parseMoney(row[iMrrTotal] ?? "0"),
    nMeses:         parseInt(row[iMeses] ?? "0") || 0,
    mrrMensalidade: parseMoney(row[iMrrMens] ?? "0"),
    closer:         row[iCloser]   ?? "",
    gp:             row[iGp]       ?? "",
    gt:             row[iGt]       ?? "",
    designer:       row[iDesigner] ?? "",
    copywriter:     row[iCopy]     ?? "",
  })).filter(r => r.cliente.trim() !== "");

  return result.length > 0 ? result : null;
}

export function useSheetData() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/export?format=csv&gid=${SHEETS_GID}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const csv = await res.text();
      const parsed = rowsToData(parseCSV(csv));
      if (parsed) {
        setData(parsed);
      } else {
        throw new Error("Nenhum dado válido encontrado na planilha.");
      }
    } catch (err) {
      setError(err.message || "Erro ao carregar dados da planilha.");
    } finally {
      setLoading(false);
      setLastFetch(new Date());
    }
  }, []);

  // Busca automática ao montar
  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, lastFetch, fetchData };
}
