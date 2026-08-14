'use client'

import { QRCodeSVG } from 'qrcode.react'

interface Props {
  isOpen: boolean
  onClose: () => void
  appUrl: string
}

export default function QrCodeModal({ isOpen, onClose, appUrl }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full flex flex-col items-center text-center shadow-2xl relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white text-sm font-bold bg-slate-800 p-1.5 rounded-lg"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-white mb-1">📱 Baixar Aplicativo</h3>
        <p className="text-xs text-slate-400 mb-6">
          Aponte a câmera do seu celular para escanear e instalar o app.
        </p>

        {/* Quadrado do QR Code */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-slate-700">
          <QRCodeSVG value={appUrl} size={200} level="H" />
        </div>

        <p className="text-[11px] font-mono text-slate-500 mt-4 truncate max-w-full px-2">
          {appUrl}
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}