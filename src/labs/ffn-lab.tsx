import { useState, type JSX } from 'react'
import { BASE_INPUT_VECTOR, FFNO, FFNR, FFNU, formatNumber } from '@/core'
import { DistributionChart } from '@/components/charts'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame, StageControls } from '@/labs/lab-frame'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const stages = [
  { name: '输入 · 4 维', values: BASE_INPUT_VECTOR, description: '一个 Token 的原始输入向量。' },
  { name: '线性扩展 · 8 维', values: FFNU, description: 'xW₁+b₁：每一列 W₁ 分别生成一个中间特征。' },
  { name: 'ReLU · 8 维', values: FFNR, description: 'max(0,u)：负数置零，非负数保留。' },
  { name: '线性降维 · 4 维', values: FFNO, description: 'RW₂+b₂：再将八个中间特征合成为四维输出。' },
] as const

const labels = ['输入 4D', '升维 8D', 'ReLU', '降维 4D']

export function FfnLab(): JSX.Element | null {
  const [stage, setStage] = useState(0)
  const active = stage % stages.length
  const current = stages[active]
  if (!current) return null
  const first = FFNU[0] ?? 0
  return (
    <LabFrame name="4 → 8 → ReLU → 4" description="点击各阶段，查看真实矩阵运算后每一维的变化。">
      <Tabs value={String(active)} onValueChange={(value) => setStage(Number(value))}>
        <TabsList>
          {labels.map((label, index) => (
            <TabsTrigger key={label} value={String(index)}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div>
        <p className="font-semibold">{current.name}</p>
        <p className={cn('mt-1 text-sm', surfaces.muted)}>{current.description}</p>
      </div>
      <DistributionChart
        label={current.name}
        mode="number"
        className={current.values.length > 4 ? 'h-80' : 'h-48'}
        items={current.values.map((value, index) => ({
          label: `d${index}`,
          value,
          tone: value < 0 ? 'orange' : value === 0 ? 'muted' : 'mint',
        }))}
      />
      {active === 1 ? (
        <p className={cn('rounded-control px-4 py-3 font-mono text-sm', surfaces.subtle)}>
          第 0 维：1×0.5 + 0×0 − 1×0.2 + 2×0 + 0 = {formatNumber(first)}
        </p>
      ) : null}
      {active === 2 ? (
        <p className={cn('rounded-control px-4 py-3 font-mono text-sm', surfaces.subtle)}>ReLU(x) = max(0, x)；负值全部变成 0</p>
      ) : null}
      <StageControls
        index={active}
        total={stages.length}
        onPrev={() => setStage((active + stages.length - 1) % stages.length)}
        onNext={() => setStage((active + 1) % stages.length)}
      />
    </LabFrame>
  )
}
