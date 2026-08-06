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
  title: "XFibra Telecom | Internet Ultraveloz e Fibra Óptica Dedicada",
  description: "Sistema Integrado de Gestão e Provedor de Internet",
  icons: {
    icon: "/logo.png", // Aponta diretamente para public/logo.png
  },
  keywords: ["internet banda larga", "fibra óptica", "provedor de internet", "XFibra"],
  authors: [{ name: "XFibra Telecom" }],
  openGraph: {
    title: "XFibra Telecom",
    description: "Conecte sua casa ou empresa com ultravelocidade.",
    url: "https://xfibra.com.br",
    siteName: "XFibra",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B0F19] text-slate-100 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}