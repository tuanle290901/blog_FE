import { Tabs } from 'antd'
import { FC, memo, useEffect, useState } from 'react'
import TicketDefinationCreate from './TicketDefinationCreate'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { fetchListTicket } from '~/stores/features/setting/ticket-process.slice'

interface TabList {
  id: string
  name: string
}

const Index: FC = memo(function Index() {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector((item) => item.ticketProcess.tickets)
  const [tabList, setTabList] = useState<TabList[]>([])
  const [tabActive, setTabActive] = useState('')

  const onChangeTab = (tabId: string) => {
    setTabActive(tabId)
  }

  useEffect(() => {
    dispatch(fetchListTicket())
    setTabList([
      {
        id: '',
        name: 'Thiết lập quy trình mới'
      }
    ])
  }, [])

  useEffect(() => {
    if (tickets.length > 0) {
      setTabList((prev) => [...prev, ...tickets])
    }
  }, [tickets])

  return (
    <div className='tw-bg-white'>
      <Tabs
        activeKey={tabActive}
        onChange={onChangeTab}
        tabPosition={'left'}
        style={{ height: '93vh' }}
        items={tabList.map((item) => {
          const id = item.id
          return {
            label: item.name,
            key: id,
            children: <TicketDefinationCreate key={id} />
          }
        })}
      />
    </div>
  )
})

export default Index
