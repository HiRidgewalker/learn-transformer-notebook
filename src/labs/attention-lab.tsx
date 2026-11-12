import { useState, type JSX } from 'react'
import { AttentionFlow } from '@/components/attention-flow'
import { DistributionChart } from '@/components/charts'
import { Matrix } from '@/components/matrix'
import { BASE_K, BASE_V, QUERY_OPTIONS, attentionWeights, dot, formatNumber, formatPercent, softmax, weightedSum } from '@/core'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { ChoiceRow, LabFrame, LabHint, StageControls } from '@/labs/lab-frame'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const stageLabels = ['生成 Q/K/V', '点积并缩放', 'Softmax', 'Value 加权']

export function AttentionLab(): JSX.Element | null {
  const [mode, setMode] = useState(0)
  const [stage, setStage] = useState(0)
  const [focus, setFocus] = useState(-1)
  const query = QUERY_OPTIONS[mode]
  if (!query) return null
  const scores = BASE_K.map((key) => dot(query, key))
  const scaled = scores.map((value) => value / Math.sqrt(2))
  const weights = softmax(scaled)
  const output = weightedSum(weights, BASE_V)
  const active = stage % stageLabels.length
  return (
    <LabFrame name="Attention：从分数到新向量" description="选择 Query，再依次查看 4 个计算阶段。所有数字都会实时更新。">
      <ChoiceRow
        label="当前 Query"
        options={QUERY_OPTIONS.map((option) => `[${option.join(', ')}]`)}
        active={mode}
        onSelect={setMode}
      />
      <Tabs value={String(active)} onValueChange={(value) => setStage(Number(value))}>
        <TabsList>
          {stageLabels.map((label, index) => (
            <TabsTrigger key={label} value={String(index)}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {active === 0 ? <QueryStage query={query} /> : null}
      {active === 1 ? <ScoreStage scores={scores} scaled={scaled} /> : null}
      {active === 2 ? <WeightStage weights={weights} focus={focus} onFocus={setFocus} /> : null}
      {active === 3 ? <OutputStage weights={weights} output={output} /> : null}
      <StageControls
        index={active}
        total={stageLabels.length}
        onPrev={() => setStage((active + stageLabels.length - 1) % stageLabels.length)}
        onNext={() => setStage((active + 1) % stageLabels.length)}
      />
    </LabFrame>
  )
}

function QueryStage({ query }: { query: readonly number[] }): JSX.Element {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div>
        <p className={cn('text-xs', surfaces.muted)}>QUERY</p>
        <p className="font-mono text-lg font-semibold">[{query.join(', ')}]</p>
      </div>
      <div>
        <p className={cn('text-xs', surfaces.muted)}>KEY MATRIX</p>
        <Matrix values={BASE_K} />
      </div>
      <div>
        <p className={cn('text-xs', surfaces.muted)}>VALUE MATRIX</p>
        <Matrix values={BASE_V} />
      </div>
      <LabHint>实际模型使用输入 X 乘 W_Q/W_K/W_V 得到这些向量。这里从给定 Q/K/V 开始手算 Attention。</LabHint>
    </div>
  )
}

function ScoreStage({ scores, scaled }: { scores: readonly number[]; scaled: readonly number[] }): JSX.Element {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {BASE_K.map((_, index) => (
        <div key={index} className={cn('rounded-control p-3', surfaces.subtle)}>
          <p className={cn('text-xs', surfaces.muted)}>q · K{index + 1}</p>
          <p className="font-mono text-lg font-semibold">{formatNumber(scores[index] ?? 0)}</p>
          <p className={cn('text-sm', surfaces.muted)}>÷ √2 = {formatNumber(scaled[index] ?? 0)}</p>
        </div>
      ))}
      <p className={cn('font-mono text-sm sm:col-span-3', surfaces.muted)}>缩放分数 [{scaled.map((value) => formatNumber(value)).join(', ')}]</p>
    </div>
  )
}

function WeightStage({
  weights,
  focus,
  onFocus,
}: {
  weights: readonly number[]
  focus: number
  onFocus: (index: number) => void
}): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <AttentionFlow weights={weights} selected={focus} onSelect={onFocus} />
      <DistributionChart
        label="注意力权重"
        mode="percent"
        items={weights.map((weight, index) => ({
          label: `Key ${index + 1}`,
          value: weight,
          tone: focus === index ? 'purple' : 'mint',
        }))}
      />
      <p className="font-mono text-sm">Σ 注意力权重 = {formatNumber(weights.reduce((sum, value) => sum + value, 0), 4)}</p>
    </div>
  )
}

function OutputStage({ weights, output }: { weights: readonly number[]; output: readonly number[] }): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {weights.map((weight, index) => (
        <p key={index} className="font-mono text-sm">
          {formatNumber(weight, 4)} × V{index + 1} = [
          {(BASE_V[index] ?? []).map((value) => formatNumber(weight * value, 4)).join(', ')}]
        </p>
      ))}
      <p className={cn('rounded-control px-4 py-3 font-mono', surfaces.mintSoft)}>
        最终输出向量 [{output.map((value) => formatNumber(value, 6)).join(', ')}]
      </p>
    </div>
  )
}

export function MultiheadLab(): JSX.Element {
  const first = attentionWeights([1, 0], BASE_K)
  const second = attentionWeights([0, 1], BASE_K)
  const out1 = weightedSum(first, BASE_V)
  const out2 = weightedSum(second, BASE_V)
  return (
    <LabFrame name="两个头同时看" description="同一组 K/V，展示两种不同查询向量如何得到不同的注意力分布。" badge="双头示意">
      <div className="grid gap-4 lg:grid-cols-2">
        <HeadPanel title="HEAD 01" query="[1, 0]" weights={first} output={out1} tone="mint" />
        <HeadPanel title="HEAD 02" query="[0, 1]" weights={second} output={out2} tone="purple" />
      </div>
      <p className={cn('rounded-control px-4 py-3 font-mono text-sm', surfaces.subtle)}>
        CONCAT → [{[...out1, ...out2].map((value) => formatNumber(value, 3)).join(', ')}]
      </p>
      <LabHint>真实多头注意力使用各头各自训练的 Q/K/V 投影；这里仅用不同 Query 展示注意力差异，之后还需乘 W_O。</LabHint>
    </LabFrame>
  )
}

function HeadPanel({
  title,
  query,
  weights,
  output,
  tone,
}: {
  title: string
  query: string
  weights: readonly number[]
  output: readonly number[]
  tone: 'mint' | 'purple'
}): JSX.Element {
  return (
    <div className={cn('rounded-control border p-4', surfaces.line)}>
      <p className={cn('text-xs tracking-widest', surfaces.mint)}>{title}</p>
      <p className="mt-1 font-semibold">Q = {query}</p>
      <DistributionChart
        label={`${title} 权重`}
        mode="percent"
        className="h-40"
        items={weights.map((weight, index) => ({ label: `K${index + 1}`, value: weight, tone }))}
      />
      <p className={cn('font-mono text-sm', surfaces.muted)}>
        输出 [{output.map((value) => formatNumber(value)).join(', ')}] · {weights.map((weight) => formatPercent(weight)).join(' / ')}
      </p>
    </div>
  )
}
