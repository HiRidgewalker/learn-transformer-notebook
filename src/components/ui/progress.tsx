import * as ProgressPrimitive from '@radix-ui/react-progress'
import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'
import { surfaces } from '@/lib/surfaces'

type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number
}

export function Progress({ className, value = 0, ...props }: ProgressProps): JSX.Element {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full', surfaces.subtle, className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full bg-mint transition-transform dark:bg-mint-dark"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
