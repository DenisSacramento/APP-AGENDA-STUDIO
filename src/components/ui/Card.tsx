import type { PropsWithChildren } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  className?: string
}

export const Card = ({ children, className }: PropsWithChildren<CardProps>) => (
  <article className={cn('rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm shadow-rose-100/70', className)}>
    {children}
  </article>
)
