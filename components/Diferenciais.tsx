"use client"

import { Zap, ShieldCheck, HeartHandshake, Infinity } from 'lucide-react'
import FadeIn from './FadeIn'

const vantagens = [
  {
    icone: <Zap className="w-5 h-5 md:h-6 md:w-6 text-cyan-400" />,
    titulo: "Velocidade Real",
    descricao: "Sua ultravelocidade sem quedas ou lentidão, perfeita para jogar online, trabalhar e assistir em 4K simultaneamente."
  },
  {
    icone: <ShieldCheck className="w-5 h-5 md:h-6 md:w-6 text-emerald-400" />,
    titulo: "Estabilidade Absoluta",
    descricao: "Conexão via fibra óptica dedicada de ponta a ponta, protegida contra interferências externas e mau tempo."
  },
  {
    icone: <HeartHandshake className="w-5 h-5 md:h-6 md:w-6 text-purple-400" />,
    titulo: "Suporte Humanizado",
    descricao: "Atendimento rápido, local e humanizado. Sem robôs que te fazem perder tempo quando você mais precisa."
  },
  {
    icone: <Infinity className="w-5 h-5 md:h-6 md:w-6 text-amber-400" />,
    titulo: "Sem Franquia de Dados",
    descricao: "Navegue, faça downloads e assista a quantos vídeos quiser sem se preocupar com redução de velocidade no fim do mês."
  }
]

export default function Diferenciais() {
  return (
    <section id="diferenciais" className="py-16 md:py-24 px-4 max-w-7xl mx-auto relative border-t border-slate-900 scroll-mt-20 overflow-hidden">
      
      {/* Efeito de luz de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[250px] bg-cyan-500/5 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      {/* Título da Seção */}
      <div className="text-center mb-12 md:mb-16 px-2">
        <FadeIn delay={0.1}>
          <span className="text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            Por que escolher a XFibra?
          </span>
        </FadeIn>
        <FadeIn delay={0.2}>
          <h2 className="text-2xl md:text-5xl font-black tracking-tight mt-4 max-w-xl mx-auto leading-tight">
            A conexão que transforma sua rotina
          </h2>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-slate-400 mt-2 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Muito além de cabos e roteadores, entregamos a estabilidade que você precisa para evoluir no digital.
          </p>
        </FadeIn>
      </div>

      {/* Grid Blindado contra bugs do Tailwind v4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10 px-2 md:px-0">
        {vantagens.map((vantagem, idx) => (
          <div 
            key={idx}
            className="p-5 md:p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-start"
          >
            {/* Ícone */}
            <div className="p-2.5 md:p-3 bg-slate-950/80 border border-slate-800 rounded-xl md:rounded-2xl w-fit mb-4 md:mb-5 shadow-inner">
              {vantagem.icone}
            </div>

            {/* Textos */}
            <h3 className="text-lg md:text-xl font-bold text-slate-100 mb-2 tracking-tight">
              {vantagem.titulo}
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              {vantagem.descricao}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}