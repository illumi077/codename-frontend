import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useSocket = () => {
  const socket = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      console.log(`Connecting to socket server at: ${BACKEND_URL}`);
      socket.current = io(BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket"],
        reconnectionAttempts: 5,
      });

      socket.current.on("connect", () => {
        console.log(`Socket successfully connected: ${socket.current.id}`);
        setIsReady(true);
      });

      socket.current.on("disconnect", (reason) => {
        console.warn(`Socket disconnected: ${reason}`);
        setIsReady(false);
      });

      socket.current.on("connect_error", (err) => {
        console.error(`Socket connection error: ${err.message}`);
      });
    }

    return () => {
      if (socket.current) {
        console.log(`Disconnecting socket: ${socket.current.id}`);
        socket.current.disconnect();
        socket.current = null;
        setIsReady(false);
      }
    };
  }, []);

  return { socket: socket.current, isSocketReady: isReady };
};
