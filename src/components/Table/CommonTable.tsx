/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { ColumnGroupType, ColumnType, ExpandableConfig, Key } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const defaultTitle = () => 'Here is title'
const defaultFooter = () => 'Here is footer'

interface IColumn {
  title?: string | (() => React.ReactNode)
  dataIndex?: string
  key?: React.ReactNode | undefined
  render?: (value: string, record: any) => React.ReactNode
  width?: number | undefined
  className?: string | ''
  ellipsis?: boolean | undefined
}

interface IMeta {
  page: number | 1
  total: number | undefined
  size: number | 10
}
interface IPropsTableCommon {
  columns: IColumn[]
  dataSource: any[]
  isLoading?: boolean | false
  mode?: string | ''
  meta?: IMeta
  handleSelectedRowsKeyChange?: (newSelectedRowKeys: any) => React.ReactNode | undefined
  handlePropsChange?: (page: number, pageSize: number) => React.ReactNode | undefined
  handleDoubleClickRow?: (record: any, rowIndex: any, event: any) => React.ReactNode | undefined
  checkedList?: string[]
  disabledRowSelection?: boolean | true
  hiddenPagination?: boolean | true
  yScrollProp?: string
  xScrollProp?: number
  triggerDesc?: string
  triggerAsc?: string
  cancelSort?: string
  rowKey?: string | undefined
  style: any
  expandable?: ExpandableConfig<any>
}

interface IScroll {
  y?: number
  x?: string
}

const CommondTable: React.FC<IPropsTableCommon> = (props) => {
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
    expandable,
    style
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
    if (handleSelectedRowsKeyChange) {
      handleSelectedRowsKeyChange(newSelectedRowKeys)
    }
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
    if (handleDoubleClickRow) {
      handleDoubleClickRow(record, rowIndex, event)
    }
  }

  const tableColumns: (ColumnType<any> | ColumnGroupType<any>)[] = columns.map((item: IColumn) => {
    const { key, ...rest } = item
    return {
      ...rest,
      ellipsis,
      key: key !== false ? (key as Key) : undefined
    }
  })

  return (
    <Table
      locale={{
        triggerDesc: triggerDesc || t('sort.triggerDesc'),
        triggerAsc: triggerAsc || t('sort.triggerAsc'),
        cancelSort: cancelSort || t('sort.cancelSort')
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
      style={style}
      rowSelection={disabledRowSelection ? undefined : rowSelection}
      pagination={
        hiddenPagination
          ? false
          : {
              className: 'd-flex justify-content-end align-items-center',
              current: meta && meta.page + 1,
              total: meta?.total,
              defaultPageSize: meta?.size,
              pageSize: meta?.size,
              pageSizeOptions: ['10', '25', '50'],
              showSizeChanger: true,
              showQuickJumper: true,
              responsive: true,
              locale: {
                items_per_page: `/ ${t('pagination.page')}`,
                next_page: t('pagination.nextPage'),
                prev_page: t('pagination.prevPage'),
                jump_to: t('pagination.jumpTo'),
                page: t('pagination.page')
              },

              position: ['bottomRight'],
              onChange: (page: number, pageSize: number) => {
                if (handlePropsChange) {
                  handlePropsChange(page, pageSize)
                }
              }
            }
      }
      columns={tableColumns}
      expandable={expandable ? { ...expandable } : undefined}
      dataSource={dataSource?.length > 0 ? dataSource : []}
      scroll={scroll}
      rowKey={rowKey}
    />
  )
}

export default CommondTable
