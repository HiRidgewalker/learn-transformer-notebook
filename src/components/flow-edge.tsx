import { type CSSProperties, type JSX } from 'react'
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, MarkerType, type Edge, type EdgeProps } from '@xyflow/react'

export function directedEdge(edge: Edge, color: string): Edge {
  return {
    ...edge,
    type: 'flow',
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 18, height: 18 },
  }
}

export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  label,
  labelStyle,
}: EdgeProps): JSX.Element {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const color = paint(style?.stroke)
  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {color && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? (
        <circle r="4" fill={color} pointerEvents="none">
          <animateMotion dur="2.2s" repeatCount="indefinite" path={path} />
        </circle>
      ) : null}
      {label ? (
        <EdgeLabelRenderer>
          <div
            className="pointer-events-none absolute text-xs"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              color: paint(labelStyle?.fill),
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  )
}

function paint(value: CSSProperties['stroke'] | CSSProperties['fill']): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export const flowEdgeTypes = { flow: FlowEdge }
