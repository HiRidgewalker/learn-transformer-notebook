import { type ComponentType } from 'react'

export type LessonMeta = {
  id: string
  no: string
  eyebrow: string
  title: string
  en: string
  summary: string
  duration: string
  input: string
  output: string
}

export type LessonModule = {
  meta: LessonMeta
  stepCount: number
  Content: ComponentType
}

const compiled = import.meta.glob<{ default: ComponentType; frontmatter: unknown }>('./lessons/*.mdx', { eager: true })
const sources = import.meta.glob<string>('./lessons/*.mdx', { eager: true, query: '?raw', import: 'default' })

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function readLessonMeta(value: unknown): LessonMeta | null {
  if (!isRecord(value)) return null
  const id = value.id
  const no = value.no
  const eyebrow = value.eyebrow
  const title = value.title
  const en = value.en
  const summary = value.summary
  const duration = value.duration
  const input = value.input
  const output = value.output
  if (
    typeof id !== 'string' ||
    typeof no !== 'string' ||
    typeof eyebrow !== 'string' ||
    typeof title !== 'string' ||
    typeof en !== 'string' ||
    typeof summary !== 'string' ||
    typeof duration !== 'string' ||
    typeof input !== 'string' ||
    typeof output !== 'string'
  ) {
    return null
  }
  return { id, no, eyebrow, title, en, summary, duration, input, output }
}

function loadLessons(): LessonModule[] {
  const lessons: LessonModule[] = []
  for (const [path, module] of Object.entries(compiled)) {
    const meta = readLessonMeta(module.frontmatter)
    if (!meta) continue
    const source = sources[path]
    const stepCount = typeof source === 'string' ? [...source.matchAll(/<Step\b/g)].length : 0
    lessons.push({ meta, stepCount, Content: module.default })
  }
  return lessons.sort((left, right) => left.meta.no.localeCompare(right.meta.no))
}

export const lessons = loadLessons()

export function lessonById(id: string): LessonModule | null {
  return lessons.find((lesson) => lesson.meta.id === id) ?? null
}
