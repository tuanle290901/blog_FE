import React from 'react'
import { DatePicker, Form, Modal, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useAppDispatch } from '~/stores/hook'
import { syncTimeAttendanceManual } from '~/stores/features/timesheet/timesheet.slice'

const SyncTimeAttendanceModal: React.FC<{ open: boolean; handleClose: () => void; onSyncSuccess: () => void }> = ({
  open,
  handleClose,
  onSyncSuccess
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const handleSubmit = async () => {
    const formValue = { ...form.getFieldsValue() }
    const payload = {
      fromDate: formValue?.startDate
        ? dayjs(formValue?.startDate).format('YYYY-MM-DD')
        : dayjs().add(-1, 'day').format('YYYY-MM-DD'),
      toDate: formValue?.endDate
        ? dayjs(formValue?.endDate).format('YYYY-MM-DD')
        : dayjs().add(-1, 'day').format('YYYY-MM-DD')
    }
    const hoursBetween = dayjs(formValue?.endDate).diff(dayjs(formValue?.startDate), 'hours')
    if (hoursBetween > 72) {
      notification.warning({
        message: t('timesheet.syncTimeAttendanceWarning')
      })
      return
    }
    if (dayjs(formValue?.endDate) < dayjs(formValue?.startDate)) {
      notification.warning({
        message: t('timesheet.selectDateWarning')
      })
      return
    }
    const response = await dispatch(syncTimeAttendanceManual(payload)).unwrap()
    if (response?.status === 200) {
      notification.success({
        message: response?.message
      })
      onSyncSuccess()
    }
    handleClose()
  }
  return (
    <Modal
      open={open}
      title={t('timesheet.syncTimeAttendance')}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={t('timesheet.sync')}
      cancelText={t('common.cancel')}
      maskClosable={false}
      forceRender
      className='timesheet-form'
    >
      <div className='tw-my-4'>
        <Form form={form} layout='vertical'>
          <Form.Item className='tw-mb-0' name='startDate' label={t('timesheet.startDate')} required>
            <DatePicker
              format='DD/MM/YYYY'
              disabledDate={(date) => {
                return date.isAfter(new Date(form.getFieldValue('endDate'))) || date.isAfter(dayjs().add(-1, 'day'))
              }}
              showToday={false}
              allowClear={false}
              defaultValue={dayjs().add(-1, 'day')}
              className='tw-w-full'
              placeholder={t('timesheet.selectDate')}
            />
          </Form.Item>

          <Form.Item className='tw-mb-0 tw-mt-4' name='endDate' label={t('timesheet.endDate')} required>
            <DatePicker
              format='DD/MM/YYYY'
              disabledDate={(date) => {
                return date.isBefore(new Date(form.getFieldValue('startDate'))) || date.isAfter(dayjs().add(-1, 'day'))
              }}
              showToday={false}
              defaultValue={dayjs().add(-1, 'day')}
              allowClear={false}
              className='tw-w-full'
              placeholder={t('timesheet.selectDate')}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
export default SyncTimeAttendanceModal
