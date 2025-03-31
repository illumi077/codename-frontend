import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../context/GameContext'; // Import GameContext
import './JoinRoom.css'; // Retro styles
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const JoinRoom = () => {
  const navigate = useNavigate();
  const { username, setUsername, roomCode, setRoomCode, role, setRole } = useGameContext(); // Access global state
  const [error, setError] = useState('');

  const handleJoinRoom = async () => {
    if (!roomCode || !username || !role) {
      setError('Room Code, Username, and Role are required!');
      return;
    }

    const userDetails = { username, role, team: 'Blue' };

    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, ...userDetails }),
      });

      if (response.ok) {
        navigate(`/room/${roomCode}`); // Navigate to the room
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to join room.');
      }
    } catch (err) {
      setError(`An error occurred while joining the room: ${err.message}`);
    }
  };

  return (
    <div className="join-room-container">
      <h1>Join a Room</h1>
      <input
        type="text"
        placeholder="Enter Room Code"
        className="retro-input"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)} // Update global state
      />
      <input
        type="text"
        placeholder="Enter Your Username"
        className="retro-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)} // Update global state
      />
      <select
        className="retro-select"
        value={role}
        onChange={(e) => setRole(e.target.value)} // Update global state
      >
        <option value="">Select Your Role</option>
        <option value="Spymaster">Spymaster</option>
        <option value="Agent">Agent</option>
      </select>
      {error && <p className="error-message">{error}</p>}
      <button className="retro-button" onClick={handleJoinRoom}>
        Join Room
      </button>
    </div>
  );
};

export default JoinRoom;
