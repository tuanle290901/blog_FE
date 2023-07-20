import { Position, MarkerType } from 'reactflow'
export const nodesMockup = [
  // {
  //   id: '1',
  //   type: 'input',
  //   data: { label: 'Khởi tạo phép', groupCode: '__START__' },
  //   position: { x: 0, y: 103 },
  //   sourcePosition: Position.Right
  // },
  // {
  //   id: '2',
  //   type: 'selectorNode',
  //   data: { label: 'Quản lý trực tiếp', groupCode: '__MANAGER__' },
  //   style: { border: '1px solid #777', padding: 10 },
  //   position: { x: 300, y: 50 }
  // },
  // {
  //   id: '3',
  //   type: 'selectorNode',
  //   data: { label: 'HCNS', groupCode: '__HR__' },
  //   style: { border: '1px solid #777', padding: 10 },
  //   position: { x: 600, y: 50 }
  // },
  // {
  //   id: '4',
  //   type: 'selectorNode',
  //   data: { label: 'Phó giám đốc', groupCode: '__VICE_DIRECTOR__' },
  //   style: { border: '1px solid #777', padding: 10 },
  //   position: { x: 900, y: 50 }
  // },
  // {
  //   id: '5',
  //   type: 'selectorNode',
  //   data: { label: 'Giám đốc', groupCode: '__DIRECTOR__' },
  //   style: { border: '1px solid #777', padding: 10 },
  //   position: { x: 1200, y: 50 }
  // },
  // {
  //   id: '6',
  //   type: 'output',
  //   data: { label: 'Trạng thái cuối', groupCode: '__END__' },
  //   position: { x: 1500, y: 103 },
  //   targetPosition: Position.Left
  // }
]
export const edgesMockup = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: 'grey' },
    type: 'custom',
    markerEnd: { type: MarkerType.ArrowClosed },
    data: {
      label: 'Duyệt lần 1'
    }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: 'grey' },
    type: 'custom',
    markerEnd: { type: MarkerType.ArrowClosed },
    data: {
      label: 'Duyệt lần 2'
    }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    style: { stroke: 'grey' },
    type: 'custom',
    markerEnd: { type: MarkerType.ArrowClosed },
    data: {
      label: 'Duyệt lần 3'
    }
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: true,
    style: { stroke: 'grey' },
    type: 'custom',
    markerEnd: { type: MarkerType.ArrowClosed },
    data: {
      label: 'Duyệt lần 4'
    }
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    animated: true,
    style: { stroke: 'grey' },
    type: 'custom',
    markerEnd: { type: MarkerType.ArrowClosed },
    data: {
      label: 'Duyệt lần 5'
    }
  }
]

export const sourceNodes = [
  {
    id: 'hr',
    title: 'HCNS'
  },
  {
    id: 'manager',
    title: 'Quản lý trực tiếp'
  },
  {
    id: 'leadership',
    title: 'Ban giám đốc'
  }
]
