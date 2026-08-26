import roomHandlers from "./roomHandlers.js";
import interviewHandlers from "./interviewHandlers.js";

const initializeSockets = (io) => {
  io.on("connection", (socket) => {
    interviewHandlers(socket);
    roomHandlers(io, socket);
  });
};

export default initializeSockets;
