/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Col, Dropdown, MenuProps, Row, Select, Table, TablePaginationConfig, notification } from 'antd'
import Search from 'antd/es/input/Search'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { COMMON_ERROR_CODE, USER_STATUS } from '~/constants/app.constant'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { IPaging, ISort } from '~/types/api-response.interface'
import { IBalance } from '~/types/balance.interface'
const Balance: React.FC = () => {
  const { t } = useTranslation()
  const [query, setQuery] = useState<string>('')
  const fileSelect = useRef<any>(null)
  const timerId = useRef<any>(null)
  const userState = useAppSelector((state: { user: any }) => state.user)
  const dispatch = useAppDispatch()
  const { userInfo } = useUserInfo()
  const [searchValue, setSearchValue] = useState<{
    query: string
    group?: string | null
    status?: string | null
    paging: IPaging
    sorts: ISort[]
  }>({
    query: '',
    // status: USER_STATUS.ACTIVE,
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
  const getSortOrder = (filed: string) => {
    const sort = searchValue.sorts[0]
    if (sort && sort.field === filed) {
      return searchValue.sorts[0].direction === 'ASC' ? 'ascend' : 'descend'
    } else {
      return null
    }
  }
  const columns: ColumnsType<IBalance> = [
    // {
    //   title: t('balance.fullName'),
    //   dataIndex: 'fullName',
    //   key: 'fullName',
    //   sorter: true,
    //   showSorterTooltip: false,
    //   sortOrder: getSortOrder('fullName'),
    //   width: '200px',
    //   fixed: 'left',
    //   render: (text, record) => {
    //     return (
    //       <div className='tw-flex tw-items-center'>
    //         <Image
    //           className='user-table__img'
    //           alt='avatar'
    //           src={record.avatarBase64 ? `data:image/png;base64,${record.avatarBase64}` : defaultImg}
    //         />
    //         <span className='tw-ml-2'>{text}</span>
    //       </div>
    //     )
    //   },
    //   ellipsis: true
    // },
    {
      title: t('balance.userName'),
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
      showSorterTooltip: false,
      sortOrder: getSortOrder('userName'),
      width: '150px',
      ellipsis: true
    },
    {
      title: t('balance.joinDate'),
      dataIndex: 'birthday',
      key: 'birthday',
      sorter: true,
      sortOrder: getSortOrder('joinDate'),
      showSorterTooltip: false,
      width: '150px',
      align: 'center',
      render: (text) => {
        if (text) {
          const date = dayjs(text).format('DD/MM/YYYY')
          return date
        }
      }
    },
    // {
    //   title: t('balance.gender'),
    //   dataIndex: 'genderType',
    //   key: 'genderType',
    //   sorter: true,
    //   width: '120px',
    //   align: 'center',
    //   sortOrder: getSortOrder('genderType'),
    //   showSorterTooltip: false,
    //   render: (text, _) => {
    //     return text ? t(text === GENDER.MALE ? 'balance.male' : 'balance.female') : ''
    //   }
    // },
    // {
    //   title: t('balance.department'),
    //   dataIndex: 'groupProfiles',
    //   key: 'groupProfiles',
    //   width: '250px',
    //   render: (text, record) => {
    //     return record.groupProfiles
    //       .map((item: { groupName: any; role: string }) => {
    //         return `${item.groupName} (${t(`common.role.${item.role.toLowerCase()}`)})`
    //       })
    //       .join(',')
    //   },
    //   ellipsis: true
    // },
    {
      title: t('balance.balance'),
      dataIndex: 'balance',
      key: 'balance',
      sorter: true,
      width: '150px',
      sortOrder: getSortOrder('balance'),
      showSorterTooltip: false
    },
    {
      title: t('balance.action'),
      key: 'action',
      align: 'center',
      width: '120px',
      render: (_, record) => {
        return (
          <div className='tw-bottom-[12px] tw-w-full'>
            <div className='tw-flex tw-gap-2 tw-justify-center tw-items-center'>
              {/* {record.status !== USER_STATUS.DEACTIVE && (
                <>
                  <Tooltip title={'Cập nhật thông tin của thành viên'}>
                    <Button
                      size='small'
                      // onClick={() => handleClickEditUser(record)}
                      icon={<EditOutlined className='tw-text-blue-600' />}
                    />
                  </Tooltip>
                  {hasPermission([ROLE.HR, ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles) && (
                    <>
                      {record?.userName === 'admin' || record?.userName === userInfo?.userName ? (
                        ''
                      ) : (
                        <Tooltip title='Vô hiệu hóa tài khoản'>
                          <Popconfirm
                            title='Xác nhận vô hiệu hóa tài khoản'
                            // onConfirm={() => handleClickDeleteUser(record)}
                          >
                            <Button size='small' icon={<DeleteOutlined className='tw-text-red-600' />} />
                          </Popconfirm>
                        </Tooltip>
                      )}
                      <Tooltip title='Đặt lại mật khẩu'>
                        <Popconfirm
                          title={t('balance.descriptionConfirmResetPassword', {
                            account: record.fullName
                          })}
                          // onConfirm={() => handleClickResetPasswordUser(record)}
                          okText={t('common.confirm')}
                          cancelText={t('common.cancel')}
                        >
                          <Button size='small' icon={<LockOutlined className='tw-text-blue-600' />} />
                        </Popconfirm>
                      </Tooltip>
                    </>
                  )}
                </>
              )}
              {record.status === USER_STATUS.DEACTIVE && (
                <>
                  <Tooltip title='Xem chi tiết'>
                    <Button
                      size='small'
                      // onClick={() => handleClickEditUser(record)}
                      icon={<EyeOutlined className='tw-text-blue-600' />}
                    />
                  </Tooltip>
                  {hasPermission([ROLE.HR, ROLE.SYSTEM_ADMIN], userInfo?.groupProfiles) && (
                    <>
                      <Tooltip title='Khôi phục'>
                        <Popconfirm
                          title={'Xác nhận khôi phục thành viên' + `'${record.fullName}'`}
                          okText={t('common.yes')}
                          // onConfirm={() => handleRestoreUser(record)}
                        >
                          <Button size='small' icon={<UndoOutlined className='tw-text-blue-600' />} />
                        </Popconfirm>
                      </Tooltip>
                    </>
                  )}
                </>
              )} */}
            </div>
          </div>
        )
      }
    }
  ]
  const handleDepartmentChange = (value: string | null) => {
    setSearchValue((prevState) => {
      return { ...prevState, query: prevState.query, group: value }
    })
  }

  const handleStatusChange = (value: string | null) => {
    setSearchValue((prevState) => {
      return { ...prevState, query: prevState.query, status: value }
    })
  }

  const handleSearchValueChange = (value: string) => {
    setQuery(value)
    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    timerId.current = setTimeout(() => {
      setSearchValue((prevState) => ({ ...prevState, query: value, paging: { ...prevState.paging, page: 0 } }))
    }, 500)
  }
  const resetPageUser = () => {
    setSearchValue({
      query: '',
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
  }
  useEffect(() => {
    // const promise = dispatch(
    // searchUser({
    //   paging: searchValue.paging,
    //   sorts: searchValue.sorts,
    //   query: searchValue.query,
    //   groupCode: searchValue.group === 'all' ? null : searchValue.group,
    //   status: searchValue.status === 'all' ? null : searchValue.status
    // })
    // )

    return () => {
      // promise.abort()
    }
  }, [searchValue])

  function handleTableChange(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IBalance> | any
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

  const onDownloadImportTemplate = async () => {
    try {
      // const response = (await getImportTemplate()) as any
      // const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
      // const fileName = `import-user-template.xlsx`
      // saveAs(blob, fileName)
    } catch (error: any) {
      // TODO
    }
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <div className='tw-cursor-pointer' onClick={() => fileSelect?.current?.click()}>
          Import phép của nhân viên
        </div>
      ),
      key: '1'
    },
    {
      label: (
        <div className='tw-cursor-pointer' onClick={onDownloadImportTemplate}>
          Tải file phép của nhân viên
        </div>
      ),
      key: '2'
    }
  ]

  return (
    <div className='tw-min-h-[calc(100%-32px)] tw-bg-white tw-m-2 md:tw-m-4'>
      <div className='user-list tw-p-2 md:tw-p-4'>
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
            {t('balance.member')} ({userState.meta.total})
          </h1>
          <h5 className='tw-text-sm'>{t('balance.memberList')}</h5>
        </div>
        <Row gutter={[16, 16]} className='tw-mt-4'>
          <Col xs={24} md={6}>
            <div className='tw-float-right tw-flex tw-flex-col md:tw-flex-row tw-w-full tw-gap-[10px]'>
              {/* {permissionAddUser && (
                <Button onClick={openModalCreateUser} type='primary' icon={<PlusOutlined />}>
                  {t('balance.addMember')}
                </Button>
              )} */}

              {/* {permissionImportUser && ( */}
              <Dropdown menu={{ items }}>
                <Button type='primary'>
                  import/ export dữ liệu
                  <input
                    ref={fileSelect}
                    className='tw-hidden'
                    type='file'
                    accept='.xlsx,.xls'
                    onChange={(event) => handleFileChange(event.target.files)}
                  />
                </Button>
              </Dropdown>
              {/*  )} */}
            </div>
          </Col>
          <Col xs={24} md={18}>
            <div className='tw-flex tw-flex-col lg:tw-flex-row md:tw-justify-end tw-w-full tw-gap-[10px]'>
              {/* <Select
                onChange={handleDepartmentChange}
                defaultValue={'all'}
                // options={groupOptions}
                value={searchValue.group}
                className='tw-w-full lg:tw-w-[200px]'
              />
              <Select
                onChange={handleStatusChange}
                defaultValue={USER_STATUS.ACTIVE}
                // options={statusOption}
                value={searchValue.status}
                className='tw-w-full lg:tw-w-[200px]'
              /> */}
              <Search
                value={query}
                placeholder={t('balance.searchMember')}
                onChange={(event) => handleSearchValueChange(event.target.value)}
                className='tw-w-full lg:tw-w-[280px]'
              />
            </div>
          </Col>
        </Row>

        <div className='tw-mt-6 user-table'>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={userState.balance}
            loading={userState.loading}
            pagination={{
              total: userState.meta.total,
              defaultPageSize: userState?.meta?.size,
              pageSize: userState?.meta?.size,
              pageSizeOptions: [5, 10, 15, 25, 50],
              showSizeChanger: true,
              showQuickJumper: true,
              current: searchValue.paging.page + 1,
              responsive: true
            }}
            // rowClassName={(record) => (record.status === USER_STATUS.DEACTIVE ? 'tw-bg-gray-100' : '')}
            scroll={{ y: 'calc(100vh - 368px)', x: 800 }}
            onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
          />
        </div>
      </div>
    </div>
  )
}

export default Balance
