import { type JSX, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export function MathBlock({ tex, small = false }: { tex: string; small?: boolean }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let active = true
    let observer: ResizeObserver | undefined
    element.textContent = tex
    const mathjax = window.MathJax
    const startup = mathjax?.startup?.promise
    if (!mathjax || !startup) return
    startup
      .then(() => {
        if (!active) return
        const host = ref.current
        if (!host) return
        mountMathjaxStyles()
        host.replaceChildren(mathjax.tex2svg(tex, { display: true }))
        fitFormula(host)
        observer = new ResizeObserver(() => fitFormula(host))
        observer.observe(host)
      })
      .catch(() => {
        if (!active) return
        const host = ref.current
        if (!host) return
        host.textContent = tex
      })
    return () => {
      active = false
      observer?.disconnect()
    }
  }, [tex])

  return <div ref={ref} aria-label={tex} className={cn('overflow-x-auto py-1 text-center', { 'text-sm': small })} />
}

function mountMathjaxStyles(): void {
  if (!document.getElementById('MJX-SVG-styles')) {
    const sheet = window.MathJax?.svgStylesheet?.()
    if (sheet) document.head.append(sheet)
  }
  if (document.getElementById('math-block-assistive-fix')) return
  const fix = document.createElement('style')
  fix.id = 'math-block-assistive-fix'
  // 辅助 MathML 会被裁切，但宽度仍按正文撑开，窄屏下公式容器会出现多余横向滚动。
  fix.textContent = 'mjx-assistive-mml { width: 1px !important; height: 1px !important; }'
  document.head.append(fix)
}

function fitFormula(host: HTMLElement): void {
  const svg = host.querySelector('svg')
  if (!(svg instanceof SVGSVGElement)) return
  // Tailwind 预检把 svg 设成 block，MathJax 靠 vertical-align 对齐的下半部分会被裁掉。
  svg.style.display = 'inline'
  const align = svg.dataset.align ?? svg.style.verticalAlign
  svg.dataset.align = align
  svg.style.maxWidth = 'none'
  svg.style.height = ''
  svg.style.verticalAlign = align
  const available = host.clientWidth
  const width = svg.getBoundingClientRect().width
  if (available > 0 && width > available + 1) {
    svg.style.maxWidth = '100%'
    svg.style.height = 'auto'
    svg.style.verticalAlign = 'middle'
  }
}
