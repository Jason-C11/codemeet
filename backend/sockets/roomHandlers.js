const handleJoinRoom = (io, socket, { roomID, username, create }) => {
  const roomExists = io.sockets.adapter.rooms.has(roomID);

  // User is trying to join an existing room
  if (!create && !roomExists) {
    socket.emit("roomError", {
      message: "Room does not exist.",
    });
    console.log(`Room ${roomID} does not exist.`);

    return;
  }

  // Room ID already exists
  if (create && roomExists) {
    socket.emit("roomError", {
      message: "Unable to create room.",
    });
    console.log(`Room ${roomID} already exists.`);
    return;
  }

  socket.data.username = username;
  socket.data.roomID = roomID;
  socket.join(roomID);

  const users = getRoomUsers(io, roomID);

  io.to(roomID).emit("roomUsers", users);

  socket.emit("roomJoined", {
    roomID,
    username,
    created: create,
  });

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
  console.log(`${socket.id} left room ${roomID} as ${username}`);
};

const handleDisconnect = (io, socket) => {
  const roomID = socket.data.roomID;

  if (!roomID) return;

  const users = getRoomUsers(io, roomID).filter(
    (user) => user.socketID !== socket.id,
  );

  io.to(roomID).emit("roomUsers", users);

  console.log(`${socket.id} left room ${roomID} as ${socket.data.username}`);
};
export { handleJoinRoom, handleLeaveRoom, handleDisconnect };
