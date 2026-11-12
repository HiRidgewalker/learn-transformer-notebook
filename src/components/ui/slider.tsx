import * as SliderPrimitive from '@radix-ui/react-slider'
import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'
import { surfaces } from '@/lib/surfaces'

export function Slider({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>): JSX.Element {
  return (
    <SliderPrimitive.Root className={cn('relative flex w-full touch-none items-center select-none', className)} {...props}>
      <SliderPrimitive.Track className={cn('relative h-2 w-full grow overflow-hidden rounded-full', surfaces.subtle)}>
        <SliderPrimitive.Range className="absolute h-full bg-mint dark:bg-mint-dark" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-5 rounded-full border border-mint bg-panel shadow-panel outline-none focus-visible:ring-2 focus-visible:ring-mint dark:border-mint-dark dark:bg-panel-dark dark:shadow-panel-dark dark:focus-visible:ring-mint-dark" />
    </SliderPrimitive.Root>
  )
}
