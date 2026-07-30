'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface Produto {
  id: number
  nome: string
  preco: number
  estoque?: number
  disponivel: boolean
}

interface Props {
  produtos: Produto[]
  tenantId: string
  onUpdate: () => void
}

export default function EstoqueSection({ produtos, tenantId, onUpdate }: Props) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('0')
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome || !preco) return

    if (editandoId) {
      await supabase
        .from('produtos')
        .update({
          nome,
          preco: parseFloat(preco),
          estoque: parseInt(estoque) || 0,
        })
        .eq('id', editandoId)
    } else {
      await supabase.from('produtos').insert([
        {
          nome,
          preco: parseFloat(preco),
          estoque: parseInt(estoque) || 0,
          tenant_id: tenantId,
          disponivel: true,
        },
      ])
    }

    limparForm()
    onUpdate()
  }

  function handleEditar(p: Produto) {
    setEditandoId(p.id)
    setNome(p.nome)
    setPreco(p.preco.toString())
    setEstoque((p.estoque || 0).toString())
  }

  async function handleDeletar(id: number) {
    if (!confirm('Deseja excluir este produto?')) return
    await supabase.from('produtos').delete().eq('id', id)
    onUpdate()
  }

  function limparForm() {
    setEditandoId(null)
    setNome('')
    setPreco('')
    setEstoque('0')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Cadastro/Edição */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl h-fit">
        <h2 className="text-base font-bold text-white mb-1">
          {editandoId ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          {editandoId ? 'Altere os dados do item.' : 'Cadastre um novo item no estoque.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nome</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white focus:outline-none"
              placeholder="Ex: Roteador ONU Dual Band"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                placeholder="180.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Qtd. Estoque</label>
              <input
                type="number"
                required
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={limparForm}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 rounded-lg text-sm transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabela de Produtos */}
      <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-base font-bold text-white">Produtos em Estoque</h2>
          <span className="text-xs text-slate-400 font-medium">{produtos.length} itens</span>
        </div>

        {produtos.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Nenhum produto cadastrado.</div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {produtos.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition">
                <div>
                  <p className="text-sm font-semibold text-white">{p.nome}</p>
                  <p className="text-xs text-slate-400">
                    Estoque: <span className="text-blue-400 font-medium">{p.estoque ?? 0} un.</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-white font-mono">
                    R$ {Number(p.preco).toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(p)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletar(p.id)}
                      className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2.5 py-1.5 rounded transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}