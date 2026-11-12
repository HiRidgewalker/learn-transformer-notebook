import { cva } from 'class-variance-authority'
import { type ComponentProps, type JSX } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-control font-semibold transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-mint-dark',
  {
    variants: {
      variant: {
        primary: 'bg-mint text-canvas hover:opacity-90 dark:bg-mint-dark dark:text-canvas-dark',
        secondary:
          'border border-line bg-panel text-ink hover:bg-hover dark:border-line-dark dark:bg-panel-dark dark:text-ink-dark dark:hover:bg-hover-dark',
        ghost: 'text-muted hover:bg-subtle hover:text-ink dark:text-muted-dark dark:hover:bg-subtle-dark dark:hover:text-ink-dark',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 px-3 text-xs',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'default' | 'sm' | 'icon'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ className, variant = 'primary', size = 'default', type = 'button', ...props }: ButtonProps): JSX.Element {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
