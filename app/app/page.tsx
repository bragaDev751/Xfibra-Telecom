"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AppSection from "@/components/AppSection"
import { QRCodeSVG } from "qrcode.react"
import { Download, Smartphone, ShieldCheck, Zap, RefreshCw } from "lucide-react"

export default function AppPage() {
  const urlAndroid = "https://play.google.com/store/apps/details?id=br.com.atlaz.xfibra&pli=1"
  const urlIos = "https://apps.apple.com/br/app-store/id6742653540"

  return (
    <div className="bg-[#0B0F19] text-white min-h-screen font-sans overflow-x-hidden pt-20">
      <Navbar />

      {/* HERO / CABEÇALHO DEDICADO DO APP */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <span className="px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-xs font-bold tracking-wider uppercase inline-block mb-4">
          📲 Aplicativo Oficial Xfibra
        </span>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
          Baixe o App da <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Central do Assinante</span>
        </h1>

        <p className="mt-4 text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          Aponte a câmera do seu smartphone para os QR Codes abaixo para realizar o download direto na sua loja de aplicativos.
        </p>

        {/* SEÇÃO DOS QR CODES DE DOWNLOAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12">
          
          {/* QR CODE ANDROID */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:border-cyan-500/40 transition-all">
            <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-700">
              <QRCodeSVG value={urlAndroid} size={180} level="H" />
            </div>

            <div className="mt-6">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Para smartphones</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Android</h3>
            </div>

            <a
              href={urlAndroid}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3.5 px-6 rounded-xl transition text-sm"
            >
              <Download size={18} className="text-cyan-400" />
              Baixar na Google Play
            </a>
          </div>

          {/* QR CODE iOS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:border-cyan-500/40 transition-all">
            <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-700">
              <QRCodeSVG value={urlIos} size={180} level="H" />
            </div>

            <div className="mt-6">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Para iPhones</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Apple iOS</h3>
            </div>

            <a
              href={urlIos}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3.5 px-6 rounded-xl transition text-sm"
            >
              <Download size={18} className="text-cyan-400" />
              Baixar na App Store
            </a>
          </div>

        </div>

        {/* CARDS DE RECURSOS DO APP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 text-left">
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-3">
              <Zap size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">Auto Desbloqueio</h4>
            <p className="text-xs text-slate-400 mt-1">Desbloqueie sua conexão instantaneamente após o pagamento da fatura.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-3">
              <RefreshCw size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">2ª Via de Fatura</h4>
            <p className="text-xs text-slate-400 mt-1">Copie o código Pix ou código de barras em poucos segundos.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-3">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">Segurança Total</h4>
            <p className="text-xs text-slate-400 mt-1">Consulte seus contratos, dados do plano e relatórios com segurança.</p>
          </div>
        </div>
      </section>

      {/* MOCKUP INTERATIVO DO CELULAR */}
      <AppSection />

      <Footer />
    </div>
  )
}