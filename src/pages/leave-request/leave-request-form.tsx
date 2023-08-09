import { DatePicker, Form, Input, Modal, Select, notification } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createLeaveRequest, editLeaveRequest } from '~/stores/features/leave-request/leave-request.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { ILeaveRequestEditForm, ILeaveRequestForm } from '~/types/leave-request'
import { LeaveTypes } from '~/types/leave-request.interface'
import { TicketAttribute } from '~/types/setting-ticket-process'
import { INPUT_TYPE, LEAVE_TYPE_MAP } from '~/utils/Constant'

const range = (start: number, end: number) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

const transformData = (
  key: string,
  formValue: { [key: string]: string },
  attributes: TicketAttribute[] | undefined
) => {
  const type = attributes && attributes.find((item) => item.name === key)?.type
  switch (type) {
    case INPUT_TYPE.DATETIME: {
      return dayjs(formValue[key]).format('YYYY-MM-DD HH:mm:ss')
    }
    default: {
      return formValue[key]
    }
  }
}

const LeaveRequestForm: React.FC<{ open: boolean; handleClose: () => void; data?: any | null }> = ({
  open,
  handleClose,
  data
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const ticketDifinations = useAppSelector((item) => item.leaveRequest.ticketDefinationType)
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>('')
  const selectedTicketType = ticketDifinations.find((ticket) => ticket.id === selectedTicketTypeId)

  useEffect(() => {
    if (data) {
      setSelectedTicketTypeId(data.ticketDefinitionId)
      form.setFieldValue('typeOfLeave', data.ticketDefinitionId)
      const attributes = selectedTicketType?.revisions[0].processNodes['0'].attributes
      const attributesData = data?.processStatus['0']?.attributes

      attributes?.forEach((item) => {
        if (item.type === INPUT_TYPE.DATETIME) {
          form.setFieldValue(item.name, dayjs(attributesData[item.name]))
        } else {
          form.setFieldValue(item.name, attributesData[item.name])
        }
      })
    }
  }, [data, selectedTicketTypeId])

  const handleSubmit = async () => {
    const formValue = form.getFieldsValue()
    const selectedTicket = ticketDifinations.find((item) => item.id === formValue.typeOfLeave)
    for (const key in formValue) {
      formValue[key] = transformData(key, formValue, selectedTicket?.revisions[1]?.processNodes['0']?.attributes)
    }

    if (data) {
      const payload: ILeaveRequestEditForm = {
        attrs: formValue,
        id: data.id
      }
      try {
        const response = await dispatch(editLeaveRequest(payload)).unwrap()
        form.resetFields()
        handleClose()
        notification.success({
          message: response.message
        })
      } catch (error: any) {
        notification.error({
          message: error.message
        })
      }
    } else {
      const payload: ILeaveRequestForm = {
        initialAttrs: formValue,
        revision: 1,
        ticketDefinitionId: formValue.typeOfLeave
      }
      try {
        const response = await dispatch(createLeaveRequest(payload)).unwrap()
        form.resetFields()
        handleClose()
        notification.success({
          message: response.message
        })
      } catch (error: any) {
        notification.error({
          message: error.message
        })
      }
    }
  }

  const onCancel = () => {
    handleClose()
    form.resetFields()
  }

  const disabledDate = (current: Dayjs, item: any) => {
    // if (item.name === 'end_time') {
    //   const startTime = form.getFieldValue('start_time')
    //   if (startTime) {
    //     return current && current <= dayjs(startTime).endOf('day')
    //   }
    //   return current && current <= dayjs().endOf('day')
    // }

    // if (item.name === 'start_time') {
    //   const endTime = form.getFieldValue('end_time')
    //   if (endTime) {
    //     return current && current >= dayjs(endTime).endOf('day')
    //   }
    //   return current && current <= dayjs().endOf('day')
    // }
    return current && current <= dayjs().endOf('day')
  }

  // const disabledDateTime = (item: any) => ({
  //   disabledHours: () => {
  //     const disabledHours = []
  //     for (let i = 0; i < 8; i++) {
  //       disabledHours.push(i)
  //     }
  //     for (let i = 18; i < 24; i++) {
  //       disabledHours.push(i)
  //     }
  //     return disabledHours
  //   },
  //   disabledMinutes: () => range(30, 60)
  // })

  return (
    <Modal
      open={open}
      title={t('leaveRequest.createNew')}
      onCancel={onCancel}
      onOk={form.submit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
      centered
    >
      <div className='tw-my-4'>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item label='Loại yêu cầu' name='typeOfLeave' rules={[{ required: true, message: 'Trường bắt buộc' }]}>
            <Select
              disabled={data?.id}
              className='tw-w-full'
              showSearch
              placeholder='Vui lòng chọn Loại yêu cầu'
              optionFilterProp='children'
              filterOption={(input, option) => {
                return (option?.label + '').toLowerCase().includes(input.toLowerCase())
              }}
              allowClear
              onClear={() => void {}}
              onChange={(id) => setSelectedTicketTypeId(id)}
              options={ticketDifinations.map((item) => {
                return {
                  label: item.name,
                  value: item.id
                }
              })}
            />
          </Form.Item>

          {selectedTicketType?.id &&
            selectedTicketType?.revisions[1]?.processNodes['0']?.attributes?.map((item, index) => {
              return (
                <Form.Item
                  key={index}
                  label={item.description}
                  name={item.name}
                  rules={[{ required: item.required, message: 'Trường bắt buộc' }]}
                >
                  {item.type === INPUT_TYPE.TEXT && <Input placeholder={item.description} />}
                  {item.type === INPUT_TYPE.SINGLE_SELECT && (
                    <Select
                      placeholder={item.description}
                      options={item.options?.map((val: keyof LeaveTypes) => {
                        return {
                          label: LEAVE_TYPE_MAP[val],
                          value: val
                        }
                      })}
                    />
                  )}
                  {item.type === INPUT_TYPE.MULTIPLE_SELECT && (
                    <Select
                      mode='multiple'
                      placeholder={item.description}
                      options={item.options?.map((val: keyof LeaveTypes) => {
                        return {
                          label: LEAVE_TYPE_MAP[val],
                          value: val
                        }
                      })}
                    />
                  )}
                  {item.type === INPUT_TYPE.DATETIME && (
                    <DatePicker
                      placeholder={item.description}
                      className='tw-w-full'
                      showTime={{ format: 'HH:mm' }}
                      format='DD/MM/YYYY HH:mm'
                      disabledDate={(val) => disabledDate(val, item)}
                      // disabledTime={() => disabledDateTime(item)}
                    />
                  )}
                  {item.type === INPUT_TYPE.BOOLEAN && (
                    <Select
                      placeholder={item.description}
                      options={[
                        { label: 'Có', value: true },
                        { label: 'Không', value: false }
                      ]}
                    />
                  )}
                </Form.Item>
              )
            })}
        </Form>
      </div>
    </Modal>
  )
}
export default LeaveRequestForm
