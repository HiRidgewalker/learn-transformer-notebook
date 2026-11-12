import { Menu, Moon, Sun } from 'lucide-react'
import { useCallback, useEffect, useState, type JSX } from 'react'
import { GithubIcon } from '@/components/github-icon'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { lessons, lessonById } from '@/content/catalog'
import { NavigateProvider } from '@/content/lesson-context'
import { HomePage } from '@/pages/home'
import { LessonPage } from '@/pages/lesson'
import { applyTheme, readDone, readRoute, readTheme, writeDone, type ThemeName } from '@/lib/preferences'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

const lessonIds = lessons.map((lesson) => lesson.meta.id)

export function App(): JSX.Element {
  const [route, setRoute] = useState(() => readRoute(lessonIds))
  const [query, setQuery] = useState('')
  const [done, setDone] = useState<string[]>(() => readDone())
  const [theme, setTheme] = useState<ThemeName>(() => readTheme())
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setRoute(readRoute(lessonIds))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      event.preventDefault()
      const fields = [...document.querySelectorAll<HTMLInputElement>('[data-lesson-search]')]
      const visible = fields.find((field) => field.getClientRects().length > 0)
      visible?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navigate = useCallback((id: string) => {
    const next = id === 'home' ? '#/' : `#/learn/${id}`
    if (location.hash === next) window.scrollTo(0, 0)
    location.hash = next
    setMenuOpen(false)
  }, [])

  const toggleDone = useCallback((id: string) => {
    setDone((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      writeDone(next)
      return next
    })
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }, [theme])

  const lesson = lessonById(route)
  const sidebarProps = {
    route,
    lessons,
    query,
    done,
    onQuery: setQuery,
    onNavigate: navigate,
  }

  return (
    <NavigateProvider navigate={navigate}>
      <div className={cn('min-h-screen', surfaces.page)}>
        <aside className="fixed inset-y-0 left-0 z-30 hidden lg:block">
          <Sidebar {...sidebarProps} />
        </aside>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <Sidebar {...sidebarProps} />
        </Sheet>
        <div className="lg:pl-72">
          <header className={cn('sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 lg:px-8', surfaces.page, surfaces.line)}>
            <div className="flex min-w-0 items-center gap-2">
              <Button className="lg:hidden" variant="ghost" size="icon" aria-label="打开导航" onClick={() => setMenuOpen(true)}>
                <Menu className="size-4" />
              </Button>
              <p className="truncate text-sm">
                <button type="button" className={surfaces.muted} onClick={() => navigate('home')}>
                  Transformer Atlas
                </button>
                <span className={cn('px-2', surfaces.muted2)}>/</span>
                <strong>{lesson ? lesson.meta.title : '学习总览'}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('hidden items-center gap-2 text-xs sm:inline-flex', surfaces.muted)}>
                <span className="size-2 rounded-full bg-mint dark:bg-mint-dark" />
                经典 Encoder–Decoder
              </span>
              <Button variant="ghost" size="icon" aria-label="切换深色或浅色" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <a
                className="inline-flex size-10 items-center justify-center rounded-control text-muted hover:bg-subtle hover:text-ink dark:text-muted-dark dark:hover:bg-subtle-dark dark:hover:text-ink-dark"
                href="https://github.com/HiRidgewalker/learn-transformer-notebook"
                target="_blank"
                rel="noreferrer"
                aria-label="参考学习项目"
              >
                <GithubIcon className="size-4" />
              </a>
            </div>
          </header>
          <main className="px-4 py-8 lg:px-8">
            {lesson ? (
              <LessonPage lesson={lesson} done={done} onNavigate={navigate} onToggleDone={toggleDone} />
            ) : (
              <HomePage lessons={lessons} done={done} onNavigate={navigate} />
            )}
          </main>
          <footer className={cn('flex flex-wrap justify-between gap-2 border-t px-4 py-6 text-xs lg:px-8', surfaces.muted, surfaces.line)}>
            <span>Transformer Atlas · 经典 Transformer 交互式学习手册</span>
            <span>本地可运行 · 无需模型 API</span>
          </footer>
        </div>
      </div>
    </NavigateProvider>
  )
}
