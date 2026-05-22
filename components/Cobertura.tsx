"use client"

import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react'

interface CoberturaProps {
  cidadeDetectada: string
}

export default function Cobertura({ cidadeDetectada }: CoberturaProps) {
  
  // Define o título principal baseado na geolocalização recebida do pai
  const obterTituloRegiao = () => {
    if (cidadeDetectada === 'Detectando') return 'A Internet Oficial da Sua Região'
    if (cidadeDetectada === 'Geral') return 'A Internet Oficial da Sua Cidade'
    return `A Internet Oficial de ${cidadeDetectada}`
  }

  // Gera o link do WhatsApp customizado com o nome da cidade atual
  const gerarLinkWhats = () => {
    const complementoCidade = 
      cidadeDetectada === 'Detectando' || cidadeDetectada === 'Geral'
        ? 'minha cidade'
        : `aqui em ${cidadeDetectada}`

    const mensagem = `Olá! Vi o site da XFibra e gostaria de verificar a disponibilidade dos planos para a minha rua ${complementoCidade}.`
    return `https://wa.me/5588999247400?text=${encodeURIComponent(mensagem)}`
  }

  return (
    <section id="cobertura" className="py-24 px-6 max-w-7xl mx-auto relative border-t border-slate-900 w-full box-border">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
          Disponibilidade Local
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4 text-white transition-all duration-300">
          {obterTituloRegiao()}
        </h2>
        <p className="text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          Nossa rede de fibra óptica de última geração cobre toda a área urbana e principais regiões. Sem intermediários, sem sotaque e com suporte que resolve de verdade.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-md max-w-xl mx-auto shadow-2xl text-center box-border">
        <div className="w-12 h-12 bg-cyan-950/60 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400">
          <MapPin className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-100">Consulte sua Rua Instantaneamente</h3>
        <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed">
          Como nossa equipe é 100% local, nossos consultores conseguem checar a viabilidade técnica da sua instalação em menos de 5 minutos pelo WhatsApp.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ultravelocidade Garantida
          </div>
          <div className="hidden sm:block text-slate-700">•</div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instalação Agilizada
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/60 pt-6">
          <a 
            href={gerarLinkWhats()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 px-6 py-4 rounded-xl transition-all shadow-lg shadow-cyan-400/10 group box-border"
          >
            Consultar Viabilidade na minha Rua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}