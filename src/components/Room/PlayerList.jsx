import React from 'react';
import './PlayerList.css'; // Retro styles

const PlayerList = ({ players }) => {
  return (
    <div className="player-list-container">
      <h3>Players</h3>
      <ul className="player-list">
        {players.map((player, index) => (
          <li key={index} className={`player-item ${player.team}`}>
            <strong>Name:</strong> {player.name} | <strong>Role:</strong> {player.role} | <strong>Team:</strong> {player.team}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
