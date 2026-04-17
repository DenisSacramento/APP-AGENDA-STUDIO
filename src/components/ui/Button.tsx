import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  fullWidth,
  className,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={cn(
        'rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-rose-500 text-white hover:bg-rose-600',
        variant === 'secondary' && 'bg-amber-100 text-amber-900 hover:bg-amber-200',
        variant === 'ghost' && 'bg-white/70 text-zinc-700 hover:bg-white',
        variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
