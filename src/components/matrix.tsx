import { type JSX } from 'react'
import { formatNumber } from '@/core'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

export function Matrix({ values }: { values: readonly (readonly number[])[] }): JSX.Element {
  return (
    <div className={cn('flex items-center gap-2 font-mono text-sm', surfaces.muted)}>
      <span className="text-2xl text-ink dark:text-ink-dark">[</span>
      <div className="flex flex-col gap-1">
        {values.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3">
            {row.map((value, columnIndex) => (
              <span key={columnIndex} className="text-ink dark:text-ink-dark">
                {formatNumber(value, 3)}
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="text-2xl text-ink dark:text-ink-dark">]</span>
    </div>
  )
}
