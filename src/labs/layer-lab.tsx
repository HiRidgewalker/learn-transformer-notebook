import { useState, type JSX } from 'react'
import { LayerFlow, type LayerStep } from '@/components/layer-flow'
import { Card } from '@/components/ui/card'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame, StageControls } from '@/labs/lab-frame'

const encoderSteps = [
  { title: '输入向量 X', detail: '每个源 Token 都有位置编码后的向量。' },
  { title: 'Self-Attention', detail: '每个源 Query 可以关注全部有效源 Key。' },
  { title: 'Add & Norm', detail: '加回 X，再对每个 Token 做 LayerNorm。' },
  { title: 'FFN', detail: '单独加工每个 Token，4→8→4。' },
  { title: 'Add & Norm / H_enc', detail: '加回 FFN 的输入 U，再归一化。' },
] as const

const decoderSteps = [
  { title: '目标向量 Y', detail: '目标前缀编码为四维向量。' },
  { title: 'Masked Self-Attention', detail: '目标侧只能关注自己与过去的位置。' },
  { title: 'Cross-Attention', detail: '目标侧 Q 查询源侧 Encoder 提供的 K、V。' },
  { title: 'FFN + Add & Norm', detail: '残差归一化后，对每个目标 Token 单独做 FFN，再 Add & Norm。' },
  { title: 'H_dec 输出', detail: '输出隐藏状态，下一步才是词表投影。' },
] as const

export function EncoderLab(): JSX.Element {
  return <LayerLab name="Encoder 层逐站解析" steps={encoderSteps} cross={false} />
}

export function DecoderLab(): JSX.Element {
  return <LayerLab name="Decoder 层逐站解析" steps={decoderSteps} cross />
}

function LayerLab({ name, steps, cross }: { name: string; steps: readonly LayerStep[]; cross: boolean }): JSX.Element | null {
  const [stage, setStage] = useState(0)
  const active = stage % steps.length
  const current = steps[active]
  if (!current) return null
  return (
    <LabFrame name={name} description="点击流程节点，高亮当前子层及其输入输出。" badge="数据流">
      <LayerFlow steps={steps} active={active} onSelect={setStage} cross={cross} />
      <div>
        <p className={cn('text-xs tracking-widest', surfaces.mint)}>
          STEP {active + 1} / {steps.length}
        </p>
        <h4 className="mt-2 text-lg font-semibold">{current.title}</h4>
        <p className={cn('mt-2 text-sm leading-6', surfaces.muted)}>{current.detail}</p>
      </div>
      {cross && active === 2 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>Decoder Q · 4×2</Card>
          <Card>Encoder K, V · 3×2</Card>
          <Card>注意力评分矩阵 4×3</Card>
        </div>
      ) : null}
      <StageControls
        index={active}
        total={steps.length}
        onPrev={() => setStage((active + steps.length - 1) % steps.length)}
        onNext={() => setStage((active + 1) % steps.length)}
        doneLabel="下一步"
      />
    </LabFrame>
  )
}
