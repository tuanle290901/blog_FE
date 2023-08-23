import type { DatePickerProps } from 'antd'
import { Button, Col, DatePicker, Form, Result, Row, TreeSelect } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import { useEffect, useState } from 'react'
// import { getListDepartments } from '~/stores/features/department/department.silce'
import { downloadExcelFile } from '~/stores/features/report/report.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DataType } from '~/types/department.interface'
import { FormValues } from '../setting/ticket-defination/type/ItemTypes'
import './style.scss'
import { convertBlobToString } from '~/utils/helper'
import { getGroupRootName } from '~/stores/features/master-data/master-data.slice'

const { RangePicker } = DatePicker

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

// interface TreeItem {
//   title: string | undefined
//   value: string
//   key: string
//   children?: TreeItem[]
// }

// const generateTreeData = (data: DataType[]) => {
//   return data.map((item) => {
//     const { code, name, children } = item
//     const formattedItem: TreeItem = { title: name, value: code, key: code }

//     if (children && children.length > 0) {
//       formattedItem.children = generateTreeData(children)
//     }

//     return formattedItem
//   })
// }

const Index = () => {
  const [reportForm] = Form.useForm()
  const dispatch = useAppDispatch()
  // const departments = useAppSelector((item) => item.department.listData)
  // const [treeData, setTreeData] = useState<any[]>([])
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [timeReport, setTimReport] = useState<Dayjs | null>(null)
  const [isDownloadFinished, setIsDownloadFinished] = useState({
    status: false,
    msg: ''
  })

  const authState = useAppSelector((state: any) => state?.auth?.userInfo)
  const groupRootNameState = useAppSelector((state: any) => state?.masterData?.groupRootName)

  const onChangeTime: DatePickerProps['onChange'] = (date) => {
    setTimReport(date)
  }

  const onFinish = async () => {
    setIsSubmit(true)
    const timeString = timeReport?.format('MM/YYYY') || ''
    const params = {
      month: timeString.split('/')[0],
      year: timeString.split('/')[1]
    }
    try {
      const response = (await downloadExcelFile(params)) as any
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
      const fileName = groupRootNameState?.name
        ? `${groupRootNameState?.name}_ChamCong_${params.month}${params.year}.xlsx`
        : `ChamCong_${params.month}${params.year}.xlsx`
      saveAs(blob, fileName)
      setIsDownloadFinished({
        status: true,
        msg: 'Tải xuống tệp thành công'
      })
    } catch (error: any) {
      const dataResponse = await convertBlobToString(error.response.data)
      if (dataResponse) {
        setIsDownloadFinished({
          status: false,
          msg: dataResponse.message
        })
      }
    }
  }

  const onFinishFailed = (formValue: FormValues) => {
    console.log(formValue)
  }

  // const [value, setValue] = useState<string[]>([])

  // const onChange = (newValue: string[]) => {
  //   setValue(newValue)
  // }

  // const treeProps = {
  //   treeData,
  //   value,
  //   onChange,
  //   treeCheckable: true,
  //   showCheckedStrategy: SHOW_PARENT,
  //   placeholder: 'Phòng ban'
  // }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && (current < dayjs().startOf('year') || current.isAfter(new Date()))
  }

  useEffect(() => {
    const promise = dispatch(getGroupRootName())
    setTimReport(dayjs())
    reportForm.setFieldsValue({
      time: dayjs()
    })
    return () => {
      promise.abort()
    }
  }, [])

  // useEffect(() => {
  //   if (departments.length > 0) {
  //     const tempTree = generateTreeData(departments)
  //     setTreeData(tempTree)
  //   }
  // }, [departments])

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
              <Col xs={24} lg={{ span: 12, offset: 6 }}>
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
                    value={timeReport}
                    onChange={onChangeTime}
                    format={'MM/YYYY'}
                    className='tw-w-full'
                    placeholder='Chọn thời gian báo cáo'
                    picker='month'
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={{ span: 12, offset: 6 }}>
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
