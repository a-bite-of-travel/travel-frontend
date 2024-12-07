import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import router from './routes/route';
import { RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

const theme = createTheme({
  palette: {
    primary: {
      main: '#0fc499', //그린오로라
    },
    secondary: {
      main: '#FF0A73', //pink
    },
    yellow: {
      main: '#FABF13',
    },
    black: {
      main: '#333',
    },
    darkGray: {
      main: '#888',
    },
    lightGray: {
      main: '#d9d9d9',
    },
  }, 
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          "&:hover": {
            color: "#FFFFFF", 
          },
          fontFamily: 'Noto Sans KR, Arial, sans-serif',
        },
        outlined: {
          color: "#0fc499",
          "&:hover": {
            color: "#0fc499", 
          }
        },
        contained: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
        },
        text: {
          color: "#0fc499",
          "&:hover": {
            color: "#0fc499", 
          }
        },
      },
    },
    MuiTypography:{
      styleOverrides: {
        root: {
          fontFamily: 'Noto Sans KR, Arial, sans-serif',
        },
      },
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {/* <AppProvider> */}
          <RouterProvider router={router} />
        {/* </AppProvider> */}
      </AuthProvider >
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
