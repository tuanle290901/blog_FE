import React from 'react'
import { Button, Image } from 'antd'
import { useTranslation } from 'react-i18next'
import DefaultImage from '~/assets/images/default-img.png'
import IconBag from '~/assets/images/timesheet/icon_bag.png'
import { IAttendance } from '~/types/attendance.interface'
import { IUser } from '~/types/user.interface'
import { IPaging } from '~/types/api-response.interface'

const TimesheetInfo: React.FC<{ data: IAttendance[]; handleOpenModal: any; userInfo: IUser | null; meta: IPaging }> = ({
  data,
  handleOpenModal,
  userInfo,
  meta
}) => {
  const { t } = useTranslation()

  return (
    <div className='timesheet-short'>
      <div className='tw-text-center'>
        <Image
          className='tw-max-w-[130px] tw-rounded-[50%]'
          src={userInfo?.avatarBase64 ? `data:image/png;base64,${userInfo?.avatarBase64}` : DefaultImage}
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
            <span className='tw-mx-2 tw-text-[20px] tw-font-bold'>{meta?.total}</span>
            {/* {t('timesheet.workingDay')} */}
          </p>
        </div>
      </div>
      <div className='timesheet-short-info'>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>
            {t('timesheet.hour')}
          </p>
          <p>{t('timesheet.overtime')}</p>
        </div>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>
            {t('timesheet.day')}
          </p>
          <p>{t('timesheet.compensatoryLeave')}</p>
        </div>
      </div>
      <div className='timesheet-short-info timesheet-short-info--onbussiness'>
        <div className='timesheet-short-info__item'>
          <p className='tw-border-t-cyan-950'>
            <span>0</span>
            {t('timesheet.day')}
          </p>
          <p>{t('timesheet.bussinessTrip')}</p>
        </div>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>
            {t('timesheet.day')}
          </p>
          <p>{t('timesheet.approvedLeave')}</p>
        </div>
      </div>
      <div className='timesheet-short-info timesheet-short-info--violate'>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>
            {t('timesheet.bout')}
          </p>
          <p>{t('timesheet.violate')}</p>
        </div>
        <div className='timesheet-short-info__item'>
          <p>
            <span>0</span>
            {t('timesheet.day')}
          </p>
          <p>{t('timesheet.leaveWithoutReason')}</p>
        </div>
      </div>
      {/* <div className='tw-mt-20'>
        <Button className='timesheet-short-info__add' size='middle' onClick={() => handleOpenModal(true)}>
          {t('timesheet.requestLeave')}
        </Button>
      </div>
      <div className='tw-mt-3'>
        <Button className='timesheet-short-info__config' size='middle' onClick={() => handleOpenModal(true)}>
          {t('timesheet.personalWorkingTime')}
        </Button>
      </div> */}
    </div>
  )
}

export default TimesheetInfo
