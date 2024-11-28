import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import router from './routes/route';
import { RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: '#0082FF', //blue
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
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider >
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
