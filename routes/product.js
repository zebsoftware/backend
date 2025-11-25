import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { verifyToken } from "../middleware/auth.js"; 
import upload from "../middleware/upload.js"; // Multer

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/", verifyToken, upload.single("image"), addProduct);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
