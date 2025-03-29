import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateRoom.css';

function CreateRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Spymaster'); // Default role
  const [team, setTeam] = useState('Red'); // Default team
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true); // Show loading state

    // Input validation
    if (!roomCode.trim() || !username.trim()) {
      setMessage('Please fill in all fields before creating the room.');
      setLoading(false); // Reset loading
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode,
          creator: {
            username,
            role,
            team,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('username', username); // Save username for later use
        setMessage('Room created successfully!');
        navigate(`/room/${roomCode}`); // Navigate to the Room.jsx page
      } else {
        setMessage(data.error || 'Failed to create room.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      console.error('Error creating room:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="create-room-container">
      <h1 className="retro-title">Create a New Room</h1>
      <form className="create-room-form" onSubmit={handleCreateRoom}>
        <label>
          Room Code:
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            required
            placeholder="Enter room code"
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </label>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Spymaster">Spymaster</option>
            <option value="Agent">Agent</option>
          </select>
        </label>
        <label>
          Team:
          <select value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
          </select>
        </label>
        <button type="submit" className="retro-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Room'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default CreateRoom;
