import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Link to CSS file for styling

// Home component to serve as the landing page
function Home() {
  return (
    <div className="home-container">
      {/* Main title with a retro-inspired design */}
      <h1 className="retro-title">Welcome to Tech Codenames</h1>
      
      {/* Navigation buttons for creating or joining a room */}
      <div className="retro-buttons">
        <Link to="/create-room" className="retro-button">
          Create Room
        </Link>
        <Link to="/join-room" className="retro-button">
          Join Room
        </Link>
      </div>
    </div>
  );
}

export default Home;