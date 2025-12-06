import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import cors
import productRoutes from "./routes/product.js";
import path from "path";

dotenv.config();
const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: ["http://localhost:5173"], // frontend URL
  credentials: true, // if you use cookies or auth headers
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/products", productRoutes); // corrected route path

// DB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("DB Connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
