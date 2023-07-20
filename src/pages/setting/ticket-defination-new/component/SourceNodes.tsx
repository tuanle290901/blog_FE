import { useState, useEffect } from 'react'
import { sourceNodes } from '../mockup/mockup'
import '../style.scss'
import { Space } from 'antd'
import { v4 as uuidv4 } from 'uuid'

export const SourceNode = () => {
  const [data, setData] = useState<{ id: string; title: string }[]>([])
  const onDragStart = (event: any, nodeType: any, item: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('id', uuidv4())
    event.dataTransfer.setData('groupCode', item.id)
    event.dataTransfer.setData('title', item.title)
    event.dataTransfer.effectAllowed = 'move'
  }

  useEffect(() => {
    setData(sourceNodes)
  }, [])

  return (
    <>
      <Space
        align='center'
        className={`tw-w-[98%] tw-ml-2 tw-flex tw-items-center ${
          data.length > 10 ? 'tw-justify-between' : 'tw-justify-center'
        } `}
      >
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              className='box-item-new'
              onDragStart={(event) => onDragStart(event, 'selectorNode', item)}
              draggable
            >
              {item.title}
            </div>
          )
        })}
      </Space>
    </>
  )
}

export default SourceNode
