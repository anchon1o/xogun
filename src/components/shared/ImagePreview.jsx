import { useState, useEffect } from 'react'
import { ImageOff } from 'lucide-react'

/**
 * Previsualización de imaxe robusta: amosa un estado de carga,
 * e se a URL falla, un indicador claro de erro en vez de deixar
 * un oco baleiro (que parecía "non funciona" aínda que a imaxe
 * cargase correctamente noutro sitio).
 */
export default function ImagePreview({ src, alt = '', className = '', size = 40 }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'error'

  useEffect(() => {
    setStatus('loading')
    if (!src) { setStatus('error'); return }
    const img = new Image()
    img.onload = () => setStatus('ok')
    img.onerror = () => setStatus('error')
    img.src = src
  }, [src])

  if (status === 'error') {
    return (
      <div className={`flex items-center justify-center bg-xogun-surface border border-xogun-border rounded ${className}`}
        style={{ width: size, height: size }} title="Non se puido cargar a imaxe">
        <ImageOff size={size * 0.45} className="text-xogun-muted" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded ${className}`} style={{ width: size, height: size }}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-xogun-surface animate-pulse" />
      )}
      <img src={src} alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${status === 'ok' ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}
