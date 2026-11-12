import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'
import { surfaces } from '@/lib/surfaces'

export function Input({ className, ...props }: ComponentProps<'input'>): JSX.Element {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-control border px-3 text-sm outline-none placeholder:text-muted-2 focus-visible:ring-2 focus-visible:ring-mint dark:placeholder:text-muted-2-dark dark:focus-visible:ring-mint-dark',
        surfaces.panel,
        surfaces.line,
        className,
      )}
      {...props}
    />
  )
}
