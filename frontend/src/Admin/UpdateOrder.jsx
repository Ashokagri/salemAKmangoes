import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateOrder.css";
import "../AdminStyles/Dashboard.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import AdminSidebar from "./AdminSidebar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../features/order/orderSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { removeErrors, removeSuccess, updateOrderStatus } from "../features/admin/adminSlice";
import {
  User,
  MapPin,
  CreditCard,
  Truck,
  Package,
  CheckCircle,
  ArrowRight,
  Calendar,
  ShoppingBag,
  IndianRupee,
  Loader2
} from "lucide-react";

function UpdateOrder() {
  const [status, setStatus] = useState("");
  const { orderId } = useParams();
  const { order, loading: orderLoading } = useSelector((state) => state.order);
  const { success, loading: adminLoading, error } = useSelector((state) => state.admin);
  const loading = orderLoading || adminLoading;
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    createdAt,
    user: customer = {}
  } = order;

  const paymentStatus = paymentInfo.status === "succeeded" ? "Paid" : "Not Paid";
  const finalOrderStatus = paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  const handleStatusUpdate = () => {
    if (!status) {
      toast.error("Please select a status", { position: "bottom-left", autoClose: 2000 });
      return;
    }
    dispatch(updateOrderStatus({ orderId, status }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Order Status updated successfully", { position: "bottom-left", autoClose: 2000 });
      dispatch(removeSuccess());
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, error, success, orderId]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <PageTitle title="Update Order - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <header className="admin-table-header">
            <div>
              <h1 className="admin-table-title">Manage Shipment</h1>
              <p className="admin-page-subtitle">Track fulfillment and logistics for order <strong>#{orderId?.substring(0, 8)}...</strong></p>
            </div>
            <div className={`status-badge px-4 py-2 text-sm ${finalOrderStatus === "Delivered" ? "status-success" :
                finalOrderStatus === "Cancelled" ? "status-error" :
                  "bg-blue-100 text-blue-700 font-black"
              }`}>
              {finalOrderStatus}
            </div>
          </header>

          {loading ? (
            <Loader />
          ) : (
            <div className="order-update-grid">
              <div className="order-details-column">
                <div className="order-info-card">
                  <h3 className="order-section-title"><User size={18} /> Customer & Shipping</h3>
                  <div className="order-details-list">
                    <div className="detail-item">
                      <span className="detail-label">Full Name</span>
                      <span className="detail-value">{customer.name || shippingInfo.name || "Guest Customer"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Contact Number</span>
                      <span className="detail-value font-mono">{shippingInfo.phoneNo}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date of Order</span>
                      <span className="detail-value flex items-center gap-2">
                        <Calendar size={14} /> {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-item span-full">
                      <span className="detail-label"><MapPin size={12} className="inline mr-1" /> Delivery Address</span>
                      <span className="detail-value">
                        {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country} - {shippingInfo.pinCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-info-card">
                  <h3 className="order-section-title"><CreditCard size={18} /> Payment Overview</h3>
                  <div className="order-details-list">
                    <div className="detail-item">
                      <span className="detail-label">Transaction ID</span>
                      <span className="detail-value font-mono text-xs">{paymentInfo.id || "Cash on Delivery"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Status</span>
                      <span className={`detail-value ${paymentStatus === "Paid" ? "text-green-600" : "text-amber-600"}`}>
                        {paymentStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Invoice Amount</span>
                      <span className="detail-value text-xl font-black text-[#1a3c34]">₹{totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="order-info-card">
                  <h3 className="order-section-title"><ShoppingBag size={18} /> Order Contents</h3>
                  <div className="order-items-list">
                    {orderItems.map((item) => (
                      <div className="order-item-row" key={item._id}>
                        <img src={item.image} alt={item.name} className="order-item-img" />
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-meta flex items-center gap-4">
                            <span className="flex items-center gap-1 font-bold text-gray-500">
                              QTY: {item.quantity} kg
                            </span>
                            <span className="flex items-center gap-1 font-bold text-gray-800">
                              <IndianRupee size={12} /> {item.price.toLocaleString()} / kg
                            </span>
                          </span>
                        </div>
                        <div className="font-black text-gray-700">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="status-update-sticky">
                <div className="status-update-card">
                  <h3 className="order-section-title"><Truck size={18} /> Delivery Tracking</h3>

                  <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#99cc33]">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">Current Phase</p>
                      <p className="text-sm font-bold text-[#1a3c34] uppercase">{finalOrderStatus}</p>
                    </div>
                  </div>

                  <div className="admin-form-group mb-4">
                    <label className="admin-form-label">Transition State</label>
                    <select
                      className="admin-form-select !bg-gray-50 hover:!border-[#99cc33]"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={loading || orderStatus === "Delivered"}
                    >
                      <option value="">Choose Next Phase</option>
                      {orderStatus === "Processing" && <option value="Shipped">Dispatch Order</option>}
                      {orderStatus === "Shipped" && <option value="Delivered">Complete Delivery</option>}
                    </select>
                  </div>

                  <button
                    className="admin-submit-btn !w-full"
                    onClick={handleStatusUpdate}
                    disabled={loading || !status || orderStatus === "Delivered"}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>Update Tracking <ArrowRight size={18} /></>
                    )}
                  </button>

                  {orderStatus === "Delivered" && (
                    <p className="mt-4 text-xs font-bold text-green-600 text-center flex items-center justify-center gap-1">
                      <CheckCircle size={14} /> Fullfilment Complete
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default UpdateOrder;
