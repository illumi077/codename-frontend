import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameContext } from "../../hooks/useGameContext";
import { useSocket } from "../../hooks/useSocket";
import { fetchRoomData, leaveRoom } from "../../utils/api";
import "./Room.css";
import Grid from "./Grid";
import PlayerList from "./PlayerList";
import TimerDisplay from "./TimerDisplay";
import StartGameButton from "./StartGameButton";
import EndTurnButton from "./EndTurnButton";
import TurnMessage from "./TurnMessage";

const Room = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { username, role, team } = useGameContext();
  const { socket, isSocketReady } = useSocket(); // Modified to include readiness check
  const [roomData, setRoomData] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState("");
  const [gameStatus, setGameStatus] = useState("");

  useEffect(() => {
    if (!username) {
      navigate("/"); // Redirect if username is missing
      return;
    }

    const fetchRoom = async () => {
      try {
        const data = await fetchRoomData(roomCode);
        setRoomData(data);

        // Ensure socket is ready before emitting events
        if (isSocketReady && socket) {
          console.log("Socket is ready, joining room...");
          socket.emit("joinRoom", { roomCode, username });
        } else {
          console.error("Socket is not initialized or ready");
        }
      } catch (err) {
        setError(`Failed to fetch room data: ${err.message}`);
      }
    };

    fetchRoom();

    // Clean up socket connection when leaving the room
    return () => {
      if (isSocketReady && socket) {
        socket.emit("leaveRoom", { roomCode, username });
        socket.disconnect();
      }
    };
  }, [roomCode, username, navigate, socket, isSocketReady]);

  useEffect(() => {
    if (!isSocketReady || !socket) {
      console.error("Socket is not initialized yet.");
      return;
    }

    console.log("Socket is ready. Setting up listeners...");

    socket.on("roomDataUpdated", (updatedRoomData) => {
      setRoomData(updatedRoomData);
    });

    socket.on("turnUpdated", (updatedTurn) => {
      setCurrentTurn(updatedTurn);
    });

    socket.on("gameEnded", (status) => {
      setGameStatus(status);
    });

    socket.on("error", (message) => {
      setError(message);
    });

    return () => {
      if (socket) {
        socket.off("roomDataUpdated");
        socket.off("turnUpdated");
        socket.off("gameEnded");
        socket.off("error");
      }
    };
  }, [socket, isSocketReady]);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentTurn("Red");
    if (isSocketReady && socket) {
      socket.emit("gameStarted", { roomCode, currentTurn: "Red" });
    } else {
      console.error("Socket is not initialized");
    }
  };

  const handleEndTurn = () => {
    const nextTurn = currentTurn === "Red" ? "Blue" : "Red";
    setCurrentTurn(nextTurn);
    if (isSocketReady && socket) {
      socket.emit("turnEnded", { roomCode, nextTurn });
    } else {
      console.error("Socket is not initialized");
    }
  };

  const handleTimeEnd = () => {
    const nextTurn = currentTurn === "Red" ? "Blue" : "Red";
    setCurrentTurn(nextTurn);
    if (isSocketReady && socket) {
      socket.emit("turnEnded", { roomCode, nextTurn });
    } else {
      console.error("Socket is not initialized");
    }
  };

  const leaveCurrentRoom = async () => {
    try {
      await leaveRoom(roomCode, username);
      navigate("/"); // Redirect to home
    } catch (err) {
      setError(`Failed to leave the room: ${err.message}`);
    }
  };

  const handleGameEnd = (status) => {
    setGameStatus(status);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!roomData) {
    return <p className="loading-message">Loading room data...</p>;
  }

  if (gameStatus) {
    return (
      <div className="game-end-container">
        <h1>{gameStatus}</h1>
        <button className="retro-button" onClick={leaveCurrentRoom}>
          Leave Room
        </button>
      </div>
    );
  }

  return (
    <div className="room-container">
      <h1>Room: {roomCode}</h1>

      <div className="player-details">
        <p>
          <strong>Name:</strong> {username}
        </p>
        <p>
          <strong>Role:</strong> {role}
        </p>
        <p>
          <strong>Team:</strong> {team}
        </p>
      </div>

      {gameStarted ? (
        <>
          <TurnMessage currentTurn={currentTurn} team={team} />
          <TimerDisplay
            duration={60}
            currentTurn={currentTurn}
            onTimeEnd={handleTimeEnd}
          />
          <EndTurnButton
            currentTurn={currentTurn}
            team={team}
            onEndTurn={handleEndTurn}
          />
          {isSocketReady && (
            <Grid
              gridState={roomData?.gridState || [[]]}
              currentTurn={currentTurn}
              setCurrentTurn={setCurrentTurn}
              onGameEnd={handleGameEnd}
              roomCode={roomCode}
            />
          )}
        </>
      ) : (
        <StartGameButton onStartGame={handleStartGame} />
      )}

      <PlayerList players={roomData.players} />
    </div>
  );
};

export default Room;
