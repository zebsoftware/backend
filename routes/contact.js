import express from "express";
import { getAllContacts, sendContact } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", sendContact);
router.get("/", getAllContacts);

export default router;
