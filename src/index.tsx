import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { createTheme, ThemeProvider } from '@mui/material';
import { LinkProps } from '@mui/material/Link';
import LinkRouter from './utils/LinkRouter';
import './index.scss';
import './i18n';
import LoadingBackdrop from './components/LoadingBackdrop/LoadingBackdrop';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const getInitialStore = () => {
  return {
    user: {
      token: localStorage.getItem('token') || '',
    },
  };
};

export const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkRouter,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkRouter,
      },
    },
  },
  palette: {
    primary: {
      main: '#233456',
      contrastText: '#fafafa',
    },
    secondary: {
      main: '#334561',
      contrastText: '#fafafa',
    },
  },
});
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingBackdrop />}>
      <BrowserRouter>
        <Provider store={store(getInitialStore())}>
          <ThemeProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </DndProvider>
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </React.Suspense>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
