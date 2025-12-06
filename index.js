import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/product.js";
import path from "path";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // serve images

// Routes
app.use("/api", productRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("DB Connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
