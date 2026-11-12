import { MDXProvider } from '@mdx-js/react'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Clock, Sparkles, Zap } from 'lucide-react'
import { type JSX } from 'react'
import { mdxComponents } from '@/components/mdx-components'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { lessons, type LessonModule } from '@/content/catalog'
import { LessonProvider } from '@/content/lesson-context'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

const sectionLinks = [
  { id: 'question', label: '学习目标' },
  { id: 'steps', label: '逐步推导' },
  { id: 'lab', label: '互动实验' },
  { id: 'takeaway', label: '核心结论' },
] as const

export function LessonPage({
  lesson,
  done,
  onNavigate,
  onToggleDone,
}: {
  lesson: LessonModule
  done: readonly string[]
  onNavigate: (id: string) => void
  onToggleDone: (id: string) => void
}): JSX.Element {
  const index = lessons.findIndex((item) => item.meta.id === lesson.meta.id)
  const next = lessons[index + 1]
  const finished = done.includes(lesson.meta.id)
  const Content = lesson.Content
  const progress = lessons.length === 0 ? 0 : (done.length / lessons.length) * 100
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
          <ArrowLeft className="size-4" /> 返回学习地图
        </Button>
        <span className={cn('font-mono text-xs', surfaces.muted)}>
          LESSON {lesson.meta.no} / {String(lessons.length - 1).padStart(2, '0')}
        </span>
      </div>
      <header className="mt-8 border-b border-line pb-8 dark:border-line-dark">
        <p className={cn('text-xs tracking-widest', surfaces.mint)}>
          {lesson.meta.eyebrow} · {lesson.meta.en}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{lesson.meta.title}</h1>
        <p className={cn('mt-4 max-w-3xl text-sm leading-7', surfaces.muted)}>{lesson.meta.summary}</p>
        <div className={cn('mt-4 flex flex-wrap gap-4 text-sm', surfaces.muted)}>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4" />
            {lesson.meta.duration}
          </span>
          <span className="inline-flex items-center gap-2">
            <BookOpen className="size-4" />
            {lesson.stepCount} 个推导步骤
          </span>
          <span className="inline-flex items-center gap-2">
            <Zap className="size-4" />
            可交互演示
          </span>
        </div>
      </header>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <LessonProvider meta={lesson.meta}>
            <MDXProvider components={mdxComponents}>
              <Content />
            </MDXProvider>
          </LessonProvider>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <Button variant={finished ? 'secondary' : 'primary'} onClick={() => onToggleDone(lesson.meta.id)}>
              <Check className="size-4" />
              {finished ? '已完成 · 点击撤销' : '标记本章已理解'}
            </Button>
            <Button variant="secondary" onClick={() => onNavigate(next ? next.meta.id : 'home')}>
              {next ? (
                <span>
                  下一章 <strong>{next.meta.title}</strong>
                </span>
              ) : (
                <span>返回学习总览</span>
              )}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className={cn('text-xs tracking-widest', surfaces.muted)}>IN THIS LESSON</p>
          <div className="mt-3 flex flex-col gap-1">
            {sectionLinks.map((link, linkIndex) => (
              <button
                key={link.id}
                type="button"
                onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={cn('flex items-center gap-2 rounded-control px-2 py-2 text-left text-sm', surfaces.muted, surfaces.hover)}
              >
                <span className="font-mono text-xs">0{linkIndex + 1}</span>
                {link.label}
                <ChevronRight className="ml-auto size-4" />
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className={cn('text-xs', surfaces.muted)}>YOUR JOURNEY</p>
            <p className="mt-1 font-semibold">
              {done.length} / {lessons.length}
            </p>
            <Progress className="mt-2" value={progress} aria-label="学习进度" />
          </div>
          <p className={cn('mt-4 flex gap-2 text-sm leading-6', surfaces.muted)}>
            <Sparkles className="mt-1 size-4 shrink-0" />
            推荐顺序：先理解文字与小矩阵，再操作实验，最后回看公式。
          </p>
        </aside>
      </div>
    </div>
  )
}
