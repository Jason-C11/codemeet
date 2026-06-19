import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controllers/authController.js";
import {
  registerInfoValidation,
  loginInfoValidation,
  handleBadRequest,
  isAuthenticated,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerInfoValidation, handleBadRequest, signup);
router.post("/login", loginInfoValidation, handleBadRequest, login);
router.post("/logout", isAuthenticated, logout);
router.get("/check", isAuthenticated, checkAuth);

export default router;
