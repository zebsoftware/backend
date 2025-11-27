import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET user profile
router.get("/", protect, async (req, res) => {
  res.json(req.user);
});

// UPDATE or CREATE profile
router.post("/", protect, async (req, res) => {
  try {
    const { name, phone, address, city, country, postalCode } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || "";
    user.address = address || "";
    user.city = city || "";
    user.country = country || "";
    user.postalCode = postalCode || "";

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user
router.delete("/", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
