import axios from 'axios'; // Import axios for API calls

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // Backend base URL

// Fetch room data
export const fetchRoomData = async (roomCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/rooms/${roomCode}`);
    return response.data; // Return room data
  } catch (error) {
    console.error('Error fetching room data:', error);
    throw error;
  }
};

// Leave a room
export const leaveRoom = async (roomCode, username) => {
  try {
    await axios.delete(`${BASE_URL}/api/rooms/leave`, {
      data: { roomCode, username }, // Axios allows sending body with DELETE
    });
  } catch (error) {
    console.error('Error leaving room:', error);
    throw error;
  }
};

// Save grid state (if needed later)
export const saveGridState = async (roomCode, gridState) => {
  try {
    await axios.put(`${BASE_URL}/api/rooms/grid`, { roomCode, gridState });
  } catch (error) {
    console.error('Error saving grid state:', error);
    throw error;
  }
};

// Fetch players data (if roomData doesn't include players)
export const fetchPlayers = async (roomCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/rooms/${roomCode}/players`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

// Any additional API functions can be added here...
