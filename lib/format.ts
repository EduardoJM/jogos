// Sem dependências de Node: pode ser usado em componentes cliente.
export function formatDate(iso?: string) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
}
