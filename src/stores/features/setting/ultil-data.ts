import { TicketDefRevisionCreateReq } from '~/types/setting-ticket-process'

export const ticketItem = {
  data: [
    {
      id: 'TD_ABSENT',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký nghỉ',
      description: 'Cho phép nhân viên đăng ký nghỉ có khai báo lí do'
    },
    {
      id: 'TD_BUSINESS_TRIP',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký công tác',
      description: 'Cho phép nhân viên đăng ký công tác'
    },
    {
      id: 'TD_OVERTIME',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      name: 'Đăng ký làm thêm giờ',
      description: 'Cho phép nhân viên đăng ký làm thêm giờ'
    },
    {
      id: 'TD_ATTENDANCE_RECORD_COMPLAIN',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      name: 'Khiếu nại chấm công',
      description: 'Cho phép nhân viên khiếu nại chấm công'
    }
  ],
  message: 'Lấy dữ liệu thành công.',
  status: 200
}

export const TICKET_PROPS_ATTR_INIT = [
  {
    name: 'Đăng ký nghỉ',
    ticketType: 'TD_ABSENT',
    description: 'Cho phép nhân viên đăng ký nghỉ có khai báo lí do, được duyệt bởi quản lý trực tiếp và phòng nhân sự',
    revision: {
      rev: '1',
      applyFromDate: '',
      processNodes: {
        '1': {
          name: 'Đăng ký nghỉ',
          groupCodes: ['__START__'],
          attributes: [
            {
              name: 'start_time',
              description: 'Thời gian bắt đầu',
              required: true,
              type: 'DATE_TIME'
            },
            {
              name: 'end_time',
              description: 'Thời gian kết thúc',
              required: true,
              type: 'DATE_TIME'
            },
            {
              name: 'type',
              description: 'Phân loại',
              required: true,
              type: 'SINGLE_CHOICE',
              options: [
                'ANNUAL',
                'SICK',
                'COMPENSATORY',
                'UNPAID',
                'MATERNITY',
                'PATERNITY',
                'WORK_FROM_HOME',
                'WEDDING',
                'OTHER'
              ]
            },
            {
              name: 'reason',
              description: 'Lí do',
              required: true,
              type: 'TEXT'
            },
            {
              name: 'supporter',
              description: 'Người tiếp quản (hỗ trợ) công việc trong thời gian nghỉ',
              required: false,
              type: 'TEXT'
            }
          ],
          nodeIndex: 1,
          position: {
            x: 0.0,
            y: 103.0
          }
        },
        '2': {
          name: 'Kết thúc',
          groupCodes: ['__END__'],
          attributes: [],
          nodeIndex: 2,
          position: {
            x: 900.0,
            y: 103.0
          }
        }
      },
      processFlow: []
    }
  },
  {
    name: 'Đăng ký công tác',
    ticketType: 'TD_BUSINESS_TRIP',
    description: 'Cho phép nhân viên đăng ký công tác',
    revision: {
      rev: '1',
      processNodes: {
        '1': {
          name: 'Đăng ký công tác',
          groupCodes: ['__START__'],
          attributes: [
            {
              name: 'start_time',
              description: 'Thời gian bắt đầu',
              required: true,
              type: 'DATE_TIME',
              options: null,
              suggestion: null,
              itemFields: null
            },
            {
              name: 'end_time',
              description: 'Thời gian kết thúc',
              required: true,
              type: 'DATE_TIME',
              options: null,
              suggestion: null,
              itemFields: null
            },
            {
              name: 'description',
              description: 'Mô tả',
              required: true,
              type: 'TEXT',
              options: null,
              suggestion: null,
              itemFields: null
            }
          ],
          nodeIndex: 1,
          position: {
            x: 0.0,
            y: 103.0
          }
        },
        '2': {
          name: 'Kết thúc',
          groupCodes: ['__END__'],
          attributes: null,
          nodeIndex: 2,
          position: {
            x: 900.0,
            y: 103.0
          }
        }
      },
      processFlow: []
    }
  },
  {
    name: 'Đăng ký làm thêm giờ',
    ticketType: 'TD_OVERTIME',
    description: 'Cho phép nhân viên đăng ký làm thêm giờ',
    revision: {
      rev: '1',
      processNodes: {
        '1': {
          name: 'Đăng ký làm thêm giờ',
          groupCodes: ['__START__'],
          attributes: [
            {
              name: 'start_time',
              description: 'Thời gian bắt đầu',
              required: true,
              type: 'DATE_TIME',
              options: null,
              suggestion: null,
              itemFields: null
            },
            {
              name: 'end_time',
              description: 'Thời gian kết thúc',
              required: true,
              type: 'DATE_TIME',
              options: null,
              suggestion: null,
              itemFields: null
            },
            {
              name: 'description',
              description: 'Mô tả',
              required: true,
              type: 'TEXT',
              options: null,
              suggestion: null,
              itemFields: null
            }
          ],
          nodeIndex: 1,
          position: {
            x: 0.0,
            y: 103.0
          }
        },
        '2': {
          name: 'Kết thúc',
          groupCodes: ['__END__'],
          attributes: null,
          nodeIndex: 2,
          position: {
            x: 900.0,
            y: 103.0
          }
        }
      },
      processFlow: [],
      applyFromDate: null
    }
  },
  {
    name: 'Khiếu nại chấm công',
    ticketType: 'TD_ATTENDANCE_RECORD_COMPLAIN',
    description: 'Cho phép nhân viên khiếu nại chấm công với phòng nhân sự',
    payrollAffected: true,
    revision: {
      rev: '1',
      processNodes: {
        '1': {
          name: 'Thông tin khiếu nại',
          groupCodes: ['__START__'],
          attributes: [
            {
              name: 'start_time',
              description: 'Bắt đầu làm việc lúc',
              required: true,
              type: 'DATE_TIME',
              options: null,
              suggestion: null,
              itemFields: null
            },
            {
              name: 'end_time',
              description: 'Kết thúc làm việc lúc',
              required: true,
              type: 'DATE_TIME',
              options: null,
              suggestion: null,
              itemFields: null
            },
            {
              name: 'description',
              description: 'Mô tả',
              required: true,
              type: 'TEXT',
              options: null,
              suggestion: ['Máy chấm công hỏng', 'Quên chấm công', 'Sự cố toàn công ty', 'Hoạt động khác'],
              itemFields: null
            }
          ],
          nodeIndex: 1,
          position: {
            x: 0.0,
            y: 103.0
          }
        },
        '2': {
          name: 'Kết thúc',
          groupCodes: ['__END__'],
          attributes: null,
          nodeIndex: 2,
          position: {
            x: 900.0,
            y: 103.0
          }
        }
      },
      processFlow: [],
      applyFromDate: null
    }
  }
]
