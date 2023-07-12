/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Col, Form, Input, List, Modal, Row } from 'antd'
import React, { useEffect, useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import IconStartSVG from '~/assets/svg/iconStart'
import IconUserDownSVG from '~/assets/svg/iconUserDown'
import IconUserUpSVG from '~/assets/svg/iconUserUp'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { DataMemberRender, IDepartmentModal, ListDataType } from '~/types/department.interface'

const { Search } = Input
const DepartmentMemberModal: React.FC<IDepartmentModal> = (props) => {
  const { onClose, onOk, showModal, typeModel, data } = props
  const { t } = useTranslation()
  const [initLoading, setInitLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const dataList = [
    { id: 1, name: 'dev', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' },
    { id: 2, name: 'dev-1', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' },
    { id: 3, name: 'dev-1', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' },
    { id: 4, name: 'dev-1', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' }
  ]
  const dataList1 = [
    { id: 5, name: 'dev', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' },
    { id: 6, name: 'dev-1', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' },
    { id: 7, name: 'dev-1', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' },
    { id: 8, name: 'dev-1', email: 'a@gmail.com', picture: 'url', loading: false, role: 'MANAGER' }
  ]
  // const [data, setData] = useState<DataType[]>([]);
  const [listDataRender, setListDataRender] = useState<DataMemberRender>({
    listDataUp: dataList,
    listDataDown: dataList1,
    listDataUpFilter: dataList,
    listDataDownFilter: dataList1
  })

  const getDetpartmentsByCode = async (code: string) => {
    try {
      const response = await HttpService.get(END_POINT_API.Department.getByCode(code))
      if (response.status === 200) {
        setListDataRender({
          listDataUp: [],
          listDataDown: [],
          listDataUpFilter: [],
          listDataDownFilter: []
        })
      }
    } catch (error) {
      setListDataRender({
        listDataUp: [],
        listDataDown: [],
        listDataUpFilter: [],
        listDataDownFilter: []
      })
    }
  }

  useEffect(() => {
    if (data) {
      getDetpartmentsByCode(data.code)
    }
  }, [data])
  const onSaveData = async () => {
    onOk()
  }

  // useEffect(() => {
  //   if (data) {
  //   }
  // }, [])

  const onSearch = (value: ChangeEvent<HTMLInputElement>) => {
    const valueFilter = value.target.value
    if (valueFilter) {
      setListDataRender((prew) => {
        return {
          ...prew,
          listDataUpFilter: prew?.listDataUp?.filter((item) =>
            item.name.toLocaleLowerCase().includes(valueFilter.toLocaleLowerCase())
          ),
          listDataDownFilter: prew?.listDataDown?.filter((item) =>
            item.name.toLocaleLowerCase().includes(valueFilter.toLocaleLowerCase())
          )
        }
      })
    } else {
      setListDataRender((prev: DataMemberRender) => ({
        ...prev,
        listDataUpFilter: prev.listDataUp,
        listDataDownFilter: prev.listDataDown
      }))
    }
  }

  const onClickDown = (data: ListDataType) => {
    const listDataUp = listDataRender.listDataUp
    const listDataDown = listDataRender?.listDataDown
    let newListDataUp: ListDataType[] = []
    if (listDataUp) {
      newListDataUp = [...listDataUp]
    }
    if (listDataDown) {
      newListDataUp = [...newListDataUp, ...listDataDown?.filter((item: ListDataType) => item.id === data.id)]
    }
    setListDataRender({
      ...listDataRender,
      listDataUpFilter: newListDataUp,
      listDataDownFilter: listDataRender?.listDataDown?.filter((item: ListDataType) => item.id !== data.id)
    })
  }

  const onClickUp = async (data: ListDataType) => {
    const listDataUp = listDataRender.listDataUp
    const listDataDown = listDataRender?.listDataDown
    let newListDataDown: ListDataType[] = []
    if (listDataUp) {
      newListDataDown = [...listDataUp?.filter((item: ListDataType) => item.id === data.id)]
    }
    if (listDataDown) {
      newListDataDown = [...newListDataDown, ...listDataDown]
    }
    setListDataRender({
      ...listDataRender,
      listDataUpFilter: listDataRender?.listDataUp?.filter((item) => item.id !== data.id),
      listDataDownFilter: newListDataDown
    })
  }

  const onCancel = async () => {
    setListDataRender((prev: DataMemberRender) => ({
      ...prev,
      listDataUpFilter: prev.listDataUp,
      listDataDownFilter: prev.listDataDown
    }))
    await onClose()
  }

  return (
    <Modal
      open={showModal}
      forceRender
      closable
      onCancel={() => onCancel()}
      onOk={() => onSaveData()}
      title={'Công ty ---'}
      maskClosable={false}
      className='modal-content-member'
    >
      <Search placeholder='input search text' onChange={onSearch} enterButton />
      <div className='tw-my-[10px]'>
        <h4 className='tw-font-medium tw-text-base tw-mb-[5px]'> Quản lý </h4>
        <div className='tw-p-[10px] tw-h-[200px] tw-overflow-y-auto'>
          <List
            loading={initLoading}
            itemLayout='horizontal'
            dataSource={listDataRender.listDataDownFilter}
            renderItem={(item: ListDataType, index: number) => {
              return (
                <Row className='tw-my-[12px]'>
                  <Col span={3}>
                    <img
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                      className='tw-h-[50px] tw-w-[50px] tw-rounded-[50%]'
                    />
                  </Col>
                  <Col span={20}>
                    <h4 className='tw-font-normal tw-text-base tw-flex tw-items-center tw-gap-[5px]'>
                      {item.name} <IconStartSVG />
                    </h4>
                    <p> mô tả phần nào đấy </p>
                  </Col>
                  <Col span={1} className='tw-flex tw-justify-end'>
                    <span
                      className='tw-flex tw-m-auto'
                      onClick={() => {
                        onClickDown(item)
                      }}
                    >
                      <IconUserDownSVG />
                    </span>
                  </Col>
                </Row>
              )
            }}
          />
        </div>
      </div>
      <div className='tw-my-[10px]'>
        <h4 className='tw-font-medium tw-text-base tw-mb-[5px]'> Thành viên </h4>
        <div className='tw-p-[10px] tw-h-[200px] tw-overflow-y-auto'>
          <List
            loading={initLoading}
            itemLayout='horizontal'
            dataSource={listDataRender.listDataUpFilter}
            renderItem={(item: ListDataType, index: number) => {
              return (
                <Row className='tw-my-[12px]'>
                  <Col span={3}>
                    <img
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                      className='tw-h-[50px] tw-w-[50px] tw-rounded-[50%]'
                    />
                  </Col>
                  <Col span={20}>
                    <h4 className='tw-font-normal tw-text-base tw-flex tw-items-center tw-gap-[5px]'>
                      {item.name} <IconStartSVG />
                    </h4>
                    <p> mô tả phần nào đấy </p>
                  </Col>
                  <Col span={1} className='tw-flex tw-justify-end'>
                    <span
                      className='tw-flex tw-m-auto'
                      onClick={() => {
                        onClickUp(item)
                      }}
                    >
                      <IconUserUpSVG />
                    </span>
                  </Col>
                </Row>
              )
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default DepartmentMemberModal
