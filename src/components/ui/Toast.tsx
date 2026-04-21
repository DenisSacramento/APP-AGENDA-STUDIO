import { cn } from '../../utils/cn'

interface ToastProps {
  open: boolean
  message: string
  type?: 'success' | 'error'
}

export const Toast = ({ open, message, type = 'success' }: ToastProps) => {
  if (!open) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:bottom-6 sm:right-6">
      <div
        className={cn(
          'rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[0_12px_28px_rgba(28,20,39,0.22)] backdrop-blur',
          type === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900',
          type === 'error' && 'border-rose-200 bg-rose-50 text-rose-900',
        )}
      >
        {message}
      </div>
    </div>
  )
}
