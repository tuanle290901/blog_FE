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

import { Button, Col, Form, Input, Row } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import 'reactflow/dist/style.css'
import { createRevision, getOneRevisionByKey } from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { SearchPayload, TicketDefRevisionCreateReq, TicketProcessRevision } from '~/types/setting-ticket-process'
import ModalInitAttr from '../ticket-defination/component/ModalInitAttrr'
import CustomNode from './component/CustomNode'
import SourceNode from './component/SourceNodes'
import './style.scss'
import { replaceRouterString } from '~/utils/helper'
import InitProps from './component/InitProps'

export const NodeItem = {
  START: 'START',
  END: 'END'
}

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Khởi tạo', value: NodeItem.START },
    position: { x: 0, y: 103 },
    sourcePosition: Position.Right
  },
  {
    id: '2',
    type: 'output',
    data: { label: 'Trạng thái cuối', value: NodeItem.END },
    position: { x: 900, y: 103 },
    targetPosition: Position.Left
  }
]

const Index = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { ticketType, rev } = useParams()
  const reactFlowWrapper = useRef<any>(null)
  const nodeIndexRef = useRef<number>(initialNodes.length + 1)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const revisionSelected = useAppSelector((state) => state.ticketProcess.revisionSelected)

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
      const processFlow = response.revision.processFlow
      const processNodes = response.revision.processNodes

      const nodes: any = convertObjToArray(processNodes)
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
    if (ticketType) {
      ticketReq.ticketType = ticketType
      ticketReq.description = '1235'
    }

    ticketRevision.applyFromDate = '2023-11-03T13:21:46.244Z'
    ticketRevision.applyToDate = ''
    ticketRevision.rev = 'v1.3.0'
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
        groupCode: array[i].data?.value,
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
      const isInput = obj[key].nodeIndex === '1'
      const isOutput = obj[key].nodeIndex === '2'
      return {
        id: String(obj[key].nodeIndex),
        type: isInput ? 'input' : isOutput ? 'output' : 'selectorNode',
        data: {
          label: obj[key].name,
          value: obj[key].groupCodes,
          initAttr: obj[key].attributes
        },
        position: obj[key].position,
        sourcePosition: isInput ? 'right' : null,
        targetPosition: isOutput ? 'left' : null,
        with: isInput || isOutput ? 150 : 140,
        height: isInput || isOutput ? 34 : 140,
        selected: false,
        dragging: false,
        positionAbsolute: obj[key].position
      }
    })
  }

  const onSave = () => {
    const payload = mappingPayload(nodes, edges)
    dispatch(createRevision(payload))
  }

  useEffect(() => {
    if (selectedNode?.id) {
      showModal()
    }
  }, [selectedNode])

  useEffect(() => {
    if (ticketType && rev) {
      const payload: SearchPayload = Object.create(null)
      payload.ticketType = ticketType
      payload.rev = replaceRouterString(rev, 'dash')
      dispatch(getOneRevisionByKey(payload))
    }
  }, [ticketType, rev, dispatch])

  useEffect(() => {
    if (revisionSelected && revisionSelected.id) {
      mappingResponse(revisionSelected)
    }
  }, [revisionSelected])

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
            <Panel position='top-left'>
              <Button type='default' onClick={() => navigate('/ticket-definition')}>
                Quay lại
              </Button>
            </Panel>
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
