import { Search } from 'lucide-react'
import { useState, type JSX } from 'react'
import { GLOSSARY } from '@/content/glossary'
import { Input } from '@/components/ui/input'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame } from '@/labs/lab-frame'

export function GlossaryLab(): JSX.Element {
  const [query, setQuery] = useState('')
  const normalized = query.toLowerCase()
  const items = GLOSSARY.filter((item) => `${item.name} ${item.detail}`.toLowerCase().includes(normalized))
  return (
    <LabFrame name="20 个必知名词" description="输入关键词快速定位公式里的概念。" badge="可搜索">
      <div className="relative">
        <Search className={cn('absolute top-1/2 left-3 size-4 -translate-y-1/2', surfaces.muted)} />
        <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索：Softmax、Residual、Embedding..." aria-label="搜索术语" />
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.name} className={cn('rounded-control border px-4 py-3', surfaces.line)}>
            <strong>{item.name}</strong>
            <p className={cn('mt-1 text-sm leading-6', surfaces.muted)}>{item.detail}</p>
          </div>
        ))}
      </div>
    </LabFrame>
  )
}
