/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useMemo, type FC } from 'react'
import { useDrop } from 'react-dnd'

import { CloseCircleFilled } from '@ant-design/icons'
import { Empty, Space, Tooltip } from 'antd'
import { removeDroppedItem } from '~/stores/features/setting/ticket-process.slice'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { DragItem, TargetProps } from '~/types/setting-ticket-process'
import { ItemTypes } from '../type/ItemTypes'

const Target: FC<TargetProps> = ({ targetKey, onDrop, dropItem, canDropItem, isValidStep }) => {
  const dispatch = useAppDispatch()
  const departments = useAppSelector((state) => state.ticketProcess.departments)

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item: DragItem) => {
      onDrop(item, targetKey)
    },
    canDrop: () => canDropItem(),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  const isActive = useMemo(() => {
    return canDrop && isOver
  }, [canDrop, isOver])

  const dropBoxStyle = {
    backgroundColor: isActive ? '#69c0ff' : canDrop ? '#e7f5ff' : isOver ? '#d5d5d5' : '#ffffff',
    border: isValidStep() ? '1px dashed #0100ff' : '1px dashed #b9bec7'
  }

  const convertGroupCodeToName = (groupCode: string) => {
    if (!groupCode) return ''
    const groupName = departments.find((d) => d.id === groupCode)?.name
    if (groupName) return groupName
    return groupCode
  }

  const handleRemoveDroppedItem = (item: DragItem) => {
    const { id, name } = item
    dispatch(removeDroppedItem({ targetKey, id }))
  }

  return (
    <div ref={drop} id={targetKey} data-testid={targetKey} className='dropped-box-item' style={dropBoxStyle}>
      {dropItem?.data.length === 0 && (
        <Empty
          imageStyle={{ height: 60 }}
          description={<span className='tw-text-slate-4D00'>Kéo và thả các thẻ tên vào vị trí này</span>}
        />
      )}
      {dropItem?.data.length > 0 && (
        <Space direction='vertical'>
          {dropItem.data.map((item, index) => (
            <div key={index} className='tw-relative'>
              <Tooltip title={convertGroupCodeToName(item.name)} placement='left'>
                <div className='drop-box__name'>{convertGroupCodeToName(item.name)}</div>
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
