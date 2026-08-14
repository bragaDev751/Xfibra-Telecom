"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-slate-800/40 bg-[#0B0F19]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO XFIBRA */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Xfibra Telecom Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* LINKS DE NAVEGAÇÃO */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/#planos" className="hover:text-cyan-400 transition-colors">Planos</Link>
          <Link href="/#cobertura" className="hover:text-cyan-400 transition-colors">Cobertura</Link>
          <Link href="/#diferenciais" className="hover:text-cyan-400 transition-colors">Vantagens</Link>
          
          {/* LINK PARA A NOVA PÁGINA DO APP */}
          <Link href="/app" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center gap-1">
            <span>📱</span> App Mobile
          </Link>
          
          {/* LINK DE SUPORTE */}
          <a 
            href="https://wa.me/5588999247400" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition-colors"
          >
            Suporte
          </a>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex items-center gap-3">
          <a 
            href="https://xfibra.atlaz.com.br/central" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/5 block"
          >
            Área do Cliente
          </a>

          <Link 
            href="/admin/login" 
            className="px-3.5 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Painel Administrativo"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>

      </div>
    </nav>
  )
}