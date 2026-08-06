'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface Produto {
  id: number
  nome: string
  categoria?: string
  preco?: number
  valor_unitario?: number
  estoque?: number
  quantidade?: number
  disponivel?: boolean
}

interface Props {
  produtos: Produto[]
  tenantId: string
  userRole: 'admin' | 'estoque'
  onUpdate: () => void
}

const CATEGORIAS = [
  'Todas',
  'EPI',
  'Equipamentos Ativos',
  'Passivos Ópticos',
  'Ferramentas & Instrumentos',
  'Cabeamento & Ferragens',
  'Geral'
]

export default function EstoqueSection({ produtos, tenantId, userRole, onUpdate }: Props) {
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('Geral')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome) return

    setLoadingAction(true)
    const precoNum = parseFloat(preco) || 0
    const estoqueNum = parseInt(estoque) || 0

    if (editandoId) {
      await supabase
        .from('produtos')
        .update({
          nome,
          categoria,
          valor_unitario: precoNum,
          quantidade: estoqueNum,
        })
        .eq('id', editandoId)
    } else {
      await supabase.from('produtos').insert([
        {
          nome,
          categoria,
          valor_unitario: precoNum,
          quantidade: estoqueNum,
          tenant_id: tenantId,
          disponivel: true,
        },
      ])
    }

    limparForm()
    setLoadingAction(false)
    onUpdate()
  }

  function handleEditar(p: Produto) {
    setEditandoId(p.id)
    setNome(p.nome)
    setCategoria(p.categoria || 'Geral')
    setPreco((p.valor_unitario ?? p.preco ?? 0).toString())
    setEstoque((p.quantidade ?? p.estoque ?? 0).toString())
  }

  async function handleDeletar(id: number) {
    if (!confirm('Deseja excluir este produto?')) return
    await supabase.from('produtos').delete().eq('id', id)
    onUpdate()
  }

  async function handleLimparTudo() {
    const confirmacao = confirm(
      '⚠️ ATENÇÃO: Tem certeza que deseja EXCLUIR TODOS OS PRODUTOS do estoque? Esta ação não pode ser desfeita.'
    )
    if (!confirmacao) return

    setLoadingAction(true)

    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('tenant_id', tenantId)

    if (error) {
      alert('Erro ao apagar os produtos: ' + error.message)
    } else {
      alert('Todo o estoque foi zerado com sucesso!')
      onUpdate()
    }

    setLoadingAction(false)
  }

  function limparForm() {
    setEditandoId(null)
    setNome('')
    setCategoria('Geral')
    setPreco('')
    setEstoque('')
  }

  // Filtragem dos produtos por categoria
  const produtosFiltrados = categoriaFiltro === 'Todas'
    ? produtos
    : produtos.filter((p) => p.categoria === categoriaFiltro)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Cadastrar / Editar */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl h-fit">
          <h2 className="text-base font-bold text-white mb-1">
            {editandoId ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Cadastre um novo item no estoque da sua operação.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Nome do Produto
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition shadow-inner"
                placeholder="Ex: Roteador ONU Dual Band"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white focus:outline-none transition shadow-inner"
              >
                {CATEGORIAS.filter((c) => c !== 'Todas').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white focus:outline-none transition shadow-inner"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Qtd. Estoque
                </label>
                <input
                  type="number"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white focus:outline-none transition shadow-inner"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loadingAction}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
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

        {/* Lista de Produtos */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
            <div>
              <h2 className="text-base font-bold text-white">Produtos em Estoque</h2>
              <p className="text-xs text-slate-400">{produtosFiltrados.length} itens exibidos</p>
            </div>

            {produtos.length > 0 && (
              <button
                onClick={handleLimparTudo}
                disabled={loadingAction}
                className="flex items-center gap-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-2 rounded-xl transition active:scale-95 disabled:opacity-50"
                title="Apagar todos os itens cadastrados"
              >
                🗑️ Limpar Tudo
              </button>
            )}
          </div>

          {/* Filtros de Categoria */}
          <div className="p-3 bg-slate-950/20 border-b border-slate-800/80 flex flex-wrap gap-1.5">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  categoriaFiltro === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Nenhum produto encontrado nesta categoria.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[460px]">
              {produtosFiltrados.map((p) => {
                const valor = p.valor_unitario ?? p.preco ?? 0
                const qtd = p.quantidade ?? p.estoque ?? 0

                return (
                  <div
                    key={p.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                        📦
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{p.nome}</p>
                          {p.categoria && (
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                              {p.categoria}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span>
                            Qtd: <strong className="text-slate-200">{qtd}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Preço: <strong className="text-emerald-400">R$ {Number(valor).toFixed(2)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditar(p)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(p.id)}
                        className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg transition"
                      >
                        Excluir
                      </button>
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