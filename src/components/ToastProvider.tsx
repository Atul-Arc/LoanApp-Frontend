import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

type ToastVariant = 'info' | 'success' | 'error'

type Toast = {
  id: string
  message: string
  variant: ToastVariant
}

export type ShowToastOptions = {
  message: string
  variant?: ToastVariant
  duration?: number
}

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void
}

const DEFAULT_DURATION = 5000

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutRefs = useRef<Record<string, number>>({})

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
    const timeoutId = timeoutRefs.current[id]
    if (typeof timeoutId === 'number') {
      window.clearTimeout(timeoutId)
      delete timeoutRefs.current[id]
    }
  }, [])

  const showToast = useCallback(
    ({ message, variant = 'info', duration = DEFAULT_DURATION }: ShowToastOptions) => {
      const trimmedMessage = message.trim()
      if (!trimmedMessage) {
        return
      }

      const id = generateId()
      setToasts(prev => [...prev, { id, message: trimmedMessage, variant }])

      const timeoutId = window.setTimeout(() => removeToast(id), Math.max(1000, duration))
      timeoutRefs.current[id] = timeoutId
    },
    [removeToast],
  )

  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeoutId => {
        window.clearTimeout(timeoutId)
      })
      timeoutRefs.current = {}
    }
  }, [])

  const contextValue = useMemo<ToastContextValue>(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toastContainer" aria-live="polite" aria-atomic="true">
        {toasts.map(({ id, message, variant }) => (
          <div
            key={id}
            className={`toast toast--${variant}`}
            role={variant === 'error' ? 'alert' : 'status'}
          >
            <span className="toast__message">{message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => removeToast(id)}
              aria-label="Dismiss notification"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
