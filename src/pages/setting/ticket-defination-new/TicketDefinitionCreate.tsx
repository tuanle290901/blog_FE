/* eslint-disable react-hooks/exhaustive-deps */
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

import dayjs from 'dayjs'
import CustomEdge from './component/CustomEdge'

import { Button, Col, Form, Modal, Popconfirm, Row, Space, notification } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import 'reactflow/dist/style.css'
import { ROLE } from '~/constants/app.constant'
import {
  approvalRevision,
  createRevision,
  getOneRevisionByKey1,
  updateRevision
} from '~/stores/features/setting/ticket-process.slice'
import { TICKET_PROPS_ATTR_INIT } from '~/stores/features/setting/ultil-data'
import { useAppDispatch } from '~/stores/hook'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { SearchPayload, TicketDefRevisionCreateReq, TicketProcessRevision } from '~/types/setting-ticket-process'
import { replaceRouterString } from '~/utils/helper'
import ModalInitAttr from '../ticket-defination/component/ModalInitAttrr'
import CustomNode from './component/CustomNode'
import InitProps from './component/InitProps'
import SourceNode from './component/SourceNodes'
import './style.scss'

export const NodeItem = {
  START: '__START__',
  END: '__END__'
}

export const NodeItemType = {
  INPUT: 'input',
  OUTPUT: 'output',
  SELECTOR: 'selectorNode'
}

const initialNodes = [
  {
    id: '1',
    type: NodeItemType.INPUT,
    data: { label: 'Khởi tạo', value: [NodeItem.START] },
    position: { x: 0, y: 103 },
    sourcePosition: Position.Right
  },
  {
    id: '2',
    type: NodeItemType.OUTPUT,
    data: { label: 'Trạng thái cuối', value: [NodeItem.END] },
    position: { x: 900, y: 103 },
    targetPosition: Position.Left
  }
]

const Index = () => {
  const location = useLocation()
  const currentURL = location.pathname
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { userInfo } = useUserInfo()
  const systemAdminInfo = userInfo?.groupProfiles.find((gr) => gr.role === ROLE.SYSTEM_ADMIN)
  const { ticketType, rev } = useParams()
  const reactFlowWrapper = useRef<any>(null)
  const nodeIndexRef = useRef<number>(initialNodes.length + 1)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [revisionSelected, setRevisionSelected] = useState<TicketDefRevisionCreateReq>()
  const [openModalInfo, setOpenModalInfo] = useState(false)

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
          const initAttrDefault = [
            {
              name: 'note',
              type: 'TEXT',
              required: false,
              options: [],
              suggestion: ['Tôi đồng ý', 'Tôi không đồng ý'],
              description: `Duyệt bởi ${title}`
            }
          ]
          const newNode = {
            id,
            type,
            position,
            data: { label: title, value: [groupCode], initAttr: initAttrDefault }
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
    if (nodeFound && nodeFound.type === 'input') {
      initAttrForm.setFieldsValue({ _isDisabled: true })
    } else {
      initAttrForm.setFieldsValue({ _isDisabled: false })
    }
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
      initPropForm.setFieldsValue({
        rev: response.revision.rev
      })

      if (response.revision.applyFromDate) {
        initPropForm.setFieldValue('applyFromDate', dayjs(response.revision.applyFromDate))
      }

      if (response.revision.applyToDate) {
        initPropForm.setFieldValue('applyToDate', dayjs(response.revision.applyToDate))
      }
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

    const { rev, applyFromDate, applyToDate } = initPropForm.getFieldsValue()
    if (ticketType) {
      ticketReq.ticketType = ticketType
    }

    ticketReq.name = TICKET_PROPS_ATTR_INIT.find((t) => t.ticketType === ticketType)?.name
    ticketReq.description = TICKET_PROPS_ATTR_INIT.find((t) => t.ticketType === ticketType)?.description
    ticketRevision.applyFromDate = applyFromDate
    ticketRevision.applyToDate = applyToDate
    ticketRevision.rev = rev
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
      const isInput = obj[key].groupCodes.includes(NodeItem.START)
      const isOutput = obj[key].groupCodes.includes(NodeItem.END)
      return {
        id: String(key),
        type: isInput ? NodeItemType.INPUT : isOutput ? NodeItemType.OUTPUT : NodeItemType.SELECTOR,
        data: {
          label: obj[key].name,
          value: obj[key].groupCodes,
          initAttr: obj[key].attributes
        },
        position: obj[key].position,
        sourcePosition: isInput ? 'right' : null,
        targetPosition: isOutput ? 'left' : null,
        selected: false,
        dragging: false,
        positionAbsolute: obj[key].position
      }
    })
  }

  const onSave = async () => {
    const { rev, applyFromDate } = initPropForm.getFieldsValue()
    if (!rev || !applyFromDate) {
      notification.warning({ message: 'Vui lòng nhập các thông tin bắt buộc' })
      return
    }
    const payload = mappingPayload(nodes, edges)
    if (currentURL.includes('view-revison') && revisionSelected?.id) {
      payload.id = revisionSelected.id
      try {
        await dispatch(updateRevision(payload)).unwrap()
        navigate(`../ticket-definition/view-revison/${payload.ticketType}/${payload.revision.rev}`)
        notification.success({ message: 'Thao tác thành công' })
      } catch (error: any) {
        notification.error({
          message: error?.response?.data?.message
        })
      }
    } else {
      try {
        await dispatch(createRevision(payload)).unwrap()
        navigate(`../ticket-definition/view-revison/${payload.ticketType}/${payload.revision.rev}`)
        notification.success({ message: 'Thao tác thành công' })
      } catch (error: any) {
        notification.error({
          message: error?.response?.data?.message
        })
      }
    }
  }

  const onApprove = () => {
    if (rev && ticketType) {
      const payload: SearchPayload = Object.create(null)
      payload.ticketType = ticketType
      payload.rev = replaceRouterString(rev, 'dash')
      try {
        dispatch(approvalRevision(payload))
        notification.success({ message: 'Thao tác thành công' })
      } catch (err: any) {
        notification.error({
          message: err?.response?.data?.message
        })
      }
    }
  }

  const showModalInfo = () => {
    setOpenModalInfo(true)
  }

  const onCloseModalInfo = () => {
    setOpenModalInfo(false)
  }

  useEffect(() => {
    if (selectedNode?.id) {
      showModal()
    }
  }, [selectedNode])

  useEffect(() => {
    const revCurrent = (location.state?.rev ? location.state?.rev : rev) as string
    const ticketTypeCurrent = (location.state?.ticketType ? location.state?.ticketType : ticketType) as string
    if (revCurrent && ticketTypeCurrent) {
      const payload: SearchPayload = Object.create(null)
      payload.ticketType = ticketTypeCurrent
      payload.rev = replaceRouterString(revCurrent, 'dash')
      const fetchData = async () => {
        const payload: SearchPayload = Object.create(null)
        payload.ticketType = ticketTypeCurrent
        payload.rev = replaceRouterString(revCurrent, 'dash')

        try {
          const response = await getOneRevisionByKey1(payload)
          if (response && response.data) {
            setRevisionSelected(response.data)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
    }

    if (ticketType && currentURL && currentURL.includes('create-revison')) {
      const foundedTicket = TICKET_PROPS_ATTR_INIT.find((t) => t.ticketType === ticketType)
      const updatedNodes = nodes.map((node) => {
        if (node.id === '1') {
          return {
            ...node,
            data: {
              ...node.data,
              initAttr: foundedTicket?.revision.processNodes['1'].attributes
            }
          }
        }
        return node
      })

      setNodes(updatedNodes)
    }
  }, [ticketType, rev, location.state])

  useEffect(() => {
    if (revisionSelected && revisionSelected.id) {
      mappingResponse(revisionSelected)
    }
  }, [revisionSelected])

  useEffect(() => {
    return () => {
      window.history.replaceState({ rev: '', ticketType: '' }, document.title)
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <div className='ticket-top-control tw-bg-white tw-h-[15%] tw-w-full tw-p-3 tw-flex tw-flex-col tw-justify-center'>
          <InitProps form={initPropForm} />
          <div className='tw-text-right tw-mb-3'>
            <span className=' tw-text-sky-700 tw-cursor-pointer' onClick={showModalInfo}>
              Xem thêm
            </span>
          </div>
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
            edgesUpdatable={systemAdminInfo?.role === ROLE.SYSTEM_ADMIN}
            nodesConnectable={systemAdminInfo?.role === ROLE.SYSTEM_ADMIN}
            // draggable={systemAdminInfo?.role === ROLE.SYSTEM_ADMIN}
            panOnDrag={true}
            elementsSelectable={true}
            deleteKeyCode={systemAdminInfo?.role === ROLE.SYSTEM_ADMIN ? ['Delete', 'Backspace'] : []}
          >
            <Panel position='top-left'>
              <Button
                type='default'
                onClick={() =>
                  navigate('/ticket-definition', {
                    state: {
                      ticketType
                    }
                  })
                }
              >
                Quay lại
              </Button>
            </Panel>

            {systemAdminInfo?.role === ROLE.SYSTEM_ADMIN && (
              <>
                <Panel position='top-right'>
                  <Space>
                    {rev && ticketType && (
                      <Popconfirm
                        title='Duyệt quy trình'
                        description='Bạn có chắc chắn thực hiện?'
                        onConfirm={onApprove}
                        okText='Đồng ý'
                        cancelText='Hủy'
                      >
                        <Button type='default' className='tw-bg-green-500 tw-text-white'>
                          Áp dụng quy trình
                        </Button>
                      </Popconfirm>
                    )}

                    <Button type='primary' onClick={() => onSave()}>
                      {currentURL.includes('view-revison') ? ' Cập nhật quy trình' : 'Lưu quy trình'}
                    </Button>
                  </Space>
                </Panel>
                <Panel
                  className='source-box-panel tw-w-[90%] tw-h-[60px] tw-bg-white tw-flex tw-items-center tw-justify-center'
                  position='bottom-center'
                >
                  <SourceNode />
                </Panel>
              </>
            )}

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

      <Modal
        title='Thông tin quy trình'
        open={openModalInfo}
        onOk={onCloseModalInfo}
        onCancel={onCloseModalInfo}
        footer={[]}
      >
        <Row gutter={[16, 16]}>
          <Col className='ticket-prop-label' span={8}>
            <div>Tên quy trình:</div>
          </Col>
          <Col className='ticket-prop-value' span={16}>
            <div>{revisionSelected?.name}</div>
          </Col>

          <Col className='ticket-prop-label' span={8}>
            <div>Mô tả:</div>
          </Col>
          <Col className='ticket-prop-value' span={16}>
            <div>{revisionSelected?.description}</div>
          </Col>

          <Col className='ticket-prop-label' span={8}>
            <div>Người tạo:</div>
          </Col>
          <Col className='ticket-prop-value' span={16}>
            <div>{revisionSelected?.createdBy}</div>
          </Col>

          <Col className='ticket-prop-label' span={8}>
            <div>Ngày tạo:</div>
          </Col>
          <Col className='ticket-prop-value' span={16}>
            <div>{dayjs(revisionSelected?.createdAt).format('DD/MM/YYYY')}</div>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default Index
