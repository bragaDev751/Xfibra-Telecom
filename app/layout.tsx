import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XFibra | Internet Ultraveloz e Fibra Óptica Dedicada",
  description: "Conecte sua casa ou empresa à ultravelocidade da XFibra. Estabilidade absoluta, suporte humanizado local e planos sem franquia de dados.",
  keywords: ["internet banda larga", "fibra óptica", "provedor de internet", "XFibra", "internet estável"],
  authors: [{ name: "XFibra Telecom" }],
  openGraph: {
    title: "XFibra | Internet Ultraveloz e Fibra Óptica Dedicada",
    description: "Estabilidade absoluta, suporte rápido e planos que cabem no seu bolso. Consulte a cobertura para o seu CEP.",
    url: "https://xfibra.com.br",
    siteName: "XFibra",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}