import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jogos jogados",
  description: "Minha lista de jogos jogados",
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
