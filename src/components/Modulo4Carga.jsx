import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FUNCOES = ["gp", "gt", "designer", "copywriter"];
const FUNCAO_LABEL = { gp: "GP", gt: "GT", designer: "Designer", copywriter: "Copywriter" };

function getColor(count) {
  if (count > 20) return "#ef4444";
  if (count > 15) return "#f59e0b";
  return "#6366f1";
}

export default function Modulo4Carga({ data }) {
  const [funcao, setFuncao] = useState("gp");

  // Contagem por colaborador para a função selecionada
  const countMap = {};
  data.forEach((r) => {
    const nome = r[funcao];
    if (nome) countMap[nome] = (countMap[nome] || 0) + 1;
  });
  const barData = Object.entries(countMap)
    .map(([name, clientes]) => ({ name, clientes }))
    .sort((a, b) => b.clientes - a.clientes);

  // Matriz de alocação cruzada GP × GT
  const gpSet = [...new Set(data.map((r) => r.gp).filter(Boolean))].sort();
  const gtSet = [...new Set(data.map((r) => r.gt).filter(Boolean))].sort();
  const matriz = {};
  data.forEach((r) => {
    if (r.gp && r.gt) {
      const key = `${r.gp}|${r.gt}`;
      matriz[key] = (matriz[key] || 0) + 1;
    }
  });

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Carga por Colaborador</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Barras por função */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex gap-2 mb-4 flex-wrap">
            {FUNCOES.map((f) => (
              <button
                key={f}
                onClick={() => setFuncao(f)}
                className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
                  funcao === f
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {FUNCAO_LABEL[f]}
              </button>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Clientes por {FUNCAO_LABEL[funcao]}</h3>

          {/* Alertas */}
          {barData.some((d) => d.clientes > 20) && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              ⚠️ Colaboradores com mais de 20 clientes detectados.
            </div>
          )}
          {barData.some((d) => d.clientes > 15 && d.clientes <= 20) && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
              ⚠️ Colaboradores com mais de 15 clientes detectados.
            </div>
          )}

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ left: -10, right: 10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="clientes" radius={[4, 4, 0, 0]} name="Clientes">
                {barData.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.clientes)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex gap-3 text-xs mt-2">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Normal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> &gt;15 clientes</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> &gt;20 clientes</span>
          </div>
        </div>

        {/* Matriz GP × GT */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Matriz de Alocação GP × GT</h3>
          <table className="text-xs border-collapse w-full">
            <thead>
              <tr>
                <th className="p-1.5 bg-gray-50 border border-gray-100 text-left font-semibold text-gray-500">GP \ GT</th>
                {gtSet.map((gt) => (
                  <th key={gt} className="p-1.5 bg-gray-50 border border-gray-100 font-semibold text-gray-500 text-center whitespace-nowrap">{gt}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gpSet.map((gp) => (
                <tr key={gp}>
                  <td className="p-1.5 border border-gray-100 font-semibold text-gray-700 bg-gray-50 whitespace-nowrap">{gp}</td>
                  {gtSet.map((gt) => {
                    const val = matriz[`${gp}|${gt}`] || 0;
                    return (
                      <td key={gt} className="p-1.5 border border-gray-100 text-center">
                        {val > 0 ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            val > 5 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {val}
                          </span>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
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
