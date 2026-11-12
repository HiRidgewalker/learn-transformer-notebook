import { useEffect, useState } from 'react'
import { useThemeKey } from '@/lib/preferences'
import { cn } from '@/lib/utils'

export type ChartTone = 'mint' | 'purple' | 'orange' | 'blue' | 'muted'

export type ChartPalette = {
  canvas: string
  ink: string
  muted: string
  mint: string
  line: string
  purple: string
  orange: string
  blue: string
  panel: string
}

const probes = {
  canvas: 'bg-canvas dark:bg-canvas-dark',
  ink: 'bg-ink dark:bg-ink-dark',
  muted: 'bg-muted dark:bg-muted-dark',
  mint: 'bg-mint dark:bg-mint-dark',
  line: 'bg-line dark:bg-line-dark',
  purple: 'bg-purple dark:bg-purple-dark',
  orange: 'bg-orange dark:bg-orange-dark',
  blue: 'bg-blue dark:bg-blue-dark',
  panel: 'bg-panel dark:bg-panel-dark',
} as const

const darkFallback: ChartPalette = {
  canvas: '#080d17',
  ink: '#f0f5fe',
  muted: '#91a2bb',
  mint: '#58e2c3',
  line: '#223148',
  purple: '#b49bff',
  orange: '#f4b473',
  blue: '#76aaff',
  panel: '#101a2a',
}

const lightFallback: ChartPalette = {
  canvas: '#f7f9fd',
  ink: '#19253b',
  muted: '#60728c',
  mint: '#148b7b',
  line: '#dae2ef',
  purple: '#8461c5',
  orange: '#b86b26',
  blue: '#3276cf',
  panel: '#ffffff',
}

function readBackground(className: string): string {
  const probe = document.createElement('div')
  probe.className = cn(className, 'absolute size-4 opacity-0')
  document.body.append(probe)
  const color = getComputedStyle(probe).backgroundColor
  probe.remove()
  return color
}

function colorFor(className: string, fallbackColor: string): string {
  const color = readBackground(className)
  return color.startsWith('rgb') ? color : fallbackColor
}

export function readChartPalette(): ChartPalette {
  const themeFallback = document.documentElement.classList.contains('dark') ? darkFallback : lightFallback
  return {
    canvas: colorFor(probes.canvas, themeFallback.canvas),
    ink: colorFor(probes.ink, themeFallback.ink),
    muted: colorFor(probes.muted, themeFallback.muted),
    mint: colorFor(probes.mint, themeFallback.mint),
    line: colorFor(probes.line, themeFallback.line),
    purple: colorFor(probes.purple, themeFallback.purple),
    orange: colorFor(probes.orange, themeFallback.orange),
    blue: colorFor(probes.blue, themeFallback.blue),
    panel: colorFor(probes.panel, themeFallback.panel),
  }
}

export function useChartPalette(): ChartPalette | null {
  const themeKey = useThemeKey()
  const [palette, setPalette] = useState<ChartPalette | null>(null)
  useEffect(() => {
    setPalette(readChartPalette())
  }, [themeKey])
  return palette
}
