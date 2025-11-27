import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Import routes
import loginRoute from "./routes/login.js";
import registerRoute from "./routes/register.js";
import contactRoute from "./routes/contact.js";
import productRoutes from "./routes/product.js";
import paymentRoute from "./routes/payment.js";
import profileRoute from "./routes/profile.js";
const app = express();

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB using .env
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(" Database connected successfully"))
  .catch((err) => console.log(" Database connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/contact", contactRoute);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoute); // ⭐ Stripe route added
app.use("/api/profile", profileRoute);

// Default Route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
