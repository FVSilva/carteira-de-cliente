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
  const body = rows.map((r) =>
    COLS.map((c) => {
      const v = r[c.key] ?? "";
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(",")
  ).join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "carteira_midas.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Modulo5Tabela({ data }) {
  const [busca, setBusca] = useState("");
  const [sortKey, setSortKey] = useState("cliente");
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    let filtered = busca
      ? data.filter((r) => r.cliente.toLowerCase().includes(busca.toLowerCase()))
      : data;
    filtered = [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      const result = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortAsc ? result : -result;
    });
    return filtered;
  }, [data, busca, sortKey, sortAsc]);

  function handleSort(key) {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  const statusBadge = (s) => {
    if (s === "Ativo") return "bg-emerald-100 text-emerald-700";
    if (s === "Ter") return "bg-rose-100 text-rose-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Tabela Completa da Carteira</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{rows.length} registros</span>
            <button
              onClick={() => exportCSV(rows)}
              className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Exportar CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c.key)}
                    className={`px-3 py-2.5 text-left text-gray-500 font-semibold cursor-pointer select-none whitespace-nowrap hover:text-red-600 ${
                      c.numeric ? "text-right" : ""
                    }`}
                  >
                    {c.label}
                    {sortKey === c.key && (
                      <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const dias = diasParaRenovacao(r.dataRenovacao);
                const urgente = dias >= 0 && dias <= 30;
                return (
                  <tr
                    key={r.cliente + i}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${urgente ? "bg-red-50/40" : ""}`}
                  >
                    <td className="px-3 py-2 font-medium text-gray-800">{r.cliente}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{r.tipoContrato}</td>
                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{r.dataEntrada}</td>
                    <td className={`px-3 py-2 whitespace-nowrap font-medium ${urgente ? "text-red-600" : "text-gray-600"}`}>
                      {r.dataRenovacao}
                      {urgente && <span className="ml-1 text-red-400">({dias}d)</span>}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-800">{formatBRL(r.mrrMensalidade)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{r.nMeses}</td>
                    <td className="px-3 py-2 text-gray-600">{r.gp}</td>
                    <td className="px-3 py-2 text-gray-600">{r.gt}</td>
                    <td className="px-3 py-2 text-gray-600">{r.designer}</td>
                    <td className="px-3 py-2 text-gray-600">{r.copywriter}</td>
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
