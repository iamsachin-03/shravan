
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initializeFirebase } from './firebase.js';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  initializeFirebase();
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to initialize Firebase, cannot start the app.", error);
  root.render(
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'red',
        fontFamily: 'Arial, sans-serif'
    }}>
      Failed to load application. Please check the console for more details.
    </div>
  );
}
