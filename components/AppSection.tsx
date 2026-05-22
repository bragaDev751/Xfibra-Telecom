"use client"

import { 
  Smartphone, 
  Home, 
  Coins, 
  FileText, 
  Unlock, 
  BarChart3, 
  UserSquare2, 
  PenTool, 
  Wrench, 
  Paperclip 
} from 'lucide-react'

export default function AppSection() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto relative">
      {/* Glow de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-gradient-to-r from-slate-900 via-slate-900/40 to-slate-900 border border-slate-800 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
        
        {/* Texto descritivo esquerdo */}
        <div className="max-w-md w-full">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            Central do Assinante
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-4 text-white">
            Controle total na palma da mão
          </h2>
          <p className="text-slate-400 mt-4 leading-relaxed text-sm md:text-base">
            Acesse nossa plataforma digital da Atlaz de onde estiver. Garanta a segunda via de faturas, realize auto desbloqueio, acompanhe relatórios de consumo e atualize seus dados em poucos cliques.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a 
              href="https://play.google.com/store/apps/details?id=br.com.atlaz.xfibra&pli=1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-5 py-3 rounded-xl transition-all group"
            >
              <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium uppercase">Disponível no</p>
                <p className="text-sm font-bold text-slate-200">Google Play</p>
              </div>
            </a>

            <a 
              href="https://apps.apple.com/br/app-store/id6742653540" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-5 py-3 rounded-xl transition-all group"
            >
              <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium uppercase">Disponível na</p>
                <p className="text-sm font-bold text-slate-200">App Store</p>
              </div>
            </a>
          </div>
        </div>

        {/* Mockup do Celular - TOTALMENTE REESTRUTURADO E SEGURO CONTRA ENCOLHIMENTO */}
        <div className="relative flex justify-center items-center w-full md:w-auto shrink-0">
          <div 
            style={{ 
              width: '310px', 
              height: '580px', 
              backgroundColor: '#020617', 
              borderRadius: '46px', 
              padding: '10px',
              boxSizing: 'border-box'
            }}
            className="border-[8px] border-slate-800 relative shadow-2xl shadow-cyan-500/10"
          >
            
            {/* Câmera do celular */}
            <div className="w-24 h-4 bg-slate-800 rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-50" />
            
            {/* TELA INTERNA */}
            <div 
              style={{ 
                backgroundColor: '#FFFFFF', 
                color: '#1E293B', 
                height: '100%',
                width: '100%',
                borderRadius: '36px',
                overflow: 'hidden',
                position: 'relative',
                boxSizing: 'border-box'
              }} 
              className="text-left select-none font-sans"
            >
              
              {/* 1. TOPO FIXO ABSOLUTO (Não encolhe nunca mais) */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '115px',
                  backgroundColor: '#38B6CD', 
                  color: '#FFFFFF', 
                  padding: '24px 16px 12px 16px', 
                  textAlign: 'center', 
                  borderBottomLeftRadius: '22px', 
                  borderBottomRightRadius: '22px',
                  boxSizing: 'border-box',
                  zIndex: '20'
                }} 
                className="shadow-md"
              >
                <div style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '3px', opacity: 0.95 }}>
                  XFIBRA TELECOM
                </div>
                <p style={{ fontSize: '12px', fontWeight: '800', lineHeight: '1.2', margin: 0 }}>GABRIEL DA SILVA BRAGA</p>
                <p style={{ fontSize: '10px', opacity: 0.9, marginTop: '2px', marginBottom: 0 }}>12345678920</p>
                
                <div style={{ marginTop: '5px' }}>
                  <p style={{ fontSize: '10px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', padding: '2px 8px', display: 'inline-block', fontWeight: '700', margin: 0 }}>
                    Plano: *100Mb Residencial - 69,99R$
                  </p>
                </div>
                
                {/* Ícone de Casinha */}
                <div style={{ position: 'absolute', top: '24px', right: '16px', color: '#FFFFFF', opacity: 0.9 }}>
                  <Home size={16} />
                </div>
              </div>

              {/* 2. CONTEÚDO SCROLLÁVEL DO MEIO COM ESPAÇAMENTO TOP/BOTTOM FIXO */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: '115px',
                  bottom: '42px',
                  left: 0,
                  right: 0,
                  overflowY: 'auto',
                  paddingBottom: '16px',
                  boxSizing: 'border-box'
                }} 
                className="no-scrollbar"
              >
                
                {/* Caixa de Seleção de Contrato */}
                <div className="px-3 mt-3 w-full" style={{ boxSizing: 'border-box' }}>
                  <div 
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', boxSizing: 'border-box' }}
                    className="text-[10px] font-bold text-slate-700 shadow-sm"
                  >
                    <span className="truncate pr-2 flex-1 text-left">Contrato: *100Mb Residencial - 69,99R$ - joao ferr</span>
                    <span style={{ color: '#64748B', fontSize: '8px' }} className="shrink-0">▼</span>
                  </div>
                </div>

                {/* Lista de Botões Turquesa Menu */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', paddingLeft: '12px', paddingRight: '12px', marginTop: '10px', width: '100%', boxSizing: 'border-box' }}>
                  
                  {/* Botão 1 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <Coins size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>2ª via de cobrança e recibo</span>
                  </div>

                  {/* Botão 2 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <FileText size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>Notas fiscais (NFCom)</span>
                  </div>

                  {/* Botão 3 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <Unlock size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>Auto desbloqueio</span>
                  </div>

                  {/* Botão 4 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <BarChart3 size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>Relatório de consumo</span>
                  </div>

                  {/* Botão 5 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <UserSquare2 size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>Atualizar dados cadastrais</span>
                  </div>

                  {/* Botão 6 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <PenTool size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>Documentos</span>
                  </div>

                  {/* Botão 7 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <Wrench size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>Dados do contrato</span>
                  </div>

                  {/* Botão 8 */}
                  <div style={{ backgroundColor: '#41B6CD', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', width: '100%', boxSizing: 'border-box' }} className="shadow-sm">
                    <div style={{ width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="shrink-0">
                      <Paperclip size={15} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1' }}>Anexos</span>
                  </div>

                </div>
              </div>

              {/* Ícone do WhatsApp Flutuante Fiel à Foto */}
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: '55px', 
                  right: '16px', 
                  backgroundColor: '#25D366', 
                  width: '34px', 
                  height: '34px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  zIndex: '30'
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#FFFFFF' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.161 1.24 8.413 3.488 2.25 2.248 3.492 5.23 3.49 8.411-.004 6.557-5.338 11.902-11.893 11.902-1.998-.001-3.951-.5-5.688-1.448L0 24zm6.59-4.846c1.656.983 3.28 1.477 4.903 1.478 5.332 0 9.68-4.356 9.682-9.699.001-2.586-1.007-5.015-2.836-6.845-1.829-1.83-4.256-2.837-6.84-2.838-5.338 0-9.686 4.351-9.688 9.691-.001 1.684.475 3.327 1.378 4.78l-.994 3.63 3.731-.977zm11.233-5.244c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.174.2-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </div>

              {/* 3. RODAPÉ FIXO ABSOLUTO (Sempre travado embaixo) */}
              <div 
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#F1F5F9', 
                  borderTop: '1px solid #E2E8F0', 
                  padding: '0 16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  color: '#64748B', 
                  borderBottomLeftRadius: '36px', 
                  borderBottomRightRadius: '36px',
                  boxSizing: 'border-box',
                  zIndex: '20'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>‹</span>
                <div 
                  style={{ backgroundColor: '#E2E8F0', fontSize: '10px', color: '#334155', paddingLeft: '16px', paddingRight: '16px', paddingTop: '3px', paddingBottom: '3px', borderRadius: '9999px', fontWeight: '600', maxWidth: '140px' }}
                  className="truncate"
                >
                  xfibra.atlaz.com.br
                </div>
                <span style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 'bold' }}>•••</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}