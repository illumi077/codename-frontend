import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GameProvider } from './context/GameContext'; // Import GameContext provider
import './styles/global.css'; // Retro global styling

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider> {/* Context wrapper */}
      <App />
    </GameProvider>
  </React.StrictMode>
);
