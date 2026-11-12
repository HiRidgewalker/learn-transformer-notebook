import { useState, type JSX } from 'react'
import { tokenize } from '@/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { LabFrame, LabHint } from '@/labs/lab-frame'

const presets = ['我喜欢编程', '我爱你', 'players', 'I love you']

export function TokenizerLab(): JSX.Element {
  const [text, setText] = useState('我喜欢编程')
  const tokens = tokenize(text)
  return (
    <LabFrame name="迷你分词器" description="输入一句话，观察教学词表的最长匹配切分和 ID 查找。" badge="可编辑输入">
      <label className="text-sm" htmlFor="token-input">
        输入文本
      </label>
      <Input id="token-input" value={text} maxLength={60} onChange={(event) => setText(event.target.value)} />
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button key={preset} size="sm" variant="secondary" onClick={() => setText(preset)}>
            {preset}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token, index) => (
          <div
            key={`${token.piece}-${index}`}
            className={cn('rounded-control px-3 py-2', {
              'bg-subtle text-orange dark:bg-subtle-dark dark:text-orange-dark': token.id === 0,
              'bg-mint-soft text-mint dark:bg-mint-soft-dark dark:text-mint-dark': token.id !== 0,
            })}
          >
            <strong className="block">{token.piece === ' ' ? '␣' : token.piece}</strong>
            <span className="text-xs">ID {token.id === 0 ? 'UNK' : token.id}</span>
          </div>
        ))}
      </div>
      <p className={cn('font-mono text-sm', surfaces.muted)}>
        Token 数量：{tokens.length} · IDs [{tokens.map((token) => token.id).join(', ')}]
      </p>
      <LabHint>本实验刻意使用小词表；真实 Byte-level BPE 不会因为陌生单词就简单地输出单个 &lt;unk&gt;。</LabHint>
    </LabFrame>
  )
}
