export const ticketItem = {
  data: [
    {
      id: 'TD_ABSENT',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký nghỉ',
      description:
        'Cho phép nhân viên đăng ký nghỉ có khai báo lí do, được duyệt bởi quản lý trực tiếp và phòng nhân sự',
      revisions: [
        {
          rev: 1,
          processNodes: [
            {
              groupCode: '__START__',
              attributes: [
                {
                  name: 'start_time',
                  description: 'Thời gian bắt đầu',
                  required: true,
                  type: 'DATE_TIME',
                  options: null,
                  suggestion: null
                },
                {
                  name: 'end_time',
                  description: 'Thời gian kết thúc',
                  required: true,
                  type: 'DATE_TIME',
                  options: null,
                  suggestion: null
                },
                {
                  name: 'type',
                  description: 'Phân loại',
                  required: true,
                  type: 'SINGLE_CHOICE',
                  options: [
                    'SICK',
                    'COMPENSATORY',
                    'ANNUAL',
                    'UNPAID',
                    'MATERNITY',
                    'PATERNITY',
                    'WORK_FROM_HOME',
                    'WEDDING',
                    'UNEXPECTED',
                    'COMPASSIONATE'
                  ],
                  suggestion: null
                },
                {
                  name: 'reason',
                  description: 'Lí do',
                  required: true,
                  type: 'TEXT',
                  options: null,
                  suggestion: null
                },
                {
                  name: 'supporter',
                  description: 'Người tiếp quản (hỗ trợ) công việc trong thời gian nghỉ',
                  required: false,
                  type: 'TEXT',
                  options: null,
                  suggestion: null
                }
              ]
            },
            {
              groupCode: 'manager',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: false,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },
            {
              groupCode: 'vice-director',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: false,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },
            {
              groupCode: 'hr',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: false,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },
            {
              groupCode: '__END__',
              attributes: null
            }
          ],
          processFlow: [
            {
              srcIdx: 0,
              destIdx: 1
            },
            {
              srcIdx: 1,
              destIdx: 2
            },
            {
              srcIdx: 2,
              destIdx: 3
            }
          ],
          strategy: 'JUDGEMENT_IMMEDIATELY',
          stopTransferStrategy: 'BY_ONE_RESULT',
          continueTransferStrategy: 'BY_ALL_RESULT',
          createdAt: '2023-07-13T10:24:37.791637Z',
          createdBy: 'SYSTEM'
        }
      ]
    },
    {
      id: 'TD_BUSINESS_TRIP',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký công tác',
      description: 'Cho phép nhân viên đăng ký công tác',
      revisions: [
        {
          rev: 1,
          processNodes: [
            {
              groupCode: '__START__',
              attributes: [
                {
                  name: 'start_time',
                  description: 'Thời gian bắt đầu',
                  required: true,
                  type: 'DATE_TIME',
                  options: null,
                  suggestion: null
                },
                {
                  name: 'end_time',
                  description: 'Thời gian kết thúc',
                  required: true,
                  type: 'DATE_TIME',
                  options: null,
                  suggestion: null
                },
                {
                  name: 'description',
                  description: 'Mô tả',
                  required: true,
                  type: 'TEXT',
                  options: null,
                  suggestion: null
                }
              ]
            },
            {
              groupCode: 'manager',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: true,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },
            {
              groupCode: 'director',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: false,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },
            {
              groupCode: '__END__',
              attributes: null
            }
          ],
          processFlow: [
            {
              srcIdx: 0,
              destIdx: 1
            },
            {
              srcIdx: 1,
              destIdx: 2
            },
            {
              srcIdx: 2,
              destIdx: 3
            }
          ],
          strategy: 'JUDGEMENT_IMMEDIATELY',
          stopTransferStrategy: 'BY_ONE_RESULT',
          continueTransferStrategy: 'BY_ALL_RESULT',
          createdAt: '2023-07-13T10:24:37.791672Z',
          createdBy: 'SYSTEM'
        }
      ]
    },
    {
      id: 'TD_OVERTIME',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký làm thêm giờ',
      description: 'Cho phép nhân viên đăng ký làm thêm giờ',
      revisions: [
        {
          rev: 1,
          processNodes: [
            {
              groupCode: '__START__',
              attributes: [
                {
                  name: 'start_time',
                  description: 'Thời gian bắt đầu',
                  required: true,
                  type: 'DATE_TIME',
                  options: null,
                  suggestion: null
                },
                {
                  name: 'end_time',
                  description: 'Thời gian kết thúc',
                  required: true,
                  type: 'DATE_TIME',
                  options: null,
                  suggestion: null
                },
                {
                  name: 'description',
                  description: 'Mô tả',
                  required: true,
                  type: 'TEXT',
                  options: null,
                  suggestion: null
                }
              ]
            },
            {
              groupCode: 'manager',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: true,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },

            {
              groupCode: 'hr',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: true,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },
            {
              groupCode: 'director',
              attributes: [
                {
                  name: 'note',
                  description: 'Ý kiến',
                  required: true,
                  type: 'TEXT',
                  options: null,
                  suggestion: ['Tôi đồng ý', 'Tôi không đồng ý']
                }
              ]
            },
            {
              groupCode: '__END__',
              attributes: null
            }
          ],
          processFlow: [
            {
              srcIdx: 0,
              destIdx: 1
            },
            {
              srcIdx: 1,
              destIdx: 2
            },
            {
              srcIdx: 2,
              destIdx: 3
            }
          ],
          strategy: 'JUDGEMENT_IMMEDIATELY',
          stopTransferStrategy: 'BY_ONE_RESULT',
          continueTransferStrategy: 'BY_ALL_RESULT',
          createdAt: '2023-07-13T10:24:37.791725Z',
          createdBy: 'SYSTEM'
        }
      ]
    }
  ],
  message: 'Lấy dữ liệu thành công.',
  status: 200
}
