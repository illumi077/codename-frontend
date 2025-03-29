import React, { useEffect  } from 'react';

function Room() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    console.log('API URL:', apiUrl);
    // Fetch room data or add logic here
  }, [apiUrl]);

  return <div>Room Component</div>;
}

export default Room;