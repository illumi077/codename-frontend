import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen/Homescreen.jsx';
import CreateRoom from './components/CreateRoom/CreateRoom';
import JoinRoom from './components/JoinRoom/JoinRoom';
import Room from './components/Room/Room';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Screen */}
        <Route path="/" element={<HomeScreen />} />

        {/* Create Room */}
        <Route path="/create-room" element={<CreateRoom />} />

        {/* Join Room */}
        <Route path="/join-room" element={<JoinRoom />} />

        {/* Room */}
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
