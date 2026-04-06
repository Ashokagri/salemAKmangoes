import React, { useEffect } from "react";
import "../CartStyles/OrderConfirm.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import CheckoutPath from "./CheckoutPath";
import { useNavigate } from "react-router-dom";
import { refreshCartPrices } from "../features/cart/cartSlice";
import { User, Truck, MapPin, Phone, ShoppingCart, CreditCard, ArrowRight } from "lucide-react";

function OrderConfirm() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingCharges = shippingInfo.shippingCharges || 0;
  const total = subtotal + shippingCharges;
  const navigate = useNavigate();

  const proceedToPayment = () => {
    const data = {
      subTotal: subtotal,
      shippingPrice: shippingCharges,
      taxPrice: 0,
      total,
    };
    sessionStorage.setItem("orderItem", JSON.stringify(data));
    navigate("/process/payment");
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshCartPrices());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="pt-24 lg:pt-32 pb-12">
        <PageTitle title="Order Confirmation - Salem AK Mangoes" />
        <CheckoutPath activePath={1} />

        <div className="confirm-container">
          <h1 className="confirm-header">Final Order Review</h1>

          <div className="confirm-layout">
            <div className="confirm-main">
              {/* Shipping Information Card */}
              <div className="confirm-card">
                <h2 className="confirm-card-title">
                  <Truck size={20} /> Shipping Details
                </h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Customer Name</span>
                    <span className="info-value">{user.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{shippingInfo.phoneNo}</span>
                  </div>
                  <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                    <span className="info-label">Delivery Address</span>
                    <span className="info-value">
                      {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, India - {shippingInfo.pinCode}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Courier Partner</span>
                    <span className="info-value text-[#99cc33] flex items-center gap-1">
                      <Truck size={14} /> {shippingInfo.shippingPartner || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Card */}
              <div className="confirm-card">
                <h2 className="confirm-card-title">
                  <ShoppingCart size={20} /> Your Selection
                </h2>
                <div className="confirm-items-list">
                  {cartItems.map((item) => (
                    <div className="confirm-item-row" key={item.product}>
                      <img src={item.image} alt={item.name} className="confirm-item-img" />
                      <div className="confirm-item-details">
                        <p className="confirm-item-name">{item.name}</p>
                        <p className="confirm-item-meta">{item.quantity} kg × ₹{item.price.toLocaleString()}/kg</p>
                      </div>
                      <div className="confirm-item-price">
                        ₹{(item.quantity * item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Summary Sticky Sidebar */}
            <aside className="order-total-card">
              <div className="confirm-card">
                <h2 className="confirm-card-title">
                  <CreditCard size={20} /> Order Summary
                </h2>

                <div className="summary-row">
                  <span className="summary-label">Items Subtotal</span>
                  <span className="summary-value">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Shipping Charges</span>
                  <span className="summary-value">₹{shippingCharges.toLocaleString()}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="final-total-row">
                  <span className="final-total-label">Grand Total</span>
                  <div className="flex flex-col items-end">
                    <span className="final-total-value">₹{total.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Included GST & Taxes</span>
                  </div>
                </div>

                <button className="proceed-button group" onClick={proceedToPayment}>
                  Make Secure Payment <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
                <br />
                <p className="text-center text-[10px] text-gray-400 mt-6 px-4 leading-relaxed uppercase tracking-widest">
                  Secure checkout powered by Razorpay. <br /> Naturally grown Salem AK Mangoes.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderConfirm;
