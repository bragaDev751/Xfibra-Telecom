'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface Despesa {
  id: string
  descricao: string
  valor: number
  categoria?: string
  created_at?: string
}

export interface Pedido {
  id: string
  total_pedido?: number
  created_at?: string
  status?: string
}

interface Props {
  despesas: Despesa[]
  pedidos: Pedido[]
  tenantId: string
  onUpdate: () => void
}

export default function FinanceiroSection({ despesas, pedidos, tenantId, onUpdate }: Props) {
  const [tipoLancamento, setTipoLancamento] = useState<'saida' | 'entrada'>('saida')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [filtroPeriodo, setFiltroPeriodo] = useState<'hoje' | 'mes' | 'ano' | 'tudo'>('mes')
  const [editandoId, setEditandoId] = useState<string | null>(null)

  const supabase = createClient()

  // Função para checar se a data pertence ao período selecionado
  const pertenceAoPeriodo = (createdAt?: string) => {
    if (!createdAt) return true
    const data = new Date(createdAt)
    const hoje = new Date()

    if (filtroPeriodo === 'hoje') {
      return (
        data.getDate() === hoje.getDate() &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      )
    }
    if (filtroPeriodo === 'mes') {
      return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    }
    if (filtroPeriodo === 'ano') {
      return data.getFullYear() === hoje.getFullYear()
    }
    return true
  }

  // Filtragem de dados pelo período
  const pedidosFiltrados = pedidos.filter((p) => pertenceAoPeriodo(p.created_at))
  const despesasFiltradas = despesas.filter((d) => pertenceAoPeriodo(d.created_at))

  // Cálculos de Totais
  const totalEntradasVendas = pedidosFiltrados.reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0)
  
  // Lançamentos Manuais de Entradas (armazenados via despesas/categoria 'Entrada' ou direto na tabela despesas com valor negativo/categoria)
  const totalEntradasManuais = despesasFiltradas
    .filter((d) => d.categoria === 'Entrada')
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const totalEntradas = totalEntradasVendas + totalEntradasManuais

  const totalSaidas = despesasFiltradas
    .filter((d) => d.categoria !== 'Entrada')
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const saldoLiquido = totalEntradas - totalSaidas

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!descricao || !valor) return

    const valorNum = parseFloat(valor)
    const categoria = tipoLancamento === 'entrada' ? 'Entrada' : 'Saída'

    if (editandoId) {
      await supabase
        .from('despesas')
        .update({
          descricao,
          valor: valorNum,
          categoria,
        })
        .eq('id', editandoId)
    } else {
      await supabase.from('despesas').insert([
        {
          descricao,
          valor: valorNum,
          categoria,
          tenant_id: tenantId,
          pago: true,
        },
      ])
    }

    limparForm()
    onUpdate()
  }

  function handleEditar(d: Despesa) {
    setEditandoId(d.id)
    setDescricao(d.descricao)
    setValor(d.valor.toString())
    setTipoLancamento(d.categoria === 'Entrada' ? 'entrada' : 'saida')
  }

  async function handleDeletar(id: string) {
    if (!confirm('Deseja excluir este registro?')) return
    await supabase.from('despesas').delete().eq('id', id)
    onUpdate()
  }

  function limparForm() {
    setEditandoId(null)
    setDescricao('')
    setValor('')
    setTipoLancamento('saida')
  }

  return (
    <div className="space-y-8">
      {/* Controles de Filtro de Período (Dia, Mês, Ano) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-white">Relatório de Caixa</h2>
          <p className="text-xs text-slate-400">Filtre os lançamentos por período de tempo</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setFiltroPeriodo('hoje')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              filtroPeriodo === 'hoje'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setFiltroPeriodo('mes')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              filtroPeriodo === 'mes'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setFiltroPeriodo('ano')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              filtroPeriodo === 'ano'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Este Ano
          </button>
          <button
            onClick={() => setFiltroPeriodo('tudo')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              filtroPeriodo === 'tudo'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tudo
          </button>
        </div>
      </div>

      {/* KPI Cards (Cards de Métricas) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Entradas */}
        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 p-5 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Entradas ({filtroPeriodo.toUpperCase()})
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            + R$ {totalEntradas.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Vendas + Lançamentos Manuais</p>
        </div>

        {/* Saídas */}
        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-rose-500/20 p-5 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            Saídas ({filtroPeriodo.toUpperCase()})
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
            - R$ {totalSaidas.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Custos e despesas lançadas</p>
        </div>

        {/* Saldo Líquido */}
        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 p-5 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            Saldo Líquido ({filtroPeriodo.toUpperCase()})
          </p>
          <h3
            className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              saldoLiquido >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            R$ {saldoLiquido.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Balanço do período</p>
        </div>
      </div>

      {/* Seção de Lançamento Manual e Histórico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Novo Lançamento */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-base font-bold text-white mb-1">
            {editandoId ? '✏️ Editar Lançamento' : '📝 Novo Lançamento'}
          </h2>
          <p className="text-xs text-slate-400 mb-4">Cadastre uma nova movimentação financeira.</p>

          {/* Toggle de Tipo (Entrada x Saída) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => setTipoLancamento('saida')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                tipoLancamento === 'saida'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ↘ Saída (Gasto)
            </button>
            <button
              type="button"
              onClick={() => setTipoLancamento('entrada')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                tipoLancamento === 'entrada'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ↗ Entrada (Receita)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Descrição
              </label>
              <input
                type="text"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition shadow-inner"
                placeholder={
                  tipoLancamento === 'saida'
                    ? 'Ex: Link Dedicado / Servidor'
                    : 'Ex: Aporte / Serviço Avulso'
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white focus:outline-none transition shadow-inner"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className={`flex-1 text-white font-medium py-3 rounded-xl text-sm transition shadow-lg active:scale-[0.98] ${
                  tipoLancamento === 'saida'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/20'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20'
                }`}
              >
                {editandoId
                  ? 'Salvar Alterações'
                  : tipoLancamento === 'saida'
                  ? 'Lançar Saída'
                  : 'Lançar Entrada'}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={limparForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela / Histórico de Lançamentos */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
            <h2 className="text-base font-bold text-white">Histórico do Período</h2>
            <span className="text-xs text-slate-400 font-medium">
              {despesasFiltradas.length} lançamentos
            </span>
          </div>

          {despesasFiltradas.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Nenhum lançamento registrado neste período.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[420px]">
              {despesasFiltradas.map((d) => {
                const isEntrada = d.categoria === 'Entrada'
                return (
                  <div
                    key={d.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          isEntrada
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isEntrada ? '↗' : '↘'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{d.descricao}</p>
                        <span className="text-[11px] text-slate-500">
                          {d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : 'Data n/d'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span
                        className={`text-sm font-bold font-mono ${
                          isEntrada ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isEntrada ? '+' : '-'} R$ {Number(d.valor).toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditar(d)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletar(d.id)}
                          className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}