import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext'; // Access global state
import { useSocket } from '../../hooks/useSocket'; // Real-time communication
import './Grid.css'; // Retro styles

const Grid = ({ gridState, currentTurn, setCurrentTurn, onGameEnd, roomCode }) => {
  const { role, team } = useGameContext(); // Get the user's role and team
  const socket = useSocket(); // Access the WebSocket instance
  const [localGridState, setLocalGridState] = useState(gridState); // Local state for grid

  useEffect(() => {
    // Listen for grid updates from the server
    socket.on('gridUpdated', (updatedGrid) => {
      setLocalGridState(updatedGrid); // Sync grid state from server
    });

    return () => {
      socket.off('gridUpdated'); // Clean up socket listener
    };
  }, [socket]);

  const handleCellClick = (row, col) => {
    // Prevent Spymasters or Agents not in turn from interacting
    if (role !== 'Agent' || currentTurn !== team) return;

    const tile = localGridState[row][col]; // Get the tile details

    if (tile.revealed) return; // Prevent interacting with already revealed tiles

    const updatedGrid = [...localGridState];
    updatedGrid[row][col].revealed = true; // Mark tile as revealed

    setLocalGridState(updatedGrid);

    // Emit the tile interaction event to the server
    socket.emit('tileClicked', { row, col, roomCode, team });

    // Game-ending condition: black tile clicked
    if (tile.color === 'black') {
      onGameEnd(`${team === 'Red' ? 'Blue' : 'Red'} wins!`);
      return;
    }

    // Turn logic: Wrong tile clicked
    if (tile.color === 'grey' || tile.color !== team) {
      setCurrentTurn(currentTurn === 'Red' ? 'Blue' : 'Red'); // Switch turn to the opposite team
    }
  };

  return (
    <div className="grid-container">
      {localGridState.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`grid-cell ${
                role === 'Spymaster' ? cell.color : cell.revealed ? `revealed-hidden-text ${cell.color}` : 'hidden'
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {role === 'Spymaster' || cell.revealed ? cell.color : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
