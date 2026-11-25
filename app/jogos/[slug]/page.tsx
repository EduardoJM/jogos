import type { Metadata } from "next";
import Link from "next/link";
import { getGame, getGameSlugs, formatDate, formatNumber } from "@/lib/games";
import StatusBadge from "@/app/StatusBadge";
import Cover from "@/app/Cover";

type Props = { params: Promise<{ slug: string }> };

// Gera uma página estática por arquivo .md
export function generateStaticParams() {
  return getGameSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  return { title: `${game.title} · Jogos jogados` };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGame(slug);

  return (
    <article className="game-detail">
      <Link href="/" className="back">← Voltar</Link>
      <div className="detail-header">
        <Cover src={game.cover} title={game.title} className="cover cover-lg" />
        <h1>{game.title}</h1>
      </div>
      <dl className="details">
        <dt>Plataforma</dt><dd>{game.platform}</dd>
        {game.emulator && (<><dt>Emulador</dt><dd>{game.emulator}</dd></>)}
        <dt>Status</dt><dd><StatusBadge status={game.status} /></dd>
        {game.rating !== undefined && (<><dt>Nota</dt><dd>{game.rating}/10</dd></>)}
        {game.hours !== undefined && (<><dt>Horas</dt><dd>{formatNumber(game.hours)}h</dd></>)}
        {game.finishedAt && (<><dt>Finalizado em</dt><dd>{formatDate(game.finishedAt)}</dd></>)}
        {game.genres.length > 0 && (<><dt>Gêneros</dt><dd>{game.genres.join(", ")}</dd></>)}
      </dl>
      <div className="prose" dangerouslySetInnerHTML={{ __html: game.contentHtml }} />
    </article>
  );
}
