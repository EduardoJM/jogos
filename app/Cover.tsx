/* eslint-disable @next/next/no-img-element */
// <img> simples: funciona com URLs externas e arquivos de /public no export estático.
export default function Cover({
  src,
  title,
  className = "cover",
}: {
  src?: string;
  title: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={`${className} cover-placeholder`} aria-hidden="true">
        {title.charAt(0).toUpperCase()}
      </div>
    );
  }
  // <img> não recebe o basePath automaticamente; prefixa caminhos locais (ex: /capas/...).
  const url = src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
  return <img src={url} alt={`Capa de ${title}`} className={className} loading="lazy" />;
}
