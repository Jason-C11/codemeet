import roomHandlers from "./roomHandlers.js";
import interviewHandlers from "./interviewHandlers.js";
import webRTCHandlers from "./webRTCHandlers.js";

const initializeSockets = (io) => {
  io.on("connection", (socket) => {
    interviewHandlers(socket);
    roomHandlers(io, socket);
    webRTCHandlers(io, socket);
  });
};

export default initializeSockets;
