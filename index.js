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

/* =========================
   MIDDLEWARE
========================= */

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES (IMPORTANT)
========================= */

// 🔥 Serve uploads folder correctly
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* =========================
   ROUTES
========================= */

app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/payment", paymentRoutes);

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ DB Connection error:", err));

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
