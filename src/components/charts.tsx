import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as echarts from 'echarts'
import { type EChartsOption } from 'echarts'
import { formatNumber, formatPercent } from '@/core'
import { type ChartPalette, type ChartTone, useChartPalette } from '@/components/chart-palette'
import { cn } from '@/lib/utils'

const chartFont = '"Google Sans", "Noto Sans SC", sans-serif'

export function Chart({ option, className, label }: { option: EChartsOption; className?: string; label: string }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const chart = echarts.init(element, undefined, { renderer: 'canvas' })
    chartRef.current = chart
    const observer = new ResizeObserver(() => {
      chart.resize()
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, true)
  }, [option])

  return <div ref={ref} role="img" aria-label={label} className={cn('w-full', className)} />
}

export type BarItem = {
  label: string
  value: number
  tone: ChartTone
}

function axisText(color: string): { color: string; fontFamily: string } {
  return { color, fontFamily: chartFont }
}

export function DistributionChart({
  items,
  mode,
  label,
  className,
}: {
  items: readonly BarItem[]
  mode: 'percent' | 'number'
  label: string
  className?: string
}): JSX.Element {
  const palette = useChartPalette()
  const option = useMemo(() => (palette ? barOption(items, mode, palette) : null), [items, mode, palette])
  if (!option) return <div className={cn('h-48', className)} />
  return <Chart option={option} label={label} className={cn('h-48', className)} />
}

function barOption(items: readonly BarItem[], mode: 'percent' | 'number', palette: ChartPalette): EChartsOption {
  return {
    animationDuration: 200,
    backgroundColor: 'transparent',
    grid: { left: 88, right: 64, top: 8, bottom: 8 },
    xAxis: {
      type: 'value',
      max: mode === 'percent' ? 1 : undefined,
      axisLabel: {
        ...axisText(palette.muted),
        formatter: (value: number) => (mode === 'percent' ? formatPercent(value) : formatNumber(value, 2)),
      },
      splitLine: { lineStyle: { color: palette.line } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: items.map((item) => item.label),
      axisLabel: axisText(palette.ink),
      axisLine: { lineStyle: { color: palette.line } },
    },
    series: [
      {
        type: 'bar',
        data: items.map((item) => ({
          value: item.value,
          itemStyle: { color: palette[item.tone] },
        })),
        label: {
          show: true,
          position: 'right',
          color: palette.ink,
          fontFamily: chartFont,
          formatter: (params) => {
            const value = typeof params === 'object' && params && 'value' in params ? params.value : null
            if (typeof value !== 'number') return ''
            return mode === 'percent' ? formatPercent(value) : formatNumber(value, 3)
          },
        },
      },
    ],
  }
}

export function WaveChart({ position, divisor }: { position: number; divisor: number }): JSX.Element {
  const palette = useChartPalette()
  const option = useMemo(() => (palette ? waveOption(position, divisor, palette) : null), [palette, position, divisor])
  if (!option) return <div className="h-56" />
  return <Chart option={option} label="正弦与余弦位置编码曲线" className="h-56" />
}

function waveOption(position: number, divisor: number, palette: ChartPalette): EChartsOption {
  const samples = Array.from({ length: 241 }, (_, index) => (index / 240) * 18)
  return {
    animationDuration: 200,
    backgroundColor: 'transparent',
    grid: { left: 36, right: 16, top: 32, bottom: 28 },
    legend: { textStyle: axisText(palette.ink) },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value',
      min: 0,
      max: 18,
      axisLabel: axisText(palette.muted),
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: -1.2,
      max: 1.2,
      axisLabel: axisText(palette.muted),
      splitLine: { lineStyle: { color: palette.line } },
    },
    series: [
      {
        name: 'sin(pos)',
        type: 'line',
        showSymbol: false,
        data: samples.map((sample) => [sample, Math.sin(sample)]),
        lineStyle: { color: palette.mint, width: 2 },
        markLine: {
          symbol: 'none',
          label: { show: false },
          lineStyle: { color: palette.ink, type: 'dashed' },
          data: [{ xAxis: position }],
        },
        markPoint: {
          symbolSize: 12,
          itemStyle: { color: palette.mint },
          data: [{ name: 'sin(pos)', coord: [position, Math.sin(position)] }],
        },
      },
      {
        name: `sin(pos / ${divisor})`,
        type: 'line',
        showSymbol: false,
        data: samples.map((sample) => [sample, Math.sin(sample / divisor)]),
        lineStyle: { color: palette.purple, width: 2 },
        markPoint: {
          symbolSize: 12,
          itemStyle: { color: palette.purple },
          data: [{ name: 'slow', coord: [position, Math.sin(position / divisor)] }],
        },
      },
    ],
  }
}
