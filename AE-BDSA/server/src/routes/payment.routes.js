const express = require("express");
const stripe = require("stripe")("sk_test_51QXhhSCEs00MMpi6Wnt9fLubZxau3CK5oniQLb5vvOt9MbXPzEuUQ8kLNcSYeKksaKfLEzJAiFxyjdLTQ65i0Rp400G6ciJ1EZ"); // Asigură-te că ai adăugat cheia secretă în .env
const router = express.Router();

// Endpoint pentru crearea unui payment intent
router.post("/create", async (req, res) => {
  const { total } = req.body;

  try {
    // Creează un PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe lucrează cu "cents", deci trebuie să convertim
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
    });
  }
});

module.exports = router;
