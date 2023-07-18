import { Tabs } from 'antd'
import { FC, memo, useState } from 'react'
import TicketDefinationCreate from './TicketDefinationCreate'
import { useAppSelector } from '~/stores/hook'

const Index: FC = memo(function Index() {
  const tickets = useAppSelector((item) => item.ticketProcess.tickets)
  const [tabActive, setTabActive] = useState('')

  const onChangeTab = (tabId: string) => {
    setTabActive(tabId)
  }
  return (
    <Tabs
      activeKey={tabActive}
      onChange={onChangeTab}
      tabPosition={'left'}
      style={{ height: '85vh' }}
      items={tickets.map((item) => {
        const id = item.id
        return {
          label: item.name,
          key: id,
          children: <TicketDefinationCreate id={tabActive} />
        }
      })}
    />
  )
})

export default Index
