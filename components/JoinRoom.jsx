import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.css';

function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Agent'); // Default role
  const [team, setTeam] = useState('Red'); // Default team
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message

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
        setMessage('Successfully joined the room!');
        // Navigate to the room details page (or wherever you want)
        navigate(`/room/${roomCode}`);
      } else {
        setMessage(data.error || 'Failed to join room.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className="join-room-container">
      <h1 className="title">Join an Existing Room</h1>
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
        <button type="submit" className="join-room-button">Join Room</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default JoinRoom;