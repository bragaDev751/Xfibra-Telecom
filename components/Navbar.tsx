"use client"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-slate-800/40 bg-[#0B0F19]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO XFIBRA */}
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
          <span>X</span>
          <span className="text-white font-medium text-lg tracking-normal -ml-1">FIBRA</span>
        </div>

        {/* LINKS DE NAVEGAÇÃO */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#planos" className="hover:text-cyan-400 transition-colors">Planos</a>
          <a href="#cobertura" className="hover:text-cyan-400 transition-colors">Cobertura</a>
          <a href="#diferenciais" className="hover:text-cyan-400 transition-colors">Vantagens</a>
          
          {/* LINK DE SUPORTE COM O SEU NÚMERO CONFIGURADO */}
          <a 
            href="https://wa.me/5588999247400" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition-colors"
          >
            Suporte
          </a>
        </div>

        {/* BOTÃO CENTRAL DO ASSINANTE */}
        <div>
          <a 
            href="https://xfibra.atlaz.com.br/central" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/5 block"
          >
            Área do Cliente
          </a>
        </div>

      </div>
    </nav>
  )
}