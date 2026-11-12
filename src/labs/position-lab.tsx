import { useState, type JSX } from 'react'
import { formatNumber, positionalEncoding } from '@/core'
import { WaveChart } from '@/components/charts'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'
import { ChoiceRow, LabFrame, SliderField } from '@/labs/lab-frame'

export function PositionLab(): JSX.Element {
  const [position, setPosition] = useState(1)
  const [dimension, setDimension] = useState<4 | 8>(4)
  const values = positionalEncoding(position, dimension)
  const divisor = dimension === 4 ? 100 : 10
  return (
    <LabFrame name="正弦位置编码实验" description="拖动 Token 位置，观察不同频率的 sin / cos 如何一起改变。">
      <SliderField label="Token 位置" display={`pos = ${position}`} value={position} min={0} max={18} step={1} onChange={setPosition} />
      <ChoiceRow
        label="编码维度"
        options={['4 维', '8 维']}
        active={dimension === 4 ? 0 : 1}
        onSelect={(index) => setDimension(index === 0 ? 4 : 8)}
      />
      <WaveChart position={position} divisor={divisor} />
      <p className="text-sm font-medium">
        PE({position}) 的 {dimension} 个数值
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {values.map((value, index) => (
          <div
            key={index}
            className={cn('rounded-control px-3 py-2', {
              'bg-mint-soft text-mint dark:bg-mint-soft-dark dark:text-mint-dark': index % 2 === 0,
              'bg-panel-3 text-purple dark:bg-panel-3-dark dark:text-purple-dark': index % 2 === 1,
            })}
          >
            <p className="text-xs">
              {index % 2 === 0 ? 'sin' : 'cos'} · d{index}
            </p>
            <p className="font-mono font-semibold">{formatNumber(value, 4)}</p>
          </div>
        ))}
      </div>
      <p className={cn('text-sm', surfaces.muted)}>第二条曲线对应较慢的频率 sin(pos / {divisor})，用来对照位置编码里不同维度的变化速度。</p>
    </LabFrame>
  )
}
