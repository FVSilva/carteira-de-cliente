import { useState, useMemo } from "react";
import GlobalFilters from "./components/GlobalFilters";
import Modulo1KPI from "./components/Modulo1KPI";
import Modulo2Financeiro from "./components/Modulo2Financeiro";
import Modulo3Churn from "./components/Modulo3Churn";
import Modulo4Carga from "./components/Modulo4Carga";
import Modulo5Tabela from "./components/Modulo5Tabela";
import { useSheetData } from "./hooks/useSheetData";
import { applyFilters } from "./utils/filters";
import "./index.css";

export default function App() {
  const { data, loading, error, lastFetch, fetchData } = useSheetData();

  const mrrValues = data.map((r) => r.mrrMensalidade).filter(Boolean);
  const globalMax = Math.max(...mrrValues, 5000);

  const [filters, setFilters] = useState({
    tipoContrato: [],
    gp: "",
    gt: "",
    mrrMin: 0,
    mrrMax: globalMax,
    status: [],
    dataInicio: "",
    dataFim: "",
  });

  const filtered = useMemo(() => applyFilters(data, filters), [data, filters]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-white m-0">
              Carteira de Clientes —{" "}
              <span className="text-red-400">Squad Midas</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Muniz &amp; Co. · Instrumento de gestão</p>
          </div>
          <div className="flex items-center gap-3">
            {lastFetch && (
              <span className="text-xs text-gray-400">
                Dados de {lastFetch.toLocaleTimeString("pt-BR")}
              </span>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Carregando..." : "Atualizar dados"}
            </button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center justify-between">
          <span>⚠️ {error} — exibindo dados locais.</span>
          <button onClick={fetchData} className="underline text-amber-700 text-xs">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Filtros globais */}
      <GlobalFilters data={data} filters={filters} setFilters={setFilters} />

      {/* Contador */}
      <div className="max-w-screen-2xl mx-auto px-4 pt-3">
        <p className="text-xs text-gray-400">
          Exibindo{" "}
          <strong className="text-gray-700">{filtered.length}</strong> de{" "}
          <strong className="text-gray-700">{data.length}</strong> clientes
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-screen-2xl mx-auto px-4 py-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 animate-pulse">
            Buscando dados da planilha...
          </div>
        </div>
      )}

      {/* Módulos */}
      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-8">
        <Modulo1KPI data={filtered} />
        <Modulo2Financeiro data={filtered} />
        <Modulo3Churn data={filtered} />
        <Modulo4Carga data={filtered} />
        <Modulo5Tabela data={filtered} />
      </main>

      <footer className="max-w-screen-2xl mx-auto px-4 py-6 text-center text-xs text-gray-300">
        Squad Midas · Muniz &amp; Co. · Dashboard v1.0
      </footer>
    </div>
  );
}
