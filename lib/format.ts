// Sem dependências de Node: pode ser usado em componentes cliente.
export function formatDate(iso?: string) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
}

// Padrão brasileiro: "." separa milhar e "," separa decimal (ex: 1.234,5).
const numberFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
export function formatNumber(n: number) {
  return numberFormat.format(n);
}
