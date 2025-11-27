// routes/payment.js
import express from "express";
import { createPaymentIntent, handleWebhook } from "../controllers/paymentController.js";

const router = express.Router();

// Regular JSON route for creating payment intents
router.post("/create-payment-intent", createPaymentIntent);

// Webhook endpoint for Stripe events (requires raw body)
router.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);

export default router;