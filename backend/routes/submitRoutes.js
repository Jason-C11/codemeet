import express from "express";
import { submit } from "../controllers/submitController.js";
import {
  handleBadRequest,
  isAuthenticated,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id", handleBadRequest, isAuthenticated, submit);

export default router;
