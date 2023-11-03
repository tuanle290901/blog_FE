/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputRef,
  Row,
  Space,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  message,
  notification
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useCompactItemContext } from 'antd/lib/space/Compact'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { COMMON_ERROR_CODE } from '~/constants/app.constant'
import { exportBenefit, searchBenefit, updateBenefit } from '~/stores/features/benefit/benefit.silce'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { IPaging, ISort } from '~/types/api-response.interface'
import { IBenefit, IBenefitFilter, IBenefitUpdate } from '~/types/benefit.interface'
import './style.scss'

const Benefit: React.FC = () => {
  const { t } = useTranslation()
  const fileSelect = useRef<any>(null)
  const timerId = useRef<any>(null)
  const dispatch = useAppDispatch()
  const { userInfo } = useUserInfo()
  const dataBenefit = useAppSelector((state: { benefit: { listData: IBenefit[]; meta: IPaging } }) => state.benefit)
  const [searchValue, setSearchValue] = useState<IBenefitFilter>({
    search: '',
    year: 0,
    paging: {
      page: 0,
      size: 15,
      total: 0,
      totalPage: 0
    },
    sorts: [
      {
        direction: 'DESC',
        field: 'created_at'
      }
    ]
  })

  useEffect(() => {
    const yearNumber = dayjs().year()
    if (dayjs().format('YYYY-MM-DDTHH:mm:ss') >= yearNumber.toString().concat('-04-01T00:00:00')) {
      setSearchValue((prev) => {
        return {
          ...prev,
          year: yearNumber + 1
        }
      })
    } else {
      setSearchValue((prev) => {
        return {
          ...prev,
          year: yearNumber
        }
      })
    }
  }, [])

  const getSortOrder = (filed: string) => {
    const sort = searchValue.sorts[0]
    if (sort && sort.field === filed) {
      return searchValue.sorts[0].direction === 'ASC' ? 'ascend' : 'descend'
    } else {
      return null
    }
  }

  const onSaveBanace = async (e: any, record: IBenefit) => {
    if (e.charCode === 13 || e.keyCode == 13 || e.code === 'Enter' || e.type === 'blur') {
      if (Number(e.target.value) > 5760 || Number(e.target.value) < 0) {
        notification.error({ message: 'Thời gian nghỉ phép phải từ 0 đến 5760 phút' })
      } else {
        const arrayJoinDate = record.joinDate.split('/')
        const joinDate = arrayJoinDate[arrayJoinDate.length - 1]
          .concat('-')
          .concat(arrayJoinDate[arrayJoinDate.length - 2])
          .concat('-')
          .concat(arrayJoinDate[0])
          .concat('T00:00:00')
        const payload: IBenefitUpdate = {
          year: searchValue.year.toString(),
          userName: record.userName,
          initYearLeaveBalanceMinutes: Number(e.target.value),
          joinDate: joinDate
        }
        try {
          const response = await dispatch(updateBenefit(payload)).unwrap()
          notification.success({
            message: response.message
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  const columns: TableColumnsType<IBenefit> = [
    {
      title: t('benefit.userName'),
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
      align: 'center',
      showSorterTooltip: false,
      sortOrder: getSortOrder('userName'),
      width: '150px',
      ellipsis: true
    },
    {
      title: t('benefit.joinDate'),
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: true,
      sortOrder: getSortOrder('join_date'),
      showSorterTooltip: false,
      width: '150px',
      align: 'center'
    },
    {
      title: t('benefit.benefit'),
      dataIndex: 'balance',
      key: 'balance',
      sorter: true,
      align: 'center',
      width: '150px',
      sortOrder: getSortOrder('balance'),
      showSorterTooltip: false,
      render: (value: any, record: IBenefit) => {
        return (
          <Input
            width='100px'
            className='td-input'
            onKeyPress={(e) => {
              onSaveBanace(e, record)
            }}
            onBlur={(e) => onSaveBanace(e, record)}
            defaultValue={Number(value)}
            type='number'
            max={5760}
            maxLength={4}
            min={0}
          />
        )
      }
    }
    // {
    //   title: t('Benefit.action'),
    //   key: 'action',
    //   align: 'center',
    //   width: '120px',
    //   render: (_, record) => {
    //     return (
    //       <div className='tw-bottom-[12px] tw-w-full'>
    //         <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
    //           <Space>
    //             {editBenefit.openInput === true &&
    //             editBenefit.item &&
    //             record.userName === editBenefit.item?.userName ? (
    //               <>
    //                 <Tooltip title='Vô hiệu hóa tài khoản'>
    //                   <Button size='small' icon={<SaveOutlined className='tw-text-yellow-600' />} />
    //                 </Tooltip>
    //                 <Tooltip title='Vô hiệu hóa tài khoản'>
    //                   <Button
    //                     size='small'
    //                     icon={<CloseOutlined className='tw-text-red-600' />}
    //                     onClick={() => {
    //                       setEditBenefit({
    //                         openInput: false,
    //                         item: null
    //                       })
    //                     }}
    //                   />
    //                 </Tooltip>
    //               </>
    //             ) : (
    //               <Tooltip title={'Cập nhật thông tin của thành viên'}>
    //                 <Button
    //                   size='small'
    //                   onClick={() =>
    //                     setEditBenefit({
    //                       openInput: true,
    //                       item: record
    //                     })
    //                   }
    //                   icon={<EditOutlined className='tw-text-blue-600' />}
    //                 />
    //               </Tooltip>
    //             )}
    //           </Space>
    //         </div>
    //       </div>
    //     )
    //   }
    // }
  ]

  const handleSearchValueChange = (value: string) => {
    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    timerId.current = setTimeout(() => {
      setSearchValue((prevState) => ({ ...prevState, search: value, paging: { ...prevState.paging, page: 0 } }))
    }, 500)
  }

  const resetPage = () => {
    let yearNumber = dayjs().year()
    if (dayjs().format('YYYY-MM-DDTHH:mm:ss') >= yearNumber.toString().concat('-04-01T00:00:00')) {
      yearNumber = yearNumber + 1
    } else {
      yearNumber = dayjs().year()
    }
    const payloadBody = {
      search: '',
      year: yearNumber,
      paging: {
        page: 0,
        size: 15,
        total: 0,
        totalPage: 0
      }
    }
    dispatch(
      searchBenefit({
        search: payloadBody.search.trim(),
        year: payloadBody.year.toString(),
        paging: payloadBody.paging,
        sorts: [
          {
            field: 'created_at',
            direction: 'DESC'
          }
        ]
      })
    )
    setSearchValue({
      search: payloadBody.search,
      year: payloadBody.year,
      paging: payloadBody.paging,
      sorts: [
        {
          field: 'created_at',
          direction: 'DESC'
        }
      ]
    })
  }

  useEffect(() => {
    if (searchValue.year > 0) {
      const promise = dispatch(
        searchBenefit({
          search: searchValue.search.trim(),
          year: searchValue.year.toString(),
          paging: searchValue.paging,
          sorts: searchValue.sorts
        })
      )

      return () => {
        promise.abort()
      }
    }
  }, [searchValue])

  function handleTableChange(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IBenefit> | any
  ) {
    setSearchValue((prevState) => {
      const paging: IPaging = {
        ...prevState.paging,
        page: Number(pagination.current) - 1,
        size: pagination.pageSize as number
      }
      const sorts: ISort[] = []
      if (sorter.order) {
        sorts.push({ field: sorter.field as string, direction: sorter.order === 'ascend' ? 'ASC' : 'DESC' })
      } else {
        sorts.push({
          direction: 'DESC',
          field: 'created_at'
        })
      }
      return { ...prevState, paging, sorts }
    })
  }
  const openModalCreateUser = () => {
    // setIsOpenUserModal(true)
  }

  const handleFileChange = async (files: FileList | null) => {
    if (files && files.length) {
      const file = files[0]
      const fileName = file.name.split('.')
      const fileExtension = fileName.length ? fileName[fileName.length - 1] : ''
      if (!(fileExtension === 'xlsx' || fileExtension === 'xls')) {
        notification.error({ message: 'Vui lòng chọn file có định dạng xlsx hoặc xls' })
      } else {
        try {
          // await dispatch(importUser(file)).unwrap()
          notification.success({ message: 'Import thành viên thành công' })
          // resetAndSearchUser()
        } catch (e: any) {
          if (e.status && !COMMON_ERROR_CODE.includes(e.status)) {
            notification.error({ message: e.message })
          }
        }
      }
    }
    if (fileSelect?.current) {
      fileSelect.current.value = ''
    }
  }

  const onDownloadExportBenefit = async () => {
    let yearNumber = dayjs().year()
    if (dayjs().format('YYYY-MM-DDTHH:mm:ss') >= yearNumber.toString().concat('-04-01T00:00:00')) {
      yearNumber = yearNumber + 1
    } else {
      yearNumber = dayjs().year()
    }
    try {
      const response = (await exportBenefit({
        year: searchValue.year.toString(),
        paging: searchValue.paging,
        sorts: searchValue.sorts
      })) as any
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const fileName = `benefit-${yearNumber}.xlsx`
      saveAs(blob, fileName)
    } catch (error: any) {
      notification.error(error)
    }
  }

  const onChangeRequest = (type: string, requestItem: string | any) => {
    let payload = {
      ...searchValue
    }
    switch (type) {
      case 'year':
        payload = {
          ...payload,
          year: dayjs(requestItem).year()
        }
        break
    }
    setSearchValue({
      ...payload
    })
  }

  // const handleSave = (row: IBenefit) => {
  //   console.log(row)
  //   // const newData = [...dataSource]
  //   // const index = newData.findIndex((item) => row.key === item.key)
  //   // const item = newData[index]
  //   // newData.splice(index, 1, {
  //   //   ...item,
  //   //   ...row
  //   // })
  //   // setDataSource(newData)
  // }

  // const components = {
  //   body: {
  //     row: EditableRow,
  //     cell: EditableCell
  //   }
  // }

  // const columns = columnsDefault.map((col) => {
  //   if (!col.editable) {
  //     return col
  //   }
  //   return {
  //     ...col,
  //     onCell: (record: IBenefit) => ({
  //       record,
  //       editable: col.editable,
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       handleSave
  //     })
  //   }
  // })
  return (
    <div className='tw-min-h-[calc(100%-32px)] tw-bg-white tw-m-2 md:tw-m-4'>
      <div className='benefit-list tw-p-2 md:tw-p-4'>
        {/* {(isOpenUserModal || !!userState.editingUser) && (
          <UserCreateEdit
            open={isOpenUserModal || !!userState.editingUser}
            userData={userState.editingUser}
            handleClose={handleCloseUserModal}
            resetPageUser={resetPageUser}
          />
        )} */}
        <div>
          <h1 className='tw-text-2xl tw-font-semibold'>
            {t('benefit.member')} ({dataBenefit.meta.total})
          </h1>
          <h5 className='tw-text-sm'>{t('benefit.memberList')}</h5>
        </div>
        <Row gutter={[16, 16]} className='tw-mt-4'>
          <Col xs={24} md={12} sm={12} lg={12}>
            <div className='tw-float-right tw-flex tw-flex-col md:tw-flex-row tw-w-full tw-gap-[10px]'>
              <Space>
                <Button
                  icon={<UploadOutlined />}
                  className='timesheet-filter__export'
                  onClick={() => fileSelect?.current?.click()}
                >
                  {t('Import thông tin')}
                  <input
                    ref={fileSelect}
                    className='tw-hidden'
                    type='file'
                    accept='.xlsx,.xls'
                    onChange={(event) => handleFileChange(event.target.files)}
                  />
                </Button>

                <Button
                  icon={<VerticalAlignBottomOutlined />}
                  className='timesheet-filter__export'
                  onClick={() => onDownloadExportBenefit()}
                >
                  {t('Xuất thông tin')}
                </Button>
              </Space>
            </div>
          </Col>
          <Col xs={24} md={12} sm={12} lg={12}>
            <div className='tw-flex tw-flex-col lg:tw-flex-row md:tw-justify-end tw-w-full tw-gap-[10px]'>
              <DatePicker
                picker='year'
                allowClear={false}
                value={dayjs().year(searchValue.year)}
                format={'YYYY'}
                onChange={(val) => onChangeRequest('year', val)}
                disabledDate={(date) => {
                  return dayjs(date).year() > dayjs().year() + 1 ? true : false
                }}
              />
            </div>
          </Col>
        </Row>

        <div className='tw-mt-6 benefit-table'>
          <Table
            columns={columns}
            dataSource={dataBenefit.listData}
            loading={dataBenefit.loading}
            className='benefit-table-antd'
            rowClassName={() => 'editable-row'}
            rowKey={(record) => record.userName}
            pagination={{
              total: dataBenefit.meta.total,
              defaultPageSize: dataBenefit?.meta?.size,
              pageSize: dataBenefit?.meta?.size,
              pageSizeOptions: [5, 10, 15, 25, 50],
              showSizeChanger: true,
              showQuickJumper: true,
              current: searchValue.paging.page + 1,
              responsive: true
            }}
            scroll={{ y: 'calc(100vh - 368px)', x: 800 }}
            onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
          />
        </div>
      </div>
    </div>
  )
}

export default Benefit
