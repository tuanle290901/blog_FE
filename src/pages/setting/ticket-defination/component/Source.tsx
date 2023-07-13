import type { FC } from 'react'
import { useDrag } from 'react-dnd'

import { ItemTypes } from '../type/ItemTypes'

import { DragItem, DropItem } from '~/types/setting-ticket-process'
import '../style.scss'

const Source: FC<DragItem> = function Source({ id, name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { id, name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropItem>()
      if (item && dropResult) {
        // TODO
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId()
    })
  }))

  const isDraggingStyle = {
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: isDragging ? 'grey' : 'white'
  }

  return (
    <div ref={drag} className='box-item' style={isDraggingStyle} id={id} data-testid={id}>
      {name}
    </div>
  )
}

export default Source
