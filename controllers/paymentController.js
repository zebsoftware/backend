// paymentController.js
import dotenv from "dotenv";
dotenv.config(); // load env variables at the top

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key missing! Check your .env file");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ message: "Amount (in cents) is required and must be a number." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("createPaymentIntent error:", err);
    return res.status(500).json({ message: err.message });
  }
};
