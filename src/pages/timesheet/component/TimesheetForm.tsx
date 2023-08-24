import React from 'react'
import { Col, DatePicker, Form, Input, message, Modal, Row, Select, TimePicker } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const TimesheetForm: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const handleSubmit = () => {
    const formValue = { ...form.getFieldsValue() }
    let payload = {}
    payload = {
      startDate: dayjs(formValue?.startDate).format('DD/MM/YYYY'),
      endDate: dayjs(formValue?.endDate).format('DD/MM/YYYY'),
      startTime: dayjs(formValue?.startTime).format('HH:mm:ss'),
      endTime: dayjs(formValue?.endTime).format('HH:mm:ss'),
      type: formValue?.type || '',
      reason: formValue?.reason || ''
    }
    void message.success('Success')
    // handleClose()
  }
  return (
    <Modal
      open={open}
      title={t('timesheet.registerForLeave')}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
      className='timesheet-form'
    >
      <div className='tw-my-4'>
        <Form form={form} layout='vertical'>
          <div className='tw-mb-3'>
            <div>{t('timesheet.time')}</div>
            <Row gutter={[16, 16]} className='tw-items-center tw-mt-3'>
              <Col xs={4} className='tw-text-[#BFBFBF]'>
                {t('timesheet.from')}
              </Col>
              <Col xs={20}>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <Form.Item className='tw-mb-0' name='startDate'>
                      <DatePicker
                        format='DD/MM/YYYY'
                        disabledDate={(date) => {
                          return date.isAfter(new Date(form.getFieldValue('endDate')))
                        }}
                        showToday={false}
                        className='tw-w-full'
                        placeholder={t('timesheet.selectDate')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item className='tw-mb-0' name='startTime'>
                      <TimePicker showNow={false} placeholder={t('timesheet.selectHour')} className='tw-w-full' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className='tw-items-center tw-mt-3'>
              <Col xs={4} className='tw-text-[#BFBFBF]'>
                {t('timesheet.to')}
              </Col>
              <Col xs={20}>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <Form.Item className='tw-mb-0' name='endDate'>
                      <DatePicker
                        format='DD/MM/YYYY'
                        disabledDate={(date) => {
                          return date.isBefore(new Date(form.getFieldValue('startDate')))
                        }}
                        showToday={false}
                        className='tw-w-full'
                        placeholder={t('timesheet.selectDate')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item className='tw-mb-0' name='endTime'>
                      <TimePicker
                        // disabledDate={(time) => {
                        //   return time.isBefore(form.getFieldValue('startTime'))
                        // }}
                        showNow={false}
                        placeholder={t('timesheet.selectHour')}
                        className='tw-w-full'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Form.Item className='tw-mb-3' label={t('timesheet.kindOfLeave')} name='type'>
            <Select placeholder={t('timesheet.kindOfLeave')}>
              <Select.Option value='phep'>{t('Nghỉ phép')}</Select.Option>
              <Select.Option value='om'>{t('Nghỉ ốm')}</Select.Option>
              <Select.Option value='thaisan'>{t('Nghỉ thai sản')}</Select.Option>
              <Select.Option value='cuoi'>{t('Nghỉ cưới')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className='tw-mb-3' label={t('timesheet.note')} name='reason'>
            <Input.TextArea rows={3} placeholder={t('timesheet.note')} allowClear />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default TimesheetForm
