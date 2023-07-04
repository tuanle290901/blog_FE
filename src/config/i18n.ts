/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from '~/assets/locales'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ['vi'],
    lng: localStorage.getItem('i18nextLng') ?? 'vi',
    fallbackLng: 'vi',
    detection: {
      order: ['localStorage', 'cookie', 'sessionStorage', 'navigator', 'path', 'htmlTag', 'subdomain'],
      caches: ['localStorage']
    },
    resources,
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true
    }
  })
export default i18n
