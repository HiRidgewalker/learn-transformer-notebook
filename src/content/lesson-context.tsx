import { createContext, use, type JSX, type ReactNode } from 'react'
import { type LessonMeta } from '@/content/catalog'

const LessonContext = createContext<LessonMeta | null>(null)
const NavigateContext = createContext<(id: string) => void>(() => {})

export function NavigateProvider({
  navigate,
  children,
}: {
  navigate: (id: string) => void
  children: ReactNode
}): JSX.Element {
  return <NavigateContext value={navigate}>{children}</NavigateContext>
}

export function LessonProvider({
  meta,
  children,
}: {
  meta: LessonMeta
  children: ReactNode
}): JSX.Element {
  return <LessonContext value={meta}>{children}</LessonContext>
}

export function useLesson(): LessonMeta {
  const meta = use(LessonContext)
  if (!meta) throw new Error('课程正文缺少 LessonProvider')
  return meta
}

export function useNavigateLesson(): (id: string) => void {
  return use(NavigateContext)
}
