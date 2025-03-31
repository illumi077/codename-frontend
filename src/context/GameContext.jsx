import React, { createContext, useState } from 'react';

// Create GameContext
const GameContext = createContext();

// GameContext Provider component
export const GameProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');

  return (
    <GameContext.Provider
      value={{
        username,
        setUsername,
        roomCode,
        setRoomCode,
        role,
        setRole,
        team,
        setTeam,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; // Export the context itself
