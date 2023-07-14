import React from 'react'
import { Button, Image } from 'antd'
import { useTranslation } from 'react-i18next'
import DefaultImage from '~/assets/images/default-img.png'
import IconBag from '~/assets/images/timesheet/icon_bag.png'
import { IAttendance } from '~/types/attendance.interface'
import { IUser } from '~/types/user.interface'

const TimesheetInfo: React.FC<{ data: IAttendance[]; handleOpenModal: any; userInfo: IUser | null }> = ({
  data,
  handleOpenModal,
  userInfo
}) => {
  const [t] = useTranslation()

  return (
    <div className='timesheet-short'>
      <div className='tw-text-center'>
        <Image
          className='tw-max-w-[130px] tw-rounded-[50%]'
          src={`data:image/png;base64,${userInfo?.avatarBase64}` || DefaultImage}
          alt=''
        />
        <p className='timesheet-short__fullname'>{userInfo?.fullName || userInfo?.userName}</p>
        <p className='timesheet-short__department'>
          {userInfo?.groupProfiles
            ? userInfo?.groupProfiles[0]?.groupName || userInfo?.groupProfiles[0]?.groupCode
            : ''}
        </p>
        <div className='tw-flex tw-justify-center tw-items-center tw-mt-4'>
          <img className='tw-max-w-[100%]' src={IconBag} alt='' />
          <p>
            <span className='tw-mx-2 tw-text-[20px] tw-font-bold'>{data?.length}</span>ngày công
          </p>
        </div>
      </div>
      <div className='timesheet-short-info'>
        <div className='timesheet-short-info__item'>
          <p>
            <span>1</span>giờ
          </p>
          <p>Làm thêm (OT)</p>
        </div>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>ngày
          </p>
          <p>Nghỉ bù</p>
        </div>
      </div>
      <div className='timesheet-short-info timesheet-short-info--onbussiness'>
        <div className='timesheet-short-info__item'>
          <p className='tw-border-t-cyan-950'>
            <span>0</span>ngày
          </p>
          <p>Đi công tác</p>
        </div>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>ngày
          </p>
          <p>Nghỉ phép</p>
        </div>
      </div>
      <div className='timesheet-short-info timesheet-short-info--violate'>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>lần
          </p>
          <p>Vi phạm</p>
        </div>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>ngày
          </p>
          <p>Nghỉ không phép</p>
        </div>
      </div>
      <div className='tw-mt-20'>
        <Button className='timesheet-short-info__add' size='middle' onClick={() => handleOpenModal(true)}>
          Thêm phép
        </Button>
      </div>
      <div className='tw-mt-3'>
        <Button className='timesheet-short-info__config' size='middle' onClick={() => handleOpenModal(true)}>
          Thời gian làm việc cá nhân
        </Button>
      </div>
    </div>
  )
}

export default TimesheetInfo
