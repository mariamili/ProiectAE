import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

// Stripe public key (din Dashboard Stripe)
const stripePromise = loadStripe("pk_test_51QXhhSCEs00MMpi68b2KCwoZ0GHHYqeqyIpRi8wkTn83gvZFaOXqaWCOYLnY1gjYDR2k8JXfVvLMM6Vc6KjCsl8000Iz5Tz8GS");

const PaymentForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Creează un PaymentIntent pe backend
      const response = await fetch(`${getApiUrl()}/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total }),
      });
      const { clientSecret } = await response.json();

      // Confirmă plata pe frontend
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay $${total}`}
      </button>
    </form>
  );
};

const Payment = ({ total }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm total={total} />
    </Elements>
  );
};

export default Payment;
