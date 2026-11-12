import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'
import { surfaces } from '@/lib/surfaces'

export function Card({ className, ...props }: ComponentProps<'div'>): JSX.Element {
  return (
    <div
      className={cn('rounded-card border p-5 shadow-panel dark:shadow-panel-dark', surfaces.panel, surfaces.line, className)}
      {...props}
    />
  )
}
