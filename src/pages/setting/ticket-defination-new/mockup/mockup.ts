import { Position, MarkerType } from 'reactflow'
export const nodesMockup = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Khởi tạo phép',
      value: '__START__',
      initAttr: [
        {
          name: '1234214',
          type: 'TEXT',
          required: true,
          options: [],
          suggestion: [],
          description: null
        }
      ]
    },
    position: {
      x: 0,
      y: 103
    },
    sourcePosition: 'right',
    with: 150,
    height: 34,
    selected: false,
    dragging: false,
    positionAbsolute: {
      x: 0,
      y: 103
    }
  },
  {
    id: '2',
    type: 'output',
    data: {
      label: 'Trạng thái cuối',
      value: '__END__'
    },
    position: {
      x: 900,
      y: 103
    },
    sourcePosition: 'left',
    with: 150,
    height: 34,
    selected: false,
    dragging: false,
    positionAbsolute: {
      x: 900,
      y: 103
    }
  },
  {
    id: '3',
    type: 'selectorNode',
    data: {
      label: 'HCNS',
      value: 'hr',
      initAttr: [
        {
          name: 'note',
          type: 'TEXT',
          required: true,
          options: [],
          suggestion: [],
          description: null
        }
      ]
    },
    position: {
      x: 628.514268530972,
      y: 249.70009704155393
    },
    sourcePosition: null,
    with: 140,
    height: 140,
    selected: false,
    dragging: false,
    positionAbsolute: {
      x: 628.514268530972,
      y: 249.70009704155393
    }
  },
  {
    id: '4',
    type: 'selectorNode',
    data: {
      label: 'Quản lý trực tiếp',
      value: 'manager',
      initAttr: [
        {
          name: 'note',
          type: 'TEXT',
          required: true,
          options: [],
          suggestion: [],
          description: null
        }
      ]
    },
    position: {
      x: 306.19948369452777,
      y: 248.10841909174434
    },
    sourcePosition: null,
    with: 140,
    height: 140,
    selected: false,
    dragging: false,
    positionAbsolute: {
      x: 306.19948369452777,
      y: 248.10841909174434
    }
  },
  {
    id: '5',
    type: 'selectorNode',
    data: {
      label: 'Ban giám đốc',
      value: 'leadership',
      initAttr: [
        {
          name: 'note',
          type: 'TEXT',
          required: true,
          options: [],
          suggestion: [],
          description: null
        }
      ]
    },
    position: {
      x: 413.63774530667587,
      y: -263.61604177204225
    },
    sourcePosition: null,
    with: 140,
    height: 140,
    selected: false,
    dragging: false,
    positionAbsolute: {
      x: 413.63774530667587,
      y: -263.61604177204225
    }
  },
  {
    id: '6',
    type: 'selectorNode',
    data: {
      label: 'HCNS',
      value: 'hr',
      initAttr: [
        {
          name: 'note',
          type: 'TEXT',
          required: true,
          options: [],
          suggestion: [],
          description: null
        }
      ]
    },
    position: {
      x: 396.12928785877017,
      y: 5.377531745780232
    },
    sourcePosition: null,
    with: 140,
    height: 140,
    selected: false,
    dragging: false,
    positionAbsolute: {
      x: 396.12928785877017,
      y: 5.377531745780232
    }
  }
]

export const edgesMockup = [
  {
    source: '1',
    sourceHandle: null,
    target: '4',
    targetHandle: null,
    id: 'reactflow__edge-1-4',
    animated: true
  },
  {
    source: '4',
    sourceHandle: null,
    target: '3',
    targetHandle: null,
    id: 'reactflow__edge-4-3',
    animated: true
  },
  {
    source: '3',
    sourceHandle: null,
    target: '2',
    targetHandle: null,
    id: 'reactflow__edge-3-2',
    animated: true
  },
  {
    source: '1',
    sourceHandle: null,
    target: '5',
    targetHandle: null,
    id: 'reactflow__edge-1-5',
    animated: true
  },
  {
    source: '5',
    sourceHandle: null,
    target: '2',
    targetHandle: null,
    id: 'reactflow__edge-5-2',
    animated: true
  },
  {
    source: '1',
    sourceHandle: null,
    target: '6',
    targetHandle: null,
    id: 'reactflow__edge-1-6',
    animated: true
  },
  {
    source: '6',
    sourceHandle: null,
    target: '2',
    targetHandle: null,
    id: 'reactflow__edge-6-2',
    animated: true
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

export const mockupResponse = {
  id: 'abc14235',
  name: 'Đơn đăng ký nghỉ phép',
  description: '235235',
  revision: {
    processFlow: [
      {
        srcIdx: 1,
        destIdx: 4
      },
      {
        srcIdx: 4,
        destIdx: 3
      },
      {
        srcIdx: 3,
        destIdx: 2
      },
      {
        srcIdx: 1,
        destIdx: 5
      },
      {
        srcIdx: 5,
        destIdx: 2
      },
      {
        srcIdx: 1,
        destIdx: 6
      },
      {
        srcIdx: 6,
        destIdx: 2
      }
    ],
    processNodes: {
      '1': {
        attributes: [
          {
            name: '1234214',
            type: 'TEXT',
            required: true,
            options: [],
            suggestion: [],
            description: null
          }
        ],
        groupCodes: '__START__',
        name: 'Khởi tạo phép',
        type: 'input',
        position: {
          x: 0,
          y: 103
        }
      },
      '2': {
        groupCodes: '__END__',
        name: 'Trạng thái cuối',
        type: 'output',
        position: {
          x: 900,
          y: 103
        }
      },
      '3': {
        attributes: [
          {
            name: 'note',
            type: 'TEXT',
            required: true,
            options: [],
            suggestion: [],
            description: null
          }
        ],
        groupCodes: 'hr',
        name: 'HCNS',
        type: 'selectorNode',
        position: {
          x: 628.514268530972,
          y: 249.70009704155393
        }
      },
      '4': {
        attributes: [
          {
            name: 'note',
            type: 'TEXT',
            required: true,
            options: [],
            suggestion: [],
            description: null
          }
        ],
        groupCodes: 'manager',
        name: 'Quản lý trực tiếp',
        type: 'selectorNode',
        position: {
          x: 306.19948369452777,
          y: 248.10841909174434
        }
      },
      '5': {
        attributes: [
          {
            name: 'note',
            type: 'TEXT',
            required: true,
            options: [],
            suggestion: [],
            description: null
          }
        ],
        groupCodes: 'leadership',
        name: 'Ban giám đốc',
        type: 'selectorNode',
        position: {
          x: 413.63774530667587,
          y: -263.61604177204225
        }
      },
      '6': {
        attributes: [
          {
            name: 'note',
            type: 'TEXT',
            required: true,
            options: [],
            suggestion: [],
            description: null
          }
        ],
        groupCodes: 'hr',
        name: 'HCNS',
        type: 'selectorNode',
        position: {
          x: 396.12928785877017,
          y: 5.377531745780232
        }
      }
    }
  }
}
