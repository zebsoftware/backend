// controllers/paymentController.js
import Stripe from "stripe";

// Ensure Stripe key exists
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error("❌ STRIPE_SECRET_KEY is missing! Set it in .env or Render environment variables.");
  throw new Error("Stripe secret key missing!");
}

const stripe = new Stripe(stripeSecret);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({
        message: "Amount (in cents) is required and must be a number.",
      });
    }

    console.log(`💰 Creating payment intent for amount: ${amount} cents`);

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("✅ PaymentIntent created successfully");

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("❌ createPaymentIntent error:", err.message);
    // Return only safe message to client
    return res.status(500).json({
      message: "Internal server error. Please check the server logs.",
    });
  }
};
