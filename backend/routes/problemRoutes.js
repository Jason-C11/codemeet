import express from "express";
import { getAllProblems, getProblemById } from "../controllers/problemController.js";


const router = express.Router();

router.get("/:id", getProblemById);
router.get("/", getAllProblems);

export default router;