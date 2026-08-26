import { createRoomState, getRoomState, deleteRoomState } from "./roomState.js";

const handleJoinRoom = (
  io,
  socket,
  { roomID, username, create, problemId, code, testCases },
) => {
  const roomExists = io.sockets.adapter.rooms.has(roomID);

  // User is trying to join an existing room
  if (!create && !roomExists) {
    socket.emit("roomError", {
      message: "Room does not exist.",
    });

    return;
  }

  // User is trying to create an existing room
  if (create && roomExists) {
    socket.emit("roomError", {
      message: "Unable to create room.",
    });

    return;
  }

  socket.data.username = username;
  socket.data.roomID = roomID;

  socket.join(roomID);

  // Create state for a new room using creator's current state
  if (create) {
    createRoomState(roomID, {
      problemId,
      code,
      testCases,
    });
  }

  const users = getRoomUsers(io, roomID);

  io.to(roomID).emit("roomUsers", users);

  socket.emit("roomJoined", {
    roomID,
    username,
    created: create,
  });

  // Send the current state to the user
  socket.emit("roomState", getRoomState(roomID));

  console.log(`${socket.id} joined room ${roomID} as ${username}`);
};

const getRoomUsers = (io, roomID) => {
  const sockets = io.sockets.adapter.rooms.get(roomID);

  if (!sockets) return [];

  return [...sockets].map((socketID) => {
    const socket = io.sockets.sockets.get(socketID);

    return {
      socketID,
      username: socket.data.username,
    };
  });
};

const handleLeaveRoom = (io, socket, { roomID, username }) => {
  socket.leave(roomID);
  socket.data.roomID = null;

  const users = getRoomUsers(io, roomID);

  io.to(roomID).emit("roomUsers", users);

  // Delete room state when nobody is left
  if (users.length === 0) {
    deleteRoomState(roomID);
  }

  console.log(`${socket.id} left room ${roomID} as ${username}`);
};

const handleDisconnect = (io, socket) => {
  const roomID = socket.data.roomID;

  if (!roomID) return;

  const users = getRoomUsers(io, roomID).filter(
    (user) => user.socketID !== socket.id,
  );

  io.to(roomID).emit("roomUsers", users);

  // Delete room state when nobody is left
  if (users.length === 0) {
    deleteRoomState(roomID);
  }

  console.log(`${socket.id} left room ${roomID} as ${socket.data.username}`);
};

const roomHandlers = (io, socket) => {
  socket.on("joinRoom", (data) => {
    handleJoinRoom(io, socket, data);
  });

  socket.on("leaveRoom", (data) => {
    handleLeaveRoom(io, socket, data);
  });

  socket.on("disconnect", () => {
    handleDisconnect(io, socket);
    console.log("Socket disconnected:", socket.id);
  });
};

export default roomHandlers;
