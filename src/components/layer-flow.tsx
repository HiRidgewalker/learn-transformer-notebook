import { type JSX, useMemo } from 'react'
import { Handle, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import { directedEdge, flowEdgeTypes } from '@/components/flow-edge'
import '@xyflow/react/dist/style.css'
import { type ChartPalette, useChartPalette } from '@/components/chart-palette'
import { useColorMode } from '@/lib/preferences'
import { surfaces } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

export type LayerStep = { title: string; detail: string }

type LayerData = { title: string; active: boolean }

type LayerNode = Node<LayerData, 'layer'>

function FlowNode({ data }: NodeProps<LayerNode>): JSX.Element {
  return (
    <div
      className={cn('w-64 rounded-control border px-4 py-3', surfaces.panel, {
        'border-mint dark:border-mint-dark': data.active,
        'border-line dark:border-line-dark': !data.active,
      })}
    >
      <Handle id="top" type="target" position={Position.Top} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
      <Handle id="left" type="target" position={Position.Left} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
      <p className="font-semibold">{data.title}</p>
      <Handle id="bottom" type="source" position={Position.Bottom} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
      <Handle id="right" type="source" position={Position.Right} className="size-2 border-0 bg-mint dark:bg-mint-dark" />
    </div>
  )
}

const nodeTypes = { layer: FlowNode }

export function LayerFlow({
  steps,
  active,
  onSelect,
  cross,
}: {
  steps: readonly LayerStep[]
  active: number
  onSelect: (index: number) => void
  cross: boolean
}): JSX.Element {
  const palette = useChartPalette()
  const colorMode = useColorMode()
  const nodes = useMemo(() => layerNodes(steps, active, cross), [steps, active, cross])
  const edges = useMemo(() => (palette ? layerEdges(steps.length, active, cross, palette) : []), [steps.length, active, cross, palette])
  return (
    <div className="w-full" style={{ height: Math.max(steps.length, cross ? 5 : steps.length) * 132 }}>
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
          const index = Number(item.id)
          if (!Number.isInteger(index) || index < 0 || index >= steps.length) return
          onSelect(index)
        }}
      />
    </div>
  )
}

function layerNodes(steps: readonly LayerStep[], active: number, cross: boolean): LayerNode[] {
  const nodes = steps.map((step, index) => ({
    id: String(index),
    type: 'layer' as const,
    position: { x: 40, y: index * 120 },
    data: { title: step.title, active: index === active },
    draggable: false,
  }))
  if (!cross) return nodes
  return [
    ...nodes,
    {
      id: 'encoder-kv',
      type: 'layer',
      position: { x: 420, y: 240 },
      data: { title: 'Encoder K, V', active: active === 2 },
      draggable: false,
    },
  ]
}

function layerEdges(count: number, active: number, cross: boolean, palette: ChartPalette): Edge[] {
  const edges: Edge[] = []
  for (let index = 0; index < count - 1; index += 1) {
    edges.push(
      directedEdge(
        {
          id: `step-${index}`,
          source: String(index),
          target: String(index + 1),
          sourceHandle: 'bottom',
          targetHandle: 'top',
          style: { stroke: palette.mint, strokeWidth: 2 },
        },
        palette.mint,
      ),
    )
  }
  if (cross) {
    const crossColor = active === 2 ? palette.purple : palette.line
    edges.push(
      directedEdge(
        {
          id: 'cross',
          source: '2',
          target: 'encoder-kv',
          sourceHandle: 'right',
          targetHandle: 'left',
          label: active === 2 ? 'Q → K, V' : '',
          labelStyle: { fill: palette.muted, fontSize: 12 },
          style: { stroke: crossColor, strokeWidth: active === 2 ? 3 : 1.5 },
        },
        crossColor,
      ),
    )
  }
  return edges
}
