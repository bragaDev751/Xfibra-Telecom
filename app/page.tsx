import { client } from '../sanity/sanityClient'
import Navbar from '../components/Navbar'
import FadeIn from '../components/FadeIn'
import Cobertura from '../components/Cobertura' 
import Diferenciais from '../components/Diferenciais'
import AppSection from '../components/AppSection'
import Footer from '../components/Footer'
import PlanosDinamicosWrapper from '../components/PlanosDinamicosWrapper' 

interface Plano {
  nome: string
  preco: string
  velocidade?: string
  destaque: boolean
  beneficios?: string[]
  videoUrl?: string
  cidades?: string[]
}

async function getPlanos(): Promise<Plano[]> {
  const query = `*[_type == "plano"] | order(preco asc) {
    nome,
    preco,
    velocidade,
    destaque,
    beneficios,
    videoUrl,
    cidades
  }`
  return await client.fetch(query)
}

export default async function LandingPage() {
  const planos = await getPlanos()

  return (
    <div className="bg-[#0B0F19] text-white min-h-screen font-sans overflow-x-hidden pt-20">
      
      {/* MENU FIXO NO TOPO */}
      <Navbar />

      {/* =========================================================================
          1. HERO SECTION ANIMADA
          ========================================================================= */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto py-12 md:py-0">
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <FadeIn delay={0.1}>
          <span className="px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-6 inline-block">
            ⚡ Fibra Óptica Dedicada
          </span>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight max-w-4xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.1] md:leading-[0.95] pb-2 px-2">
            A internet que voa para o seu mundo.
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.5}>
          <p className="mt-6 text-sm md:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed px-2">
            A XFibra entrega estabilidade absoluta, ultravelocidade e suporte humanizado em minutos. Conecte sua casa ou empresa ao que há de mais avançado.
          </p>
        </FadeIn>
        
        <FadeIn delay={0.7}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
            <a href="#planos" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:scale-102 text-sm w-full sm:w-auto text-center">
              Conhecer os Planos
            </a>
            <a href="#planos" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold rounded-xl transition-all text-sm w-full sm:w-auto text-center">
              Consultar Disponibilidade
            </a>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          2 e 3. SEÇÃO DE PLANOS E COBERTURA SINCRONIZADOS
          ========================================================================= */}
      <PlanosDinamicosWrapper planos={planos} />

      {/* =========================================================================
          4. SEÇÃO DE VANTAGENS E DIFERENCIAIS
          ========================================================================= */}
      <Diferenciais />

      {/* =========================================================================
          5. SEÇÃO DO APLICATIVO MÓVEL (MOCKUP CENTRAL DO ASSINANTE)
          ========================================================================= */}
      <AppSection />

      {/* =========================================================================
          6. RODAPÉ INSTITUCIONAL
          ========================================================================= */}
      <Footer />

    </div>
  )
}