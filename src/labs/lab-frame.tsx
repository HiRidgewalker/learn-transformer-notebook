import { ArrowLeft, ArrowRight } from 'lucide-react'
import { type JSX, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

export function LabFrame({
  name,
  description,
  badge = '实时计算',
  children,
}: {
  name: string
  description: string
  badge?: string
  children: ReactNode
}): JSX.Element {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={cn('text-xs tracking-widest', surfaces.mint)}>INTERACTIVE SANDBOX</p>
          <h3 className="mt-2 text-xl font-semibold">{name}</h3>
          <p className={cn('mt-1 text-sm', surfaces.muted)}>{description}</p>
        </div>
        <Badge>{badge}</Badge>
      </div>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </Card>
  )
}

export function LabHint({ children }: { children: ReactNode }): JSX.Element {
  return <p className={cn('text-sm leading-6', surfaces.muted)}>{children}</p>
}

export function StageControls({
  index,
  total,
  onPrev,
  onNext,
  doneLabel = '重新查看',
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  doneLabel?: string
}): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="secondary" size="sm" onClick={onPrev}>
        <ArrowLeft className="size-4" /> 上一步
      </Button>
      <span className={cn('font-mono text-sm', surfaces.muted)}>
        {index + 1} / {total}
      </span>
      <Button size="sm" onClick={onNext}>
        {index === total - 1 ? doneLabel : '下一步'} <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}

export function SliderField({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  display: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}): JSX.Element {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <strong>{display}</strong>
      </div>
      <Slider
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(next) => {
          const resolved = next[0]
          if (resolved === undefined) return
          onChange(resolved)
        }}
      />
    </div>
  )
}

export function ChoiceRow({
  label,
  options,
  active,
  onSelect,
}: {
  label: string
  options: readonly string[]
  active: number
  onSelect: (index: number) => void
}): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn('text-sm', surfaces.muted)}>{label}</span>
      {options.map((option, index) => (
        <Button key={option} size="sm" variant={active === index ? 'primary' : 'secondary'} onClick={() => onSelect(index)}>
          {option}
        </Button>
      ))}
    </div>
  )
}
