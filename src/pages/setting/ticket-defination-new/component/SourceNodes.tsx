import { Space } from 'antd'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getAllDepartments } from '~/stores/features/department/department.silce'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import '../style.scss'

export const SourceNode = () => {
  const dispatch = useAppDispatch()
  const listDepartment = useAppSelector((state) => state.department.listAll)
  const onDragStart = (event: any, nodeType: any, item: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('id', uuidv4())
    event.dataTransfer.setData('groupCode', item.code)
    event.dataTransfer.setData('title', item.name)
    event.dataTransfer.effectAllowed = 'move'
  }

  useEffect(() => {
    dispatch(getAllDepartments())
  }, [])

  return (
    <>
      <Space
        align='center'
        className={`tw-w-[98%] tw-ml-2 tw-flex tw-items-center ${
          listDepartment.length > 10 ? 'tw-justify-between' : 'tw-justify-center'
        } `}
      >
        {listDepartment?.map((item, index) => {
          return (
            <div
              key={item.code}
              className='box-item-new'
              onDragStart={(event) => onDragStart(event, 'selectorNode', item)}
              draggable
            >
              {item.name}
            </div>
          )
        })}
      </Space>
    </>
  )
}

export default SourceNode
