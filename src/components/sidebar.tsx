import { Check, ChevronRight, House, Layers, Search } from 'lucide-react'
import { type JSX } from 'react'
import { type LessonModule } from '@/content/catalog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

export function Sidebar({
  route,
  lessons,
  query,
  done,
  onQuery,
  onNavigate,
}: {
  route: string
  lessons: readonly LessonModule[]
  query: string
  done: readonly string[]
  onQuery: (value: string) => void
  onNavigate: (id: string) => void
}): JSX.Element {
  const normalized = query.trim().toLowerCase()
  const filtered = lessons.filter((lesson) => {
    const haystack = `${lesson.meta.title} ${lesson.meta.en} ${lesson.meta.eyebrow} ${lesson.meta.no}`.toLowerCase()
    return haystack.includes(normalized)
  })
  const progress = lessons.length === 0 ? 0 : (done.length / lessons.length) * 100
  return (
    <div className={cn('flex h-full w-72 flex-col', surfaces.side)}>
      <button type="button" onClick={() => onNavigate('home')} className="flex items-center gap-3 px-4 py-5 text-left">
        <span className="flex size-10 items-center justify-center rounded-control bg-mint text-canvas dark:bg-mint-dark dark:text-canvas-dark">
          <Layers className="size-5" />
        </span>
        <span>
          <strong className="block">Transformer Atlas</strong>
          <small className={surfaces.muted}>从原理到生成的可视化地图</small>
        </span>
      </button>
      <div className="px-4 pb-3">
        <p className={cn('mb-2 flex items-center justify-between text-xs tracking-widest', surfaces.muted2)}>
          <span>LEARNING PATH</span>
          <span>{lessons.length} LESSONS</span>
        </p>
        <div className="relative">
          <Search className={cn('absolute top-1/2 left-3 size-4 -translate-y-1/2', surfaces.muted)} />
          <Input
            data-lesson-search
            className="pr-10 pl-9"
            value={query}
            placeholder="搜索章节 / 概念..."
            aria-label="搜索章节"
            onChange={(event) => onQuery(event.target.value)}
          />
          <span className={cn('absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs', surfaces.muted2)}>/</span>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <nav className="flex flex-col gap-1 px-3 pb-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={cn('flex items-center gap-2 rounded-control px-3 py-2 text-left text-sm', {
              'bg-mint-soft text-ink dark:bg-mint-soft-dark dark:text-ink-dark': route === 'home',
              'text-muted hover:bg-hover dark:text-muted-dark dark:hover:bg-hover-dark': route !== 'home',
            })}
          >
            <House className="size-4" />
            总览 · 学习首页
            <ChevronRight className="ml-auto size-4" />
          </button>
          {filtered.map((lesson, index) => {
            const previous = filtered[index - 1]
            const showGroup = !previous || previous.meta.eyebrow !== lesson.meta.eyebrow
            const active = route === lesson.meta.id
            return (
              <div key={lesson.meta.id}>
                {showGroup ? <p className={cn('px-3 pt-3 pb-1 text-xs', surfaces.muted2)}>{lesson.meta.eyebrow}</p> : null}
                <button
                  type="button"
                  onClick={() => onNavigate(lesson.meta.id)}
                  className={cn('flex w-full items-center gap-3 rounded-control px-3 py-2 text-left text-sm', {
                    'bg-mint-soft text-ink dark:bg-mint-soft-dark dark:text-ink-dark': active,
                    'text-muted hover:bg-hover dark:text-muted-dark dark:hover:bg-hover-dark': !active,
                  })}
                >
                  <span className="w-6 font-mono text-xs">{lesson.meta.no}</span>
                  <span className="min-w-0 flex-1 truncate">{lesson.meta.title}</span>
                  {done.includes(lesson.meta.id) ? <Check className="size-4 text-mint dark:text-mint-dark" /> : null}
                </button>
              </div>
            )
          })}
          {filtered.length === 0 ? <p className={cn('px-3 py-4 text-sm', surfaces.muted)}>没有匹配章节</p> : null}
        </nav>
      </ScrollArea>
      <div className="border-t border-line px-4 py-4 dark:border-line-dark">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className={surfaces.muted}>学习进度</span>
          <strong>
            {done.length} / {lessons.length}
          </strong>
        </div>
        <Progress value={progress} aria-label="学习进度" />
        <p className={cn('mt-2 text-xs', surfaces.muted2)}>每一步都有迹可循。</p>
      </div>
    </div>
  )
}
