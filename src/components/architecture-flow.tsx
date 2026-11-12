import { type JSX, useMemo } from 'react'
import { Handle, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import { directedEdge, flowEdgeTypes } from '@/components/flow-edge'
import '@xyflow/react/dist/style.css'
import { type ChartPalette, useChartPalette } from '@/components/chart-palette'
import { useColorMode } from '@/lib/preferences'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

type ArchData = {
  title: string
  detail: string
  lessonId: string
  tone: 'default' | 'blue' | 'purple'
}

type ArchNode = Node<ArchData, 'arch'>

const toneClass = {
  default: 'border-line dark:border-line-dark',
  blue: 'border-blue dark:border-blue-dark',
  purple: 'border-purple dark:border-purple-dark',
} as const

function ArchitectureNode({ data }: NodeProps<ArchNode>): JSX.Element {
  return (
    <div className={cn('w-56 rounded-control border px-4 py-3', surfaces.panel, toneClass[data.tone])}>
      <Handle id="top" type="target" position={Position.Top} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
      <Handle id="left" type="target" position={Position.Left} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
      <p className="font-semibold">{data.title}</p>
      <p className={cn('text-sm', surfaces.muted)}>{data.detail}</p>
      <Handle id="bottom" type="source" position={Position.Bottom} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
      <Handle id="right" type="source" position={Position.Right} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
    </div>
  )
}

const nodeTypes = { arch: ArchitectureNode }

const sourceNodes: ArchNode[] = [
  node('tokenizer', 0, 40, '文字 / Token IDs', 'Tokenizer + Embedding', 'tokenizer', 'default'),
  node('position', 0, 190, '位置编码', 'Embedding + PE', 'position', 'default'),
  node('encoder', 0, 340, 'Encoder', 'Self-Attention → FFN', 'encoder', 'blue'),
]

const targetNodes: ArchNode[] = [
  node('mask', 380, 40, '目标前缀 + Mask', 'Masked Self-Attention', 'mask', 'default'),
  node('decoder', 380, 190, 'Decoder', 'Cross-Attention → FFN', 'decoder', 'purple'),
  node('generation', 380, 340, '词表投影 → 生成', 'Logits / Softmax', 'generation', 'default'),
]

function node(
  id: string,
  x: number,
  y: number,
  title: string,
  detail: string,
  lessonId: string,
  tone: ArchData['tone'],
): ArchNode {
  return { id, type: 'arch', position: { x, y }, data: { title, detail, lessonId, tone }, draggable: false }
}

export function ArchitectureFlow({ onOpen }: { onOpen: (id: string) => void }): JSX.Element {
  const palette = useChartPalette()
  const colorMode = useColorMode()
  const edges = useMemo(() => (palette ? architectureEdges(palette) : []), [palette])
  return (
    <div className="h-[32rem] w-full">
      <ReactFlow
        nodes={[...sourceNodes, ...targetNodes]}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={flowEdgeTypes}
        colorMode={colorMode}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        edgesReconnectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: false }}
        onNodeClick={(_event, item) => {
          if (!isArchNode(item)) return
          onOpen(item.data.lessonId)
        }}
      />
    </div>
  )
}

function isArchNode(item: Node): item is ArchNode {
  return item.type === 'arch'
}

function architectureEdges(palette: ChartPalette): Edge[] {
  return [
    link('tokenizer', 'position', 'bottom', 'top', palette),
    link('position', 'encoder', 'bottom', 'top', palette),
    link('mask', 'decoder', 'bottom', 'top', palette),
    link('decoder', 'generation', 'bottom', 'top', palette),
    {
      ...link('encoder', 'decoder', 'right', 'left', palette),
      label: 'K, V',
      labelStyle: { fill: palette.muted, fontSize: 12 },
    },
  ]
}

function link(source: string, target: string, sourceHandle: string, targetHandle: string, palette: ChartPalette): Edge {
  return directedEdge(
    {
      id: `${source}-${target}`,
      source,
      target,
      sourceHandle,
      targetHandle,
      style: { stroke: palette.blue, strokeWidth: 2 },
    },
    palette.blue,
  )
}
