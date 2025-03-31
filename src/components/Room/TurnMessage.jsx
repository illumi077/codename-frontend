import React from 'react';
import './TurnMessage.css';

const TurnMessage = ({ currentTurn, team }) => {
  return (
    <div className="turn-message-container">
      {currentTurn === team ? (
        <h3>It's your turn!</h3>
      ) : (
        <h3>Waiting for {currentTurn} Team...</h3>
      )}
    </div>
  );
};

export default TurnMessage;
