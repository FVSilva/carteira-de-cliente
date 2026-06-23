import { formatBRL, diasParaRenovacao } from "../utils/filters";

function KPICard({ label, value, sub, color = "indigo" }) {
  const colors = {
    indigo: "from-indigo-500 to-indigo-700",
    emerald: "from-emerald-500 to-emerald-700",
    amber: "from-amber-400 to-amber-600",
    rose: "from-rose-500 to-rose-700",
    violet: "from-violet-500 to-violet-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 text-white shadow-lg`}>
      <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

export default function Modulo1KPI({ data }) {
  const ativos = data.filter((r) => r.status === "Ativo");
  const executar = data.filter((r) => r.tipoContrato === "Executar");
  const mrrTotal = executar.reduce((s, r) => s + r.mrrMensalidade, 0);
  const ticketMedio = ativos.length > 0 ? mrrTotal / ativos.length : 0;
  const renovacoes30 = data.filter((r) => {
    const d = diasParaRenovacao(r.dataRenovacao);
    return d >= 0 && d <= 30;
  }).length;
  const emTer = data.filter((r) => r.status === "Ter").length;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Visão Geral da Carteira</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard label="Clientes ativos" value={ativos.length} color="indigo" />
        <KPICard label="MRR Total" value={formatBRL(mrrTotal)} sub="somente Executar" color="emerald" />
        <KPICard label="Ticket médio" value={formatBRL(ticketMedio)} sub="MRR ÷ clientes ativos" color="violet" />
        <KPICard label="Renovações em 30 dias" value={renovacoes30} sub="contratos a vencer" color="amber" />
        <KPICard label="Em status Ter" value={emTer} sub="risco de churn" color="rose" />
      </div>
    </section>
  );
}
