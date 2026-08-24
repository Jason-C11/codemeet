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

  socket.join(roomID);

  socket.emit("roomJoined", {
    roomID,
    username,
    created: create,
  });

  console.log(`${socket.id} joined room ${roomID} as ${username}`);
};

const handleLeaveRoom = (socket, { roomID, username }) => {
  socket.leave(roomID);

  console.log(`${socket.id} left room ${roomID} as ${username}`);
};

export { handleJoinRoom, handleLeaveRoom };
