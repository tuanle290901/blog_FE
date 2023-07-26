/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './index.scss'

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Space, Table, TableColumnsType, Tooltip } from 'antd'
import { ExpandableConfig } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import IconBackSVG from '~/assets/svg/iconback'
import CommonButton from '~/components/Button/CommonButton'
import { getListDepartments } from '~/stores/features/department/department.silce'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DataType, IDepartmentTitle, IModelState } from '~/types/department.interface'
import { ACTION_TYPE, hasPermissionAndGroup } from '~/utils/helper'

import { ROLE } from '~/constants/app.constant'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import DepartmentMemberModal from './DepartmentMemberModal'
import DepartmentModal from './DepartmentModal'

const Department: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { userInfo } = useUserInfo()
  const [valueSearch, setValueSearch] = useState<string>('')
  const listDataDepartments: DataType[] = useAppSelector((state: any) => state.department.listData)
  const isLoading = useAppSelector((state: any) => state.department.loading)
  const [dataRender, setDataRender] = useState<{
    listData: DataType[]
    listDataTitle: IDepartmentTitle[]
  }>({
    listData: listDataDepartments,
    listDataTitle: []
  })

  const [showModal, setShowModal] = useState<IModelState>({
    openModal: false,
    type: '',
    data: null,
    dataParent: []
  })
  const [useSelect, setUseSelect] = useState<DataType>()

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const data: DataType[] = getListDataByNameOrCodeOrEmail(listDataDepartments, e.target.value)
      setDataRender({
        listData: data,
        listDataTitle: [
          {
            name: data[0]?.name,
            code: data[0]?.code
          }
        ]
      })
      setValueSearch(e.target.value)
    } else {
      setDataRender({
        listData: listDataDepartments,
        listDataTitle: [
          {
            name: listDataDepartments[0]?.name,
            code: listDataDepartments[0]?.code
          }
        ]
      })
      setValueSearch('')
    }
  }

  const renderTreeRows = (nodes: DataType[], isLastLevel = false) => {
    return nodes.map((node) => {
      const { code, name, contactEmail, address, children, parentCode, parentName, contactPhoneNumber, publishDate } =
        node
      const hasChildren = children && children.length > 0
      const row = {
        code,
        name,
        contactEmail,
        address,
        children,
        parentCode,
        parentName,
        contactPhoneNumber,
        publishDate
      }
      if (hasChildren) {
        row.children = renderTreeRows(children, !isLastLevel)
      }
      return row
    })
  }

  const expandableConfig: ExpandableConfig<DataType> = {
    expandIcon: ({ expanded, onExpand, record }) => {
      if (record.children && record.children.length === 0) {
        return <span className='tw-ml-[10px]'> </span>
      }
      return (
        <span
          className={`ant-table-row-expand-icon ${
            expanded ? 'ant-table-row-expand-icon-expanded' : 'ant-table-row-expand-icon-collapsed'
          }`}
          onClick={(e) => onExpand!(record, e)}
        />
      )
    },
    defaultExpandAllRows: true
  }

  function getListDataByKey(data: DataType[], targetKey: any) {
    const filteredData: DataType[] = []

    function getListDataByKey(listData: DataType[]) {
      for (const item of listData) {
        if (item.code === targetKey.code) {
          filteredData.push(item)
          break
        } else if (item.children && item.children.length > 0) {
          getListDataByKey(item.children)
        }
      }
    }
    getListDataByKey(data)
    return filteredData
  }

  const getListDataByNameOrCodeOrEmail = useCallback((data: DataType[], keyword: string): DataType[] => {
    const filteredData: DataType[] = []
    function getListDataByKey(listData: DataType[]) {
      for (const item of listData) {
        if (
          item.code.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) ||
          item.name?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
        ) {
          filteredData.push(item)
          break
        } else if (item.children && item.children.length > 0) {
          getListDataByKey(item.children)
        }
      }
    }
    getListDataByKey(data)
    return filteredData
  }, [])

  const getParentByKey = useCallback((listData: DataType[], targetKey: IDepartmentTitle): IDepartmentTitle[] => {
    const parentList: IDepartmentTitle[] = []
    if (targetKey) {
      for (const item of listData) {
        if (item.code === targetKey.code) {
          parentList.push({ code: item.code, name: item.name })
        } else {
          if (item.children && item.children.length > 0) {
            const child = item.children.find((childItem: DataType) => childItem.code === targetKey.code)
            if (child) {
              parentList.push({ code: item.code, name: item.name, parentCode: item?.parentCode })
              parentList.push({ code: targetKey.code, name: targetKey.name, parentCode: targetKey?.parentCode })
              break
            } else {
              const result = getParentByKey(item.children, targetKey)
              if (result.length > 0) {
                parentList.push({ code: item.code, name: item.name, parentCode: item?.parentCode })
                parentList.push(...result)
                break
              }
            }
          }
        }
      }
    }
    return parentList
  }, [])

  useEffect(() => {
    if (useSelect) {
      const listDataTitle: IDepartmentTitle[] = getParentByKey(listDataDepartments, useSelect)
      setDataRender({
        listData: [useSelect],
        listDataTitle: [...listDataTitle]
      })
    } else {
      setDataRender({
        listData: listDataDepartments,
        listDataTitle: [
          {
            name: listDataDepartments[0]?.name,
            code: listDataDepartments[0]?.code,
            parentCode: listDataDepartments[0]?.parentCode
          }
        ]
      })
    }
  }, [useSelect, listDataDepartments, getParentByKey])

  useEffect(() => {
    if (isLoading === false && listDataDepartments.length > 0) {
      const dataTitle = [
        {
          code: listDataDepartments[0].code,
          name: listDataDepartments[0].name,
          parentCode: listDataDepartments[0]?.parentCode
        }
      ]
      setDataRender({
        listData: listDataDepartments,
        listDataTitle: dataTitle
      })
    }
  }, [listDataDepartments, isLoading])

  useEffect(() => {
    const promise = dispatch(getListDepartments())
    if (listDataDepartments) {
      setDataRender({
        listData: listDataDepartments,
        listDataTitle: [
          {
            code: listDataDepartments[0]?.code,
            name: listDataDepartments[0]?.name,
            parentCode: listDataDepartments[0]?.parentCode
          }
        ]
      })
    }
    return () => {
      promise.abort()
    }
  }, [])

  const onDelete = (record: DataType) => {
    // console.log(record.name)
  }

  const columns = useMemo(() => {
    const dataRenderColumns: TableColumnsType<DataType> = [
      {
        title: `${t('department.name')}`,
        dataIndex: 'name',
        key: 'name',
        width: '250px',
        render: (value: string, record: DataType) => {
          return (
            <span
              onClick={() => {
                setUseSelect(record)
              }}
            >
              {value}
            </span>
          )
        },
        ellipsis: true
      },
      {
        title: `${t('department.code')}`,
        dataIndex: 'code',
        key: 'code',
        width: '100px',
        ellipsis: true
      },
      {
        title: `${t('department.address')}`,
        dataIndex: 'address',
        key: 'address',
        width: '250px',
        ellipsis: true
      },
      {
        title: `${t('department.contactPhoneNumber')}`,
        dataIndex: 'contactPhoneNumber',
        key: 'contactPhoneNumber',
        width: '150px',
        ellipsis: true
      },
      {
        title: `${t('department.contactEmail')}`,
        dataIndex: 'contactEmail',
        key: 'contactEmail',
        width: '150px',
        ellipsis: true
      },
      {
        title: `${t('department.publishDate')}`,
        dataIndex: 'publishDate',
        key: 'publishDate',
        width: '150px',
        ellipsis: true,
        render: (value: string) => {
          if (value) {
            const date = dayjs(value).format('DD/MM/YYYY')
            return date
          }
        }
      }
    ]

    // if (hasPermissionAndGroup([ROLE.MANAGER, ROLE.SUB_MANAGER], userInfo?.groupProfiles, dataRender.listDataTitle)) {
    //   dataRenderColumns.push({
    //     title: () => {
    //       return <div className='tw-text-center'>{`${t('department.actions')}`}</div>
    //     },
    //     key: 'actions',
    //     align: 'center',
    //     width: '120px',
    //     render: (text: string, record: DataType) => (
    //       <Tooltip placement='topLeft' title={t('department.tooltip.mmenber')}>
    //         <Button
    //           size='small'
    //           onClick={() => {
    //             setShowModal({
    //               openModal: true,
    //               type: ACTION_TYPE.View,
    //               data: record,
    //               dataParent: dataRender.listDataTitle
    //             })
    //           }}
    //           icon={<UserOutlined className='tw-text-orange-600' />}
    //         />
    //       </Tooltip>
    //     )
    //   })
    // }

    if (hasPermissionAndGroup([ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles, dataRender.listDataTitle)) {
      dataRenderColumns.push({
        title: () => {
          return <div className='tw-text-center'>{`${t('department.actions')}`}</div>
        },
        key: 'actions',
        align: 'center',
        width: '120px',
        render: (text: string, record: DataType) => (
          <Space size='small'>
            <Tooltip placement='topLeft' title={t('department.tooltip.update')}>
              <Button
                size='small'
                onClick={() => {
                  setShowModal({
                    openModal: true,
                    type: ACTION_TYPE.Updated,
                    data: record,
                    dataParent: dataRender.listDataTitle
                  })
                }}
                icon={<EditOutlined className='tw-text-blue-600' />}
              />
            </Tooltip>
            {/* <Tooltip placement='topLeft' title={t('department.tooltip.mmenber')}>
              <Button
                size='small'
                onClick={() => {
                  setShowModal({
                    openModal: true,
                    type: ACTION_TYPE.View,
                    data: record,
                    dataParent: dataRender.listDataTitle
                  })
                }}
                icon={<UserOutlined className='tw-text-orange-600' />}
              />
            </Tooltip> */}
            <Tooltip placement='topLeft' title={t('department.tooltip.delete')}>
              <Button
                size='small'
                onClick={() => {
                  onDelete(record)
                }}
                icon={<DeleteOutlined className='tw-text-red-600' />}
              />
            </Tooltip>
          </Space>
        )
      })
    }
    return dataRenderColumns
  }, [setShowModal, onDelete, t, hasPermissionAndGroup])

  const onRendered = async (item: DataType) => {
    if (item.code === listDataDepartments[0].code) {
      await setDataRender({
        listData: listDataDepartments,
        listDataTitle: [
          {
            name: listDataDepartments[0].name,
            code: listDataDepartments[0].code
          }
        ]
      })
    } else {
      const listDataTitle: IDepartmentTitle[] = getParentByKey(listDataDepartments, item)
      await setDataRender({
        listData: await getListDataByKey(listDataDepartments, item),
        listDataTitle: listDataTitle
      })
    }
  }

  const onBackPageSize = async () => {
    if (dataRender.listDataTitle.length > 1) {
      const listDataTitle: IDepartmentTitle[] = getParentByKey(
        listDataDepartments,
        dataRender.listDataTitle[dataRender.listDataTitle.length - 2]
      )
      const data = await getListDataByKey(
        listDataDepartments,
        dataRender.listDataTitle[dataRender.listDataTitle.length - 2]
      )
      await setDataRender({
        listData: data,
        listDataTitle: listDataTitle
      })
      setValueSearch('')
    } else if (dataRender.listDataTitle.length === 1) {
      setValueSearch('')
      navigate(-1)
    } else {
      setValueSearch('')
      navigate(-1)
    }
  }

  const onCancelModel = async () => {
    await setShowModal({
      openModal: false,
      type: '',
      data: null,
      dataParent: []
    })
  }

  useEffect(() => {
    if (valueSearch) {
      const data: DataType[] = getListDataByNameOrCodeOrEmail(listDataDepartments, valueSearch)
      setDataRender({
        listData: data,
        listDataTitle: [
          {
            name: data[0]?.name,
            code: data[0]?.code
          }
        ]
      })
    }
  }, [valueSearch])

  return (
    <div className='user-list  tw-h-[calc(100%-48px)]  tw-bg-white page-department tw-m-6 tw-p-5'>
      <Row className='tw-w-100'>
        <Button
          size='large'
          className='tw-mr-[15px]'
          onClick={() => onBackPageSize()}
          icon={<IconBackSVG width={11} height={16} fill='' />}
        />
        <h1 className='tw-flex tw-items-center tw-justify-center tw-font-medium tw-text-3xl'>
          {dataRender?.listDataTitle.map((item: any, index) => {
            return (
              <span
                key={item.code}
                onClick={() => {
                  onRendered(item)
                }}
                className='tw-ml-[5px] pointer'
              >
                {` ${item.name} ${dataRender?.listDataTitle.length - 1 !== index ? ' ->  ' : ' '}`}
              </span>
            )
          })}
        </h1>
      </Row>
      <Row className='tw-w-100 tw-flex tw-justify-start tw-my-[20px]'>
        <Col span={12}>
          <CommonButton
            loading={false}
            classNameProps={`btn-add ${
              dataRender.listDataTitle &&
              hasPermissionAndGroup([ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles, dataRender.listDataTitle) === false
                ? 'tw-hidden'
                : 'tw-block'
            }`}
            typeProps={{
              type: 'primary',
              size: 'middle'
            }}
            onClick={() => {
              setShowModal({
                openModal: !showModal.openModal,
                type: ACTION_TYPE.Created,
                data: null,
                dataParent: dataRender.listDataTitle
              })
            }}
            icon={<PlusOutlined className='tw-text-600' />}
            title={`${t('department.add')}`}
          />
        </Col>
        <Col span={12} className='tw-flex tw-justify-end'>
          <Input.Search
            placeholder={`${t('department.pleaseEnterSearch')}`}
            onChange={(value) => onSearch(value)}
            style={{ width: '30%' }}
            value={valueSearch}
          />
        </Col>
      </Row>
      {showModal.type !== ACTION_TYPE.View ? (
        <DepartmentModal
          onClose={() => onCancelModel()}
          onOk={() => onCancelModel()}
          showModal={showModal.openModal}
          typeModel={showModal.type}
          data={showModal.data}
          dataParent={showModal.dataParent}
        />
      ) : (
        <DepartmentMemberModal
          onClose={() => onCancelModel()}
          onOk={() => onCancelModel()}
          showModal={showModal.openModal}
          typeModel={showModal.type}
          data={showModal.data}
          dataParent={[]}
        />
      )}
      <Row className='tw-w-100' gutter={[12, 12]}>
        <Table
          dataSource={renderTreeRows(dataRender.listData, true)}
          columns={columns}
          loading={isLoading}
          expandable={expandableConfig}
          pagination={false}
          style={{ width: '100%' }}
          className='pointer'
          scroll={{ y: 'calc(100vh - 360px)' }}
          rowKey={(record: DataType) => record.code}
        />
      </Row>
    </div>
  )
}

export default Department
