import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js"
import upload from "../middleware/upload.js"; // Multer

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/", protect, upload.single("image"), addProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
