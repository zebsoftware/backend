import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ---------------------
// Public Routes (No JWT)
// ---------------------
router.get("/", getProducts);       // List all products
router.get("/:id", getProductById); // Get single product by ID

// ---------------------
// Admin Routes (JWT required)
// ---------------------
router.post("/", verifyToken, upload.single("image"), addProduct);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
