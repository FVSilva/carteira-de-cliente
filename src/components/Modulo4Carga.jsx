import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FUNCOES = ["gp", "gt", "designer", "copywriter"];
const FUNCAO_LABEL = { gp: "GP", gt: "GT", designer: "Designer", copywriter: "Copywriter" };

function getColor(count) {
  if (count > 20) return "#e11d48";
  if (count > 15) return "#f59e0b";
  return "#3f3f46";
}

export default function Modulo4Carga({ data }) {
  const [funcao, setFuncao] = useState("gp");

  const countMap = {};
  data.forEach((r) => { const n = r[funcao]; if (n) countMap[n] = (countMap[n] || 0) + 1; });
  const barData = Object.entries(countMap).map(([name, clientes]) => ({ name, clientes })).sort((a, b) => b.clientes - a.clientes);

  const gpSet = [...new Set(data.map((r) => r.gp).filter(Boolean))].sort();
  const gtSet = [...new Set(data.map((r) => r.gt).filter(Boolean))].sort();
  const matriz = {};
  data.forEach((r) => { if (r.gp && r.gt) { const k = `${r.gp}|${r.gt}`; matriz[k] = (matriz[k] || 0) + 1; } });

  return (
    <section>
      <h2 className="module-title">Carga por Colaborador</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Barras */}
        <div className="module-card">
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {FUNCOES.map((f) => (
              <button key={f} onClick={() => setFuncao(f)}
                style={{ padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                  background: funcao === f ? "#e11d48" : "#f3f4f6",
                  color: funcao === f ? "#fff" : "#374151" }}>
                {FUNCAO_LABEL[f]}
              </button>
            ))}
          </div>
          <p className="section-title">Clientes por {FUNCAO_LABEL[funcao]}</p>

          {barData.some((d) => d.clientes > 20) && (
            <div style={{ marginBottom: 10, padding: "8px 12px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, fontSize: 12, color: "#991b1b" }}>
              ⚠️ Colaborador com mais de 20 clientes detectado.
            </div>
          )}
          {barData.some((d) => d.clientes > 15 && d.clientes <= 20) && (
            <div style={{ marginBottom: 10, padding: "8px 12px", background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8, fontSize: 12, color: "#854d0e" }}>
              ⚠️ Colaborador com mais de 15 clientes detectado.
            </div>
          )}

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ left: -10, right: 10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip />
              <Bar dataKey="clientes" radius={[4, 4, 0, 0]} name="Clientes">
                {barData.map((e, i) => <Cell key={i} fill={getColor(e.clientes)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", gap: 12, fontSize: 11, marginTop: 8, color: "#6b7280" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#3f3f46", marginRight: 4 }} />Normal</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", marginRight: 4 }} />&gt;15</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#e11d48", marginRight: 4 }} />&gt;20</span>
          </div>
        </div>

        {/* Matriz GP × GT */}
        <div className="module-card" style={{ overflowX: "auto" }}>
          <p className="section-title">Matriz GP × GT</p>
          <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ padding: "6px 8px", background: "#f9fafb", border: "1px solid #e5e7eb", textAlign: "left", color: "#6b7280", fontWeight: 600 }}>GP \ GT</th>
                {gtSet.map((gt) => (
                  <th key={gt} style={{ padding: "6px 8px", background: "#f9fafb", border: "1px solid #e5e7eb", textAlign: "center", color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>{gt}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gpSet.map((gp) => (
                <tr key={gp}>
                  <td style={{ padding: "6px 8px", border: "1px solid #f3f4f6", fontWeight: 600, color: "#374151", background: "#f9fafb", whiteSpace: "nowrap" }}>{gp}</td>
                  {gtSet.map((gt) => {
                    const val = matriz[`${gp}|${gt}`] || 0;
                    return (
                      <td key={gt} style={{ padding: "6px 8px", border: "1px solid #f3f4f6", textAlign: "center" }}>
                        {val > 0 ? (
                          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: val > 5 ? "#fee2e2" : "#f3f4f6", color: val > 5 ? "#e11d48" : "#374151", fontSize: 11, fontWeight: 700 }}>
                            {val}
                          </span>
                        ) : <span style={{ color: "#e5e7eb" }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
