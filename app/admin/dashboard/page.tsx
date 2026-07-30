'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import EstoqueSection, { Produto } from './components/EstoqueSection'
import FinanceiroSection, { Despesa, Pedido } from './components/FinanceiroSection'

export default function DashboardPage() {
  const [abaAtiva, setAbaAtiva] = useState<'estoque' | 'financeiro'>('estoque')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const supabase = createClient()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || ''

  const carregarDados = useCallback(async () => {
    setLoading(true)

    // Produtos
    const { data: prodData } = await supabase
      .from('produtos')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: false })

    if (prodData) setProdutos(prodData)

    // Despesas (Saídas)
    const { data: despData } = await supabase
      .from('despesas')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (despData) setDespesas(despData)

    // Pedidos (Entradas/Vendas)
    const { data: pedData } = await supabase
      .from('pedidos')
      .select('*')
      .eq('tenant_id', tenantId)

    if (pedData) setPedidos(pedData)

    setLoading(false)
  }, [supabase, tenantId])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Cálculos rápidos para o topo
  const totalEntradas = pedidos.reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0)
  const totalSaidas = despesas.reduce((acc, curr) => acc + Number(curr.valor || 0), 0)
  const saldoLiquido = totalEntradas - totalSaidas

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-12">
      {/* Background Decorativo Grafismo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Header Fixo e Responsivo */}
      <header className="relative z-10 border-b border-slate-800/80 bg-[#0B0F17]/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
              X
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                Xfibra Telecom
              </h1>
              <span className="text-[11px] text-slate-400 font-medium">Painel Administrativo</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700/60 transition shadow-sm"
          >
            Sair →
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-lg">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Itens em Estoque
            </p>
            <h3 className="text-2xl font-bold text-white">{produtos.length} cadastrados</h3>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-lg">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Total Faturado
            </p>
            <h3 className="text-2xl font-bold text-emerald-400 font-mono">
              R$ {totalEntradas.toFixed(2)}
            </h3>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-lg">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Balanço Geral
            </p>
            <h3
              className={`text-2xl font-bold font-mono ${
                saldoLiquido >= 0 ? 'text-blue-400' : 'text-rose-400'
              }`}
            >
              R$ {saldoLiquido.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Navegação por Abas (Mobile & Desktop) */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 mb-8 max-w-md">
          <button
            onClick={() => setAbaAtiva('estoque')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition ${
              abaAtiva === 'estoque'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📦 Estoque
          </button>
          <button
            onClick={() => setAbaAtiva('financeiro')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition ${
              abaAtiva === 'financeiro'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💳 Fluxo de Caixa
          </button>
        </div>

        {/* Renderização Condicional */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Atualizando dados...</p>
          </div>
        ) : abaAtiva === 'estoque' ? (
          <EstoqueSection produtos={produtos} tenantId={tenantId} onUpdate={carregarDados} />
        ) : (
          <FinanceiroSection
            despesas={despesas}
            pedidos={pedidos}
            tenantId={tenantId}
            onUpdate={carregarDados}
          />
        )}
      </main>
    </div>
  )
}