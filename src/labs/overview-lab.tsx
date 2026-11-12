import { type JSX } from 'react'
import { ArchitectureFlow } from '@/components/architecture-flow'
import { useNavigateLesson } from '@/content/lesson-context'
import { LabFrame, LabHint } from '@/labs/lab-frame'

export function OverviewLab(): JSX.Element {
  const navigate = useNavigateLesson()
  return (
    <LabFrame name="点击模块查看职责" description="这张图代表完整的经典 Encoder–Decoder 数据流。" badge="架构地图">
      <ArchitectureFlow onOpen={navigate} />
      <LabHint>点击任意模块，进入对应章节。</LabHint>
    </LabFrame>
  )
}
