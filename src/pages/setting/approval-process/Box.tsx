import type { FC } from 'react'
import { useDrag } from 'react-dnd'

import { ItemTypes } from './ItemTypes'

import './style.scss'

export interface BoxProps {
  id: string
  name: string
}

interface DropResult {
  id: string
  name: string
}

export const Box: FC<BoxProps> = function Box({ id, name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      //   if (item && dropResult) {
      //     console.log(item.name, dropResult, 'drag')
      //   }
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
