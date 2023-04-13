import './public-path';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider } from '@arco-design/web-react';
import { GlobalContext } from './context';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
// import '@arco-design/web-react/dist/css/arco.css';

import Layout from './Layout';
import reportWebVitals from './reportWebVitals';
import useStorage from './utils/useStorage';
import changeTheme from './utils/changeTheme';
import rootReducer from './store';
import './styles/global.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const store = createStore(rootReducer);

const Index = () => {
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');

  function getArcoLocale() {
    switch (lang) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  }

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };
  return (
    <BrowserRouter basename={window.__MICRO_APP_BASE_ROUTE__ || '/'}>
      <ConfigProvider
        locale={getArcoLocale()}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              <Route path="/" component={Layout} />
            </Switch>
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

root.render(<Index />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
