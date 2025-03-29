import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/Room.css';

const socket = io('https://codename-backend.onrender.com'); // Connect to backend's Socket.IO server

function Room() {
  const { roomCode } = useParams(); // Retrieve room code from the URL
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(45); // Initialize timer
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Joining Room with Code:', roomCode);
    socket.emit('joinRoom', roomCode);

    const fetchRoomData = async () => {
      try {
        const response = await fetch(`https://codename-backend.onrender.com/api/rooms/${roomCode}`);
        const data = await response.json();
        console.log('Fetched Room Data:', data);
        if (response.ok) {
          setRoomData(data);
        } else {
          setError(data.error || 'Failed to fetch room details.');
          navigate('/');
        }
      } catch (err) {
        setError('An error occurred while fetching room details.');
        console.error('Fetch Error:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();

    // Socket.IO listeners for real-time updates
    socket.on('updatePlayers', (updatedPlayers) => {
      setRoomData((prevRoomData) => ({
        ...prevRoomData,
        players: updatedPlayers,
      }));
    });

    socket.on('updateTile', ({ index }) => {
      setRoomData((prevData) => {
        const updatedRevealedTiles = [...prevData.revealedTiles];
        updatedRevealedTiles[index] = true;
        return {
          ...prevData,
          revealedTiles: updatedRevealedTiles,
        };
      });
    });

    socket.on('gameStarted', ({ currentTurnTeam }) => {
      setRoomData((prevData) => ({
        ...prevData,
        currentTurnTeam,
        gameState: 'active',
      }));
      setTimer(45); // Reset timer
    });

    socket.on('gameEnded', ({ result }) => {
      alert(result);
      setRoomData((prevData) => ({
        ...prevData,
        gameState: 'ended',
      }));
    });

    return () => {
      socket.emit('leaveRoom', roomCode);
      socket.off('updatePlayers');
      socket.off('updateTile');
      socket.off('gameStarted');
      socket.off('gameEnded');
    };
  }, [roomCode, navigate]);
  const currentPlayer = roomData?.players?.find(
    (player) => player.username === sessionStorage.getItem('username')
  );
  
  if (!currentPlayer) {
    console.error('Current player not found. Check sessionStorage username or backend data.');
  }
  const handleStartGame = async () => {
    try {
      const response = await fetch('https://codename-backend.onrender.com/api/rooms/startGame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to start the game.');
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleLeaveRoom = async () => {
    const username = sessionStorage.getItem('username');
    try {
      const response = await fetch('https://codename-backend.onrender.com/api/rooms/leave', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, username }),
      });

      const data = await response.json();
      if (response.status === 200) {
        socket.emit('playerLeft', { roomCode, players: data.players });
        sessionStorage.removeItem('username');
        navigate('/');
      } else {
        alert(data.error || 'Failed to leave the room.');
      }
    } catch (error) {
      console.error('Error leaving the room:', error);
    }
  };

  const handleEndTurn = useCallback(async () => {
    try {
      const response = await fetch('https://codename-backend.onrender.com/api/rooms/endTurn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode }),
      });
      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to end turn.');
      }
    } catch (error) {
      console.error('Error ending turn:', error);
    }
  }, [roomCode]);

  useEffect(() => {
    if (roomData?.currentTurnTeam === currentPlayer?.team && roomData?.gameState === 'active') {
      if (timer > 0) {
        const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
        return () => clearTimeout(countdown);
      } else {
        handleEndTurn(); // Automatically end the turn when the timer runs out
      }
    }
  }, [timer, roomData, currentPlayer?.team, handleEndTurn]);

  if (loading) {
    return <div className="loading">Loading room details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="room-container">
      <div className="player-info">
        <h2 className="player-name">{currentPlayer?.username || 'Unknown Player'}</h2>
        <p className="player-role">{currentPlayer?.role || 'Role Unavailable'}</p>
        <p className="player-team">{currentPlayer?.team || 'Team Unavailable'} Team</p>
      </div>
  
      {/* Game State Information */}
      {roomData.gameState === 'active' && (
        <div className="game-info">
          {roomData.currentTurnTeam === currentPlayer?.team ? (
            <h3>Time Remaining: {timer}s</h3>
          ) : (
            <h3>It's {roomData.currentTurnTeam} Team's Turn</h3>
          )}
        </div>
      )}
      {roomData.gameState === 'waiting' && (
        <h3>The game hasn't started yet. Waiting for players...</h3>
      )}
      {roomData.gameState === 'ended' && (
        <h3>The game has ended! Check the results!</h3>
      )}
  
      {/* Game Grid */}
      <div className="grid">
        {roomData.wordSet.map((word, index) => {
          const tileClass = currentPlayer?.role === 'Spymaster'
            ? roomData.patterns[index]
            : roomData.revealedTiles[index]
            ? roomData.patterns[index]
            : '';
  
          return (
            <div
              key={index}
              className={`tile ${tileClass}`}
              onClick={() => {
                if (
                  roomData.currentTurnTeam === currentPlayer?.team &&
                  currentPlayer?.role !== 'Spymaster' &&
                  !roomData.revealedTiles[index]
                ) {
                  socket.emit('tileRevealed', { roomCode, index });
                }
              }}
            >
              {roomData.revealedTiles[index] ? '' : word}
            </div>
          );
        })}
      </div>
  
      {/* Buttons Section: Start Game and Leave Room */}
      <div className="action-buttons">
        {roomData.gameState === 'waiting' &&
          currentPlayer?.team === 'Red' &&
          currentPlayer?.role === 'Agent' && (
            <button className="retro-button" onClick={handleStartGame}>
              Start Game
            </button>
          )}
        <button className="retro-button" onClick={handleLeaveRoom}>
          Leave Room
        </button>
      </div>
  
      {/* Player List */}
      <div className="player-list">
        <h3>Players in the Room:</h3>
        <ul>
          {roomData.players.map((player, index) => (
            <li key={index} className="player-item">
              <strong>{player.username}</strong> - {player.role} ({player.team})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
}

export default Room;
