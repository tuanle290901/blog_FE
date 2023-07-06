import type { FC } from 'react'
import { useDrop } from 'react-dnd'

import { Empty, Space, Tooltip } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { ItemTypes } from './ItemTypes'
import { DropItem, DustbinProps } from '~/types/setting-request-process'

const Target: FC<DustbinProps> = ({ dustbinKey, onDrop, dropItem }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item: DropItem) => {
      onDrop(item, dustbinKey)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && dropItem.length === 0,
      canDrop: monitor.canDrop()
    })
  }))

  function hasDuplicates(arr: any[]) {
    console.log(arr, 'arr')
    const uniqueValues = new Set(arr)
    return arr.length !== uniqueValues.size
  }

  const isActive = canDrop && isOver

  const dropBoxStyle = {
    backgroundColor: isActive ? '#69c0ff' : canDrop ? '#e7f5ff' : '#ffffff'
  }

  return (
    <div ref={drop} id={dustbinKey} data-testid={dustbinKey} className='dropped-box-item' style={dropBoxStyle}>
      {dropItem?.length === 0 && (
        <Empty
          imageStyle={{ height: 60 }}
          description={<span className='tw-text-slate-4D00'>Kéo và thả các thẻ tên vào vị trí này</span>}
        />
      )}
      {dropItem?.length > 0 && (
        <Space direction='vertical'>
          {dropItem.map((item: DropItem, index: number) => (
            <div key={index} className='tw-relative'>
              <Tooltip title={item.name} placement='left'>
                <div className='drop-box__name'>{item.name}</div>
              </Tooltip>
              <div className='tw-absolute tw-top-[-5px] tw-right-[-5px] tw-cursor-pointer'>
                <CloseCircleFilled />
              </div>
            </div>
          ))}
        </Space>
      )}
    </div>
  )
}

export default Target
