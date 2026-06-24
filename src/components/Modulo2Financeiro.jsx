import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { formatBRL, formatBRLShort, uniqueValues } from "../utils/filters";

const COLORS = ["#ef4444", "#b91c1c", "#7f1d1d", "#dc2626", "#991b1b", "#450a0a"];

function CustomTooltipBRL({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{formatBRL(p.value)}</p>
      ))}
    </div>
  );
}

export default function Modulo2Financeiro({ data }) {
  // Top 10 por MRR Mensalidade
  const top10 = [...data]
    .sort((a, b) => b.mrrMensalidade - a.mrrMensalidade)
    .slice(0, 10)
    .map((r) => ({ name: r.cliente, mrr: r.mrrMensalidade }));

  // Donut por tipo
  const tipoMap = {};
  data.forEach((r) => {
    tipoMap[r.tipoContrato] = (tipoMap[r.tipoContrato] || 0) + r.mrrMensalidade;
  });
  const donutData = Object.entries(tipoMap).map(([name, value]) => ({ name, value }));

  // MRR médio por GP
  const gpMap = {};
  const gpCount = {};
  data.forEach((r) => {
    if (r.gp) {
      gpMap[r.gp] = (gpMap[r.gp] || 0) + r.mrrMensalidade;
      gpCount[r.gp] = (gpCount[r.gp] || 0) + 1;
    }
  });
  const gpData = Object.entries(gpMap).map(([name, total]) => ({
    name,
    mrrMedio: Math.round(total / gpCount[name]),
  })).sort((a, b) => b.mrrMedio - a.mrrMedio);

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Financeiro</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top 10 clientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Top 10 Clientes por MRR Mensalidade</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={top10} layout="vertical" margin={{ left: 60, right: 40 }}>
              <XAxis type="number" tickFormatter={formatBRLShort} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip content={<CustomTooltipBRL />} />
              <Bar dataKey="mrr" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Distribuição de MRR por Tipo</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatBRL(v)} />
              <Legend formatter={(v, e) => `${v}: ${Math.round(e.payload.value / donutData.reduce((a, d) => a + d.value, 0) * 100)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* MRR médio por GP */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">MRR Médio por GP Responsável</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={gpData} margin={{ left: 10, right: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatBRLShort} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltipBRL />} />
              <Bar dataKey="mrrMedio" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
