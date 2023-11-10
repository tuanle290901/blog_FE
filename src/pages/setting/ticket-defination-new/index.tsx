import { Divider, Empty, Tabs } from 'antd'
import { FC, memo, useEffect, useState } from 'react'
import {
  fetchListTicket,
  getListRevisionByTicketType,
  getTicketById
} from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { SearchPayload, TicketDefRevisionCreateReq } from '~/types/setting-ticket-process'
import TabItems from './component/TabItems'
import { useLocation } from 'react-router-dom'

const Index: FC = memo(function Index() {
  const dispatch = useAppDispatch()
  const listData: TicketDefRevisionCreateReq[] = useAppSelector((state) => state.ticketProcess.tickets)
  const [activeTab, setActiveTab] = useState('')
  const { state } = useLocation()

  const onChangeTab = (tabId: string) => {
    if (tabId) {
      setActiveTab(tabId)
      dispatch(getTicketById({ id: tabId }))
      const payload: SearchPayload = Object.create(null)
      payload.ticketType = tabId
      dispatch(getListRevisionByTicketType(payload))
    }
  }

  useEffect(() => {
    dispatch(fetchListTicket())
  }, [])

  useEffect(() => {
    if (listData.length > 0) {
      const idTab = listData[0].id as string
      dispatch(getTicketById({ id: idTab }))
      setActiveTab(idTab)
      const payload: SearchPayload = Object.create(null)
      payload.ticketType = idTab
      dispatch(getListRevisionByTicketType(payload))
    }
  }, [dispatch, listData])

  useEffect(() => {
    if (state?.ticketType) {
      setActiveTab(state?.ticketType)
    }
  }, [])

  return (
    <div className='tw-m-2 md:tw-m-4 tw-p-4 tw-bg-white tw-h-[95%]'>
      <div className='tw-mb-3'>
        <h1 className='tw-text-2xl tw-font-semibold'>Quy trình phê duyệt</h1>
        <h5 className='tw-text-sm'>Danh sách tất cả quy trình phê duyệt</h5>
      </div>
      {/* <div className='tw-mt-3 tw-mb-3'>
        <Button onClick={() => goToTicketProcessMap(null, 'view')} type='primary'>
          Thêm mới quy trình
        </Button>
      </div> */}
      <Divider />
      {listData.length > 0 && (
        <Tabs
          tabPosition='left'
          style={{ height: '70vh' }}
          onChange={onChangeTab}
          activeKey={activeTab}
          items={listData.map((data, i) => {
            const id = String(data.id)
            return {
              label: data.name,
              key: id,
              disabled: false,
              children: <TabItems />
            }
          })}
        />
      )}

      {listData.length === 0 && <Empty description='Danh sách quy trình phê duyệt trống' />}
    </div>
  )
})

export default Index
