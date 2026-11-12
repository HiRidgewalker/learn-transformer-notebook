import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { type JSX, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { surfaces } from '@/lib/surfaces'

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}): JSX.Element {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-canvas lg:hidden dark:bg-canvas-dark" />
        <Dialog.Content className={cn('fixed inset-y-0 left-0 z-50 w-72 outline-none lg:hidden', surfaces.side)}>
          <Dialog.Title className="sr-only">学习导航</Dialog.Title>
          <Dialog.Description className="sr-only">章节列表与学习进度</Dialog.Description>
          {children}
          <Dialog.Close className="absolute top-4 right-4 rounded-control p-2 text-muted dark:text-muted-dark">
            <X className="size-4" />
            <span className="sr-only">关闭</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
