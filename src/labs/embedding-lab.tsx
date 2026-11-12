import { useState, type JSX } from 'react'
import { EMBED_ROWS } from '@/core'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame } from '@/labs/lab-frame'

export function EmbeddingLab(): JSX.Element | null {
  const [pick, setPick] = useState(25)
  const selected = EMBED_ROWS.find((row) => row.id === pick) ?? EMBED_ROWS[0]
  if (!selected) return null
  return (
    <LabFrame name="用 Token ID 查表" description="点击词表中的任意一行，观察 E[id] 如何直接取出 Embedding 向量。">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          {EMBED_ROWS.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setPick(row.id)}
              className={cn('grid grid-cols-[3rem_4rem_minmax(0,1fr)] items-center rounded-control border px-3 py-2 text-left', surfaces.line, {
                'bg-mint-soft dark:bg-mint-soft-dark': selected.id === row.id,
                'bg-panel hover:bg-hover dark:bg-panel-dark dark:hover:bg-hover-dark': selected.id !== row.id,
              })}
            >
              <span className="font-mono">{row.id}</span>
              <strong>{row.token}</strong>
              <code className={cn('font-mono text-sm', surfaces.muted)}>[{row.vector.join(', ')}]</code>
            </button>
          ))}
        </div>
        <div className={cn('rounded-control p-4', surfaces.subtle)}>
          <p className={cn('text-xs tracking-widest', surfaces.mint)}>LOOKUP → E[{selected.id}]</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {selected.vector.map((value, index) => (
              <div key={index}>
                <p className={cn('text-xs', surfaces.muted)}>dim {index}</p>
                <p className="font-mono text-lg font-semibold">{value.toFixed(1)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">
            Token「{selected.token}」按 ID <strong>{selected.id}</strong> 取到了这四个参数。
          </p>
        </div>
      </div>
    </LabFrame>
  )
}
