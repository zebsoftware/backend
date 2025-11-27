import express from "express";
import { protect } from "../middleware/auth.js";


const router = express.Router();

// GET PROFILE
router.get("/", protect, async (req, res) => {
  res.json(req.user);
});

// UPDATE PROFILE
router.put("/", protect, async (req, res) => {
  try {
    const user = req.user;

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;
