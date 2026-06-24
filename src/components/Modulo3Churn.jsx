import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { longevidade, faixaLongevidade, diasParaRenovacao, corRenovacao, formatBRL } from "../utils/filters";

const FAIXAS = ["0–6 meses", "7–12 meses", "13–24 meses", "24+ meses"];

export default function Modulo3Churn({ data }) {
  // Histograma de longevidade
  const faixaCount = {};
  FAIXAS.forEach((f) => (faixaCount[f] = 0));
  data.forEach((r) => {
    const meses = longevidade(r.dataEntrada);
    faixaCount[faixaLongevidade(meses)]++;
  });
  const histData = FAIXAS.map((f) => ({ faixa: f, qtd: faixaCount[f] }));

  // Renovações próximos 90 dias
  const renovacoes90 = data
    .map((r) => ({ ...r, dias: diasParaRenovacao(r.dataRenovacao) }))
    .filter((r) => r.dias >= 0 && r.dias <= 90)
    .sort((a, b) => a.dias - b.dias);

  // Tabela Ter
  const emTer = data.filter((r) => r.status === "Ter");

  const badgeColor = {
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-emerald-100 text-emerald-700",
  };
  const badgeLabel = { red: "≤30 dias", yellow: "31–60 dias", green: "61–90 dias" };

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Longevidade e Risco de Churn</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Histograma */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Distribuição por Tempo de Casa</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={histData} margin={{ left: -10 }}>
              <XAxis dataKey="faixa" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="qtd" fill="#ef4444" radius={[4, 4, 0, 0]} name="Clientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline renovações */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Renovações nos Próximos 90 Dias</h3>
          {renovacoes90.length === 0 ? (
            <p className="text-sm text-gray-400 mt-4">Nenhuma renovação nos próximos 90 dias.</p>
          ) : (
            <div className="space-y-2">
              {renovacoes90.map((r) => {
                const cor = corRenovacao(r.dias);
                return (
                  <div key={r.cliente} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-700 truncate max-w-[140px]">{r.cliente}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeColor[cor]}`}>
                      {badgeLabel[cor]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabela Ter */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            Clientes em Status "Ter" <span className="text-rose-500">({emTer.length})</span>
          </h3>
          {emTer.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum cliente em status Ter.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left py-1">Cliente</th>
                  <th className="text-left py-1">GP</th>
                  <th className="text-right py-1">MRR</th>
                </tr>
              </thead>
              <tbody>
                {emTer.map((r) => (
                  <tr key={r.cliente} className="border-b border-gray-50">
                    <td className="py-1.5 text-gray-700">{r.cliente}</td>
                    <td className="py-1.5 text-gray-500">{r.gp}</td>
                    <td className="py-1.5 text-right font-medium text-rose-600">{formatBRL(r.mrrMensalidade)}</td>
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
