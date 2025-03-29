import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import Room from '../components/Room'; // Import the Room component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/room/:roomCode" element={<Room />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
