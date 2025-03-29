import React from 'react';
import ReactDOM from 'react-dom/client'; // Update to use 'react-dom/client'
import App from './App';

// Use ReactDOM.createRoot for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);