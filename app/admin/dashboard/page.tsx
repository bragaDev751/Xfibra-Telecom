'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import EstoqueSection, { Produto } from './components/EstoqueSection'
import FinanceiroSection, { Despesa, Pedido } from './components/FinanceiroSection'

const formatarMoeda = (valor: number) => {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'admin' | 'estoque'>('estoque')
  const [abaAtiva, setAbaAtiva] = useState<'estoque' | 'financeiro'>('estoque')
  
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const supabase = createClient()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || ''

  const carregarDados = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role

    if (!role || (role !== 'admin' && role !== 'estoque')) {
      await supabase.auth.signOut()
      alert('Acesso Negado: Seu usuário não pertence a este sistema.')
      router.push('/admin/login')
      return
    }

    setUserRole(role)
    if (role === 'estoque') setAbaAtiva('estoque')

    const { data: prodData } = await supabase
      .from('produtos')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: false })

    if (prodData) setProdutos(prodData)

    if (role === 'admin') {
      const { data: despData } = await supabase
        .from('despesas')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (despData) setDespesas(despData)

      const { data: pedData } = await supabase
        .from('pedidos')
        .select('*')
        .eq('tenant_id', tenantId)

      if (pedData) setPedidos(pedData)
    }

    setLoading(false)
  }, [supabase, tenantId, router])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // CÁLCULOS UNIFICADOS (CONSIDERANDO APENAS REGISTROS PAGOS)
  const totalEntradasVendas = pedidos.reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0)
  const totalEntradasManuais = despesas
    .filter((d) => d.categoria === 'Entrada' && (d.pago ?? true))
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const totalEntradas = totalEntradasVendas + totalEntradasManuais

  const totalSaidas = despesas
    .filter((d) => d.categoria !== 'Entrada' && (d.pago ?? true))
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const saldoLiquido = totalEntradas - totalSaidas

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-12">
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden sm:block">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header Fixo */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#07090E] sm:bg-[#07090E]/90 sm:backdrop-blur-md shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Xfibra Telecom Logo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <div className="border-l border-slate-800 pl-3 hidden sm:block">
              <span className="text-[11px] text-slate-400 font-medium block leading-none">
                {userRole === 'admin' ? 'Painel Administrativo' : 'Controle de Estoque'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
              userRole === 'admin' 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
              {userRole === 'admin' ? '👑 Admin' : '📦 Estoque'}
            </span>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700/60 transition shadow-sm"
            >
              Sair →
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* KPI Summary Cards */}
        <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'sm:grid-cols-3' : 'sm:grid-cols-1'} gap-4 mb-8`}>
          <div className="bg-[#0e131f] border border-slate-800/80 p-5 rounded-2xl shadow-lg">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Itens em Estoque
            </p>
            <h3 className="text-2xl font-bold text-white">{produtos.length} cadastrados</h3>
          </div>

          {userRole === 'admin' && (
            <>
              <div className="bg-[#0e131f] border border-slate-800/80 p-5 rounded-2xl shadow-lg">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Total Faturado
                </p>
                <h3 className="text-2xl font-bold text-emerald-400 font-mono">
                  {formatarMoeda(totalEntradas)}
                </h3>
              </div>

              <div className="bg-[#0e131f] border border-slate-800/80 p-5 rounded-2xl shadow-lg">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Balanço Geral
                </p>
                <h3 className={`text-2xl font-bold font-mono ${
                  saldoLiquido >= 0 ? 'text-blue-400' : 'text-rose-400'
                }`}>
                  {formatarMoeda(saldoLiquido)}
                </h3>
              </div>
            </>
          )}
        </div>

        {/* Navegação por Abas */}
        {userRole === 'admin' && (
          <div className="flex bg-[#0e131f] p-1.5 rounded-2xl border border-slate-800/80 mb-8 max-w-md">
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
        )}

        {/* Renderização do Conteúdo */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Carregando permissões...</p>
          </div>
        ) : abaAtiva === 'estoque' || userRole === 'estoque' ? (
          <EstoqueSection produtos={produtos} tenantId={tenantId} userRole={userRole} onUpdate={carregarDados} />
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