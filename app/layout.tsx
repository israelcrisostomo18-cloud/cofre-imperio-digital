import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIRJE Quizzes | Conectados no Altar",
  description:
    "Plataforma de quizzes biblicos, pesquisas e acompanhamento da MIRJE - Ministerio Internacional Reconstruindo Jerusalem.",
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
