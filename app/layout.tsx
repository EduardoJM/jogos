import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const title = "Jogos jogados";
const description = "Minha lista de jogos jogados";
const image = {
  url: "og.png", // relativo ao metadataBase, que já inclui o basePath no GitHub Pages
  width: 1200,
  height: 630,
  alt: "Jogos jogados — minha lista de jogos zerados, platinados e em andamento",
};

export const metadata: Metadata = {
  // URL pública do site (definida no workflow de deploy), usada para gerar links absolutos da imagem de compartilhamento.
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title,
  description,
  openGraph: { title, description, type: "website", locale: "pt_BR", images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <Link href="/">🎮 Jogos jogados</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
