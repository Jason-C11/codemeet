import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import execRoutes from "./routes/execRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import initializeSockets from "./sockets/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type",
  }),
);

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("CodeMeet backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/exec", execRoutes);
app.use("/api/submit", submitRoutes);

// socket.io setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND,
    credentials: true,
  },
});

initializeSockets(io);

httpServer.listen(5000, () => {
  console.log("Server running on port 5000");
});
