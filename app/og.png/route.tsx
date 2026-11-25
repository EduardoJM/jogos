import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getAllGames, formatNumber } from "@/lib/games";

// Imagem de compartilhamento (Open Graph), gerada no build com os números reais da coleção.
// Fica em /og.png: com extensão, o GitHub Pages serve como image/png.
export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

const MIME: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

// Lê capas locais (/capas/...) como data URI. O gerador só aceita JPEG/PNG, então WebP fica de fora.
function coverDataUri(cover?: string) {
  if (!cover?.startsWith("/")) return null;
  const mime = MIME[path.extname(cover).toLowerCase()];
  const file = path.join(process.cwd(), "public", cover);
  if (!mime || !fs.existsSync(file)) return null;
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
}

export function GET() {
  const games = getAllGames();
  const finished = games.filter((g) => g.status === "zerado" || g.status === "platinado").length;
  const hours = Math.round(games.reduce((sum, g) => sum + (g.hours ?? 0), 0));
  const covers = games.map((g) => coverDataUri(g.cover)).filter((c): c is string => c !== null).slice(0, 4);

  const stats = [
    { value: games.length, label: "jogos" },
    { value: finished, label: "finalizados" },
    { value: hours, label: "horas" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #0f1115 0%, #1a1530 100%)", color: "#e8eaed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", width: 680 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#a78bfa", letterSpacing: 4, textTransform: "uppercase" }}>
            Minha coleção
          </div>
          <div style={{ display: "flex", fontSize: 80, lineHeight: 1.05, whiteSpace: "nowrap", marginTop: 12 }}>
            Jogos jogados
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#9aa0a6", marginTop: 16 }}>
            Zerados, platinados e em andamento.
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 48 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex", flexDirection: "column", padding: "16px 24px", borderRadius: 16,
                  background: "#181b21", border: "1px solid #2a2e36",
                }}
              >
                <div style={{ display: "flex", fontSize: 48, color: "#a78bfa" }}>{formatNumber(s.value)}</div>
                <div style={{ display: "flex", fontSize: 22, color: "#9aa0a6" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Capas em leque à direita */}
        {covers.map((src, i) => (
          <img
            key={i}
            src={src}
            width={210}
            height={280}
            style={{
              position: "absolute", top: 175 + (i % 2 === 0 ? -30 : 30), left: 660 + i * 105,
              objectFit: "cover", borderRadius: 16, border: "4px solid #2a2e36",
              transform: `rotate(${(i - (covers.length - 1) / 2) * 6}deg)`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          />
        ))}
      </div>
    ),
    size,
  );
}
