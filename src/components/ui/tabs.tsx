import * as TabsPrimitive from '@radix-ui/react-tabs'
import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'
import { surfaces } from '@/lib/surfaces'

export function Tabs({ ...props }: ComponentProps<typeof TabsPrimitive.Root>): JSX.Element {
  return <TabsPrimitive.Root {...props} />
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>): JSX.Element {
  return (
    <TabsPrimitive.List
      className={cn('flex h-auto flex-wrap gap-1 rounded-control p-1', surfaces.subtle, className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>): JSX.Element {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-control px-3 text-sm font-medium transition-colors data-[state=active]:bg-panel data-[state=active]:text-ink data-[state=active]:shadow-panel dark:data-[state=active]:bg-panel-dark dark:data-[state=active]:text-ink-dark dark:data-[state=active]:shadow-panel-dark',
        surfaces.muted,
        className,
      )}
      {...props}
    />
  )
}
