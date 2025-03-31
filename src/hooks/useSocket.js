import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Use environment variable for backend URL

export const useSocket = () => {
  const socket = useRef(null); // Use `useRef` to persist the socket instance across re-renders

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io(BACKEND_URL, {
      withCredentials: true,
    });

    // Cleanup the socket connection on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return socket.current; // Return the socket instance for use in components
};
