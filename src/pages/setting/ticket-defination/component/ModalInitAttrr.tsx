/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MinusCircleFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Row, Select, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useState, type FC } from 'react'
import { INPUT_TYPE } from '~/utils/Constant'
import { ModalInitAttrProp } from '../type/ItemTypes'

const ModalInitAttr: FC<ModalInitAttrProp> = function ModalInitAttr(props) {
  const {
    isModalInitAttrOpen,
    initAttrForm,
    handleCancelModalInitAttr,
    onFinishInitAttr,
    onFinishInitAttrFail,
    onChangeType
  } = props

  const [collapsed, setCollapsed] = useState<boolean[]>([true])

  return (
    <Modal
      title='Khởi tạo thuộc tính'
      width='40%'
      style={{ minWidth: 500, top: 50 }}
      open={isModalInitAttrOpen.status}
      footer={null}
      onCancel={handleCancelModalInitAttr}
    >
      <Form
        form={initAttrForm}
        name='dynamicFormInitAttr'
        onFinish={onFinishInitAttr}
        onFinishFailed={onFinishInitAttrFail}
        scrollToFirstError={true}
        autoComplete='off'
        className='dynamic-form-container'
        layout='vertical'
        initialValues={{
          initAttr: [{ name: null, type: null, required: null, options: [], suggestion: [], description: null }]
        }}
      >
        <Form.List name='initAttr'>
          {(fields, { add, remove }) => {
            return (
              <>
                <div className='form-array-container'>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Row align='middle' key={key} className='dynamic-form-item-container' gutter={[8, 0]}>
                      <Col span={12}>
                        <Form.Item
                          label='Tên thuộc tính'
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: 'Trường bắt buộc' }]}
                        >
                          <Input placeholder='Tên thuộc tính' />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label='Kiểu dữ liệu'
                          {...restField}
                          name={[name, 'type']}
                          rules={[{ required: true, message: 'Trường bắt buộc' }]}
                        >
                          <Select
                            onChange={(value) => onChangeType(value, index)}
                            placeholder={'Chọn kiểu dữ liệu'}
                            options={[
                              { value: INPUT_TYPE.TEXT, label: 'Văn bản' },
                              { value: INPUT_TYPE.NUMBER, label: 'Số' },
                              { value: INPUT_TYPE.DATETIME, label: 'Thời gian' },
                              { value: INPUT_TYPE.BOOLEAN, label: 'Boolean' },
                              { value: INPUT_TYPE.SINGLE_SELECT, label: 'Chọn một' },
                              { value: INPUT_TYPE.MULTIPLE_SELECT, label: 'Chọn nhiều' }
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label='Bắt buộc'
                          {...restField}
                          name={[name, 'required']}
                          rules={[{ required: true, message: 'Trường bắt buộc' }]}
                        >
                          <Select
                            placeholder={'Chọn trường bắt buộc'}
                            options={[
                              { value: true, label: 'Có' },
                              { value: false, label: 'Không' }
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        {(initAttrForm.getFieldsValue().initAttr?.[index]?.type === INPUT_TYPE.SINGLE_SELECT ||
                          initAttrForm.getFieldsValue().initAttr?.[index]?.type === INPUT_TYPE.MULTIPLE_SELECT) && (
                          <Form.Item
                            label='Các giá trị cho phép'
                            {...restField}
                            name={[name, 'options']}
                            rules={[{ required: true, message: 'Trường bắt buộc' }]}
                          >
                            <Select
                              placeholder='Các giá trị cho phép'
                              mode='tags'
                              style={{ width: '100%' }}
                              tokenSeparators={[',']}
                              open={false}
                            />
                          </Form.Item>
                        )}
                      </Col>

                      <Col span={24}>
                        <span
                          className='tw-float-right tw-text-blue-400 tw-cursor-pointer'
                          onClick={() => {
                            const newCollapsed = [...collapsed]
                            newCollapsed[index] = !newCollapsed[index]
                            setCollapsed(newCollapsed)
                          }}
                        >
                          {collapsed[index] ? 'Mở rộng' : 'Thu gọn'}
                        </span>
                      </Col>

                      {!collapsed[index] && (
                        <>
                          <Col span={24}>
                            {initAttrForm.getFieldsValue().initAttr?.[index]?.type === INPUT_TYPE.TEXT && (
                              <Form.Item label='Gợi ý ' {...restField} name={[name, 'suggestion']}>
                                <Select
                                  placeholder='Gợi ý'
                                  mode='tags'
                                  style={{ width: '100%' }}
                                  tokenSeparators={[',']}
                                  open={false}
                                />
                              </Form.Item>
                            )}
                          </Col>
                          <Col span={24}>
                            <Form.Item label='Mô tả' {...restField} name={[name, 'description']}>
                              <TextArea placeholder='Mô tả' />
                            </Form.Item>
                          </Col>
                        </>
                      )}

                      {index !== 0 && (
                        <div
                          className='dynamic-form-item-icon-close'
                          onClick={() => {
                            remove(name)
                            setCollapsed((prevState) => prevState.filter((item, idx) => idx !== index))
                          }}
                        >
                          <MinusCircleFilled className='tw-text-xl tw-text-red-600' />
                        </div>
                      )}
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      ghost
                      type='primary'
                      onClick={() => {
                        add()
                        setCollapsed((prevState) => [...prevState, true])
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm thuộc tính
                    </Button>
                  </Form.Item>
                </div>
              </>
            )
          }}
        </Form.List>

        <Divider />
        <Form.Item>
          <Space className='tw-float-right'>
            <Button htmlType='button' onClick={handleCancelModalInitAttr}>
              Quay lại
            </Button>
            <Button type='primary' htmlType='submit'>
              Tiếp tục
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalInitAttr
