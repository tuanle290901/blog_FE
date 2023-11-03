export const ticketItem = {
  data: [
    {
      id: 'TD_ABSENT',
      createdAt: '2023-11-01T09:15:14.383Z',
      createdBy: 'bao.nkg',
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký nghỉ',
      description:
        'Cho phép nhân viên đăng ký nghỉ có khai báo lí do, được duyệt bởi quản lý trực tiếp và phòng nhân sự',
      revisions: [
        {
          rev: 1,
          processNodes: {
            '1': {
              nodeIndex: 1,
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
              nodeIndex: 2,
              groupCodes: '__END__',
              name: 'Trạng thái cuối',
              type: 'output',
              position: {
                x: 900,
                y: 103
              }
            },
            '3': {
              nodeIndex: 3,
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
              nodeIndex: 4,
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
              nodeIndex: 5,
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
              nodeIndex: 6,
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
          },
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
          createdAt: '2023-07-13T10:24:37.791637Z',
          createdBy: 'SYSTEM'
        }
      ]
    },
    {
      id: 'TD_BUSINESS_TRIP',
      createdAt: '2023-11-02T09:15:14.383Z',
      createdBy: 'hung.pv',
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký công tác',
      description: 'Cho phép nhân viên đăng ký công tác',
      revisions: [
        {
          rev: 1,
          processNodes: {
            '1': {
              nodeIndex: 1,
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
              nodeIndex: 2,
              groupCodes: '__END__',
              name: 'Trạng thái cuối',
              type: 'output',
              position: {
                x: 900,
                y: 103
              }
            },
            '3': {
              nodeIndex: 3,
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
              nodeIndex: 4,
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
              nodeIndex: 5,
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
              nodeIndex: 6,
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
          },
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
          createdAt: '2023-07-13T10:24:37.791672Z',
          createdBy: 'SYSTEM'
        }
      ]
    },
    {
      id: 'TD_OVERTIME',
      createdAt: '2023-11-03T09:15:14.383Z',
      createdBy: 'trang.lt',
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký làm thêm giờ',
      description: 'Cho phép nhân viên đăng ký làm thêm giờ',
      revisions: [
        {
          rev: 1,
          processNodes: {
            '1': {
              nodeIndex: 1,
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
              nodeIndex: 2,
              groupCodes: '__END__',
              name: 'Trạng thái cuối',
              type: 'output',
              position: {
                x: 900,
                y: 103
              }
            },
            '3': {
              nodeIndex: 3,
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
              nodeIndex: 4,
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
              nodeIndex: 5,
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
              nodeIndex: 6,
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
          },
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
          createdAt: '2023-07-13T10:24:37.791725Z',
          createdBy: 'SYSTEM'
        }
      ]
    }
  ],
  message: 'Lấy dữ liệu thành công.',
  status: 200
}
