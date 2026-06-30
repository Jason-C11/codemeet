import express from "express";
import { exec } from "../controllers/execController.js";
import {
  handleBadRequest,
  isAuthenticated,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", handleBadRequest, isAuthenticated, exec);

export default router;
