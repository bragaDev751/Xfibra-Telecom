import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'XFibra Telecom',
    short_name: 'XFibra',
    description: 'Sistema Integrado de Gestão e Provedor de Internet',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0F19',
    theme_color: '#0B0F19',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}