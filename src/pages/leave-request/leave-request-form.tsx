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

const LeaveRequestForm: React.FC<{
  canUpdateForm: boolean
  open: boolean
  handleClose: () => void
  data?: any | null
}> = ({ canUpdateForm, open, handleClose, data }) => {
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
      const attributesProperties = selectedTicketType?.revisions[0].processNodes['0'].attributes
      const attributesData = data?.processStatus['0']?.attributes

      attributesProperties?.forEach((item) => {
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

    const processNodesAttributes = selectedTicket?.revisions[1]?.processNodes['0']?.attributes

    const transformedFormValue = Object.keys(formValue).reduce((acc, key) => {
      const transformedValue = transformData(key, formValue, processNodesAttributes)
      return { ...acc, [key]: transformedValue }
    }, {})

    const payload: ILeaveRequestForm | ILeaveRequestEditForm = data
      ? { attrs: transformedFormValue, id: data.id }
      : { initialAttrs: transformedFormValue, revision: 1, ticketDefinitionId: formValue.typeOfLeave }

    try {
      const response = await (data
        ? dispatch(editLeaveRequest(payload as ILeaveRequestEditForm))
        : dispatch(createLeaveRequest(payload as ILeaveRequestForm))
      ).unwrap()
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

  const onCancel = () => {
    handleClose()
    form.resetFields()
  }

  const disabledDate = (current: Dayjs, item: any) => {
    return current && current <= dayjs().endOf('day')
  }

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
                  {item.type === INPUT_TYPE.TEXT && <Input disabled={!canUpdateForm} placeholder={item.description} />}
                  {item.type === INPUT_TYPE.SINGLE_SELECT && (
                    <Select
                      disabled={!canUpdateForm}
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
                      disabled={!canUpdateForm}
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
                      disabled={!canUpdateForm}
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
                      disabled={!canUpdateForm}
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
