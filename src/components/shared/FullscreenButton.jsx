import { useState, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

export function useFullscreen(containerRef) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  async function toggle() {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      try { await containerRef.current.requestFullscreen() } catch {}
    } else {
      try { await document.exitFullscreen() } catch {}
    }
  }

  return { isFullscreen, toggle }
}

export default function FullscreenButton({ containerRef, className = '' }) {
  const { isFullscreen, toggle } = useFullscreen(containerRef)
  return (
    <button onClick={toggle} className={`text-xogun-muted hover:text-xogun-accent transition-colors ${className}`}
      title={isFullscreen ? 'Saír de pantalla completa' : 'Pantalla completa'}>
      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
    </button>
  )
}
