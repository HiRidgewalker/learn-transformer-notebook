import { ArrowRight, Code, Layers, Zap } from 'lucide-react'
import { type JSX } from 'react'
import { ArchitectureFlow } from '@/components/architecture-flow'
import { MathBlock } from '@/components/math-block'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { type LessonModule } from '@/content/catalog'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

export function HomePage({
  lessons,
  done,
  onNavigate,
}: {
  lessons: readonly LessonModule[]
  done: readonly string[]
  onNavigate: (id: string) => void
}): JSX.Element {
  const next = lessons.find((lesson) => !done.includes(lesson.meta.id))?.meta.id ?? 'tokenizer'
  const progress = lessons.length === 0 ? 0 : Math.round((done.length / lessons.length) * 100)
  return (
    <div className="flex flex-col gap-16">
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <p className={cn('text-xs tracking-widest', surfaces.mint)}>INTERACTIVE TRANSFORMER JOURNEY · 中文 · 开源可学</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            从一个 Token，
            <br />
            走到<span className="bg-linear-to-r from-mint to-blue bg-clip-text text-transparent dark:from-mint-dark dark:to-blue-dark">一整个 Transformer.</span>
          </h1>
          <p className={cn('mt-4 max-w-xl text-sm leading-7', surfaces.muted)}>
            不跳步骤，不背结论。用可拖动的参数、逐维计算、动态连线与公式，把经典 Encoder–Decoder Transformer 的每一步真正看明白。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => onNavigate(next)}>
              开始探索 <ArrowRight className="size-4" />
            </Button>
            <Button variant="secondary" onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}>
              查看架构全图 <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className={cn('mt-6 flex flex-wrap gap-4 text-sm', surfaces.muted)}>
            <span className="inline-flex items-center gap-2">
              <Layers className="size-4" /> {lessons.length} 个章节
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="size-4" /> 实时交互演算
            </span>
            <span className="inline-flex items-center gap-2">
              <Code className="size-4" /> 数学原理可追溯
            </span>
          </div>
        </div>
        <Card className="flex min-h-64 items-center justify-center bg-mint-soft dark:bg-mint-soft-dark">
          <div className="w-full text-center">
            <p className={cn('text-xs tracking-widest', surfaces.mint)}>ATTENTION</p>
            <MathBlock tex={String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`} />
          </div>
        </Card>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat index="01 / LEARNING" value={String(lessons.length)} unit="章" text="沿数据流逐步推导" />
        <Stat index="02 / INTERACTION" value="11" unit="组+" text="每章专属可视化实验" />
        <Stat index="03 / YOUR PROGRESS" value={String(done.length)} unit={`/ ${lessons.length}`} text={`已完成课程 ${progress}%`} />
      </section>
      <section id="architecture" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={cn('text-xs tracking-widest', surfaces.mint)}>THE SYSTEM / 经典架构</p>
            <h2 className="mt-2 text-3xl font-semibold">先看全局，再钻进细节</h2>
            <p className={cn('mt-2 text-sm', surfaces.muted)}>点击任意模块，即可跳转到它的课程页面。</p>
          </div>
          <span className={cn('text-sm', surfaces.muted)}>ENCODER → DECODER</span>
        </div>
        <Card>
          <ArchitectureFlow onOpen={onNavigate} />
          <p className={cn('mt-3 text-sm', surfaces.muted)}>编码源句与生成目标序列通过交叉注意力连接，K、V 来自 Encoder。</p>
        </Card>
      </section>
      <section>
        <p className={cn('text-xs tracking-widest', surfaces.mint)}>CURRICULUM / 学习路径</p>
        <h2 className="mt-2 text-3xl font-semibold">循序渐进的 {lessons.length} 站</h2>
        <p className={cn('mt-2 text-sm', surfaces.muted)}>每一站都有定义、公式、手算过程与动态演示。</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => (
            <button
              key={lesson.meta.id}
              type="button"
              onClick={() => onNavigate(lesson.meta.id)}
              className={cn('rounded-card border p-5 text-left shadow-panel transition-colors dark:shadow-panel-dark', surfaces.panel, surfaces.line, surfaces.hover)}
            >
              <div className="flex items-center justify-between">
                <span className={cn('font-mono text-xs', surfaces.muted)}>{lesson.meta.no}</span>
                {done.includes(lesson.meta.id) ? <Badge>已学</Badge> : <ArrowRight className={cn('size-4', surfaces.muted)} />}
              </div>
              <p className={cn('mt-6 text-xs', surfaces.muted)}>
                {lesson.meta.eyebrow} · {lesson.meta.duration}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{lesson.meta.title}</h3>
              <p className={cn('mt-2 text-sm leading-6', surfaces.muted)}>{lesson.meta.summary}</p>
            </button>
          ))}
        </div>
      </section>
      <section className={cn('flex flex-wrap items-center justify-between gap-6 rounded-card p-8', surfaces.mintSoft)}>
        <div>
          <p className={cn('text-xs tracking-widest', surfaces.mint)}>READY TO LEARN?</p>
          <h2 className="mt-2 text-3xl font-semibold">理解从来不是跳过细节。</h2>
          <p className={cn('mt-2 text-sm', surfaces.muted)}>从第一行 Token ID 开始，沿着真实的数据流走完整个 Transformer。</p>
        </div>
        <Button onClick={() => onNavigate('tokenizer')}>
          从 Tokenizer 开始 <ArrowRight className="size-4" />
        </Button>
      </section>
    </div>
  )
}

function Stat({ index, value, unit, text }: { index: string; value: string; unit: string; text: string }): JSX.Element {
  return (
    <Card>
      <p className={cn('text-xs tracking-widest', surfaces.muted)}>{index}</p>
      <p className="mt-3 text-3xl font-semibold">
        {value} <small className="text-base font-medium">{unit}</small>
      </p>
      <p className={cn('mt-2 text-sm', surfaces.muted)}>{text}</p>
    </Card>
  )
}
