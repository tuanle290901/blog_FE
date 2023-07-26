import { useState, useEffect } from 'react'
import './style.scss'
import { Button, Col, DatePicker, Empty, Form, Result, Row, Select, TreeSelect } from 'antd'
import { FormValues } from '../setting/ticket-defination/type/ItemTypes'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { downloadExcelFile } from '~/stores/features/report/report.slice'
import { convertUTCToLocaleDate } from '~/utils/helper'
import { getListDepartments } from '~/stores/features/department/department.silce'
import { DataType } from '~/types/department.interface'
import { saveAs } from 'file-saver'

const { RangePicker } = DatePicker
import type { DatePickerProps } from 'antd'

const rangePresets: {
  label: string
  value: [Dayjs, Dayjs]
}[] = [
  { label: 'Hôm nay', value: [dayjs(), dayjs()] },
  { label: 'Tuần này', value: [dayjs().startOf('week'), dayjs()] },
  { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs()] },
  {
    label: 'Tháng trước',
    value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  },
  { label: 'Năm nay', value: [dayjs().startOf('year'), dayjs()] }
]

const { SHOW_PARENT } = TreeSelect

interface TreeItem {
  title: string | undefined
  value: string
  key: string
  children?: TreeItem[]
}

const generateTreeData = (data: DataType[]) => {
  return data.map((item) => {
    const { code, name, children } = item
    const formattedItem: TreeItem = { title: name, value: code, key: code }

    if (children && children.length > 0) {
      formattedItem.children = generateTreeData(children)
    }

    return formattedItem
  })
}

const Index = () => {
  const [reportForm] = Form.useForm()
  const dispatch = useAppDispatch()
  const departments = useAppSelector((item) => item.department.listData)

  const [treeData, setTreeData] = useState<any[]>([])
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [timeReport, setTimReport] = useState<string>('')
  const [isDownloadFinished, setIsDownloadFinished] = useState({
    status: false,
    msg: ''
  })

  const onChangeTime: DatePickerProps['onChange'] = (date, dateString) => {
    setTimReport(dateString)
  }

  const onFinish = async () => {
    setIsSubmit(true)
    const params = {
      month: timeReport.split('/')[0],
      year: timeReport.split('/')[1]
    }
    try {
      const response: any = await downloadExcelFile(params)
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
      saveAs(blob, 'Bang-chi-tiet-cham-cong.xlsx')
      setIsDownloadFinished({
        status: true,
        msg: 'Tải xuống tệp thành công'
      })
    } catch (error: any) {
      setIsDownloadFinished({
        status: false,
        msg: 'Không có dữ liệu của tháng đã chọn'
      })
    }
  }

  const onFinishFailed = (formValue: FormValues) => {
    console.log(formValue)
  }

  const [value, setValue] = useState<string[]>([])

  const onChange = (newValue: string[]) => {
    setValue(newValue)
  }

  const treeProps = {
    treeData,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Phòng ban'
  }

  useEffect(() => {
    dispatch(getListDepartments())
  }, [])

  useEffect(() => {
    if (departments.length > 0) {
      const tempTree = generateTreeData(departments)
      setTreeData(tempTree)
    }
  }, [departments])

  return (
    <div className='report-wrapper'>
      <div className='report-container'>
        <div className='report-title tw-text-lg tw-font-semibold'>Xuất báo cáo</div>
        <div className='report-description tw-text-md tw-mt-2 tw-italic tw-text-sky-700'>
          Tải xuống bảng chấm công theo tháng của CBNV dưới dạng tệp Excel
        </div>

        <div className='report-filter-container'>
          <Form
            layout='vertical'
            name='reportForm'
            form={reportForm}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >
            <Row className='tw-w-full tw-h-full'>
              {/* <Col span={9}>
                <Form.Item
                  label='Phòng ban'
                  name='groupCode'
                  required
                  rules={[{ required: true, message: 'Trường bắt buộc' }]}
                >
                  <TreeSelect {...treeProps} />
                </Form.Item>
              </Col> */}
              <Col span={12} offset={6}>
                <Form.Item
                  label='Thời gian báo cáo'
                  name='time'
                  required
                  rules={[{ required: true, message: 'Trường bắt buộc' }]}
                >
                  {/* <RangePicker
                    format={'DD/MM/YYYY'}
                    className='tw-w-full'
                    presets={rangePresets}
                    placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                  /> */}
                  <DatePicker
                    onChange={onChangeTime}
                    format={'MM/YYYY'}
                    className='tw-w-full'
                    placeholder='Chọn thời gian báo cáo'
                    picker='month'
                  />
                </Form.Item>
              </Col>

              <Col span={12} offset={6}>
                <Form.Item>
                  <Button className='login-button tw-w-1/10 tw-float-right' type='primary' htmlType='submit'>
                    Tải xuống
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <hr style={{ borderTop: '1px solid #fefefe' }} />
        <div className='report-list'>
          {isSubmit && (
            <Result status={isDownloadFinished.status ? 'success' : '500'} title={isDownloadFinished?.msg} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
