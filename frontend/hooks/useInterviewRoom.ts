import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../sockets/socket";

type RoomEvent = "created" | "joined" | "left" | null;

type RoomUser = {
  socketID: string;
  username: string;
};

const useInterviewRoom = () => {
  const { user } = useAuth();

  const [roomID, setRoomID] = useState<string | null>(null);
  const [roomEvent, setRoomEvent] = useState<RoomEvent>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);

  const resetRoomState = () => {
    setRoomID(null);
    setRoomEvent(null);
    setRoomError(null);
    setRoomUsers([]);
  };

  const disconnectSocket = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

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

  // Handle room users update
  useEffect(() => {
    const handleRoomUsers = (users: RoomUser[]) => {
      setRoomUsers(users);
    };

    socket.on("roomUsers", handleRoomUsers);

    return () => {
      socket.off("roomUsers", handleRoomUsers);
    };
  }, []);

  // Clear room state when user logs out
  useEffect(() => {
    if (!user) {
      resetRoomState();
      disconnectSocket();
    }
  }, [user]);

  // Disconnect when leaving the interview page
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

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
    if (!roomID || !user) return;

    setRoomError(null);

    socket.emit("leaveRoom", {
      roomID,
      username: user.username,
    });

    disconnectSocket();
    resetRoomState();
    setRoomEvent("left");
  };

  return {
    roomID,
    roomEvent,
    roomError,
    roomUsers,
    createRoom,
    joinRoom,
    leaveRoom,
  };
};

export default useInterviewRoom;
