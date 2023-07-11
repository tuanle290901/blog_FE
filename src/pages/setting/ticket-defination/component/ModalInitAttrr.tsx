/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MinusCircleFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Row, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import type { FC } from 'react'
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
  return (
    <Modal
      title='Khởi tạo thuộc tính'
      width='40%'
      style={{ minWidth: 500, top: 50 }}
      open={isModalInitAttrOpen}
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
            console.log(fields)
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
                            <Input placeholder='Các giá trị cho phép' />
                          </Form.Item>
                        )}
                      </Col>
                      <Col span={24}>
                        {initAttrForm.getFieldsValue().initAttr?.[index]?.type === INPUT_TYPE.TEXT && (
                          <Form.Item label='Gợi ý ' {...restField} name={[name, 'suggestion']}>
                            <Input placeholder='Gợi ý' />
                          </Form.Item>
                        )}
                      </Col>
                      <Col span={24}>
                        <Form.Item label='Mô tả' {...restField} name={[name, 'description']}>
                          <TextArea placeholder='Mô tả' />
                        </Form.Item>
                      </Col>
                      {index !== 0 && (
                        <div className='dynamic-form-item-icon-close' onClick={() => remove(name)}>
                          <MinusCircleFilled className='tw-text-xl tw-text-red-600' />
                        </div>
                      )}
                    </Row>
                  ))}
                  <Form.Item>
                    <Button ghost type='primary' onClick={() => add()} block icon={<PlusOutlined />}>
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
          <Button type='primary' htmlType='submit' className='tw-float-right'>
            Tiếp tục
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalInitAttr
