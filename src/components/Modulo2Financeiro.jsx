import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { formatBRL, formatBRLShort } from "../utils/filters";

const REDS = ["#e11d48", "#9f1239", "#be123c", "#881337", "#fb7185"];

function BRLTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <p style={{ margin: 0, fontWeight: 600, color: "#e4e4e7" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ margin: 0, color: "#e11d48" }}>{formatBRL(p.value)}</p>
      ))}
    </div>
  );
}

export default function Modulo2Financeiro({ data }) {
  const top10 = [...data].sort((a, b) => b.mrrMensalidade - a.mrrMensalidade).slice(0, 10)
    .map((r) => ({ name: r.cliente, mrr: r.mrrMensalidade }));

  const tipoMap = {};
  data.forEach((r) => { tipoMap[r.tipoContrato] = (tipoMap[r.tipoContrato] || 0) + r.mrrMensalidade; });
  const donutData = Object.entries(tipoMap).map(([name, value]) => ({ name, value }));
  const total = donutData.reduce((a, d) => a + d.value, 0);

  const gpMap = {}, gpCount = {};
  data.forEach((r) => {
    if (r.gp) { gpMap[r.gp] = (gpMap[r.gp] || 0) + r.mrrMensalidade; gpCount[r.gp] = (gpCount[r.gp] || 0) + 1; }
  });
  const gpData = Object.entries(gpMap).map(([name, t]) => ({ name, mrrMedio: Math.round(t / gpCount[name]) }))
    .sort((a, b) => b.mrrMedio - a.mrrMedio);

  return (
    <section>
      <h2 className="module-title">Financeiro</h2>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

        {/* Top 10 */}
        <div className="module-card">
          <p className="section-title">Top 10 Clientes por MRR Mensalidade</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={top10} layout="vertical" margin={{ left: 60, right: 40 }}>
              <XAxis type="number" tickFormatter={formatBRLShort} tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} width={110} />
              <Tooltip content={<BRLTooltip />} />
              <Bar dataKey="mrr" fill="#e11d48" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="module-card">
          <p className="section-title">MRR por Tipo de Contrato</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {donutData.map((_, i) => <Cell key={i} fill={REDS[i % REDS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [formatBRL(v), "MRR"]} />
              <Legend formatter={(v, e) => `${v}: ${Math.round((e.payload.value / total) * 100)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* MRR médio por GP */}
        <div className="module-card" style={{ gridColumn: "1 / -1" }}>
          <p className="section-title">MRR Médio por GP</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={gpData} margin={{ left: 10, right: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis tickFormatter={formatBRLShort} tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip content={<BRLTooltip />} />
              <Bar dataKey="mrrMedio" fill="#be123c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
