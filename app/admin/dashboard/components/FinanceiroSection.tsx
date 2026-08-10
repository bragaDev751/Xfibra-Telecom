'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface Despesa {
  id: string
  descricao: string
  valor: number
  categoria?: string
  pago?: boolean
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

const formatarMoeda = (valor: number) => {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export default function FinanceiroSection({ despesas: despesasProp, pedidos, tenantId, onUpdate }: Props) {
  const [despesasLocal, setDespesasLocal] = useState<Despesa[]>(despesasProp)
  
  const [tipoLancamento, setTipoLancamento] = useState<'saida' | 'entrada'>('saida')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [pago, setPago] = useState(true)
  const [filtroPeriodo, setFiltroPeriodo] = useState<'hoje' | 'mes' | 'ano' | 'tudo'>('mes')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pagos' | 'pendentes'>('todos')
  const [editandoId, setEditandoId] = useState<string | null>(null)

  const supabase = createClient()

  if (despesasProp !== despesasLocal && !editandoId) {
    setDespesasLocal(despesasProp)
  }

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

  const despesasFiltradas = despesasLocal.filter((d) => {
    const noPeriodo = pertenceAoPeriodo(d.created_at)
    if (!noPeriodo) return false

    if (filtroStatus === 'pagos') return d.pago === true
    if (filtroStatus === 'pendentes') return d.pago === false
    return true
  })

  const pedidosFiltrados = pedidos.filter((p) => pertenceAoPeriodo(p.created_at))

  const totalEntradasVendas = pedidosFiltrados.reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0)
  
  const totalEntradasManuais = despesasFiltradas
    .filter((d) => d.categoria === 'Entrada' && d.pago)
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const totalEntradas = totalEntradasVendas + totalEntradasManuais

  const totalSaidas = despesasFiltradas
    .filter((d) => d.categoria !== 'Entrada' && d.pago)
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const saldoLiquido = totalEntradas - totalSaidas

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!descricao || !valor) return

    const valorNum = parseFloat(valor)
    const categoria = tipoLancamento === 'entrada' ? 'Entrada' : 'Saída'

    if (editandoId) {
      setDespesasLocal((prev) =>
        prev.map((d) =>
          d.id === editandoId ? { ...d, descricao, valor: valorNum, categoria, pago } : d
        )
      )

      await supabase
        .from('despesas')
        .update({ descricao, valor: valorNum, categoria, pago })
        .eq('id', editandoId)
    } else {
      const tempId = crypto.randomUUID()
      const novoItem: Despesa = {
        id: tempId,
        descricao,
        valor: valorNum,
        categoria,
        pago,
        created_at: new Date().toISOString(),
      }

      setDespesasLocal((prev) => [novoItem, ...prev])

      await supabase.from('despesas').insert([
        {
          descricao,
          valor: valorNum,
          categoria,
          tenant_id: tenantId,
          pago,
        },
      ])
    }

    limparForm()
    onUpdate()
  }

  async function toggleStatusPagamento(id: string, statusAtual: boolean) {
    setDespesasLocal((prev) =>
      prev.map((d) => (d.id === id ? { ...d, pago: !statusAtual } : d))
    )

    await supabase
      .from('despesas')
      .update({ pago: !statusAtual })
      .eq('id', id)

    onUpdate()
  }

  function handleEditar(d: Despesa) {
    setEditandoId(d.id)
    setDescricao(d.descricao)
    setValor(d.valor.toString())
    setTipoLancamento(d.categoria === 'Entrada' ? 'entrada' : 'saida')
    setPago(d.pago ?? true)
  }

  async function handleDeletar(id: string) {
    if (!confirm('Excluir lançamento?')) return
    setDespesasLocal((prev) => prev.filter((d) => d.id !== id))
    await supabase.from('despesas').delete().eq('id', id)
    onUpdate()
  }

  function limparForm() {
    setEditandoId(null)
    setDescricao('')
    setValor('')
    setTipoLancamento('saida')
    setPago(true)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-[100vh] overflow-hidden gap-2">
      
      {/* 1. Header Fixo Compacto (Filtros + Resumo em Grid Estilo Planilha) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shrink-0 space-y-2">
        {/* Controles de Filtro */}
        <div className="flex items-center justify-between text-xs gap-1 overflow-x-auto pb-1">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setFiltroPeriodo('hoje')}
              className={`px-2 py-1 rounded ${filtroPeriodo === 'hoje' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Hoje
            </button>
            <button
              onClick={() => setFiltroPeriodo('mes')}
              className={`px-2 py-1 rounded ${filtroPeriodo === 'mes' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Mês
            </button>
            <button
              onClick={() => setFiltroPeriodo('ano')}
              className={`px-2 py-1 rounded ${filtroPeriodo === 'ano' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
            >
              Ano
            </button>
          </div>

          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setFiltroStatus('todos')}
              className={`px-2 py-1 rounded ${filtroStatus === 'todos' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroStatus('pagos')}
              className={`px-2 py-1 rounded ${filtroStatus === 'pagos' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              Pagos
            </button>
            <button
              onClick={() => setFiltroStatus('pendentes')}
              className={`px-2 py-1 rounded ${filtroStatus === 'pendentes' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              Pendentes
            </button>
          </div>
        </div>

        {/* Resumo Estilo Excel */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-center font-mono">
          <div className="border-r border-slate-800 pr-1">
            <p className="text-[9px] uppercase text-emerald-400 font-sans font-bold">Entradas</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-400 truncate">{formatarMoeda(totalEntradas)}</p>
          </div>
          <div className="border-r border-slate-800 px-1">
            <p className="text-[9px] uppercase text-rose-400 font-sans font-bold">Saídas</p>
            <p className="text-xs sm:text-sm font-bold text-rose-400 truncate">{formatarMoeda(totalSaidas)}</p>
          </div>
          <div className="pl-1">
            <p className="text-[9px] uppercase text-blue-400 font-sans font-bold">Saldo</p>
            <p className={`text-xs sm:text-sm font-bold truncate ${saldoLiquido >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
              {formatarMoeda(saldoLiquido)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Formulário Rápido Estilo Célula Excel (Fixo) */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-2 shrink-0 flex flex-wrap sm:flex-nowrap gap-1.5 items-center">
        <button
          type="button"
          onClick={() => setTipoLancamento(tipoLancamento === 'saida' ? 'entrada' : 'saida')}
          className={`px-2 py-1.5 rounded text-xs font-bold shrink-0 transition ${
            tipoLancamento === 'saida' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {tipoLancamento === 'saida' ? '↘ Saída' : '↗ Entrada'}
        </button>

        <input
          type="text"
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          className="flex-1 min-w-[120px] bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
        />

        <div className="relative w-28 shrink-0">
          <span className="absolute left-2 top-1.5 text-xs text-slate-500 font-bold">R$</span>
          <input
            type="number"
            step="0.01"
            required
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-800 rounded py-1.5 pl-7 pr-2 text-xs text-white font-mono focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer shrink-0 px-1">
          <input
            type="checkbox"
            checked={pago}
            onChange={(e) => setPago(e.target.checked)}
            className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
          />
          Pago
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded transition shrink-0 ml-auto"
        >
          {editandoId ? 'Salvar' : '+ Add'}
        </button>
      </form>

      {/* 3. Tabela Rolo Interno (Estilo Planilha Excel) */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="p-2 border-r border-slate-800/60 w-8 text-center">T</th>
                <th className="p-2 border-r border-slate-800/60">Descrição</th>
                <th className="p-2 border-r border-slate-800/60 text-right">Valor (R$)</th>
                <th className="p-2 border-r border-slate-800/60 text-center w-16">Status</th>
                <th className="p-2 text-center w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              {despesasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500 font-sans text-xs">
                    Nenhum lançamento no período.
                  </td>
                </tr>
              ) : (
                despesasFiltradas.map((d) => {
                  const isEntrada = d.categoria === 'Entrada'
                  const isPago = d.pago ?? true

                  return (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition">
                      {/* Tipo */}
                      <td className="p-2 border-r border-slate-800/40 text-center font-bold">
                        <span className={isEntrada ? 'text-emerald-400' : 'text-rose-400'}>
                          {isEntrada ? '↗' : '↘'}
                        </span>
                      </td>

                      {/* Descrição */}
                      <td className="p-2 border-r border-slate-800/40 font-sans truncate max-w-[140px] sm:max-w-none">
                        <span className="text-slate-200 font-medium block truncate">{d.descricao}</span>
                      </td>

                      {/* Valor */}
                      <td className={`p-2 border-r border-slate-800/40 text-right font-bold ${
                        isEntrada ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatarMoeda(d.valor)}
                      </td>

                      {/* Status */}
                      <td className="p-2 border-r border-slate-800/40 text-center">
                        <button
                          onClick={() => toggleStatusPagamento(d.id, isPago)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isPago
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isPago ? 'Pago' : 'Pend.'}
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="p-2 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleEditar(d)}
                            className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded hover:bg-slate-700"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletar(d.id)}
                            className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded hover:bg-rose-500/20"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}