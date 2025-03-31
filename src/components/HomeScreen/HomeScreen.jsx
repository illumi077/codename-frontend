import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css'; // Retro theme styles

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Retro Game!</h1>
      <p className="message">Team up for an exciting, turn-based multiplayer challenge.</p>

      <div className="retro-buttons">
        <button
          className="retro-button"
          onClick={() => navigate('/create-room')}
        >
          Create Room
        </button>
        <button
          className="retro-button"
          onClick={() => navigate('/join-room')}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
