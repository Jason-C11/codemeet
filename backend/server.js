import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("CodeMeet backend running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.use("/api/auth", authRoutes);
