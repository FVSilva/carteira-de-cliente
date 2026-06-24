import { uniqueValues } from "../utils/filters";

export default function GlobalFilters({ data, filters, setFilters }) {
  const gps = uniqueValues(data, "gp");
  const gts = uniqueValues(data, "gt");
  const allStatus = uniqueValues(data, "status");
  const tipos = ["Executar", "Saber", "Ter"];
  const mrrValues = data.map((r) => r.mrrMensalidade).filter(Boolean);
  const globalMin = Math.min(...mrrValues, 0);
  const globalMax = Math.max(...mrrValues, 5000);

  function toggleList(field, value) {
    setFilters((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  function resetFilters() {
    setFilters({ tipoContrato: [], gp: "", gt: "", mrrMin: globalMin, mrrMax: globalMax, status: [], dataInicio: "", dataFim: "" });
  }

  return (
    <div className="dash-filters">
      <div style={{ maxWidth: 1536, margin: "0 auto", padding: "12px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>

          {/* Tipo de Contrato */}
          <div>
            <label className="filter-label">Tipo de Contrato</label>
            <div style={{ display: "flex", gap: 4 }}>
              {tipos.map((t) => (
                <button key={t} onClick={() => toggleList("tipoContrato", t)}
                  className={`filter-chip ${filters.tipoContrato.includes(t) ? "active" : ""}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* GP */}
          <div>
            <label className="filter-label">GP</label>
            <select className="filter-select" value={filters.gp}
              onChange={(e) => setFilters((f) => ({ ...f, gp: e.target.value }))}>
              <option value="">Todos</option>
              {gps.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* GT */}
          <div>
            <label className="filter-label">GT</label>
            <select className="filter-select" value={filters.gt}
              onChange={(e) => setFilters((f) => ({ ...f, gt: e.target.value }))}>
              <option value="">Todos</option>
              {gts.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Faixa de MRR */}
          <div>
            <label className="filter-label">
              MRR: R${filters.mrrMin.toLocaleString("pt-BR")} – R${filters.mrrMax.toLocaleString("pt-BR")}
            </label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="range" min={globalMin} max={globalMax} step={100}
                value={filters.mrrMin}
                onChange={(e) => setFilters((f) => ({ ...f, mrrMin: Math.min(Number(e.target.value), f.mrrMax - 100) }))}
                style={{ width: 90, accentColor: "#e11d48" }} />
              <input type="range" min={globalMin} max={globalMax} step={100}
                value={filters.mrrMax}
                onChange={(e) => setFilters((f) => ({ ...f, mrrMax: Math.max(Number(e.target.value), f.mrrMin + 100) }))}
                style={{ width: 90, accentColor: "#e11d48" }} />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="filter-label">Status</label>
            <div style={{ display: "flex", gap: 4 }}>
              {allStatus.map((s) => (
                <button key={s} onClick={() => toggleList("status", s)}
                  className={`filter-chip ${filters.status.includes(s) ? "active" : ""}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="filter-label">Entrada de</label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="date" className="filter-date" value={filters.dataInicio}
                onChange={(e) => setFilters((f) => ({ ...f, dataInicio: e.target.value }))} />
              <span style={{ color: "#52525b", fontSize: 11 }}>até</span>
              <input type="date" className="filter-date" value={filters.dataFim}
                onChange={(e) => setFilters((f) => ({ ...f, dataFim: e.target.value }))} />
            </div>
          </div>

          <button onClick={resetFilters}
            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#a1a1aa", background: "transparent", border: "1px solid #3f3f46", borderRadius: 8, cursor: "pointer" }}>
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
