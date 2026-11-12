import * as SwitchPrimitive from '@radix-ui/react-switch'
import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>): JSX.Element {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-line bg-subtle transition-colors data-[state=checked]:bg-mint dark:border-line-dark dark:bg-subtle-dark dark:data-[state=checked]:bg-mint-dark',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 translate-x-0.5 rounded-full bg-panel transition-transform data-[state=checked]:translate-x-5 dark:bg-panel-dark" />
    </SwitchPrimitive.Root>
  )
}
