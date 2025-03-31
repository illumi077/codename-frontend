import React from 'react';
import './StartGameButton.css';

const StartGameButton = ({ onStartGame }) => {
  return (
    <div className="start-game-container">
      <button className="retro-button" onClick={onStartGame}>
        Start Game
      </button>
    </div>
  );
};

export default StartGameButton;
