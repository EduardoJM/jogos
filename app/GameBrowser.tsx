"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { GameMeta } from "@/lib/games";
import { formatDate } from "@/lib/format";
import StatusBadge from "./StatusBadge";
import Cover from "./Cover";

const ALL = "todos";
const NO_DATE = "sem-data";

type Option = { value: string; label: string };
type Filters = { ano: string; plataforma: string };
const PARAMS = ["ano", "plataforma"] as const;

function uniqueSorted(values: string[], desc = false) {
  const sorted = Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR"));
  return desc ? sorted.reverse() : sorted;
}

export default function GameBrowser({ games }: { games: GameMeta[] }) {
  const [filters, setFilters] = useState<Filters>({ ano: ALL, plataforma: ALL });

  const options = useMemo<Record<keyof Filters, Option[]>>(() => {
    const years = uniqueSorted(games.flatMap((g) => (g.finishedAt ? [g.finishedAt.slice(0, 4)] : [])), true);
    const platforms = uniqueSorted(games.map((g) => g.platform));
    return {
      ano: [
        { value: ALL, label: "Todos" },
        ...years.map((y) => ({ value: y, label: y })),
        ...(games.some((g) => !g.finishedAt) ? [{ value: NO_DATE, label: "Sem data" }] : []),
      ],
      plataforma: [{ value: ALL, label: "Todas" }, ...platforms.map((p) => ({ value: p, label: p }))],
    };
  }, [games]);

  // Lê ?ano= e ?plataforma= da URL ao carregar (o site é estático, então isso só acontece no navegador).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Partial<Filters> = {};
    for (const key of PARAMS) {
      const v = params.get(key);
      if (v && options[key].some((o) => o.value === v)) fromUrl[key] = v;
    }
    if (Object.keys(fromUrl).length) setFilters((f) => ({ ...f, ...fromUrl }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(key: keyof Filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    const url = new URL(window.location.href);
    if (value === ALL) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    window.history.replaceState(null, "", url);
  }

  const filtered = games.filter((g) => {
    const { ano, plataforma } = filters;
    if (plataforma !== ALL && g.platform !== plataforma) return false;
    if (ano === NO_DATE) return !g.finishedAt;
    if (ano !== ALL) return g.finishedAt?.startsWith(ano) ?? false;
    return true;
  });
  // Arredonda para 2 casas para evitar erros de ponto flutuante (ex: 236.60000000000002).
  const totalHours = Math.round(filtered.reduce((sum, g) => sum + (g.hours ?? 0), 0) * 100) / 100;

  const stats = [
    { label: "jogos", value: filtered.length },
    { label: "finalizados", value: filtered.filter((g) => g.status === "zerado" || g.status === "platinado").length },
    { label: "horas", value: totalHours },
  ];

  const groups: { key: keyof Filters; label: string }[] = [
    { key: "plataforma", label: "Plataforma" },
    { key: "ano", label: "Ano de término" },
  ];

  return (
    <>
      <div className="filters">
        {groups.map(({ key, label }) => (
          <div key={key} className="filter" role="group" aria-label={`Filtrar por ${label.toLowerCase()}`}>
            <span className="filter-label">{label}:</span>
            {options[key].map((o) => (
              <button
                key={o.value}
                type="button"
                className="filter-chip"
                aria-pressed={filters[key] === o.value}
                onClick={() => select(key, o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <section className="summary" aria-label="Resumo">
        {stats.map((st) => (
          <div key={st.label} className="summary-card">
            <strong>{st.value}</strong>
            <span>{st.label}</span>
          </div>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="empty">Nenhum jogo encontrado.</p>
      ) : (
        <ul className="game-list">
          {filtered.map((g) => (
            <li key={g.slug}>
              <Link href={`/jogos/${g.slug}`} className="game-card">
                <Cover src={g.cover} title={g.title} />
                <div className="game-card-body">
                  <div className="game-card-top">
                    <h2>{g.title}</h2>
                    {g.rating !== undefined && <span className="rating">{g.rating}/10</span>}
                  </div>
                  <div className="game-card-meta">
                    <span>{g.platform}</span>
                    {g.emulator && <span className="emulator" title="Emulador">🕹️ {g.emulator}</span>}
                    <StatusBadge status={g.status} />
                    {g.finishedAt && <span>{formatDate(g.finishedAt)}</span>}
                    {g.hours !== undefined && <span>{g.hours}h</span>}
                  </div>
                  {g.genres.length > 0 && (
                    <div className="genres">
                      {g.genres.map((genre) => <span key={genre}>{genre}</span>)}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
