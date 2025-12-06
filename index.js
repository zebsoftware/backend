import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Import routes
import productRoutes from "./routes/product.js";
import profileRoutes from "./routes/profile.js";
import contactRoutes from "./routes/contact.js";
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();
const app = express();

// Enable CORS
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/payment", paymentRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("DB Connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
