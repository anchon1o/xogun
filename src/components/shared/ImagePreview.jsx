import { useState, useEffect } from 'react'
import { ImageOff } from 'lucide-react'

/**
 * Previsualización de imaxe robusta: amosa un estado de carga,
 * e se a URL falla, un indicador claro de erro en vez de deixar
 * un oco baleiro (que parecía "non funciona" aínda que a imaxe
 * cargase correctamente noutro sitio).
 *
 * Modos:
 * - Tamaño fixo (por defecto): pasa `size` en px, ej. para miniaturas de listas.
 * - `fill`: ocupa o 100% do contedor pai (útil en tarxetas do catálogo,
 *   onde o tamaño real depende do grid responsivo, non dun valor fixo).
 */
export default function ImagePreview({ src, alt = '', className = '', size = 40, fill = false, fallbackIcon = null }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'error'

  useEffect(() => {
    setStatus('loading')
    if (!src) { setStatus('error'); return }
    const img = new Image()
    img.onload = () => setStatus('ok')
    img.onerror = () => setStatus('error')
    img.src = src
  }, [src])

  const sizeStyle = fill ? {} : { width: size, height: size }

  if (status === 'error') {
    return (
      <div className={`flex items-center justify-center bg-xogun-surface border border-xogun-border rounded ${fill ? 'w-full h-full' : ''} ${className}`}
        style={sizeStyle} title="Non se puido cargar a imaxe">
        {fallbackIcon ? <span className="text-2xl opacity-40">{fallbackIcon}</span> : <ImageOff size={fill ? 24 : size * 0.45} className="text-xogun-muted" />}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded ${fill ? 'w-full h-full' : ''} ${className}`} style={sizeStyle}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-xogun-surface animate-pulse" />
      )}
      <img src={src} alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${status === 'ok' ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}
