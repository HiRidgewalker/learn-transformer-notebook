import { useState, type JSX } from 'react'
import { formatNumber } from '@/core'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame, LabHint, SliderField } from '@/labs/lab-frame'

const input = [1, 2, 3, 4]
const sublayer = [0.1, -0.2, 0.3, 0]

export function NormalizationLab(): JSX.Element {
  const [gamma, setGamma] = useState(1)
  const residual = input.map((value, index) => value + (sublayer[index] ?? 0))
  const mean = residual.reduce((sum, value) => sum + value, 0) / residual.length
  const variance = residual.reduce((sum, value) => sum + (value - mean) ** 2, 0) / residual.length
  const epsilon = 0.00001
  const scale = Math.sqrt(variance + epsilon)
  const adjusted = residual.map((value) => ((value - mean) / scale) * gamma)
  return (
    <LabFrame name="Add → Norm 实时计算" description="从一个 Token 的四维向量出发，逐步看到均值、方差与标准化后的结果。">
      <div className="grid gap-3">
        <p className="font-mono text-sm">输入 X [{input.join(', ')}]</p>
        <p className="font-mono text-sm">子层输出 F(X) [{sublayer.join(', ')}]</p>
        <p className={cn('rounded-control px-3 py-2 font-mono text-sm', surfaces.mintSoft)}>残差相加 R = X + F(X) [{residual.join(', ')}]</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Metric label="均值 μ" value={formatNumber(mean)} />
        <Metric label="方差 σ²" value={formatNumber(variance)} />
        <Metric label="标准差" value={formatNumber(scale)} />
      </div>
      <SliderField label="示意 γ（统一缩放）" display={gamma.toFixed(2)} value={gamma} min={0.5} max={2} step={0.1} onChange={setGamma} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {adjusted.map((value, index) => (
          <div
            key={index}
            className={cn('rounded-control px-3 py-2', {
              'bg-subtle text-orange dark:bg-subtle-dark dark:text-orange-dark': value < 0,
              'bg-mint-soft text-mint dark:bg-mint-soft-dark dark:text-mint-dark': value >= 0,
            })}
          >
            <p className="text-xs">dim {index}</p>
            <p className="font-mono font-semibold">{formatNumber(value, 4)}</p>
          </div>
        ))}
      </div>
      <LabHint>实验统一设置 β=0、γ 为可调的同一值。实际 LayerNorm 使用逐维独立可学习的 γ、β。</LabHint>
    </LabFrame>
  )
}

function Metric({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className={cn('rounded-control p-3', surfaces.subtle)}>
      <p className={cn('text-xs', surfaces.muted)}>{label}</p>
      <p className="font-mono font-semibold">{value}</p>
    </div>
  )
}
