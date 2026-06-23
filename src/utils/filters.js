export function applyFilters(data, filters) {
  return data.filter((row) => {
    if (filters.tipoContrato.length > 0 && !filters.tipoContrato.includes(row.tipoContrato)) return false;
    if (filters.gp && row.gp !== filters.gp) return false;
    if (filters.gt && row.gt !== filters.gt) return false;
    if (row.mrrMensalidade < filters.mrrMin || row.mrrMensalidade > filters.mrrMax) return false;
    if (filters.status.length > 0 && !filters.status.includes(row.status)) return false;
    if (filters.dataInicio || filters.dataFim) {
      const entrada = new Date(row.dataEntrada);
      if (filters.dataInicio && entrada < new Date(filters.dataInicio)) return false;
      if (filters.dataFim && entrada > new Date(filters.dataFim)) return false;
    }
    return true;
  });
}

export function uniqueValues(data, key) {
  return [...new Set(data.map((r) => r[key]).filter(Boolean))].sort();
}

export function longevidade(dataEntrada) {
  const hoje = new Date();
  const entrada = new Date(dataEntrada);
  const meses = (hoje.getFullYear() - entrada.getFullYear()) * 12 + (hoje.getMonth() - entrada.getMonth());
  return Math.max(0, meses);
}

export function faixaLongevidade(meses) {
  if (meses <= 6) return "0–6 meses";
  if (meses <= 12) return "7–12 meses";
  if (meses <= 24) return "13–24 meses";
  return "24+ meses";
}

export function diasParaRenovacao(dataRenovacao) {
  const hoje = new Date();
  const renovacao = new Date(dataRenovacao);
  return Math.ceil((renovacao - hoje) / (1000 * 60 * 60 * 24));
}

export function corRenovacao(dias) {
  if (dias <= 30) return "red";
  if (dias <= 60) return "yellow";
  return "green";
}

export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBRLShort(value) {
  if (value >= 1000) return `R$${(value / 1000).toFixed(1)}k`;
  return `R$${value}`;
}
