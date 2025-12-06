import express from "express";
import { addProduct, getAllProducts, updateProduct, deleteProduct } from "../controllers/productController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// All routes relative to /api/products
router.get("/", getAllProducts);
router.post("/", upload.single("image"), addProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
