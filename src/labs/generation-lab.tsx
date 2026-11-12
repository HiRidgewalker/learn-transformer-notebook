import { useState, type JSX } from 'react'
import { GENERATION_LABELS, GENERATION_PROBABILITIES, GENERATION_SEQUENCE } from '@/core'
import { DistributionChart } from '@/components/charts'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame, LabHint } from '@/labs/lab-frame'

export function GenerationLab(): JSX.Element {
  const [step, setStep] = useState(0)
  const chartIndex = Math.min(step, 3)
  const labels = GENERATION_LABELS[chartIndex] ?? []
  const probabilities = GENERATION_PROBABILITIES[chartIndex] ?? []
  const max = Math.max(...probabilities)
  const finished = step === 4
  return (
    <LabFrame name="自回归 Token 生成器" description="每次点击只生成一个新 Token；新 Token 会变成下一轮 Decoder 的输入。" badge="推理循环">
      <div>
        <p className={cn('text-xs tracking-widest', surfaces.muted)}>CURRENT PREFIX · 当前前缀</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GENERATION_SEQUENCE.slice(0, step + 1).map((token, index) => (
            <span
              key={`${token}-${index}`}
              className={cn('rounded-control px-3 py-2 font-mono', {
                'bg-mint text-canvas dark:bg-mint-dark dark:text-canvas-dark': index === step,
                'bg-subtle dark:bg-subtle-dark': index !== step,
              })}
            >
              {token}
            </span>
          ))}
        </div>
      </div>
      <DistributionChart
        label="下一 Token 的候选概率"
        mode="percent"
        items={labels.map((label, index) => ({
          label,
          value: probabilities[index] ?? 0,
          tone: (probabilities[index] ?? 0) === max ? 'mint' : 'purple',
        }))}
      />
      <div className={cn('rounded-control px-4 py-3', surfaces.mintSoft)}>
        <p className="text-sm">{finished ? '停止条件满足' : 'argmax 选出下一个 Token'}</p>
        <p className="font-semibold">{finished ? '已生成 <eos>，序列结束' : GENERATION_SEQUENCE[step + 1]}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" size="sm" onClick={() => setStep(0)}>
          <RefreshCw className="size-4" /> 重新开始
        </Button>
        <span className={cn('text-sm', surfaces.muted)}>已生成 {step} 个 Token</span>
        <Button size="sm" disabled={finished} onClick={() => setStep((value) => Math.min(4, value + 1))}>
          生成下一个
        </Button>
      </div>
      <LabHint>本实验使用预先设定的理想译文与示例概率，不运行真实训练好的模型。每轮概率排列只用于说明 argmax。</LabHint>
    </LabFrame>
  )
}
