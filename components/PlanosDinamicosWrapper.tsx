'use client'

import { useState, useEffect } from 'react'
import PlanosDinamicos from './PlanosDinamicos'
import Cobertura from './Cobertura'

interface Plano {
  nome: string
  preco: string
  velocidade?: string
  destaque: boolean
  beneficios?: string[]
  videoUrl?: string
  cidades?: string[]
}

interface PlanosDinamicosWrapperProps {
  planos: Plano[]
}

export default function PlanosDinamicosWrapper({ planos }: PlanosDinamicosWrapperProps) {
  const [cidadeDetectada, setCidadeDetectada] = useState<string>('Detectando')
  const [loadingGeo, setLoadingGeo] = useState(true)
  const [erroGeo, setErroGeo] = useState('')
  const [isClient, setIsClient] = useState(false)

  const cidadesAtendidas = ['Banabuiú', 'Juatama', 'Choró']

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true)

      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        setCidadeDetectada('Geral')
        setLoadingGeo(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
            )
            const data = await res.json()
            const cityResult = data.city || data.locality

            if (cidadesAtendidas.includes(cityResult)) {
              setCidadeDetectada(cityResult)
            } else {
              setCidadeDetectada('Geral')
              setErroGeo(`Identificamos que você está em ${cityResult}.`)
            }
          } catch {
            setCidadeDetectada('Geral')
          } finally {
            setLoadingGeo(false)
          }
        },
        () => {
          setCidadeDetectada('Geral')
          setLoadingGeo(false)
        }
      )
    }, 0)
  }, [])

  return (
    <>
      <section id="planos" className="py-16 md:py-24 px-4 max-w-7xl mx-auto relative border-t border-slate-900 overflow-hidden">
        <div className="text-center mb-12 md:mb-16 px-2">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            Nossos Planos
          </span>
          <h2 className="text-2xl md:text-5xl font-black tracking-tight mt-4">A ultravelocidade na sua região</h2>
          <p className="text-slate-400 mt-2 text-xs md:text-base">Digite seu CEP ou use a localização para filtrar as ofertas da sua cidade.</p>
        </div>

        <PlanosDinamicos 
          planosIniciais={planos} 
          cidadeDetectada={cidadeDetectada}
          setCidadeDetectada={setCidadeDetectada}
          loadingGeo={loadingGeo}
          erroGeo={erroGeo}
          isClient={isClient}
        />
      </section>

      <Cobertura cidadeDetectada={cidadeDetectada} />
    </>
  )
}