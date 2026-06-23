import { useState, useCallback } from "react";
import { INITIAL_DATA, SHEETS_ID, SHEETS_GID } from "../data/initialData";

function parseSheetRows(values) {
  if (!values || values.length < 2) return null;
  const headers = values[0];
  const idx = (name) => headers.findIndex((h) => h?.toLowerCase().includes(name.toLowerCase()));

  const iSquad = idx("squad");
  const iEntrada = idx("entrada");
  const iCliente = idx("cliente");
  const iStatus = idx("status");
  const iRenovacao = idx("renovação");
  const iTipo = idx("tipo");
  const iMrrTotal = idx("mrr total");
  const iMeses = idx("meses");
  const iMrrMens = idx("mensalidade");
  const iCloser = idx("closer");
  const iGp = idx("gp");
  const iGt = idx("gt");
  const iDesigner = idx("designer");
  const iCopy = idx("copywriter");

  return values.slice(1).map((row) => ({
    squad: row[iSquad] ?? "",
    dataEntrada: row[iEntrada] ?? "",
    cliente: row[iCliente] ?? "",
    status: row[iStatus] ?? "",
    dataRenovacao: row[iRenovacao] ?? "",
    tipoContrato: row[iTipo] ?? "",
    mrrTotal: parseFloat(String(row[iMrrTotal] ?? "0").replace(/[^0-9.]/g, "")) || 0,
    nMeses: parseInt(row[iMeses] ?? "0") || 0,
    mrrMensalidade: parseFloat(String(row[iMrrMens] ?? "0").replace(/[^0-9.]/g, "")) || 0,
    closer: row[iCloser] ?? "",
    gp: row[iGp] ?? "",
    gt: row[iGt] ?? "",
    designer: row[iDesigner] ?? "",
    copywriter: row[iCopy] ?? "",
  })).filter((r) => r.cliente);
}

export function useSheetData() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&gid=${SHEETS_GID}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const csv = await res.text();

      // Parse CSV to rows
      const rows = csv.split("\n").map((line) =>
        line.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim())
      );
      const parsed = parseSheetRows(rows);
      if (parsed && parsed.length > 0) {
        setData(parsed);
      } else {
        throw new Error("Nenhum dado válido encontrado na planilha.");
      }
      setLastFetch(new Date());
    } catch (err) {
      setError(err.message || "Erro ao carregar dados da planilha.");
      setLastFetch(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, lastFetch, fetchData };
}
