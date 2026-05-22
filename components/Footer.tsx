"use client"

import { MapPin, Clock, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-[#070a12] text-slate-400 text-sm py-16 px-6 w-full box-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-left">
        
        {/* LOGO */}
        <div className="w-full">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
            <span>X</span><span className="text-white font-medium text-lg tracking-normal -ml-1">FIBRA</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-xs md:text-sm max-w-sm">
            A melhor experiência em conectividade e ultravelocidade. Leve estabilidade para a sua casa ou empresa com suporte de ponta.
          </p>
        </div>

        {/* SUPORTE */}
        <div className="space-y-3 w-full">
          <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-2 text-cyan-400">Atendimento Técnico</h4>
          <div className="flex items-start gap-2.5 text-xs md:text-sm text-slate-400">
            <Phone className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
            <div>
              <p>(88) 9 9924-7400</p>
              <p>(88) 9 9765-2675</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-slate-400">
            <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
            <p className="truncate">atendimento@xfibratelecom.com.br</p>
          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="space-y-3 w-full">
          <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-2 text-cyan-400">Endereço Presencial</h4>
          <div className="flex items-start gap-2.5 text-xs md:text-sm text-slate-400">
            <MapPin className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
            <p>Rua Avenida Arrojado Lisboa, 62. Centro, Banabuiú - CE.</p>
          </div>
          <div className="flex items-start gap-2.5 text-xs md:text-sm text-slate-400">
            <Clock className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
            <div>
              <p>Seg - Sex: 8:00 às 17:00</p>
              <p>Sáb: 8:00 às 12:00</p>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900/60 mt-12 pt-6 text-center text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} XFibra Telecom. Todos os direitos reservados.</p>
        <p className="text-[10px]">Desenvolvido com Next.js & Sanity CMS</p>
      </div>
    </footer>
  )
}