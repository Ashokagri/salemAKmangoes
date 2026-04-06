import React from "react";
import "../CartStyles/Payment.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ShieldCheck, ArrowLeft, CreditCard, Lock, ArrowRight, IndianRupee } from "lucide-react";

function Payment() {
  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
  const { user } = useSelector((state) => state.user);
  const { shippingInfo } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const completePayment = async (amount) => {
    try {
      const { data: keyData } = await axios.get("/api/v1/getKey");
      const { key } = keyData;

      const { data: orderData } = await axios.post("/api/v1/payment/process", { amount });
      const { order } = orderData;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "Salem AK Mangoes",
        description: "Premium Mango Order Payment",
        order_id: order.id,
        handler: async function (response) {
          const { data } = await axios.post("/api/v1/paymentVerification", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (data.success) {
            navigate(`/paymentSuccess?reference=${data.reference}`);
          } else {
            toast.error("Payment verification failed. Please contact support.", { position: "bottom-left" });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNo,
        },
        theme: {
          color: "#1a3c34",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message, { position: "bottom-left", autoClose: 2000 });
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <PageTitle title="Secure Checkout - Salem AK Mangoes" />

      <CheckoutPath activePath={2} />

      <div className="payment-wrapper animate-in fade-in slide-in-from-bottom-5 duration-700">
        <header className="text-center">
          <div className="payment-icon-box">
            <ShieldCheck size={40} />
          </div>
          <h1 className="payment-header-title">Finalize Order</h1>
          <p className="payment-header-subtitle">Securely complete your premium mango purchase.</p>
        </header>

        <div className="payment-summary-card">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4 border-b pb-2">Order Summary</h3>
          <div className="summary-row">
            <span className="summary-label">Items Subtotal</span>
            <span className="summary-value">₹{orderItem?.subTotal?.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Shipping Charges</span>
            <span className="summary-value">₹{orderItem?.shippingPrice?.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">IGST (Including Taxes)</span>
            <span className="summary-value">₹{orderItem?.taxPrice?.toLocaleString()}</span>
          </div>
          <div className="summary-row mt-4 pt-4 border-t border-dashed">
            <span className="text-lg font-black text-[#1a3c34]">Total Amount to Pay</span>
            <span className="text-2xl font-black text-[#1a3c34]">₹{orderItem?.total?.toLocaleString()}</span>
          </div>
        </div>

        <div className="payment-actions">
          <button className="pay-now-btn" onClick={() => completePayment(orderItem?.total)}>
            <CreditCard size={20} /> Proceed to Secure Payment <ArrowRight size={18} />
          </button>

          <Link to="/order/confirm" className="payment-back-link">
            <ArrowLeft size={16} /> Change Order Details
          </Link>
        </div>

        <div className="secure-badge">
          <Lock size={12} className="text-[#99cc33]" />
          <span>SSL Secured & Encrypted Transaction</span>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Payment;
