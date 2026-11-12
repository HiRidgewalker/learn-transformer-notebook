import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'

export function Separator({ className, ...props }: ComponentProps<typeof SeparatorPrimitive.Root>): JSX.Element {
  return <SeparatorPrimitive.Root className={cn('h-px w-full bg-line dark:bg-line-dark', className)} {...props} />
}
