import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../sockets/socket";

type RoomEvent = "created" | "joined" | "left" | null;

const useInterviewRoom = () => {
  const { user } = useAuth();

  const [roomID, setRoomID] = useState<string | null>(null);
  const [roomEvent, setRoomEvent] = useState<RoomEvent>(null);
  const [roomError, setRoomError] = useState<string | null>(null);

  // Handle server room events
  useEffect(() => {
    const handleRoomJoined = ({
      roomID,
      created,
    }: {
      roomID: string;
      created: boolean;
    }) => {
      setRoomID(roomID);
      setRoomEvent(created ? "created" : "joined");
      setRoomError(null);
    };

    const handleRoomError = ({ message }: { message: string }) => {
      setRoomError(message);
    };

    socket.on("roomJoined", handleRoomJoined);
    socket.on("roomError", handleRoomError);

    return () => {
      socket.off("roomJoined", handleRoomJoined);
      socket.off("roomError", handleRoomError);
    };
  }, []);

  // Clear room state when user logs out
  useEffect(() => {
    if (!user) {
      setRoomID(null);
      setRoomEvent(null);
      setRoomError(null);
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [user]);

  const createRoom = () => {
    if (!user) return;
    setRoomError(null);
    const roomID = crypto.randomUUID();

    socket.connect();

    socket.emit("joinRoom", {
      roomID,
      username: user.username,
      create: true,
    });
  };

  const joinRoom = (roomID: string) => {
    if (!user) return;
    setRoomError(null);
    socket.connect();

    socket.emit("joinRoom", {
      roomID,
      username: user.username,
      create: false,
    });
  };

  const leaveRoom = () => {
    if (!roomID) return;
    if (!user) return;
    setRoomError(null);
    socket.emit("leaveRoom", {
      roomID,
      username: user.username,
    });

    socket.disconnect();

    setRoomID(null);
    setRoomEvent("left");
  };

  return {
    roomID,
    roomEvent,
    roomError,
    createRoom,
    joinRoom,
    leaveRoom,
  };
};

export default useInterviewRoom;
