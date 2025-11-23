import express from "express";
import { registerUser } from "../controllers/registerController.js";

const router = express.Router();

// POST /api/register
router.post("/", registerUser);

export default router;
