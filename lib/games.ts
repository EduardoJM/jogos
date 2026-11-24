import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const GAMES_DIR = path.join(process.cwd(), "content", "jogos");

export type GameStatus = "zerado" | "jogando" | "abandonado" | "platinado";

export interface GameMeta {
  slug: string;
  title: string;
  platform: string;
  status: GameStatus;
  rating?: number; // 0–10
  hours?: number;
  finishedAt?: string; // YYYY-MM-DD
  genres: string[];
  emulator?: string; // ex: PCSX2, Dolphin, RetroArch
  cover?: string; // URL externa ou caminho em /public (ex: /capas/jogo.jpg)
}

export interface Game extends GameMeta {
  contentHtml: string;
}

function readFile(slug: string) {
  const raw = fs.readFileSync(path.join(GAMES_DIR, `${slug}.md`), "utf8");
  return matter(raw);
}

function toMeta(slug: string, data: Record<string, unknown>): GameMeta {
  const finished = data.finishedAt;
  return {
    slug,
    title: String(data.title ?? slug),
    platform: String(data.platform ?? "—"),
    status: (data.status as GameStatus) ?? "zerado",
    rating: typeof data.rating === "number" ? data.rating : undefined,
    hours: typeof data.hours === "number" ? data.hours : undefined,
    // gray-matter converte datas YAML em Date
    finishedAt:
      finished instanceof Date
        ? finished.toISOString().slice(0, 10)
        : finished
          ? String(finished)
          : undefined,
    genres: Array.isArray(data.genres) ? data.genres.map(String) : [],
    emulator: data.emulator ? String(data.emulator) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
  };
}

export function getGameSlugs(): string[] {
  return fs
    .readdirSync(GAMES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllGames(): GameMeta[] {
  return getGameSlugs()
    .map((slug) => toMeta(slug, readFile(slug).data))
    .sort((a, b) => (b.finishedAt ?? "9999").localeCompare(a.finishedAt ?? "9999"));
}

export async function getGame(slug: string): Promise<Game> {
  const { data, content } = readFile(slug);
  const processed = await remark().use(html).process(content);
  return { ...toMeta(slug, data), contentHtml: processed.toString() };
}

export { formatDate } from "./format";
