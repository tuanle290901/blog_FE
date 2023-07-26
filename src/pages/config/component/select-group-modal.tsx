import { Button, Form, Modal, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { IPosition } from '~/types/position.interface.ts'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '~/stores/hook.ts'
import { getAllGroup } from '~/stores/features/master-data/master-data.slice.ts'

const SelectGroupModal: React.FC<{
  open: boolean
  handleClose: (group?: { code: string; name: string }) => void
  ignoreGroupCode: string[]
}> = ({ open, handleClose, ignoreGroupCode }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [selectedGroup, setSelectedGroup] = useState<any>()
  const groups = useAppSelector((state) => state.masterData.groups)
  const groupOptions = useMemo<{ value: string | null; label: string }[]>(() => {
    const filterGroups = groups.filter((item) => !ignoreGroupCode.includes(item.code))
    return filterGroups.map((item) => {
      return { value: item.code, label: item.name }
    })
  }, [groups, ignoreGroupCode])
  const handleSubmit = () => {
    handleClose({ code: selectedGroup.value, name: selectedGroup.label })
    setSelectedGroup(undefined)
  }
  return (
    <Modal
      open={open}
      title='Chọn phòng ban'
      onCancel={() => handleClose()}
      footer={
        <div className={'tw-flex tw-justify-end'}>
          <Button onClick={() => handleClose()}>{t('common.cancel')}</Button>
          <Button type='primary' onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </div>
      }
      maskClosable={false}
      forceRender
      centered
    >
      <Select
        className='tw-w-full'
        value={selectedGroup?.value}
        onChange={(value, option) => setSelectedGroup(option)}
        options={groupOptions}
        placeholder={t('userModal.selectDepartment')}
      ></Select>
    </Modal>
  )
}
export default SelectGroupModal
