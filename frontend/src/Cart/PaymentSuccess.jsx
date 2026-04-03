import React, { useEffect } from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, removeErrors, removeSuccess } from "../features/order/orderSlice";
import { toast } from "react-toastify";
import { clearCart } from "../features/cart/cartSlice";
import { CheckCircle2, Package, ShoppingBag, Share2, ArrowRight, ExternalLink } from "lucide-react";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { loading, success, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    const createOrderData = async () => {
      try {
        const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
        if (!orderItem) return;
        const orderData = {
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pinCode,
            phoneNo: shippingInfo.phoneNo,
            shippingPartner: shippingInfo.shippingPartner,
          },
          orderItems: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: "succeeded",
          },
          itemPrice: orderItem.subTotal,
          taxPrice: orderItem.taxPrice,
          shippingPrice: orderItem.shippingPrice,
          totalPrice: orderItem.total,
        };
        dispatch(createOrder(orderData));
        sessionStorage.removeItem("orderItem");
      } catch (error) {
        toast.error(error.message || "Order Creation Error", { position: "bottom-left", autoClose: 2000 });
      }
    };
    createOrderData();
  }, [dispatch, reference, cartItems, shippingInfo]);

  useEffect(() => {
    if (success) {
      toast.success("Order Placed Successfully", { position: "bottom-left", autoClose: 2000 });
      dispatch(clearCart());
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <Navbar />
      <PageTitle title="Payment Success - Salem AK Mangoes" />

      {loading ? (
        <Loader />
      ) : (
        <div className="payment-success-wrapper">
          <div className="success-card">
            <div className="success-icon-container">
              <CheckCircle2 size={56} strokeWidth={3} />
            </div>

            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-msg">
              Thank you for chooseing Salem AK Mangoes. Your premium harvest is being prepared for shipment.
              A confirmation email has been sent to your registered address.
            </p>

            <div className="reference-box">
              <span className="ref-label">Transaction Reference</span>
              <span className="ref-value flex items-center gap-2">
                {reference} <ExternalLink size={14} className="text-gray-300" />
              </span>
            </div>

            <div className="success-actions">
              <Link to="/orders/user" className="btn-primary-success">
                <Package size={20} /> Track Your Order <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn-secondary-success">
                <ShoppingBag size={20} /> Continue Shopping
              </Link>
            </div>
            
            <button className="mt-8 text-xs font-bold text-gray-400 flex items-center justify-center gap-2 mx-auto hover:text-[#1a3c34] transition-colors">
              <Share2 size={14} /> Share your purchase with friends
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default PaymentSuccess;
