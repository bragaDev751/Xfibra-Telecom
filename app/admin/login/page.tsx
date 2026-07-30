'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErro('E-mail ou senha incorretos. Verifique suas credenciais.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Luzes de Fundo (Grafismo / Ambient Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Decorativo no Fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Card de Login Glassmorphic */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/80">
        
        {/* Logo & Cabeçalho */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl mx-auto mb-4 shadow-lg shadow-blue-500/30 border border-blue-400/30">
            X
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Xfibra Telecom
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Painel Administrativo de Gestão
          </p>
        </div>

        {/* Alerta de Erro */}
        {erro && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl text-center backdrop-blur-md animate-fade-in">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              E-mail de Acesso
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/90 focus:border-blue-500/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition shadow-inner"
                placeholder="admin@xfibra.com.br"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Senha
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800/90 focus:border-blue-500/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Acessar Painel →</span>
            )}
          </button>
        </form>

        {/* Rodapé */}
        <p className="text-[11px] text-center text-slate-500 mt-8">
          &copy; {new Date().getFullYear()} Xfibra Telecom. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}