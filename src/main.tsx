import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { Provider } from 'react-redux'
import { store } from '~/stores/store.ts'
import { I18nextProvider } from 'react-i18next'
import i18n from '~/config/i18n.ts'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import vi_VN from 'antd/es/locale/vi_VN'
import 'dayjs/locale/vi'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={vi_VN}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    </ConfigProvider>
  </React.StrictMode>
)
