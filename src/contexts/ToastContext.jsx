import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = { success: CheckCircle, error: XCircle, info: Info }
const COLORS = {
  success: 'border-green-500/40 text-green-400 bg-green-500/10',
  error: 'border-xogun-red/40 text-xogun-red bg-xogun-red/10',
  info: 'border-xogun-accent/40 text-xogun-accent bg-xogun-accent/10',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const show = useCallback((message, type = 'info', duration = 4500) => {
    const id = crypto.randomUUID()
    setToasts(t => [...t, { id, message, type }])
    if (duration) setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const toast = {
    success: (msg, duration) => show(msg, 'success', duration),
    error: (msg, duration) => show(msg, 'error', duration),
    info: (msg, duration) => show(msg, 'info', duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center w-full px-4 pointer-events-none">
        {toasts.map(t => {
          const Icon = ICONS[t.type] || Info
          return (
            <div key={t.id}
              className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-lg max-w-sm animate-fade-in ${COLORS[t.type]}`}
              style={{ backgroundColor: '#181510' }}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="text-sm flex-1">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-70 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return { success: () => {}, error: (msg) => console.error(msg), info: () => {} }
  }
  return ctx
}
