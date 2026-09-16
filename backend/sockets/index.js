import roomHandlers from "./roomHandlers.js";
import interviewHandlers from "./interviewHandlers.js";
import webRTCHandlers from "./webRTCHandlers.js";
import { authenticateSocket } from "../middleware/authMiddleware.js";

const initializeSockets = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    interviewHandlers(socket);
    roomHandlers(io, socket);
    webRTCHandlers(io, socket);
  });
};

export default initializeSockets;
