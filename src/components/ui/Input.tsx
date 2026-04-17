import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-zinc-700">
      <span className="font-medium">{label}</span>
      <input
        className={cn(
          'w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 outline-none ring-0 transition focus:border-rose-300',
          error && 'border-red-300',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  )
}
