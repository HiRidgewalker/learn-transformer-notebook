import { useState, type JSX } from 'react'
import { formatNumber, softmax } from '@/core'
import { DistributionChart } from '@/components/charts'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame, LabHint, SliderField } from '@/labs/lab-frame'

const names = ['I · 正确', 'love', 'you']

export function TrainingLab(): JSX.Element {
  const [bias, setBias] = useState(0)
  const logits = [0.4 + bias, 1.2, 0.8]
  const probabilities = softmax(logits)
  const correct = probabilities[0] ?? 0
  const loss = -Math.log(correct)
  const gradient = correct - 1
  return (
    <LabFrame name="正确概率如何控制 Loss" description="假设正确 Token 是 I。只调整 I 的 Logit，观察 Softmax、Cross-Entropy 和梯度的实时变化。">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <p className={cn('text-xs', surfaces.muted)}>DECODER 输入（正确历史）</p>
          <p className="font-semibold">&lt;bos&gt; I love</p>
        </div>
        <span className={surfaces.muted}>→</span>
        <div>
          <p className={cn('text-xs', surfaces.muted)}>训练标签</p>
          <p className="font-semibold">I love you</p>
        </div>
      </div>
      <SliderField
        label="正确 Token「I」的 Logit 增量"
        display={`${bias > 0 ? '+' : ''}${bias.toFixed(1)}`}
        value={bias}
        min={-3}
        max={5}
        step={0.1}
        onChange={setBias}
      />
      <DistributionChart
        label="三个候选的概率"
        mode="percent"
        items={names.map((name, index) => ({
          label: name,
          value: probabilities[index] ?? 0,
          tone: index === 0 ? 'mint' : 'purple',
        }))}
      />
      <div className="grid gap-2 font-mono text-sm sm:grid-cols-3">
        {logits.map((logit, index) => (
          <p key={names[index] ?? index}>
            {names[index]} logit = {formatNumber(logit, 2)}
          </p>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={cn('rounded-control p-4', surfaces.subtle)}>
          <p className={cn('text-xs', surfaces.muted)}>CROSS-ENTROPY LOSS</p>
          <p className="font-mono text-2xl font-semibold">{formatNumber(loss, 4)}</p>
          <p className={cn('text-sm', surfaces.muted)}>−ln({formatNumber(correct, 4)})</p>
        </div>
        <div className={cn('rounded-control p-4', surfaces.subtle)}>
          <p className={cn('text-xs', surfaces.muted)}>正确类 LOGIT GRADIENT</p>
          <p className="font-mono text-2xl font-semibold">{formatNumber(gradient, 4)}</p>
          <p className={cn('text-sm', surfaces.muted)}>P(I) − 1</p>
        </div>
      </div>
      <LabHint>这是一个三候选的教学算例，不执行真实训练；实际参数更新须将梯度反传到模型权重。</LabHint>
    </LabFrame>
  )
}
