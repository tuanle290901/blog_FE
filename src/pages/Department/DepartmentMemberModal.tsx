/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, Col, Input, List, Modal, Row, notification } from 'antd'
import { AxiosResponse, HttpStatusCode } from 'axios'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconNoData from '~/assets/svg/iconNoData'
import IconStartSVG from '~/assets/svg/iconStart'
import IconUserDownSVG from '~/assets/svg/iconUserDown'
import IconUserUpSVG from '~/assets/svg/iconUserUp'
import HttpService from '~/config/api'
import { END_POINT_API } from '~/config/endpointapi'
import { useAppSelector } from '~/stores/hook'
import {
  DataInfoDepartment,
  DataMemberRender,
  IDepartmentModal,
  ListDataUserGroup,
  updateUserRole
} from '~/types/department.interface'
import { ErrorResponse } from '~/types/error-response.interface'
import { ROlE_STORAGE } from '~/utils/Constant'

const DepartmentMemberModal: React.FC<IDepartmentModal> = (props) => {
  const { onClose, onOk, showModal, data } = props
  const { t } = useTranslation()
  const prevDataRef = useRef<any>(null)
  const prevShowModalRef = useRef<any>(null)
  const [initLoading, setInitLoading] = useState(false)
  const userTitle = useAppSelector((state) => state.masterData.listUserTitle)
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
    if (data && showModal === true && (prevDataRef.current !== data || prevShowModalRef.current !== showModal)) {
      getDetpartmentsByCode(data.code)
    }
    prevDataRef.current = data
    prevShowModalRef.current = showModal
  }, [data, showModal])

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
      const response: AxiosResponse<any, any> = await HttpService.put(
        END_POINT_API.Department.updateUserRole(),
        payload
      )
      if (response.status === HttpStatusCode.Ok) {
        notification.success({ message: response?.data?.message || 'Cập nhật thành công' })
        onOk()
      }
    } catch (error: any) {
      const response = error.data as ErrorResponse
      notification.error({ message: `${response?.message}` || 'Error updating user from department' })
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
              (item.fullName && item.fullName.toLocaleLowerCase().includes(valueFilter?.toLocaleLowerCase())) ||
              (item.userName && item.userName.toLocaleLowerCase().includes(valueFilter?.toLocaleLowerCase()))
          ),
          listDataDownFilter: prew?.listDataDown?.filter(
            (item) =>
              (item.fullName && item.fullName.toLocaleLowerCase().includes(valueFilter?.toLocaleLowerCase())) ||
              (item.userName && item.userName.toLocaleLowerCase().includes(valueFilter?.toLocaleLowerCase()))
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
      okText={`${t('common.save')}`}
      cancelText={`${t('common.cancel')}`}
      maskClosable={false}
      className='modal-content-member'
    >
      <Input.Search placeholder={`${t('department.pleaseEnterSearch')}`} onChange={(e) => onSearch(e)} enterButton />
      <div className='tw-my-[10px]'>
        <h4 className='tw-font-medium tw-text-base tw-mb-[5px]'> {`${t('department.manager')}`} </h4>
        <div className='tw-p-[10px] tw-h-[200px] tw-overflow-y-auto'>
          <List
            loading={initLoading}
            itemLayout='horizontal'
            dataSource={listDataRender.listDataDownFilter}
            locale={{
              emptyText: (
                <div>
                  <IconNoData width={64} height={41} />
                  <div>{t('noData')}</div>
                </div>
              )
            }}
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
                    <p>
                      {item.groupProfiles &&
                        item?.groupProfiles.length &&
                        userTitle.find(
                          (dataTitle) =>
                            item?.groupProfiles?.find((dataG) => data?.code === dataG.groupCode)?.title ===
                            dataTitle.code
                        )?.nameTitle}{' '}
                    </p>
                  </Col>
                  <Col span={1} className=' tw-justify-end tw-text-center tw-m-auto'>
                    <Button
                      size='small'
                      onClick={() => {
                        onClickDown(item)
                      }}
                      icon={<IconUserDownSVG className='tw-text-600' />}
                    />
                  </Col>
                </Row>
              )
            }}
          />
        </div>
      </div>
      <div className='tw-my-[10px]'>
        <h4 className='tw-font-medium tw-text-base tw-mb-[5px]'> {`${t('department.menber')}`} </h4>
        <div className='tw-p-[10px] tw-h-[200px] tw-overflow-y-auto'>
          <List
            loading={initLoading}
            itemLayout='horizontal'
            dataSource={listDataRender.listDataUpFilter}
            locale={{
              emptyText: (
                <div>
                  <IconNoData width={64} height={41} />
                  <div>{t('noData')}</div>
                </div>
              )
            }}
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
                    <p>
                      {item.groupProfiles &&
                        item?.groupProfiles.length &&
                        userTitle.find(
                          (dataTitle) =>
                            item?.groupProfiles?.find((dataG) => data?.code === dataG.groupCode)?.title ===
                            dataTitle.code
                        )?.nameTitle}{' '}
                    </p>
                  </Col>
                  <Col span={1} className='tw-justify-end tw-text-center tw-m-auto'>
                    <Button
                      size='small'
                      onClick={() => {
                        onClickUp(item)
                      }}
                      icon={<IconUserUpSVG />}
                    />
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
