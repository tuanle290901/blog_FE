/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import commonEN from './translations/en/common.json'
import commonVN from './translations/vn/common.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: { translation: { ...commonEN } },
      vi: { translation: { ...commonVN } }
    }
  })

export default i18n
