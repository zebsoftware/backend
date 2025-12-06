import express from "express";
import { addProduct, getAllProducts, updateProduct, deleteProduct } from "../controllers/productController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// All routes
router.get("/products", getAllProducts);
router.post("/products", upload.single("image"), addProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
