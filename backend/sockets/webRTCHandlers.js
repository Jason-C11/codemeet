const webRTCHandlers = (io, socket) => {
  // ==================== helper
  const findSocketByUsername = (io, roomID, username) => {
    const room = io.sockets.adapter.rooms.get(roomID);

    if (!room) return null;

    for (const socketID of room) {
      const targetSocket = io.sockets.sockets.get(socketID);

      if (targetSocket?.data.username === username) {
        return targetSocket;
      }
    }

    return null;
  };

  // ==================== offer
  socket.on("webrtc:offer", ({ offer, targetUsername }) => {
    const { roomID, username } = socket.data;

    const targetSocket = findSocketByUsername(io, roomID, targetUsername);

    if (targetSocket) {
      targetSocket.emit("webrtc:offer", {
        offer,
        senderSocketID: socket.id,
        senderUsername: username,
      });
    }
  });

  // ==================== answer
  socket.on("webrtc:answer", ({ answer, targetSocketID }) => {
    io.to(targetSocketID).emit("webrtc:answer", {
      answer,
      senderUsername: socket.data.username,
    });
  });

  // ==================== ice-candidate
  socket.on("webrtc:ice-candidate", ({ candidate, targetUsername }) => {
    const { roomID, username } = socket.data;

    const targetSocket = findSocketByUsername(io, roomID, targetUsername);

    if (targetSocket) {
      targetSocket.emit("webrtc:ice-candidate", {
        candidate,
        senderUsername: username,
      });
    }
  });
};

export default webRTCHandlers;
