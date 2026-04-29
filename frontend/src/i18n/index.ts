import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTW from './locales/zh-TW'
import en from './locales/en'

const LANG_KEY = 'preferred_lang'

export const defaultLang = localStorage.getItem(LANG_KEY) ?? 'zh-TW'

i18n.use(initReactI18next).init({
  resources: {
    'zh-TW': { translation: zhTW },
    en: { translation: en },
  },
  lng: defaultLang,
  fallbackLng: 'zh-TW',
  interpolation: { escapeValue: false },
})

export function setLanguage(lang: string) {
  i18n.changeLanguage(lang)
  localStorage.setItem(LANG_KEY, lang)
}

export default i18n
