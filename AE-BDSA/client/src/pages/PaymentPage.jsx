import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"; // Import Redux dispatch
import "./payment.css"; 
import { useLocation } from "react-router-dom";
import { createOrder } from "../routes/orders"; 
// Add a CSS file for better styling
import { getApiUrl } from "../utils/envUtils";
import { useNavigate } from 'react-router-dom';
import { clearCart } from "../store/slices/cartSlice"; // Import clearCart action
// Stripe public key (din Dashboard Stripe)
const stripePromise = loadStripe("pk_test_51QXhhSCEs00MMpi68b2KCwoZ0GHHYqeqyIpRi8wkTn83gvZFaOXqaWCOYLnY1gjYDR2k8JXfVvLMM6Vc6KjCsl8000Iz5Tz8GS");

const PaymentForm = () => {
    const dispatch = useDispatch(); 
    const navigate=useNavigate();
    const location = useLocation();
// Extract the total from the location state
console.log(location.state);
    
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Creează un PaymentIntent pe backend
      const response = await fetch(`${getApiUrl()}/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total }),
      });
      console.log(total);
      const { clientSecret } = await response.json();
        console.log(clientSecret);
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
        const {name,phone,address,city,orderRows,total,token}=location.state
        const response = await createOrder({name,phone,address,city,orderRows,total},token);
        console.log(response);
        dispatch(clearCart());// Clear the cart
        navigate("/cart"); // Redirect to the cart
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed!");
    } finally {
      setLoading(false);;
    }
  };
  const total = Number(location.state.total);
  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay $${total}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
    const navigate=useNavigate();
    const location = useLocation();
    console.log(location.state.total);
    const total = Number(location.state.total);
    console.log(total); 
   // const { total } = location.state["total"] || { total: 0 };
    const handleCancel = () => {
        navigate("/cart"); // Redirect to the cart page
      };
  return (
    <div>
      <div className="payment-page-container">
  <h1 className="payment-header">Complete Your Payment</h1>
  <div className="payment-form-container">
    <Elements stripe={stripePromise}>
      <PaymentForm total={total} />
    </Elements>
  </div>
</div>

      <button
        onClick={handleCancel}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
    
  );
};

export default PaymentPage;

