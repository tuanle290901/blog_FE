import { Table } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const defaultTitle = () => 'Here is title'
const defaultFooter = () => 'Here is footer'

interface IColumn {
  title?: string | (() => React.ReactNode)
  dataIndex?: string
  key?: React.ReactNode
  render?: (value: string, record: any) => React.ReactNode
  width?: number | undefined
  className?: string | ''
}

interface IMeta {
  page?: number | 1
  total?: number | undefined
  // defaultPageSize?: number | undefined
  size?: number | 10
}

interface expandable {
  defaultExpandAllRows: boolean
}
interface IPropsTableCommon {
  columns: IColumn[]
  dataSource: any[]
  isLoading?: boolean | false
  mode?: string | ''
  meta?: IMeta
  handleSelectedRowsKeyChange?: () => void
  handlePropsChange?: (page: number, pageSize: number) => void
  handleDoubleClickRow?: () => void
  checkedList?: string[]
  disabledRowSelection?: boolean | false
  hiddenPagination?: boolean | true
  yScrollProp?: number
  xScrollProp?: number
  triggerDesc?: string
  triggerAsc?: string
  cancelSort?: () => void
  rowKey?: () => void
  expandable?: expandable
}

interface IScroll {
  y?: number
  x?: string
}

const CommondTable: React.FC<IPropsTableCommon> = (props: any) => {
  const {
    columns,
    dataSource,
    isLoading,
    mode,
    meta,
    handleSelectedRowsKeyChange,
    handlePropsChange,
    handleDoubleClickRow,
    checkedList,
    disabledRowSelection,
    hiddenPagination,
    yScrollProp,
    xScrollProp,
    triggerDesc,
    triggerAsc,
    cancelSort,
    rowKey,
    expandable
  } = props
  const { t } = useTranslation()
  const [bordered] = useState<boolean>(false)
  const [size] = useState<SizeType>('large')
  const [showTitle] = useState<boolean>(false)
  const [showHeader] = useState<boolean>(true)
  const [showfooter] = useState<boolean>(false)
  const [tableLayout] = useState<undefined>(undefined)
  const [ellipsis] = useState<boolean>(false)
  const [yScroll] = useState<boolean>(false)
  const [xScroll] = useState<string>('fixed')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const variablesColor: any = {}
  const scroll: IScroll = {}

  if (yScroll) {
    scroll.y = 240
  } else if (yScrollProp) {
    scroll.y = parseInt(yScrollProp, 10)
  }
  if (xScroll) {
    scroll.x = 'scroll'
  } else if (xScrollProp) {
    scroll.y = xScrollProp
  }

  const tableColumns = columns.map((item: IColumn) => {
    return {
      ...item,
      ellipsis
    }
  })
  const tableProps = {
    bordered,
    loading: isLoading,
    title: showTitle ? defaultTitle : undefined,
    showHeader,
    footer: showfooter ? defaultFooter : undefined,
    scroll,
    tableLayout
  }

  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys)
    handleSelectedRowsKeyChange(newSelectedRowKeys)
  }
  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange
  }

  useEffect(() => {
    onModeChange('head')
  }, [mode, checkedList])

  const onModeChange = (type: string) => {
    const isLightMode = mode === 'light'
    switch (type) {
      case 'head': {
        const allHeaderElement = document.querySelectorAll('.ant-table-thead>tr>th')
        allHeaderElement.forEach((element: any) => {
          element.style.backgroundColor = isLightMode ? variablesColor.mainColor : '#fafafa'
          element.style.color = isLightMode ? variablesColor.colorWhite : 'black'
        })
        break
      }

      default: {
        break
      }
    }
  }

  const onDoubleClickRow = (record: any, rowIndex: any, event: any) => {
    handleDoubleClickRow(record, rowIndex, event)
  }

  return (
    <Table
      locale={{
        triggerDesc: triggerDesc || t('sort.triggerDesc'),
        triggerAsc: triggerAsc || t('sort.triggerAsc'),
        cancelSort: cancelSort || t('sort.cancelSort')
        // emptyText: (
        //   <div>
        //     <svg
        //       className='ant-empty-img-simple'
        //       width='64'
        //       height='41'
        //       viewBox='0 0 64 41'
        //       xmlns='http://www.w3.org/2000/svg'
        //     >
        //       <g transform='translate(0 1)' fill='none' fillRule='evenodd'>
        //         <ellipse className='ant-empty-img-simple-ellipse' cx='32' cy='33' rx='32' ry='7' />
        //         <g className='ant-empty-img-simple-g' fillRule='nonzero'>
        //           <path d='M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z' />
        //           <path
        //             d='M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z'
        //             className='ant-empty-img-simple-path'
        //           />
        //         </g>
        //       </g>
        //     </svg>
        //     <div>{t('noData')}</div>
        //   </div>
        // )
      }}
      onRow={(record: any, rowIndex: any) => {
        return {
          onDoubleClick: (event: any) => {
            onDoubleClickRow(record, rowIndex, event)
          }
        }
      }}
      size={size || undefined}
      {...tableProps}
      rowSelection={disabledRowSelection ? undefined : rowSelection}
      pagination={
        hiddenPagination
          ? false
          : {
              className: 'd-flex justify-content-end align-items-center',
              current: meta?.page + 1,
              total: meta?.total,
              defaultPageSize: meta?.size,
              pageSize: meta?.size,
              pageSizeOptions: ['10', '25', '50'],
              showSizeChanger: true,
              showQuickJumper: true,
              locale: {
                items_per_page: `/ ${t('pagination.page')}`,
                next_page: t('pagination.nextPage'),
                prev_page: t('pagination.prevPage'),
                jump_to: t('pagination.jumpTo'),
                page: t('pagination.page')
              },

              position: ['bottomRight'],
              onChange: (page: number, pageSize: number) => handlePropsChange(page, pageSize)
            }
      }
      columns={tableColumns}
      expandable={...expandable}
      dataSource={dataSource?.length > 0 ? dataSource : []}
      scroll={scroll}
      rowKey={rowKey}
    />
  )
}

export default CommondTable
