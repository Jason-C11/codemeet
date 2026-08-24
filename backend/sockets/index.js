import { handleJoinRoom, handleLeaveRoom } from "./roomHandlers.js";

const initializeSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinRoom", (data) => {
      handleJoinRoom(io, socket, data);
    });

    socket.on("leaveRoom", (data) => {
      handleLeaveRoom(socket, data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default initializeSockets;
