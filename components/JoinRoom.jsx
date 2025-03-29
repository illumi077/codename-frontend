import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.css';

function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Agent'); // Default role
  const [team, setTeam] = useState('Red'); // Default team
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true); // Show loading state

    // Input validation
    if (!roomCode.trim() || !username.trim()) {
      setMessage('Please fill in all fields before joining the room.');
      setLoading(false); // Reset loading
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode,
          username,
          role,
          team,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('username', username); // Save username for future use
        setMessage('Successfully joined the room!');
        navigate(`/room/${roomCode}`); // Redirect to Room.jsx
      } else {
        setMessage(data.error || `Unable to join room with code: ${roomCode}.`);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      console.error('Error joining room:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="join-room-container">
      <h1 className="retro-title">Join an Existing Room</h1>
      <form className="join-room-form" onSubmit={handleJoinRoom}>
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
            <option value="Agent">Agent</option>
            <option value="Spymaster">Spymaster</option>
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
          {loading ? 'Joining...' : 'Join Room'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default JoinRoom;
