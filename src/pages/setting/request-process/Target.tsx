/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useMemo, type FC } from 'react'
import { useDrop } from 'react-dnd'

import { CloseCircleFilled } from '@ant-design/icons'
import { Empty, Space, Tooltip } from 'antd'
import { removeDroppedItem } from '~/stores/features/setting/request-process.slice'
import { useAppDispatch } from '~/stores/hook'
import { DropItem, TargetProps } from '~/types/setting-request-process'
import { ItemTypes } from './ItemTypes'

const Target: FC<TargetProps> = ({ targetKey, onDrop, dropItem, canDropItem }) => {
  const dispatch = useAppDispatch()

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item: DropItem) => {
      onDrop(item, targetKey)
    },
    canDrop: (item) => {
      return canDropItem(item)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  const isActive = useMemo(() => {
    return canDrop && isOver
  }, [canDrop, isOver])

  const dropBoxStyle = {
    backgroundColor: isActive ? '#69c0ff' : canDrop ? '#e7f5ff' : isOver ? '#d5d5d5' : '#ffffff'
  }

  const handleRemoveDroppedItem = (item: DropItem) => {
    const { id, name } = item
    dispatch(removeDroppedItem({ targetKey, id }))
  }

  return (
    <div ref={drop} id={targetKey} data-testid={targetKey} className='dropped-box-item' style={dropBoxStyle}>
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
              <div
                className='tw-absolute tw-top-[-5px] tw-right-[-5px] tw-cursor-pointer'
                onClick={() => handleRemoveDroppedItem(item)}
              >
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