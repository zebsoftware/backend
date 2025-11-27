// routes/payment.js
import express from "express";
import { createPaymentIntent, getPaymentHealth } from "../controllers/paymentController.js";

const router = express.Router();

// Add this health check route
router.get("/health", getPaymentHealth);

// Create payment intent
router.post("/create-payment-intent", createPaymentIntent);

export default router;