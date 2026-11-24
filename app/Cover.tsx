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
  return <img src={src} alt={`Capa de ${title}`} className={className} loading="lazy" />;
}
