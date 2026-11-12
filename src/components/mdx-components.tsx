import { Children, type JSX, type ReactNode } from 'react'
import { MathBlock } from '@/components/math-block'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useLesson } from '@/content/lesson-context'
import { Lab } from '@/labs/lab'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

export function Question({ children }: { children: ReactNode }): JSX.Element {
  const lesson = useLesson()
  return (
    <section id="question" className="scroll-mt-24">
      <p className={cn('text-xs tracking-widest', surfaces.mint)}>01 · 先回答一个问题</p>
      <h2 className="mt-3 text-2xl font-semibold">{children}</h2>
      <p className={cn('mt-3 max-w-3xl text-sm leading-7', surfaces.muted)}>{lesson.summary}</p>
    </section>
  )
}

export function Formula({ tex }: { tex: string }): JSX.Element {
  return (
    <Card className="mt-6">
      <p className={cn('text-xs tracking-widest', surfaces.muted)}>核心数学公式 · KEY EQUATION</p>
      <MathBlock tex={tex} />
    </Card>
  )
}

export function Io(): JSX.Element {
  const lesson = useLesson()
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <Card>
        <p className={cn('text-xs tracking-widest', surfaces.mint)}>INPUT</p>
        <p className="mt-2">{lesson.input}</p>
      </Card>
      <span className={surfaces.muted}>→</span>
      <Card>
        <p className={cn('text-xs tracking-widest', surfaces.mint)}>OUTPUT</p>
        <p className="mt-2">{lesson.output}</p>
      </Card>
    </div>
  )
}

export function Steps({ children }: { children: ReactNode }): JSX.Element {
  const items = Children.toArray(children)
  return (
    <section id="steps" className="mt-12 scroll-mt-24">
      <p className={cn('text-xs tracking-widest', surfaces.mint)}>02 · 打开黑盒 · 逐步推导</p>
      <h2 className="mt-3 text-2xl font-semibold">每个数字是怎样走到下一步的？</h2>
      <ol className="mt-6 flex flex-col gap-6">
        {items.map((item, index) => (
          <li key={index} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
            <span className={cn('flex size-8 items-center justify-center rounded-full font-mono text-sm', surfaces.mintSoft)}>
              {index + 1}
            </span>
            <div>{item}</div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Step({ title, example, children }: { title: string; example: string; children: ReactNode }): JSX.Element {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className={cn('mt-2 text-sm leading-7', surfaces.muted)}>{children}</p>
      <div className={cn('mt-3 rounded-control px-4 py-3', surfaces.subtle)}>
        <p className={cn('text-xs', surfaces.mint)}>具体算例</p>
        <p className="mt-1 font-medium">{example}</p>
      </div>
    </div>
  )
}

export function LabSection({ id }: { id: string }): JSX.Element {
  return (
    <section id="lab" className="mt-12 scroll-mt-24">
      <p className={cn('text-xs tracking-widest', surfaces.mint)}>03 · 动手实验 · 让公式动起来</p>
      <div className="mt-4">
        <Lab id={id} />
      </div>
    </section>
  )
}

export function Takeaway({ insight, caution }: { insight: string; caution: string }): JSX.Element {
  return (
    <section id="takeaway" className="mt-12 scroll-mt-24">
      <p className={cn('text-xs tracking-widest', surfaces.mint)}>04 · 现在记住这一点</p>
      <Card className="mt-4 flex gap-4">
        <Badge>结论</Badge>
        <div>
          <h3 className="font-semibold">核心结论</h3>
          <p className={cn('mt-2 text-sm leading-7', surfaces.muted)}>{insight}</p>
        </div>
      </Card>
      <Card className="mt-3">
        <h3 className="font-semibold">容易混淆的地方</h3>
        <p className={cn('mt-2 text-sm leading-7', surfaces.muted)}>{caution}</p>
      </Card>
    </section>
  )
}

export const mdxComponents = {
  Question,
  Formula,
  Io,
  Steps,
  Step,
  LabSection,
  Takeaway,
}
