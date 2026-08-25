import {
  handleJoinRoom,
  handleLeaveRoom,
  handleDisconnect,
} from "./roomHandlers.js";

const initializeSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

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
  });
};

export default initializeSockets;
