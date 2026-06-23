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
    setFilters({
      tipoContrato: [],
      gp: "",
      gt: "",
      mrrMin: globalMin,
      mrrMax: globalMax,
      status: [],
      dataInicio: "",
      dataFim: "",
    });
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-4 items-end">

          {/* Tipo de Contrato */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tipo de Contrato</label>
            <div className="flex gap-1">
              {tipos.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleList("tipoContrato", t)}
                  className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                    filters.tipoContrato.includes(t)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* GP */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">GP</label>
            <select
              value={filters.gp}
              onChange={(e) => setFilters((f) => ({ ...f, gp: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Todos</option>
              {gps.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* GT */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">GT</label>
            <select
              value={filters.gt}
              onChange={(e) => setFilters((f) => ({ ...f, gt: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Todos</option>
              {gts.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Faixa de MRR */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              MRR Mensalidade: R${filters.mrrMin.toLocaleString("pt-BR")} – R${filters.mrrMax.toLocaleString("pt-BR")}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min={globalMin}
                max={globalMax}
                step={100}
                value={filters.mrrMin}
                onChange={(e) => setFilters((f) => ({ ...f, mrrMin: Math.min(Number(e.target.value), f.mrrMax - 100) }))}
                className="w-24 accent-indigo-600"
              />
              <input
                type="range"
                min={globalMin}
                max={globalMax}
                step={100}
                value={filters.mrrMax}
                onChange={(e) => setFilters((f) => ({ ...f, mrrMax: Math.max(Number(e.target.value), f.mrrMin + 100) }))}
                className="w-24 accent-indigo-600"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
            <div className="flex gap-1">
              {allStatus.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleList("status", s)}
                  className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                    filters.status.includes(s)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Período de Entrada */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Entrada de</label>
            <div className="flex gap-1 items-center">
              <input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters((f) => ({ ...f, dataInicio: e.target.value }))}
                className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="text-gray-400 text-xs">até</span>
              <input
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters((f) => ({ ...f, dataFim: e.target.value }))}
                className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="px-4 py-1.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
