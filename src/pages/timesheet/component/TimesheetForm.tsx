import React, { useState } from 'react'
import { Col, DatePicker, Form, Input, message, Modal, Row, Segmented, Select, TimePicker } from 'antd'
import { useTranslation } from 'react-i18next'

const TimesheetForm: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [typeOfReason, setTypeOfReason] = useState('violate')

  const handleSubmit = () => {
    const formValue = { ...form.getFieldsValue(), typeOfReason }
    console.log('formValue', formValue)
    void message.success('Success')
    // handleClose()
  }
  return (
    <Modal
      open={open}
      title={t('Thêm phép')}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
    >
      <div className='tw-my-4'>
        <Form form={form} layout='vertical'>
          <Form.Item className='tw-mb-3' label={t('Loại phép')}>
            <Segmented
              options={[
                { label: 'Đi muộn/về sớm', value: 'violate' },
                { label: 'Công tác', value: 'onBussiness' },
                { label: 'Nghỉ phép', value: 'onLeave' }
              ]}
              defaultValue='violate'
              onChange={(v) => setTypeOfReason(v.toString())}
            />
          </Form.Item>
          {typeOfReason === 'violate' && (
            <>
              <Form.Item className='tw-mb-3' label={t('Ngày phép')} name='date'>
                <DatePicker
                  format='DD/MM/YYYY'
                  // disabledDate={(date) => {
                  //   return date.isAfter(new Date())
                  // }}
                  showToday={false}
                  className='tw-w-full'
                  placeholder={t('Ngày phép')}
                />
              </Form.Item>
              <Form.Item className='tw-mb-3' label={t('Thời gian làm')} name='time'>
                <TimePicker.RangePicker placeholder={['Giờ đến', 'Giờ về']} className='tw-w-full' />
              </Form.Item>
            </>
          )}
          {(typeOfReason === 'onBussiness' || typeOfReason === 'onLeave') && (
            <div className='tw-mb-3'>
              <div>Thời gian {typeOfReason === 'onBussiness' ? 'đi công tác' : 'nghỉ phép'}</div>
              <Row gutter={[16, 16]} className='tw-items-center tw-mt-3'>
                <Col xs={4} className='tw-text-[#BFBFBF]'>
                  Từ
                </Col>
                <Col xs={20}>
                  <Row gutter={[16, 16]}>
                    <Col xs={12}>
                      <Form.Item className='tw-mb-0' name='startDate'>
                        <DatePicker
                          format='DD/MM/YYYY'
                          // disabledDate={(date) => {
                          //   return date.isAfter(new Date())
                          // }}
                          showToday={false}
                          className='tw-w-full'
                          placeholder={t('Chọn ngày')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item className='tw-mb-0' name='startTime'>
                        <TimePicker placeholder='Chọn giờ' className='tw-w-full' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[16, 16]} className='tw-items-center tw-mt-3'>
                <Col xs={4} className='tw-text-[#BFBFBF]'>
                  Đến
                </Col>
                <Col xs={20}>
                  <Row gutter={[16, 16]}>
                    <Col xs={12}>
                      <Form.Item className='tw-mb-0' name='endDate'>
                        <DatePicker
                          format='DD/MM/YYYY'
                          // disabledDate={(date) => {
                          //   return date.isAfter(new Date())
                          // }}
                          showToday={false}
                          className='tw-w-full'
                          placeholder={t('Chọn ngày')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item className='tw-mb-0' name='endTime'>
                        <TimePicker placeholder='Chọn giờ' className='tw-w-full' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          )}
          {typeOfReason === 'onLeave' && (
            <Form.Item className='tw-mb-3' label={t('Loại phép')} name='type'>
              <Select placeholder={t('Loại phép')}>
                <Select.Option value='a'>{t('Nghỉ thường niên')}</Select.Option>
                <Select.Option value='b'>{t('Nghỉ ốm')}</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item className='tw-mb-3' label={t('Lý do')} name='reason'>
            <Input.TextArea rows={3} placeholder={t('Lý do')} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default TimesheetForm
