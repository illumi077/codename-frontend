import React from 'react';
import './EndTurnButton.css';

const EndTurnButton = ({ currentTurn, team, onEndTurn }) => {
  // Show the button only for the active team
  if (currentTurn !== team) return null;

  return (
    <div className="end-turn-container">
      <button className="retro-button" onClick={onEndTurn}>
        End Turn
      </button>
    </div>
  );
};

export default EndTurnButton;
