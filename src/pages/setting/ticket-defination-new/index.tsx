import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  Panel,
  Position
} from 'reactflow'

import CustomEdge from './component/CustomEdge'

import 'reactflow/dist/style.css'
import CustomNode from './component/CustomNode'
import { edgesMockup, nodesMockup } from './mockup/mockup'
import './style.scss'
import SourceNode from './component/SourceNodes'
import { Button, Modal } from 'antd'
import InitProps from './component/InitProps'
import { Node } from '../ticket-defination/TicketDefinationCreate'

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Khởi tạo phép', value: Node.START },
    position: { x: 0, y: 103 },
    sourcePosition: Position.Right
  },
  {
    id: '2',
    type: 'output',
    data: { label: 'Trạng thái cuối', value: Node.END },
    position: { x: 900, y: 103 },
    targetPosition: Position.Left
  }
]

const Index = () => {
  const reactFlowWrapper = useRef<any>(null)
  const nodeIndexRef = useRef<number>(initialNodes.length + 1)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const nodeTypes = useMemo(
    () => ({
      selectorNode: CustomNode
    }),
    []
  )

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge
    }),
    []
  )

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onElementClick = useCallback((event: any, element: any) => {
    console.log(element)
    setSelectedNode(element)
  }, [])

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      if (reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const type = event.dataTransfer.getData('application/reactflow')
        const id = String(nodeIndexRef.current)
        const title = event.dataTransfer.getData('title')
        const groupCode = event.dataTransfer.getData('groupCode')

        if (typeof type === 'undefined' || !type) {
          return
        }

        if (reactFlowInstance) {
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top
          })
          const newNode = {
            id,
            type,
            position,
            data: { label: title, value: groupCode }
          }

          setNodes((nds) => nds.concat(newNode))
          nodeIndexRef.current++
        }
      }
    },
    [reactFlowInstance]
  )

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    // setNodes(nodesMockup)
    // setEdges(edgesMockup)
  }, [])

  useEffect(() => {
    if (selectedNode?.id) {
      showModal()
    }
  }, [selectedNode])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <div className='ticket-top-control tw-bg-white tw-h-[15%] tw-w-full tw-p-3 tw-flex tw-flex-col tw-justify-center tw-gap-3'>
          <InitProps />
          {/* <SourceNode /> */}
        </div>

        <div className='ticket-bottom-control reactflow-wrapper tw-h-[85%] tw-w-full' ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDoubleClick={onElementClick}
            fitView
            attributionPosition='bottom-right'
          >
            <Panel position='top-right'>
              <Button type='primary' onClick={() => console.log(nodes, edges)}>
                Lưu thông tin
              </Button>
            </Panel>

            <Panel
              className='source-box-panel tw-w-[90%] tw-h-[60px] tw-bg-white tw-flex tw-items-center tw-justify-center'
              position='bottom-center'
            >
              <SourceNode />
            </Panel>
            <Controls />
            <Background gap={20} size={1} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      <Modal title='Basic Modal' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {selectedNode && (
          <>
            <div>{selectedNode.id}</div>
            <div>{selectedNode.data.label}</div>
            <div>{selectedNode.data.value}</div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Index
