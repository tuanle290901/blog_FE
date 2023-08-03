/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { Col, DatePicker, Form, Input, Modal, Row, Select, TimePicker, notification } from 'antd'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createLeaveRequest, updateLeaveRequest } from '~/stores/features/leave-request/leave-request.slice'
import { useAppDispatch } from '~/stores/hook'
import { ILeaveRequest, ILeaveRequestForm } from '~/types/leave-request'
import dayjs from 'dayjs'

const LeaveRequestForm: React.FC<{ open: boolean; handleClose: () => void; data?: ILeaveRequest | null }> = ({
  open,
  handleClose,
  data
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<ILeaveRequest>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }, [data])

  const handleSubmit = async () => {
    const formValue = { ...form.getFieldsValue() }
    const payload: ILeaveRequestForm = {
      typeOfLeave: formValue?.typeOfLeave,
      requestMessage: formValue?.requestMessage,
      AmountTimeLeave: formValue?.AmountTimeLeave,
      requestDate: dayjs().format('DD/MM/YYYY'),
      startDate: `${dayjs(formValue?.startDate).format('DD/MM/YYYY')} ${dayjs(formValue?.startTime).format('HH:mm')}`,
      endDate: `${dayjs(formValue?.endDate).format('DD/MM/YYYY')} ${dayjs(formValue?.endTime).format('HH:mm')}`
    }
    if (data) {
      try {
        console.log(payload)
        const response = await dispatch(
          updateLeaveRequest({
            ...payload,
            id: data.id
          })
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
    } else {
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

  const typeOfLeaveOptions = [
    { value: 'OM', label: 'Nghỉ ốm' },
    { value: 'HY', label: 'Nghỉ cưới' }
  ]

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
          <Form.Item label={t('leaveRequest.typeOfLeave')} name='typeOfLeave'>
            <Select
              className='tw-w-full'
              showSearch
              placeholder={`${t('rootInit.requiredSelect')} ${t('leaveRequest.typeOfLeave')}`}
              optionFilterProp='children'
              filterOption={(input, option) => {
                return (option?.label + '').toLowerCase().includes(input.toLowerCase())
              }}
              allowClear
              onClear={() => void {}}
              onChange={() => void {}}
              options={typeOfLeaveOptions}
            />
          </Form.Item>
          <div className='tw-mb-3'>
            <div>{t('leaveRequest.timeLeave')}</div>
            <Row gutter={[16, 16]} className='tw-items-center tw-mt-3'>
              <Col xs={4} className='tw-text-[#BFBFBF]'>
                {t('leaveRequest.from')}
              </Col>
              <Col xs={20}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={14}>
                    <Form.Item className='tw-mb-0' name='startDate'>
                      <DatePicker
                        format='DD/MM/YYYY'
                        disabledDate={(date) => {
                          return date.isAfter(new Date(form.getFieldValue('endDate')))
                        }}
                        showToday={false}
                        className='tw-w-full'
                        placeholder={t('leaveRequest.selectDate')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Form.Item className='tw-mb-0' name='startTime'>
                      <TimePicker
                        showNow={false}
                        placeholder={t('leaveRequest.selectHour')}
                        format='HH:mm'
                        className='tw-w-full'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className='tw-items-center tw-mt-3'>
              <Col xs={4} className='tw-text-[#BFBFBF]'>
                {t('leaveRequest.to')}
              </Col>
              <Col xs={20}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={14}>
                    <Form.Item className='tw-mb-0' name='endDate'>
                      <DatePicker
                        format='DD/MM/YYYY'
                        disabledDate={(date) => {
                          return date.isBefore(new Date(form.getFieldValue('startDate')))
                        }}
                        showToday={false}
                        className='tw-w-full'
                        placeholder={t('leaveRequest.selectDate')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Form.Item className='tw-mb-0' name='endTime'>
                      <TimePicker
                        // disabledDate={(time) => {
                        //   return time.isBefore(form.getFieldValue('startTime'))
                        // }}
                        showNow={false}
                        placeholder={t('leaveRequest.selectHour')}
                        className='tw-w-full'
                        format='HH:mm'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Form.Item label={t('leaveRequest.requestMessage')} name='requestMessage'>
            <Input.TextArea rows={3} placeholder={t('leaveRequest.requestMessage')} allowClear />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default LeaveRequestForm
