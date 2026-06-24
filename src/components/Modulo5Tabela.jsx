import { useState, useMemo } from "react";
import { formatBRL, diasParaRenovacao } from "../utils/filters";

const COLS = [
  { key: "cliente", label: "Cliente" },
  { key: "status", label: "Status" },
  { key: "tipoContrato", label: "Tipo" },
  { key: "dataEntrada", label: "Entrada" },
  { key: "dataRenovacao", label: "Renovação" },
  { key: "mrrMensalidade", label: "MRR Mens.", numeric: true },
  { key: "nMeses", label: "Meses", numeric: true },
  { key: "gp", label: "GP" },
  { key: "gt", label: "GT" },
  { key: "designer", label: "Designer" },
  { key: "copywriter", label: "Copywriter" },
];

function exportCSV(rows) {
  const header = COLS.map((c) => c.label).join(",");
  const body = rows.map((r) => COLS.map((c) => `"${String(r[c.key] ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "carteira_midas.csv"; a.click();
  URL.revokeObjectURL(url);
}

function statusBadge(s) {
  if (s === "Ativo") return <span className="badge-ativo">{s}</span>;
  if (s === "Ter") return <span className="badge-ter">{s}</span>;
  return <span className="badge-default">{s}</span>;
}

export default function Modulo5Tabela({ data }) {
  const [busca, setBusca] = useState("");
  const [sortKey, setSortKey] = useState("cliente");
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    let f = busca ? data.filter((r) => r.cliente.toLowerCase().includes(busca.toLowerCase())) : data;
    return [...f].sort((a, b) => {
      const va = a[sortKey] ?? "", vb = b[sortKey] ?? "";
      const res = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortAsc ? res : -res;
    });
  }, [data, busca, sortKey, sortAsc]);

  function handleSort(key) {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  return (
    <section>
      <h2 className="module-title">Tabela Completa da Carteira</h2>
      <div className="module-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ padding: "7px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 8, width: 240, outline: "none" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{rows.length} registros</span>
            <button onClick={() => exportCSV(rows)}
              style={{ padding: "7px 16px", fontSize: 12, fontWeight: 600, background: "#e11d48", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
              Exportar CSV
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                {COLS.map((c) => (
                  <th key={c.key} onClick={() => handleSort(c.key)}
                    style={{ padding: "10px 12px", textAlign: c.numeric ? "right" : "left", color: "#6b7280", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}>
                    {c.label}{sortKey === c.key ? (sortAsc ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const dias = diasParaRenovacao(r.dataRenovacao);
                const urgente = dias >= 0 && dias <= 30;
                return (
                  <tr key={r.cliente + i} style={{ borderBottom: "1px solid #f9fafb", background: urgente ? "#fff5f5" : "transparent" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 500, color: "#111827" }}>{r.cliente}</td>
                    <td style={{ padding: "8px 12px" }}>{statusBadge(r.status)}</td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{r.tipoContrato}</td>
                    <td style={{ padding: "8px 12px", color: "#9ca3af", whiteSpace: "nowrap" }}>{r.dataEntrada}</td>
                    <td style={{ padding: "8px 12px", whiteSpace: "nowrap", fontWeight: urgente ? 600 : 400, color: urgente ? "#e11d48" : "#6b7280" }}>
                      {r.dataRenovacao}{urgente && ` (${dias}d)`}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "#111827" }}>{formatBRL(r.mrrMensalidade)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#6b7280" }}>{r.nMeses}</td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{r.gp}</td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{r.gt}</td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{r.designer}</td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{r.copywriter}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
