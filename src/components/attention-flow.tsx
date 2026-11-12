import { type JSX, useMemo } from 'react'
import { Handle, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import { directedEdge, flowEdgeTypes } from '@/components/flow-edge'
import '@xyflow/react/dist/style.css'
import { formatPercent } from '@/core'
import { type ChartPalette, useChartPalette } from '@/components/chart-palette'
import { useColorMode } from '@/lib/preferences'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

type AttentionData = { title: string; detail: string; active: boolean }
type AttentionNode = Node<AttentionData, 'attention'>

function AttentionCard({ data }: NodeProps<AttentionNode>): JSX.Element {
  return (
    <div
      className={cn('w-44 rounded-control border px-3 py-2', surfaces.panel, {
        'border-mint dark:border-mint-dark': data.active,
        'border-line dark:border-line-dark': !data.active,
      })}
    >
      <Handle id="in" type="target" position={Position.Left} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
      <p className="font-semibold">{data.title}</p>
      <p className={cn('text-sm', surfaces.muted)}>{data.detail}</p>
      <Handle id="out" type="source" position={Position.Right} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
    </div>
  )
}

const nodeTypes = { attention: AttentionCard }

export function AttentionFlow({
  weights,
  selected,
  onSelect,
}: {
  weights: readonly number[]
  selected: number
  onSelect: (index: number) => void
}): JSX.Element {
  const palette = useChartPalette()
  const colorMode = useColorMode()
  const nodes = useMemo(() => attentionNodes(weights, selected), [weights, selected])
  const edges = useMemo(() => (palette ? attentionEdges(weights, selected, palette) : []), [weights, selected, palette])
  return (
    <div>
      <div className="h-80 w-full">
      <ReactFlow
        nodes={nodes}
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
          if (!item.id.startsWith('key-')) return
          const index = Number(item.id.slice(4))
          if (!Number.isInteger(index)) return
          onSelect(selected === index ? -1 : index)
        }}
      />
      </div>
      <p className={cn('mt-2 text-sm', surfaces.muted)}>连线粗细表示当前 Query 对不同 Key 的注意力权重</p>
    </div>
  )
}

function attentionNodes(weights: readonly number[], selected: number): AttentionNode[] {
  return [
    {
      id: 'query',
      type: 'attention',
      position: { x: 0, y: 110 },
      data: { title: 'Query', detail: '当前 Token', active: true },
      draggable: false,
    },
    ...weights.map((weight, index) => ({
      id: `key-${index}`,
      type: 'attention' as const,
      position: { x: 340, y: index * 110 },
      data: { title: `Key ${index + 1}`, detail: formatPercent(weight), active: selected === index },
      draggable: false,
    })),
  ]
}

function attentionEdges(weights: readonly number[], selected: number, palette: ChartPalette): Edge[] {
  return weights.map((weight, index) => {
    const color = selected === index ? palette.mint : palette.muted
    return directedEdge(
      {
        id: `query-key-${index}`,
        source: 'query',
        target: `key-${index}`,
        sourceHandle: 'out',
        targetHandle: 'in',
        style: { stroke: color, strokeWidth: 1 + weight * 8 },
      },
      color,
    )
  })
}
