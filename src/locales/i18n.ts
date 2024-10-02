import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./recources";
// 检测当前浏览器的语言
// import Backend from 'i18next-http-backend';
// 从服务器获取配置资源
// import LanguageDetector from 'i18next-browser-languagedetector';
// import resources from './locales/resources'
const currentLanguage = window.localStorage.getItem('i18next-language');
i18n
//   .use(Backend)
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: currentLanguage ? currentLanguage : "zh",
    lng: currentLanguage ? currentLanguage : "zh",
    debug: true,
    resources: resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
