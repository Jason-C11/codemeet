import express from "express";
import { aiCodeEvaluation, aiHintGeneration } from "../controllers/aiController.js";
import {
  handleBadRequest,
  isAuthenticated,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/evaluate/:id", handleBadRequest, isAuthenticated, aiCodeEvaluation);
router.post("/hint/:id", handleBadRequest, isAuthenticated, aiHintGeneration);

export default router;
