import { StrictMode } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#f44336',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
