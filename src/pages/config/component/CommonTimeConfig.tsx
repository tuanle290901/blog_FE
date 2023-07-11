import React, { RefObject, useRef, useState } from 'react'
import { fakeData, IWorkingDayConfig } from '~/types/WorkingTime.interface.ts'
import { Button } from 'antd'
import DayConfigItem, { RefType } from '~/pages/config/component/DayConfigItem.tsx'

const WorkingTimeForDayConfig: React.FC<{ fieldName: string }> = ({ fieldName }) => {
  const [data, setData] = useState(fakeData.workingDays)
  const refList = useRef<any>(new Array(7).fill(useRef<RefType>(null)))

  const handleDataChange = (data: IWorkingDayConfig) => {
    console.log(data)
  }

  const save = () => {
    console.log(refList)
    refList.current.forEach((ref: RefObject<RefType>) => {
      ref.current?.submit()
    })
  }

  return (
    <div>
      {data.map((item, index) => {
        return (
          <DayConfigItem
            ref={refList.current[index]}
            key={index}
            className='tw-w-full tw-my-2'
            config={item}
            onFinish={handleDataChange}
          />
        )
      })}
      <Button onClick={save}>Submit</Button>
    </div>
  )
}
const CommonTimeConfig: React.FC = () => {
  return (
    <div className='tw-w-1/2 tw-mx-auto'>
      <WorkingTimeForDayConfig fieldName='cake' />
    </div>
  )
}
export default CommonTimeConfig
