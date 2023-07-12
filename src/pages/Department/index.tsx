/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './index.scss'

import { PlusOutlined } from '@ant-design/icons'
import { Col, Input, Row, Space, Table, Tooltip } from 'antd'
import { ExpandableConfig, Key } from 'antd/es/table/interface'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import IconBackSVG from '~/assets/svg/iconback'
import IconDeleteSVG from '~/assets/svg/iconDelete'
import IconEditSVG from '~/assets/svg/iconEdit'
import IconTeamSVG from '~/assets/svg/iconTeam'
import CommonButton from '~/components/Button/CommonButton'
import CommondTable from '~/components/Table/CommonTable'
import { getListDepartments } from '~/stores/features/department/department.silce'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DataType, IDepartmentTitle, IModelState } from '~/types/department.interface'
import { ACTION_TYPE } from '~/utils/helper'

import DepartmentMemberModal from './DepartmentMemberModal'
import DepartmentModal from './DepartmentModal'

const { Search } = Input
const Department: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const listDataDepartments: DataType[] = useAppSelector((state) => state.department.listData)
  const isLoading = useAppSelector((state) => state.department.loading)
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

  const onSearch = (value: string) => {
    if (value) {
      const data: DataType[] = getListDataByNameOrCodeOrEmail(listDataDepartments, value)
      setDataRender({
        listData: data,
        listDataTitle: [
          {
            name: data[0]?.name,
            code: data[0]?.code
          }
        ]
      })
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
    }
  }

  const renderTreeRows = (nodes: DataType[], isLastLevel = false) => {
    return nodes.map((node) => {
      const { code, name, contactEmail, address, children, parentCode, parentName, contactPhoneNumber } = node
      const hasChildren = children && children.length > 0
      const row = {
        code,
        name,
        contactEmail,
        address,
        children,
        parentCode,
        parentName,
        contactPhoneNumber
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
        return null
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

  function getListDataByNameOrCodeOrEmail(data: DataType[], keyword: string) {
    const filteredData: DataType[] = []

    function getListDataByKey(listData: DataType[]) {
      for (const item of listData) {
        if (item.code.includes(keyword) || item.name?.includes(keyword)) {
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
  const getParentByKey = (listData: DataType[], targetKey: IDepartmentTitle) => {
    const parentList: IDepartmentTitle[] = []
    if (targetKey) {
      for (const item of listData) {
        if (item.children && item.children.length > 0) {
          const child = item.children.find((childItem: DataType) => childItem.code === targetKey.code)
          if (child) {
            parentList.push({ code: item.code, name: item.name })
            parentList.push({ code: targetKey.code, name: targetKey.name })
            break
          } else {
            const result = getParentByKey(item.children, targetKey)
            if (result.length > 0) {
              parentList.push({ code: item.code, name: item.name })
              parentList.push(...result)
              break
            }
          }
        }
      }
    }
    return parentList
  }

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
            code: listDataDepartments[0]?.code
          }
        ]
      })
    }
  }, [useSelect, listDataDepartments])

  useEffect(() => {
    if (isLoading === false && listDataDepartments.length > 0) {
      const dataTitle = [
        {
          code: listDataDepartments[0].code,
          name: listDataDepartments[0].name
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
            name: listDataDepartments[0]?.name
          }
        ]
      })
    }
    return () => {
      promise.abort()
    }
  }, [])

  const onDelete = (record: DataType) => {
    console.log(record.name)
  }

  const columns = useMemo(() => {
    const dataRenderColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
        }
      },
      {
        title: 'code',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: 'address',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'contactPhoneNumber',
        dataIndex: 'contactPhoneNumber',
        key: 'contactPhoneNumber'
      },
      {
        title: 'contactEmail',
        dataIndex: 'contactEmail',
        key: 'contactEmail'
      },
      {
        title: 'publishDate',
        dataIndex: 'publishDate',
        key: 'publishDate'
      },
      {
        title: () => {
          return <div className='tw-text-center'>Actions</div>
        },
        key: 'actions',
        width: 200,
        className: 'tw-text-center',
        render: (text: string, record: DataType) => (
          <Space size='middle'>
            <Tooltip title={t('edit')}>
              <span
                onClick={() => {
                  setShowModal({
                    openModal: true,
                    type: ACTION_TYPE.Updated,
                    data: record,
                    dataParent: dataRender.listDataTitle
                  })
                }}
              >
                <IconEditSVG width={21} height={23} fill='' />
              </span>
            </Tooltip>
            <Tooltip title={t('team')}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setShowModal({
                    openModal: true,
                    type: ACTION_TYPE.View,
                    data: record,
                    dataParent: dataRender.listDataTitle
                  })
                }}
              >
                <span>
                  <IconTeamSVG width={21} height={23} fill='' />
                </span>
              </div>
            </Tooltip>
            <Tooltip title={t('delete')}>
              {/* <Popconfirm
            title={t('xóa')}
            description={t('xóa')}
            onConfirm={() => {
              console.log('â')
              onDelete(record)
            }}
            okText={t('delete')}
            cancelText={t('cancel')}
          > */}
              <span
                onClick={() => {
                  onDelete(record)
                }}
              >
                <IconDeleteSVG width={21} height={23} fill='' />
              </span>
              {/* </Popconfirm> */}
            </Tooltip>
          </Space>
        )
      }
    ]
    return dataRenderColumns
  }, [setShowModal, onDelete])

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
        dataRender.listDataTitle[dataRender.listDataTitle.length - 1]
      )
      await setDataRender({
        listData: await getListDataByKey(
          listDataDepartments,
          dataRender.listDataTitle[dataRender.listDataTitle.length - 1]
        ),
        listDataTitle: listDataTitle
      })
    } else if (dataRender.listDataTitle.length === 1) {
      await setDataRender({
        listData: listDataDepartments,
        listDataTitle: [
          {
            code: listDataDepartments[0].code,
            name: listDataDepartments[0]?.name
          }
        ]
      })
    } else {
      window.history.back()
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

  return (
    <div className='tw-p-[20px] tw-bg-white page-department'>
      <Row className='tw-w-100'>
        <div
          className='tw-cursor-pointer tw-w-[42px] tw-h-[42px] tw-rounded-sm tw-border-solid 
          tw-border-[1px] tw-border-[#d9d9d9] tw-flex tw-items-center tw-justify-center tw-mr-[15px]'
          onClick={() => {
            onBackPageSize()
          }}
        >
          <IconBackSVG width={11} height={16} fill='' />
        </div>
        <h1 className='tw-flex tw-items-center tw-justify-center tw-font-medium tw-text-3xl'>
          {dataRender?.listDataTitle.map((item: any, index) => {
            return (
              <span
                key={item.code}
                onClick={() => {
                  onRendered(item)
                }}
              >
                {`${item.name} ${dataRender?.listDataTitle.length - 1 !== index ? '->' : ''}`}
              </span>
            )
          })}
        </h1>
      </Row>
      <Row className='tw-w-100 tw-flex tw-justify-end tw-my-[20px]'>
        <Col span={12}>
          <CommonButton
            loading={false}
            classNameProps='btn-add'
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
            icon={<PlusOutlined />}
            title={'add'}
          />
        </Col>
        <Col span={12} className='tw-flex tw-justify-end'>
          <Search placeholder='input search text' onSearch={onSearch} style={{ width: '30%' }} />
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
          expandable={expandableConfig}
          pagination={false}
          style={{ width: '100%' }}
          scroll={{ y: '650px' }}
          rowKey={(record: DataType) => record.code}
        />
      </Row>
    </div>
  )
}

export default Department
