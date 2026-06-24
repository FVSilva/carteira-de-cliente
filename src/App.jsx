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
    <div style={{ minHeight: "100vh", background: "#09090b" }}>
      {/* Header */}
      <header className="dash-header">
        <div style={{ maxWidth: 1536, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>
              Carteira de Clientes —{" "}
              <span style={{ color: "#e11d48" }}>Squad Midas</span>
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: "#71717a", marginTop: 2 }}>
              Muniz &amp; Co. · Instrumento de gestão
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {lastFetch && (
              <span style={{ fontSize: 11, color: "#71717a" }}>
                Dados de {lastFetch.toLocaleTimeString("pt-BR")}
              </span>
            )}
            <button className="btn-brand" onClick={fetchData} disabled={loading}>
              {loading ? "Carregando..." : "Atualizar dados"}
            </button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div style={{ background: "#fef3c7", borderBottom: "1px solid #fcd34d", padding: "8px 24px", fontSize: 13, color: "#92400e", display: "flex", justifyContent: "space-between" }}>
          <span>⚠️ {error} — exibindo dados locais.</span>
          <button onClick={fetchData} style={{ background: "none", border: "none", textDecoration: "underline", color: "#b45309", cursor: "pointer", fontSize: 12 }}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Filtros globais */}
      <GlobalFilters data={data} filters={filters} setFilters={setFilters} />

      {/* Contador */}
      <div style={{ maxWidth: 1536, margin: "0 auto", padding: "10px 24px 0" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#71717a" }}>
          Exibindo <strong style={{ color: "#a1a1aa" }}>{filtered.length}</strong> de{" "}
          <strong style={{ color: "#a1a1aa" }}>{data.length}</strong> clientes
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ maxWidth: 1536, margin: "0 auto", padding: "8px 24px" }}>
          <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#be123c" }}>
            Buscando dados da planilha...
          </div>
        </div>
      )}

      {/* Módulos */}
      <main style={{ maxWidth: 1536, margin: "0 auto", padding: "24px", display: "flex", flexDirection: "column", gap: 32 }}>
        <Modulo1KPI data={filtered} />
        <Modulo2Financeiro data={filtered} />
        <Modulo3Churn data={filtered} />
        <Modulo4Carga data={filtered} />
        <Modulo5Tabela data={filtered} />
      </main>

      <footer style={{ maxWidth: 1536, margin: "0 auto", padding: "24px", textAlign: "center", fontSize: 11, color: "#d1d5db" }}>
        Squad Midas · Muniz &amp; Co. · Dashboard v1.0
      </footer>
    </div>
  );
}
