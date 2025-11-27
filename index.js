// server.js (or index.js)
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Debug: Check environment variables
console.log("🔧 Environment Check:");
console.log("   - NODE_ENV:", process.env.NODE_ENV || 'development');
console.log("   - PORT:", process.env.PORT || 5000);
console.log("   - MongoDB:", process.env.MONGO_URL ? "✅ Configured" : "❌ Missing");
console.log("   - Stripe:", process.env.STRIPE_SECRET_KEY ? "✅ Configured" : "❌ Missing");
console.log("   - JWT Secret:", process.env.JWT_SECRET ? "✅ Configured" : "❌ Missing");

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
if (process.env.MONGO_URL) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => {
      console.log("❌ Database connection error:", err.message);
      console.log("💡 Please check your MONGO_URL environment variable");
    });
} else {
  console.log("⚠️  MongoDB connection string not provided");
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug route - check environment variables
app.get("/debug", (req, res) => {
  res.json({
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000,
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      mongoConfigured: !!process.env.MONGO_URL,
      jwtConfigured: !!process.env.JWT_SECRET
    },
    services: {
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      payments: process.env.STRIPE_SECRET_KEY ? "configured" : "misconfigured"
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      payments: !!process.env.STRIPE_SECRET_KEY ? "configured" : "misconfigured"
    }
  });
});

// Routes
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/contact", contactRoute);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/profile", profileRoute);

// Default Route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Backend Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
          .success { background: #d4edda; color: #155724; }
          .warning { background: #fff3cd; color: #856404; }
          .error { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <h1>🚀 Backend Server is Running!</h1>
        <div class="status ${mongoose.connection.readyState === 1 ? 'success' : 'error'}">
          Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
        </div>
        <div class="status ${process.env.STRIPE_SECRET_KEY ? 'success' : 'warning'}">
          Payments: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '⚠️ Not Configured'}
        </div>
        <div class="status success">
          Environment: ${process.env.NODE_ENV || 'development'}
        </div>
        <p>Check these endpoints:</p>
        <ul>
          <li><a href="/health">/health</a> - Service health</li>
          <li><a href="/debug">/debug</a> - Environment debug</li>
          <li><a href="/api/payment/health">/api/payment/health</a> - Payment system health</li>
        </ul>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Global error handler:", err);
  res.status(500).json({
    message: "Something went wrong!",
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    availableRoutes: [
      "/health",
      "/debug", 
      "/api/login",
      "/api/register",
      "/api/contact", 
      "/api/products",
      "/api/payment",
      "/api/profile"
    ]
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔑 JWT: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`);
  console.log(`\n📋 Useful endpoints:`);
  console.log(`   http://localhost:${PORT}/health`);
  console.log(`   http://localhost:${PORT}/debug`);
  console.log(`   http://localhost:${PORT}/api/payment/health`);
});