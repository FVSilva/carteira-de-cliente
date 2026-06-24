import { formatBRL, diasParaRenovacao } from "../utils/filters";

const CARDS = [
  { key: "ativos", label: "Clientes Ativos", accent: false },
  { key: "mrr", label: "MRR Total", sub: "somente Executar", accent: true },
  { key: "ticket", label: "Ticket Médio", sub: "MRR ÷ clientes", accent: false },
  { key: "renov30", label: "Renovações em 30 dias", sub: "contratos a vencer", accent: true },
  { key: "ter", label: "Em Status Ter", sub: "risco de churn", accent: false },
];

export default function Modulo1KPI({ data }) {
  const ativos = data.filter((r) => r.status === "Ativo");
  const executar = data.filter((r) => r.tipoContrato === "Executar");
  const mrrTotal = executar.reduce((s, r) => s + r.mrrMensalidade, 0);
  const ticketMedio = ativos.length > 0 ? mrrTotal / ativos.length : 0;
  const renovacoes30 = data.filter((r) => { const d = diasParaRenovacao(r.dataRenovacao); return d >= 0 && d <= 30; }).length;
  const emTer = data.filter((r) => r.status === "Ter").length;

  const values = {
    ativos: ativos.length,
    mrr: formatBRL(mrrTotal),
    ticket: formatBRL(ticketMedio),
    renov30: renovacoes30,
    ter: emTer,
  };

  return (
    <section>
      <h2 className="module-title">Visão Geral da Carteira</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {CARDS.map((c) => (
          <div key={c.key} className="kpi-card" style={c.accent ? { borderLeft: "4px solid #e11d48" } : {}}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {c.label}
            </p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: c.accent ? "#e11d48" : "#f4f4f5" }}>
              {values[c.key]}
            </p>
            {c.sub && <p style={{ margin: 0, fontSize: 11, color: "#52525b", marginTop: 4 }}>{c.sub}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
