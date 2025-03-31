import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../hooks/useGameContext';
import { useSocket } from '../../hooks/useSocket';
import './Grid.css';

const Grid = ({ gridState = [[]], currentTurn, setCurrentTurn, onGameEnd, roomCode }) => {
  const { role, team } = useGameContext();
  const { socket, isSocketReady } = useSocket();
  const [localGridState, setLocalGridState] = useState(gridState);

  useEffect(() => {
    console.log('Initial gridState:', gridState); // Debugging log for gridState
    console.log('Local gridState:', localGridState);

    if (!isSocketReady || !socket) {
      console.warn('Socket is not ready yet for grid updates.');
      return;
    }

    console.log('Setting up socket listener for grid updates.');

    // Listen for grid updates from the server
    socket.on('gridUpdated', (updatedGrid) => {
      console.log('Received gridUpdated event:', updatedGrid);
      if (Array.isArray(updatedGrid) && updatedGrid.length) {
        setLocalGridState(updatedGrid); // Update grid state if valid
      } else {
        console.error('Invalid gridUpdated data received:', updatedGrid);
      }
    });

    return () => {
      if (socket) {
        socket.off('gridUpdated');
      }
    };
  }, [socket, isSocketReady, gridState, localGridState]);

  if (!localGridState.length || !Array.isArray(localGridState[0])) {
    return <p className="error-message">Grid data is unavailable or invalid.</p>;
  }

  const handleCellClick = (row, col) => {
    if (role !== 'Agent' || currentTurn !== team) return;

    const tile = localGridState[row]?.[col];
    if (!tile || tile.revealed) return;

    const updatedGrid = localGridState.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((cell, colIndex) =>
            colIndex === col ? { ...cell, revealed: true } : cell
          )
        : r
    );

    setLocalGridState(updatedGrid);

    if (isSocketReady && socket) {
      console.log('Emitting tileClicked event to server:', { row, col, roomCode, team });
      socket.emit('tileClicked', { row, col, roomCode, team });
    }

    if (tile.color === 'black') {
      onGameEnd(`${team === 'Red' ? 'Blue' : 'Red'} wins!`);
      return;
    }

    if (tile.color === 'grey' || tile.color !== team) {
      setCurrentTurn(currentTurn === 'Red' ? 'Blue' : 'Red');
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
