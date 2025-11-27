// controllers/paymentController.js
import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables in this file
dotenv.config();

// Ensure Stripe key exists
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error("❌ STRIPE_SECRET_KEY is missing! Set it in .env or Render environment variables.");
  throw new Error("Stripe secret key missing!");
}

const stripe = new Stripe(stripeSecret);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;

    // Validate amount
    if (!amount || typeof amount !== "number" || amount < 50) {
      return res.status(400).json({
        message: "Valid amount (minimum 50 cents) is required and must be a number.",
      });
    }

    console.log(`💰 Creating payment intent for amount: ${amount} ${currency}`);

    // Validate currency
    const validCurrencies = ['usd', 'eur', 'gbp', 'cad', 'aud'];
    if (!validCurrencies.includes(currency.toLowerCase())) {
      return res.status(400).json({
        message: `Unsupported currency. Supported currencies: ${validCurrencies.join(', ')}`,
      });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure integer
      currency: currency.toLowerCase(),
      automatic_payment_methods: { 
        enabled: true 
      },
      // Add metadata for better tracking
      metadata: {
        integration_check: 'accept_a_payment'
      }
    });

    console.log("✅ PaymentIntent created successfully:", paymentIntent.id);

    return res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error("❌ createPaymentIntent error:", err);
    
    // Handle specific Stripe errors
    switch (err.type) {
      case 'StripeInvalidRequestError':
        return res.status(400).json({
          message: "Invalid request to payment processor. Please check your request parameters.",
        });
      case 'StripeAuthenticationError':
        return res.status(500).json({
          message: "Payment authentication failed. Please contact support.",
        });
      case 'StripeConnectionError':
        return res.status(503).json({
          message: "Payment service temporarily unavailable. Please try again.",
        });
      case 'StripeRateLimitError':
        return res.status(429).json({
          message: "Too many payment requests. Please wait and try again.",
        });
      default:
        return res.status(500).json({
          message: "Internal server error during payment processing.",
          // Include more details in development
          ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            type: err.type
          })
        });
    }
  }
};

// Optional: Add webhook handler for future use
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`❌ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`💰 PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Update your database here
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.error(`❌ Payment failed: ${failedPaymentIntent.last_payment_error?.message}`);
      break;
    default:
      console.log(`⚡ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};