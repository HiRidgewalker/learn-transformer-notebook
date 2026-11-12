import { useState, type JSX } from 'react'
import { formatPercent, softmax } from '@/core'
import { DistributionChart } from '@/components/charts'
import { Switch } from '@/components/ui/switch'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { ChoiceRow, LabFrame, LabHint } from '@/labs/lab-frame'

const scores = [1, 2, 3, 4]

export function MaskLab(): JSX.Element {
  const [row, setRow] = useState(2)
  const [enabled, setEnabled] = useState(true)
  const allowed = scores.map((_, index) => !enabled || index <= row)
  const logits = scores.map((value, index) => (allowed[index] ? value : Number.NEGATIVE_INFINITY))
  const finite = logits.filter((value) => Number.isFinite(value))
  const probabilities = softmax(finite)
  let finiteIndex = 0
  const weights = allowed.map((ok) => {
    if (!ok) return 0
    const weight = probabilities[finiteIndex] ?? 0
    finiteIndex += 1
    return weight
  })
  return (
    <LabFrame name="Causal Mask 实时实验" description="选择 Query 所在行，体验未来位置被设置为 −∞ 后，Softmax 如何分配权重。">
      <ChoiceRow label="Query 位置" options={['0', '1', '2', '3']} active={row} onSelect={setRow} />
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="启用因果掩码" />
        <span>启用因果掩码 Causal Mask</span>
      </label>
      <div className="grid gap-2">
        <p className={cn('text-xs tracking-widest', surfaces.muted)}>QUERY ↓ / KEY →</p>
        {[0, 1, 2, 3].map((rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2 text-center text-sm">
            <span className={cn({ 'font-semibold text-mint dark:text-mint-dark': row === rowIndex })}>Q{rowIndex}</span>
            {[0, 1, 2, 3].map((column) => {
              const blocked = enabled && column > rowIndex
              return (
                <span
                  key={column}
                  className={cn('rounded-control py-2', {
                    'bg-subtle text-orange dark:bg-subtle-dark dark:text-orange-dark': blocked,
                    'bg-mint-soft text-mint dark:bg-mint-soft-dark dark:text-mint-dark': !blocked,
                    'ring-1 ring-mint dark:ring-mint-dark': row === rowIndex,
                  })}
                >
                  {blocked ? '×' : '✓'}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 font-mono text-sm">
        {logits.map((value, index) => (
          <div key={index}>
            <p className={surfaces.muted}>Key {index}</p>
            <p>{Number.isFinite(value) ? value : '−∞'}</p>
            <p>{formatPercent(weights[index] ?? 0)}</p>
          </div>
        ))}
      </div>
      <DistributionChart
        label="掩码后的注意力权重"
        mode="percent"
        items={weights.map((weight, index) => ({
          label: `Key ${index}`,
          value: weight,
          tone: weight === 0 ? 'orange' : 'mint',
        }))}
      />
      <LabHint>此处评分固定为 [1, 2, 3, 4]，只用来展示 Mask 在 Softmax 前后的效果。</LabHint>
    </LabFrame>
  )
}
