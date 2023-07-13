/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Col, Input, List, Modal, Row, notification } from 'antd'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconStartSVG from '~/assets/svg/iconStart'
import IconUserDownSVG from '~/assets/svg/iconUserDown'
import IconUserUpSVG from '~/assets/svg/iconUserUp'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import {
  DataInfoDepartment,
  DataMemberRender,
  IDepartmentModal,
  ListDataUserGroup,
  updateUserRole
} from '~/types/department.interface'
import { ROlE_STORAGE } from '~/utils/Constant'

const { Search } = Input
const DepartmentMemberModal: React.FC<IDepartmentModal> = (props) => {
  const { onClose, onOk, showModal, typeModel, data } = props
  const { t } = useTranslation()
  const [initLoading, setInitLoading] = useState(false)
  const [listDataRender, setListDataRender] = useState<DataMemberRender>({
    listDataUp: [],
    listDataDown: [],
    listDataUpFilter: [], // sub-managers
    listDataDownFilter: [] // managers
  })

  const [dataInfoDepartment, setDataInfoDepartment] = useState<DataInfoDepartment>()

  const getDetpartmentsByCode = async (code: string) => {
    setInitLoading(true)
    try {
      const response = await HttpService.get(END_POINT_API.Department.getBaseInfo(code))
      if (response.status === 200) {
        console.log(response.data)
        setDataInfoDepartment(response.data)
        setListDataRender({
          listDataUp: [...response.data.subManagers],
          listDataDown: [...response.data.managers],
          listDataUpFilter: [...response.data.subManagers], // sub-managers
          listDataDownFilter: [...response.data.managers] // managers
        })
        setInitLoading(false)
      }
    } catch (error) {
      setInitLoading(false)
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
    try {
      let dataRole: ListDataUserGroup[] = []
      if (listDataRender.listDataUpFilter) {
        dataRole = [...listDataRender.listDataUpFilter]
      }
      if (listDataRender.listDataDownFilter) {
        dataRole = [...dataRole, ...listDataRender.listDataDownFilter]
      }
      const payload: updateUserRole = {
        groupCode: (dataInfoDepartment && dataInfoDepartment.code) || (data && data.code),
        updateRoles: dataRole.map((item) => {
          return {
            role: item.groupProfiles && item.groupProfiles[0].role,
            userName: item.userName
          }
        })
      }
      const response = await HttpService.post(END_POINT_API.Department.updateUserRole(), payload)
      if (response.status === 200) {
        notification.success({ message: 'Updating user from department success' })
        onOk()
      }
    } catch (error) {
      notification.error({ message: 'Error updating user from department' })
    }
  }

  const onSearch = (value: ChangeEvent<HTMLInputElement>) => {
    const valueFilter = value.target.value
    if (valueFilter) {
      setListDataRender((prew) => {
        return {
          ...prew,
          listDataUpFilter: prew?.listDataUp?.filter(
            (item) =>
              item.fullName.toLocaleLowerCase().includes(valueFilter.toLocaleLowerCase()) ||
              (item.userName && item.userName.toLocaleLowerCase().includes(valueFilter.toLocaleLowerCase()))
          ),
          listDataDownFilter: prew?.listDataDown?.filter(
            (item) =>
              item.fullName.toLocaleLowerCase().includes(valueFilter.toLocaleLowerCase()) ||
              (item.userName && item.userName.toLocaleLowerCase().includes(valueFilter.toLocaleLowerCase()))
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

  const onClickDown = (data: ListDataUserGroup) => {
    const listDataUp = listDataRender.listDataUp
    const listDataDown = listDataRender?.listDataDown
    let newListDataUp: ListDataUserGroup[] = []
    if (listDataUp) {
      newListDataUp = [...listDataUp]
    }
    if (listDataDown) {
      newListDataUp = [
        ...newListDataUp,
        ...listDataDown
          ?.filter((item: ListDataUserGroup) => item.userName === data.userName)
          .map((item) => {
            if (item.groupProfiles) {
              item.groupProfiles[0].role = ROlE_STORAGE.SUB_MANAGER
            }
            return item
          })
      ]
    }
    setListDataRender({
      ...listDataRender,
      listDataUpFilter: newListDataUp,
      listDataDownFilter: listDataRender?.listDataDown?.filter((item: ListDataUserGroup) => item.id !== data.id)
    })
  }

  const onClickUp = async (data: ListDataUserGroup) => {
    const listDataUp = listDataRender.listDataUp
    const listDataDown = listDataRender?.listDataDown
    let newListDataDown: ListDataUserGroup[] = []
    if (listDataUp) {
      newListDataDown = [
        ...listDataUp
          ?.filter((item: ListDataUserGroup) => item.userName === data.userName)
          .map((item) => {
            if (item.groupProfiles) {
              item.groupProfiles[0].role = ROlE_STORAGE.MANAGER
            }
            return item
          })
      ]
    }
    if (listDataDown) {
      newListDataDown = [...newListDataDown, ...listDataDown]
    }
    setListDataRender({
      ...listDataRender,
      listDataUpFilter: listDataRender?.listDataUp?.filter((item) => item.userName !== data.userName),
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
      title={data && data.name}
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
            renderItem={(item: ListDataUserGroup) => {
              return (
                <Row className='tw-my-[12px]'>
                  <Col span={3}>
                    <img
                      src={item.avatarBase64 ? `data:image/png;base64,${item.avatarBase64}` : ''}
                      className='tw-h-[50px] tw-w-[50px] tw-rounded-[50%]'
                    />
                  </Col>
                  <Col span={20}>
                    <h4 className='tw-font-normal tw-text-base tw-flex tw-items-center tw-gap-[5px]'>
                      {item.fullName}{' '}
                      {((item.groupProfiles && item.groupProfiles[0].role === ROlE_STORAGE.MANAGER) ||
                        (item.groupProfiles && item.groupProfiles[0].role === ROlE_STORAGE.SYSTEM_ADMIN)) && (
                        <IconStartSVG />
                      )}
                    </h4>
                    <p> {item.groupProfiles && item.groupProfiles[0].title}</p>
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
            renderItem={(item: ListDataUserGroup) => {
              return (
                <Row className='tw-my-[12px]'>
                  <Col span={3}>
                    <img
                      src={item.avatarBase64 ? `data:image/png;base64,${item.avatarBase64}` : ''}
                      className='tw-h-[50px] tw-w-[50px] tw-rounded-[50%]'
                    />
                  </Col>
                  <Col span={20}>
                    <h4 className='tw-font-normal tw-text-base tw-flex tw-items-center tw-gap-[5px]'>
                      {item.fullName}
                    </h4>
                    <p> {item.groupProfiles && item.groupProfiles[0].title} </p>
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
