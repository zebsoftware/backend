// controllers/paymentController.js
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("❌ STRIPE_SECRET_KEY missing");
}

const stripe = new Stripe(stripeSecret);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;

    if (!amount || typeof amount !== "number" || amount < 50) {
      return res.status(400).json({
        message: "Amount must be a number and at least 50 cents",
      });
    }

    console.log(`💰 Creating PaymentIntent: ${amount} ${currency}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // cents
      currency: currency.toLowerCase(),
      payment_method_types: ["card"], // ✅ FIX
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("❌ Stripe error:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};
