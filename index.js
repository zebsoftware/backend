import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import productRoutes from "./routes/product.js";
import profileRoutes from "./routes/profile.js";
import contactRoutes from "./routes/contact.js";
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();
const app = express();

// Enable CORS (allow everything for testing)
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve current directory (important for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/payment", paymentRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ DB Connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
