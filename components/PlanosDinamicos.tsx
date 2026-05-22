'use client'

import { useState } from 'react'
import { Wifi, Check, Flame, Search, RefreshCw } from 'lucide-react'

interface Plano {
  nome: string
  preco: string
  velocidade?: string
  destaque: boolean
  beneficios?: string[]
  videoUrl?: string
  cidades?: string[]
}

interface PlanosDinamicosProps {
  planosIniciais: Plano[]
  cidadeDetectada: string
  setCidadeDetectada: (cidade: string) => void
  loadingGeo: boolean
  erroGeo: string
  isClient: boolean
}

export default function PlanosDinamicos({
  planosIniciais,
  cidadeDetectada,
  setCidadeDetectada,
  loadingGeo,
  erroGeo,
  isClient
}: PlanosDinamicosProps) {
  const [cep, setCep] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)
  const [erroCepInterno, setErroCepInterno] = useState('')

  const cidadesAtendidas = ['Banabuiú', 'Juatama', 'Choró']

  const buscarCEP = async (cepInformado: string) => {
    const cepLimpo = cepInformado.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setErroCepInterno('Digite um CEP válido com 8 dígitos.')
      return
    }

    setLoadingCep(true)
    setErroCepInterno('')

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()

      if (data.erro) {
        setErroCepInterno('CEP não encontrado.')
        return
      }

      const cidadeResult = data.localidade

      if (cidadesAtendidas.includes(cidadeResult)) {
        setCidadeDetectada(cidadeResult)
      } else {
        setErroCepInterno(`Desculpe, a XFibra ainda não atende a região de ${cidadeResult}.`)
      }
    } catch {
      setErroCepInterno('Erro ao consultar o CEP. Tente novamente.')
    } finally {
      setLoadingCep(false)
    }
  }

  // Filtra os planos de acordo com a cidade detectada
  const planosFiltrados = planosIniciais.filter((plano) => {
    if (cidadeDetectada === 'Detectando' || cidadeDetectada === 'Geral') return false
    return plano.cidades?.includes(cidadeDetectada)
  })

  // Se não estiver montado no cliente, renderiza o esqueleto idêntico para evitar erros de hidratação
  if (!isClient) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 mb-12 flex items-center justify-center gap-2 text-sm text-cyan-400">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>Carregando ofertas da região...</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      
      {/* BARRA DE LOCALIZAÇÃO INTEGRADA */}
      <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 mb-12 backdrop-blur-md">
        {cidadeDetectada === 'Detectando' && (
          <div className="flex items-center justify-center gap-2 text-sm text-cyan-400 py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Localizando sua região automaticamente...</span>
          </div>
        )}

        {cidadeDetectada === 'Geral' && (
          <div>
            <p className="text-sm font-semibold text-center text-slate-300 mb-4">
              📍 Insira seu CEP para visualizar os planos disponíveis na sua rua:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Digite seu CEP (Ex: 63950-000)"
                  maxLength={9}
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl py-3 px-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              </div>
              <button
                onClick={() => buscarCEP(cep)}
                disabled={loadingCep || loadingGeo}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
              >
                Ver Planos
              </button>
            </div>
          </div>
        )}

        {cidadeDetectada !== 'Geral' && cidadeDetectada !== 'Detectando' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold text-white">
                Conectado à rede XFibra de: <span className="text-cyan-400">{cidadeDetectada}</span>
              </p>
            </div>
            <button
              onClick={() => { setCidadeDetectada('Geral'); setCep(''); setErroCepInterno(''); }}
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              Alterar localização
            </button>
          </div>
        )}

        {(erroCepInterno || erroGeo) && (
          <p className="text-xs text-amber-400 font-medium text-center mt-3">{erroCepInterno || erroGeo}</p>
        )}
      </div>

      {/* GRADE DE PLANOS FILTRADA EXCLUSIVA */}
      {cidadeDetectada !== 'Geral' && cidadeDetectada !== 'Detectando' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 md:px-0 items-stretch relative z-10">
          {planosFiltrados.map((plano: Plano, idx: number) => {
            let embedUrl = ""
            if (plano.videoUrl) {
              embedUrl = plano.videoUrl.includes("watch?v=") ? plano.videoUrl.replace("watch?v=", "embed/") : plano.videoUrl
            }

            let parteInteira = "00"
            let parteDecimal = "00"
            if (plano.preco) {
              const precoLimpo = String(plano.preco).replace("R$", "").trim()
              const temVirgula = precoLimpo.includes(",")
              parteInteira = temVirgula ? precoLimpo.split(',')[0] : precoLimpo
              parteDecimal = temVirgula ? precoLimpo.split(',')[1] : '99'
            }

            return (
              <div 
                key={idx}
                className={`relative rounded-3xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 border box-border ${
                  plano.destaque 
                    ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 lg:-translate-y-2 z-10' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 backdrop-blur-sm'
                }`}
              >
                {plano.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    <Flame size={10} /> Mais Vendido
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{plano.nome || "Plano"}</h3>
                      {plano.velocidade && (
                        <p className="text-[10px] md:text-[11px] text-slate-400 mt-0.5">{plano.velocidade}</p>
                      )}
                    </div>
                    <div className={`p-2 rounded-xl shrink-0 ${plano.destaque ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Wifi size={16} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-0.5 my-4 md:my-6">
                    <span className="text-xs text-slate-400 font-medium">R$</span>
                    <span className="text-3xl md:text-4xl font-black text-white tracking-tight">{parteInteira}</span>
                    <span className="text-xs md:text-sm font-semibold text-slate-400">,{parteDecimal}</span>
                    <span className="text-[10px] text-slate-500 ml-1">/mês</span>
                  </div>

                  <ul className="space-y-2.5 border-t border-slate-800/80 pt-4 md:pt-6 mb-6 md:mb-8">
                    {plano.beneficios && plano.beneficios.length > 0 ? (
                      plano.beneficios.map((beneficio: string, bIdx: number) => (
                        <li key={bIdx} className="flex items-start gap-2 text-[11px] md:text-xs text-slate-300 text-left">
                          <span className="mt-0.5 text-cyan-400 shrink-0">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span>{beneficio}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[11px] text-slate-500 italic">Consulte benefícios ativos</li>
                    )}
                  </ul>
                </div>

                <div className="mt-auto w-full">
                  {embedUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-slate-800 bg-black/40 aspect-video relative">
                      <iframe src={embedUrl} className="w-full h-full opacity-90" allowFullScreen loading="lazy" />
                    </div>
                  )}
                  <a href="https://xfibra.atlaz.com.br/central/assinar" target="_blank" rel="noopener noreferrer" className="block w-full">
                    <button 
                      className={`w-full py-2.5 md:py-3 px-4 rounded-xl font-bold text-[11px] md:text-xs uppercase tracking-wide transition-colors ${
                        plano.destaque 
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20' 
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      Assinar em {cidadeDetectada}
                    </button>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}