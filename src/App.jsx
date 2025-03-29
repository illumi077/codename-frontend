import React, { useEffect, useState } from 'react';

const App = () => {
  const [healthMessage, setHealthMessage] = useState('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('https://codename-backend.onrender.com/health');
        const text = await response.text();
        setHealthMessage(text);
      } catch (error) {
        console.error('Error fetching /health route:', error);
        setHealthMessage('Unable to connect to the backend!');
      }
    };

    fetchHealth();
  }, []);

  return (
    <div>
      <h1>Codenames App</h1>
      <p>Backend Health: {healthMessage}</p>
    </div>
  );
};

export default App;