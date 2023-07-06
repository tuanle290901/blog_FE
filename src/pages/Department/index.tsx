/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PlusOutlined } from '@ant-design/icons'
import { Col, Input, Popconfirm, Row, Space, Tooltip } from 'antd'
import Table from 'antd/es/table'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import IconDeleteSVG from '~/assets/svg/iconDelete'
import IconEditSVG from '~/assets/svg/iconEdit'
import IconTeamSVG from '~/assets/svg/iconTeam'
import IconBackSVG from '~/assets/svg/iconback'
import CommonButton from '~/components/Button/CommonButton'
import { ACTION_TYPE } from '~/utils/helper'
import './index.scss'
import DepartmentModal from './DepartmentModal'
import CommondTable from '~/components/Table/CommonTable'
import DepartmentMemberModal from './DepartmentMemberModal'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  description: string
}

const { Search } = Input
const Department: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState<{
    openModal: boolean
    type: string
    data: any
  }>({
    openModal: false,
    type: '',
    data: null
  })

  const onSearch = (value: string) => {
    console.log(value)
  }
  const data = [
    {
      key: 1,
      name: 'Node 1',
      age: 30,
      address: '123 Main St',
      children: [
        {
          key: 2,
          name: 'Node 1.1',
          age: 25,
          address: '456 Park Ave',
          parentWorkUnitCode: 1,
          parentWorkUnitName: 'Node 1',
          children: [
            {
              key: 3,
              name: 'Node 1.1.1',
              age: 20,
              address: '789 Elm St',
              children: [],
              parentWorkUnitCode: 2,
              parentWorkUnitName: 'Node 1.1'
            },
            {
              key: 4,
              name: 'Node 1.1.2',
              age: 35,
              address: '321 Oak St',
              children: [],
              parentWorkUnitCode: 2,
              parentWorkUnitName: 'Node 1.1'
            }
          ]
        },
        {
          key: 5,
          name: 'Node 1.2',
          age: 40,
          address: '987 Pine St',
          children: [],
          parentWorkUnitCode: 1,
          parentWorkUnitName: 'Node 1'
        }
      ]
    }
  ]

  const [dataRender, setDataRender] = useState({
    listData: data,
    listDataTitle: []
  })
  const renderTreeRows = (nodes: any[]) => {
    return nodes.map((node) => {
      const { key, name, age, address, children, parentWorkUnitCode, parentWorkUnitName } = node
      const hasChildren = children && children.length > 0

      const row = {
        key,
        name,
        age,
        address,
        children,
        parentWorkUnitCode,
        parentWorkUnitName
      }

      if (hasChildren) {
        row.children = renderTreeRows(children)
      }

      return row
    })
  }
  const treeData = renderTreeRows(dataRender.listData)

  const [useSelect, setUseSelect] = useState<any>(null)

  function getListDataByKey(data: any[], targetKey: any) {
    const filteredData: any = []

    function getListDataByKey(listData: any[]) {
      for (const item of listData) {
        if (item.key === targetKey.key) {
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

  function getParentByKey(listData: any[], targetKey: any): any[] {
    const parentList: any[] = []
    if (targetKey) {
      for (const item of listData) {
        if (item.children && item.children.length > 0) {
          const child = item.children.find((childItem: any) => childItem.key === targetKey.key)
          if (child) {
            parentList.push({ key: item.key, name: item.name })
            break
          } else {
            const result = getParentByKey(item.children, targetKey)
            if (result.length > 0) {
              parentList.push({ key: item.key, name: item.name })
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
      const listDataTitle: any = getParentByKey(data, useSelect)
      setDataRender({
        listData: [useSelect],
        listDataTitle: listDataTitle
      })
    }
  }, [useSelect])

  useEffect(() => {
    setDataRender({
      listData: data,
      listDataTitle: []
    })
  }, [])

  const onDelete = (record: any) => {
    console.log(record.name)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value: string, record: any) => {
        return <span onClick={() => setUseSelect(record)}>{value}</span>
      }
    },
    {
      title: 'age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: () => {
        return <div className='tw-text-center'>Actions</div>
      },
      key: 'actions',
      width: 200,
      className: 'tw-text-center',
      render: (text: string, record: object) => (
        <Space size='middle'>
          <Tooltip title={t('edit')}>
            <span
              onClick={() => {
                setShowModal({
                  openModal: true,
                  type: ACTION_TYPE.Updated,
                  data: record
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
                  data: record
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

  const onRendered = async (item: any) => {
    const listDataTitle: any = getParentByKey(data, item)
    await setDataRender({
      listData: await getListDataByKey(data, item),
      listDataTitle: listDataTitle
    })
  }

  const onBackPageSize = async () => {
    if (dataRender.listDataTitle.length > 1) {
      const listDataTitle: any = getParentByKey(data, dataRender.listDataTitle[dataRender.listDataTitle.length - 1])
      await setDataRender({
        listData: await getListDataByKey(data, dataRender.listDataTitle[dataRender.listDataTitle.length - 1]),
        listDataTitle: listDataTitle
      })
    } else if (dataRender.listDataTitle.length === 1) {
      await setDataRender({
        listData: data,
        listDataTitle: []
      })
    } else {
      navigate(-1)
    }
  }

  const onCancelModel = async () => {
    await setShowModal({
      openModal: false,
      type: '',
      data: null
    })
  }

  return (
    <div className='tw-p-[20px] tw-bg-white page-department'>
      <Row className='tw-w-100'>
        {/* <div className='d-flex align-items-center'> */}
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
          Hti group{' '}
          {dataRender?.listDataTitle.map((item: any, index) => {
            return (
              <span
                key={item.key}
                onClick={() => {
                  onRendered(item)
                }}
              >{` -> ${item.name}`}</span>
            )
          })}
        </h1>
      </Row>
      <Row className='tw-w-100 tw-flex tw-justify-end tw-my-[20px]'>
        {/* <Space size='middle'> */}
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
                data: null
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
        />
      ) : (
        <DepartmentMemberModal
          onClose={() => onCancelModel()}
          onOk={() => onCancelModel()}
          showModal={showModal.openModal}
          typeModel={showModal.type}
          data={showModal.data}
        />
      )}
      <Row className='tw-w-100' gutter={[12, 12]}>
        <CommondTable
          dataSource={treeData}
          columns={columns}
          expandable={{ defaultExpandAllRows: false }}
          isLoading={false}
          meta={{ page: 1, total: 0, size: 10 }}
          // hiddenPagination={true}
        />
      </Row>
    </div>
  )
}

export default Department
