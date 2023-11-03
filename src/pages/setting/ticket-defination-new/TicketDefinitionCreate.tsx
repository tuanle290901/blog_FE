import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node as Nodes,
  Panel,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState
} from 'reactflow'

import CustomEdge from './component/CustomEdge'

import { Button, Form } from 'antd'
import 'reactflow/dist/style.css'
import { TicketDefRevisionCreateReq, TicketProcessRevision } from '~/types/setting-ticket-process'
import { Node } from '../ticket-defination/TicketDefinationCreate'
import ModalInitAttr from '../ticket-defination/component/ModalInitAttrr'
import CustomNode from './component/CustomNode'
import InitProps from './component/InitProps'
import SourceNode from './component/SourceNodes'
import { edgesMockup, nodesMockup } from './mockup/mockup'
import './style.scss'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { getTicketById } from '~/stores/features/setting/ticket-process.slice'

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Khởi tạo', value: Node.START },
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
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const ticketSelected = useAppSelector((state) => state.ticketProcess.ticketSelected)
  const reactFlowWrapper = useRef<any>(null)
  const nodeIndexRef = useRef<number>(initialNodes.length + 1)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const [initAttrForm] = Form.useForm()
  const [initPropForm] = Form.useForm()
  const [isModalInitAttrOpen, setIsModalInitAttrOpen] = useState<{ key: string; status: boolean }>({
    key: '0',
    status: false
  })

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
    const nodeFound: any = nodes.find((n) => n.id === selectedNode.id)
    const { data } = nodeFound
    if (data?.initAttr?.length > 0) {
      initAttrForm.setFieldsValue({ initAttr: data.initAttr })
    } else {
      initAttrForm.resetFields()
    }
    setIsModalInitAttrOpen((prev) => {
      return {
        ...prev,
        status: true
      }
    })
  }

  const handleOk = () => {
    setIsModalInitAttrOpen((prev) => {
      return {
        ...prev,
        status: false
      }
    })
    const updatedNodes = nodes.map((node) => {
      if (node.id == selectedNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            initAttr: initAttrForm.getFieldsValue().initAttr
          }
        }
      }
      return node
    })

    setNodes(updatedNodes)
  }

  const handleCancel = () => {
    setIsModalInitAttrOpen((prev) => {
      return {
        ...prev,
        status: false
      }
    })
  }

  const onCloseModalFail = (initFormValues: any) => {
    console.log(initFormValues, 'initFormValues')
  }

  const onChangeType = (value: string, index: number) => {
    const updatedForm = { ...initAttrForm.getFieldsValue() }
    updatedForm.initAttr[index].type = value
    initAttrForm.setFieldsValue(updatedForm)
  }

  const mappingResponse = (response: any) => {
    if (response && response.id) {
      const processFlow = response.revisions[0].processFlow
      const processNodes = response.revisions[0].processNodes

      const nodes = convertObjToArray(processNodes)
      const edges = processFlow.map((e: any) => {
        return {
          source: String(e.srcIdx),
          target: String(e.destIdx),
          id: `edge-${e.srcIdx}-${e.destIdx}`,
          animated: true
        }
      })
      setNodes(nodes)
      setEdges(edges)
      nodeIndexRef.current = nodes.length + 1
    }
  }

  const mappingPayload = (nodes: Nodes[], edges: Edge[]) => {
    const ticketReq: TicketDefRevisionCreateReq = Object.create(null)
    const ticketRevision: TicketProcessRevision = Object.create(null)

    const { name, description } = initPropForm.getFieldsValue()
    ticketReq.name = name
    ticketReq.description = description

    ticketRevision.processFlow = edges.map((edge) => {
      return {
        srcIdx: Number(edge.source),
        destIdx: Number(edge.target)
      }
    })
    ticketRevision.processNodes = convertArrToObj(nodes)
    ticketReq.revision = ticketRevision
    return ticketReq
  }

  const convertArrToObj = (array: any[]) => {
    const obj = Object.create(null)
    for (let i = 0; i < array.length; i++) {
      const key = array[i].id
      const value = {
        nodeIndex: Number(array[i].id),
        attributes: array[i].data?.initAttr,
        groupCodes: array[i].data?.value,
        name: array[i].data?.label,
        type: array[i].type,
        position: array[i].position
      }
      obj[key] = value
    }
    return obj
  }

  const convertObjToArray = (obj: any) => {
    return Object.keys(obj).map((key) => {
      return {
        id: String(obj[key].nodeIndex),
        type: obj[key].type,
        data: {
          label: obj[key].name,
          value: obj[key].groupCodes,
          initAttr: obj[key].attributes
        },
        position: obj[key].position,
        sourcePosition: obj[key].type === 'input' ? 'right' : null,
        targetPosition: obj[key].type === 'output' ? 'left' : null,
        with: obj[key].type === 'input' || obj[key].type === 'output' ? 150 : 140,
        height: obj[key].type === 'input' || obj[key].type === 'output' ? 34 : 140,
        selected: false,
        dragging: false,
        positionAbsolute: obj[key].position
      }
    })
  }

  const onSave = () => {
    console.log(JSON.stringify(mappingPayload(nodes, edges)))
  }

  useEffect(() => {
    if (selectedNode?.id) {
      showModal()
    }
  }, [selectedNode])

  useEffect(() => {
    dispatch(getTicketById({ id }))
  }, [id])

  useEffect(() => {
    if (ticketSelected) {
      mappingResponse(ticketSelected)
    }
  }, [ticketSelected])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <div className='ticket-top-control tw-bg-white tw-h-[15%] tw-w-full tw-p-3 tw-flex tw-flex-col tw-justify-center tw-gap-3'>
          <InitProps form={initPropForm} />
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
            selectionOnDrag={true}
            attributionPosition='bottom-right'
          >
            <Panel position='top-right'>
              <Button type='primary' onClick={() => onSave()}>
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
      <ModalInitAttr
        isModalInitAttrOpen={isModalInitAttrOpen}
        initAttrForm={initAttrForm}
        handleCancelModalInitAttr={handleCancel}
        onFinishInitAttr={handleOk}
        onFinishInitAttrFail={onCloseModalFail}
        onChangeType={onChangeType}
      />
    </div>
  )
}

export default Index
