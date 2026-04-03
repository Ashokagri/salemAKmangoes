import React, { useEffect } from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nocart from "../components/Nocart";
import { refreshCartPrices } from "../features/cart/cartSlice";
import { ShoppingCart, ArrowRight, CreditCard } from "lucide-react";

function Cart() {
  const { cartItems } = useSelector((state) => state.cart);

  // Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  const navigate = useNavigate();
  const checkoutHandler = () => {
    navigate(`/login?redirect=/shipping`);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshCartPrices());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <br></br>
      <br />
      <div className="pt-24 lg:pt-32 pb-12">
        <PageTitle title="Your Shopping Cart - Salem AK Mangoes" />

        {cartItems.length === 0 ? (
          <div className="container-custom">
            <Nocart />
          </div>
        ) : (
          <div className="container-custom">
            <div className="cart-page">
              <div className="cart-items">
                <div className="cart-items-heading">
                  <ShoppingCart size={24} />
                  Your Shopping Cart
                  <span className="text-sm font-normal text-gray-400 ml-auto">
                    ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                  </span>
                </div>

                <div className="cart-table">
                  <div className="cart-table-header">
                    <div>Product</div>
                    <div>Quantity</div>
                    <div>Total</div>
                    <div className="text-right">Action</div>
                  </div>

                  {/* Cart Items */}
                  <div className="flex flex-col">
                    {cartItems.map((item) => (
                      <CartItem item={item} key={item.product} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <aside className="price-summary">
                <h3 className="price-summary-heading flex items-center gap-2">
                  <CreditCard size={20} /> Order Summary
                </h3>

                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value text-xs text-gray-500 uppercase">Calculated next</span>
                </div>

                <div className="summary-total-row">
                  <span className="total-label">Total Amount</span>
                  <span className="total-value">₹{subtotal.toLocaleString()}</span>
                </div>

                <button
                  className="checkout-btn group"
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                >
                  Checkout Now <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
                <br />
                <p className="text-center text-xs text-gray-400 mt-4 px-4">
                  Secure checkout powered by Razorpay. All our mangoes are naturally grown.
                </p>
              </aside>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Cart;
