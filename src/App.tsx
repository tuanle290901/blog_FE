import React from 'react'
import './App.scss'
import { useTranslation } from 'react-i18next'

const App: React.FC = () => {
  const [t] = useTranslation()
  return (
    <h1 className='tw-text-3xl tw-text-center tw-text-red-500 tw-mt-10 tw-w-full tw-font-bold tw-underline'>
      {t('common.title')}
    </h1>
  )
}

export default App
