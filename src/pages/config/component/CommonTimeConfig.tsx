import React from 'react'
import WorkingTimeOfTheWeekConfig from '~/pages/config/component/WorkingTimeOfTheWeekConfig.tsx'

const CommonTimeConfig: React.FC = () => {
  return (
    <div className='tw-w-1/2 tw-mx-auto'>
      <WorkingTimeOfTheWeekConfig fieldName='cake' />
    </div>
  )
}
export default CommonTimeConfig
