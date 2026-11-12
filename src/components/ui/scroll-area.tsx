import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { type JSX, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ScrollArea({ className, children }: { className?: string; children: ReactNode }): JSX.Element {
  return (
    <ScrollAreaPrimitive.Root className={cn('relative overflow-hidden', className)}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full">{children}</ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="flex w-2 touch-none p-0.5">
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-line dark:bg-line-dark" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  )
}
