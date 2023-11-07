import React, { useMemo } from 'react'
import { getConnectedEdges, Handle, HandleType, Position, useNodeId, useStore } from 'reactflow'

interface CustomHandleProps {
  isConnectable?: boolean | number | (({ node, connectedEdges }: { node: any; connectedEdges: any[] }) => boolean)
  type: HandleType
  position: Position
  style: any
}

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges
})

const CustomHandle: React.FC<CustomHandleProps> = (props) => {
  const { nodeInternals, edges } = useStore(selector)
  const nodeId = useNodeId()

  const isHandleConnectable = useMemo(() => {
    if (typeof props.isConnectable === 'function') {
      const node = nodeInternals.get(nodeId)
      const connectedEdges = getConnectedEdges([node], edges)

      return props.isConnectable({ node, connectedEdges })
    }

    if (typeof props.isConnectable === 'number') {
      const node = nodeInternals.get(nodeId)
      const connectedEdges = getConnectedEdges([node], edges)

      return connectedEdges.length < props.isConnectable
    }

    return props.isConnectable
  }, [nodeInternals, edges, nodeId, props.isConnectable])

  return (
    <Handle
      {...props}
      isConnectable={isHandleConnectable}
      type={props.type}
      position={props.position}
      style={props.style}
    />
  )
}

export default CustomHandle
