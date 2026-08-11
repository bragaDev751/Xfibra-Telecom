'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export interface Despesa {
  id: string
  descricao: string
  valor: number
  categoria?: string
  pago?: boolean
  created_at?: string
  ordem?: number
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

export default function FinanceiroSection({ despesas: despesasProp, pedidos = [], tenantId, onUpdate }: Props) {
  const [despesasLocal, setDespesasLocal] = useState<Despesa[]>(despesasProp)
  const [descricao, setDescricao] = useState('')
  const [valorInput, setValorInput] = useState('')
  const [tipoLancamento, setTipoLancamento] = useState<'saida' | 'entrada'>('saida')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pago' | 'pendente'>('todos')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const supabase = createClient()

  useEffect(() => {
    setDespesasLocal(despesasProp)
  }, [despesasProp])

  const converterParaNumero = (valStr: string | number) => {
    if (typeof valStr === 'number') return valStr
    if (!valStr) return 0
    const limpo = valStr.toString().replace(/\./g, '').replace(',', '.')
    return parseFloat(limpo) || 0
  }

  // CÁLCULOS CONSIDERANDO APENAS ITENS PAGOS
  const totalEntradasVendas = pedidos.reduce((acc, curr) => acc + Number(curr.total_pedido || 0), 0)
  const totalEntradasManuais = despesasLocal
    .filter((d) => d.categoria === 'Entrada' && (d.pago ?? true))
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const totalEntradas = totalEntradasVendas + totalEntradasManuais

  const totalSaidas = despesasLocal
    .filter((d) => d.categoria !== 'Entrada' && (d.pago ?? true))
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  const saldoLiquido = totalEntradas - totalSaidas

  // LISTA FILTRADA PARA EXIBIÇÃO NA TABELA
  const despesasExibidas = despesasLocal.filter((d) => {
    const isPago = d.pago ?? true
    if (filtroStatus === 'pago') return isPago
    if (filtroStatus === 'pendente') return !isPago
    return true
  })

  // 1. Adicionar Lançamento
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!descricao) return

    const valorNum = converterParaNumero(valorInput)
    const categoria = tipoLancamento === 'entrada' ? 'Entrada' : 'Saída'
    const novaOrdem = despesasLocal.length

    const novoItem: Despesa = {
      id: crypto.randomUUID(),
      descricao,
      valor: valorNum,
      categoria,
      pago: true,
      ordem: novaOrdem,
      created_at: new Date().toISOString(),
    }

    setDespesasLocal((prev) => [...prev, novoItem])

    await supabase.from('despesas').insert([
      { descricao, valor: valorNum, categoria, tenant_id: tenantId, pago: true, ordem: novaOrdem },
    ])

    setDescricao('')
    setValorInput('')
    onUpdate()
  }

  // 2. Alternar Status Pago / Pendente
  async function handleTogglePago(id: string, pagoAtual: boolean) {
    const novoStatus = !pagoAtual
    setDespesasLocal((prev) =>
      prev.map((d) => (d.id === id ? { ...d, pago: novoStatus } : d))
    )

    await supabase.from('despesas').update({ pago: novoStatus }).eq('id', id)
    onUpdate()
  }

  // 3. Alteração de Valor Direto
  function handleAlterarValorLocal(id: string, novoValorStr: string) {
    const valorNum = converterParaNumero(novoValorStr)
    setDespesasLocal((prev) =>
      prev.map((d) => (d.id === id ? { ...d, valor: valorNum } : d))
    )
  }

  async function handleSalvarValorBanco(id: string) {
    const item = despesasLocal.find((d) => d.id === id)
    if (item) {
      await supabase.from('despesas').update({ valor: item.valor }).eq('id', id)
      onUpdate()
    }
  }

  // 4. Zerar Valores Mantendo a Lista
  async function handleZerarValores() {
    if (!confirm('Deseja zerar os valores de TODAS as contas mantendo a lista?')) return

    setDespesasLocal((prev) => prev.map((d) => ({ ...d, valor: 0 })))

    const ids = despesasLocal.map((d) => d.id)
    if (ids.length > 0) {
      await supabase.from('despesas').update({ valor: 0 }).in('id', ids)
    }
    onUpdate()
  }

  // 5. Drag and Drop com Salvamento da Ordem no Supabase
  function handleDragStart(index: number) {
    setDraggedIndex(index)
  }

  function handleDragOver(e: React.DragEvent, targetIndex: number) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const listaReordenada = [...despesasLocal]
    const itemArrastado = listaReordenada[draggedIndex]

    listaReordenada.splice(draggedIndex, 1)
    listaReordenada.splice(targetIndex, 0, itemArrastado)

    setDraggedIndex(targetIndex)
    setDespesasLocal(listaReordenada)
  }

  async function handleDragEnd() {
    setDraggedIndex(null)

    // Atualiza o índice 'ordem' para cada elemento
    const listaComOrdem = despesasLocal.map((item, index) => ({
      ...item,
      ordem: index,
    }))

    setDespesasLocal(listaComOrdem)

    // Grava as novas posições no banco de dados
    try {
      const updates = listaComOrdem.map((item) =>
        supabase.from('despesas').update({ ordem: item.ordem }).eq('id', item.id)
      )
      await Promise.all(updates)
    } catch (error) {
      console.error('Erro ao salvar nova ordem:', error)
    }
  }

  // 6. Excluir Lançamento
  async function handleDeletar(id: string) {
    if (!confirm('Excluir este lançamento?')) return
    setDespesasLocal((prev) => prev.filter((d) => d.id !== id))
    await supabase.from('despesas').delete().eq('id', id)
    onUpdate()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-[100vh] overflow-hidden gap-2 font-sans select-none">
      
      {/* Bloco de Resumo */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shrink-0 space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-300">Resumo do Caixa</span>
          <button
            type="button"
            onClick={handleZerarValores}
            className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/40 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
          >
            🔄 Zerar Tudo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono">
          <div className="border-r border-slate-800">
            <p className="text-[10px] text-emerald-400 font-sans font-bold">ENTRADAS</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-400 truncate">{formatarMoeda(totalEntradas)}</p>
          </div>
          <div className="border-r border-slate-800">
            <p className="text-[10px] text-rose-400 font-sans font-bold">SAÍDAS</p>
            <p className="text-xs sm:text-sm font-bold text-rose-400 truncate">{formatarMoeda(totalSaidas)}</p>
          </div>
          <div>
            <p className="text-[10px] text-blue-400 font-sans font-bold">BALANÇO</p>
            <p className={`text-xs sm:text-sm font-bold truncate ${saldoLiquido >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
              {formatarMoeda(saldoLiquido)}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário Rápido */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-2 shrink-0 flex flex-wrap sm:flex-nowrap gap-2 items-center">
        <button
          type="button"
          onClick={() => setTipoLancamento(tipoLancamento === 'saida' ? 'entrada' : 'saida')}
          className={`px-3 py-1.5 rounded text-xs font-bold shrink-0 transition ${
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
          placeholder="Descrição (ex: Aluguel)"
          className="flex-1 min-w-[130px] bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
        />

        <div className="relative w-32 shrink-0">
          <span className="absolute left-2.5 top-1.5 text-xs text-slate-500 font-bold">R$</span>
          <input
            type="text"
            value={valorInput}
            onChange={(e) => setValorInput(e.target.value.replace(/[^0-9,.]/g, ''))}
            placeholder="0,00"
            className="w-full bg-slate-950 border border-slate-800 rounded py-1.5 pl-8 pr-2 text-xs text-white font-mono focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded transition shrink-0 ml-auto"
        >
          + Adicionar
        </button>
      </form>

      {/* Tabela Interativa Com Filtros */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-0">
        
        {/* Barra de Filtros por Status */}
        <div className="bg-slate-950 p-2 border-b border-slate-800 flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Filtrar:</span>
          
          <button
            type="button"
            onClick={() => setFiltroStatus('todos')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              filtroStatus === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({despesasLocal.length})
          </button>

          <button
            type="button"
            onClick={() => setFiltroStatus('pago')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              filtroStatus === 'pago'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ✅ Pagos ({despesasLocal.filter((d) => (d.pago ?? true)).length})
          </button>

          <button
            type="button"
            onClick={() => setFiltroStatus('pendente')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              filtroStatus === 'pendente'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ⏳ Pendentes ({despesasLocal.filter((d) => !(d.pago ?? true)).length})
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="p-2 border-r border-slate-800/60 w-8 text-center">≡</th>
                <th className="p-2 border-r border-slate-800/60">Descrição</th>
                <th className="p-2 border-r border-slate-800/60 text-right w-32">Valor (R$)</th>
                <th className="p-2 border-r border-slate-800/60 text-center w-24">Status</th>
                <th className="p-2 text-center w-12">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              {despesasExibidas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500 font-sans text-xs">
                    Nenhum lançamento encontrado para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                despesasExibidas.map((d, index) => {
                  const isEntrada = d.categoria === 'Entrada'
                  const isPago = d.pago ?? true

                  return (
                    <tr
                      key={d.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`hover:bg-slate-800/40 transition cursor-grab active:cursor-grabbing ${
                        draggedIndex === index ? 'bg-blue-900/30 border-blue-500' : ''
                      }`}
                    >
                      {/* Drag Icon */}
                      <td className="p-2 border-r border-slate-800/40 text-center text-slate-500 hover:text-white font-bold select-none">
                        ⋮⋮
                      </td>

                      {/* Descrição */}
                      <td className="p-2 border-r border-slate-800/40 font-sans truncate max-w-[150px] sm:max-w-none">
                        <span className="text-slate-200 font-medium block truncate">
                          {isEntrada ? '↗ ' : '↘ '}
                          {d.descricao}
                        </span>
                      </td>

                      {/* Edição de Valor */}
                      <td className="p-1 border-r border-slate-800/40 text-right">
                        <div className="flex items-center justify-end bg-slate-950/80 rounded border border-slate-800 px-1.5 py-0.5">
                          <span className="text-[10px] text-slate-500 mr-1 font-sans">R$</span>
                          <input
                            type="text"
                            value={d.valor === 0 ? '' : d.valor}
                            onChange={(e) => handleAlterarValorLocal(d.id, e.target.value)}
                            onBlur={() => handleSalvarValorBanco(d.id)}
                            placeholder="0.00"
                            className={`w-20 bg-transparent text-right font-bold focus:outline-none ${
                              isEntrada ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          />
                        </div>
                      </td>

                      {/* Botão de Status (Pago / Pendente) */}
                      <td className="p-1 border-r border-slate-800/40 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePago(d.id, isPago)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                            isPago
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                          }`}
                        >
                          {isPago ? '✅ Pago' : '⏳ Pendente'}
                        </button>
                      </td>

                      {/* Botão de Excluir */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletar(d.id)}
                          className="text-[10px] bg-rose-500/10 text-rose-400 p-1 rounded hover:bg-rose-500/20 transition"
                          title="Excluir"
                        >
                          🗑️
                        </button>
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