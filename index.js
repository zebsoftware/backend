import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import loginRoute from "./routes/login.js";
import registerRoute from "./routes/register.js";
import contactRoute from "./routes/contact.js";
import productRoutes from "./routes/product.js";

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL =
  "mongodb+srv://anwarzeb:123@cluster0.zc7cnit.mongodb.net/ShopXDB";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/contact", contactRoute);
app.use("/api/products", productRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
