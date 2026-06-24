import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { longevidade, faixaLongevidade, diasParaRenovacao, corRenovacao, formatBRL } from "../utils/filters";

const FAIXAS = ["0–6 meses", "7–12 meses", "13–24 meses", "24+ meses"];

const BADGE = {
  red:    { bg: "#fee2e2", color: "#991b1b", label: "≤30 dias" },
  yellow: { bg: "#fef9c3", color: "#854d0e", label: "31–60 dias" },
  green:  { bg: "#dcfce7", color: "#166534", label: "61–90 dias" },
};

export default function Modulo3Churn({ data }) {
  const faixaCount = {};
  FAIXAS.forEach((f) => (faixaCount[f] = 0));
  data.forEach((r) => { faixaCount[faixaLongevidade(longevidade(r.dataEntrada))]++; });
  const histData = FAIXAS.map((f) => ({ faixa: f, qtd: faixaCount[f] }));

  const renovacoes90 = data
    .map((r) => ({ ...r, dias: diasParaRenovacao(r.dataRenovacao) }))
    .filter((r) => r.dias >= 0 && r.dias <= 90)
    .sort((a, b) => a.dias - b.dias);

  const emTer = data.filter((r) => r.status === "Ter");

  return (
    <section>
      <h2 className="module-title">Longevidade e Risco de Churn</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Histograma */}
        <div className="module-card">
          <p className="section-title">Tempo de Casa</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={histData} margin={{ left: -10 }}>
              <XAxis dataKey="faixa" tick={{ fontSize: 10, fill: "#6b7280" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip />
              <Bar dataKey="qtd" fill="#e11d48" radius={[4, 4, 0, 0]} name="Clientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Renovações 90 dias */}
        <div className="module-card" style={{ overflowY: "auto", maxHeight: 260 }}>
          <p className="section-title">Renovações — Próximos 90 Dias</p>
          {renovacoes90.length === 0 ? (
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Nenhuma renovação nos próximos 90 dias.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {renovacoes90.map((r) => {
                const b = BADGE[corRenovacao(r.dias)];
                return (
                  <div key={r.cliente} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{r.cliente}</span>
                    <span style={{ background: b.bg, color: b.color, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{b.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabela Ter */}
        <div className="module-card" style={{ overflowY: "auto", maxHeight: 260 }}>
          <p className="section-title">
            Clientes em Status "Ter"{" "}
            <span style={{ color: "#e11d48" }}>({emTer.length})</span>
          </p>
          {emTer.length === 0 ? (
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Nenhum cliente em status Ter.</p>
          ) : (
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "#9ca3af", borderBottom: "1px solid #f3f4f6" }}>
                  <th style={{ textAlign: "left", padding: "4px 0" }}>Cliente</th>
                  <th style={{ textAlign: "left", padding: "4px 0" }}>GP</th>
                  <th style={{ textAlign: "right", padding: "4px 0" }}>MRR</th>
                </tr>
              </thead>
              <tbody>
                {emTer.map((r) => (
                  <tr key={r.cliente} style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "6px 0", color: "#374151" }}>{r.cliente}</td>
                    <td style={{ padding: "6px 0", color: "#6b7280" }}>{r.gp}</td>
                    <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 600, color: "#e11d48" }}>{formatBRL(r.mrrMensalidade)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
