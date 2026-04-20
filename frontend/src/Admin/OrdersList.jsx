import React, { useEffect, useState } from "react";
import "../AdminStyles/Dashboard.css";
import "../AdminStyles/AdminTable.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import AdminFooter from "./AdminFooter";
import AdminSidebar from "./AdminSidebar";
import Loader from "../components/Loader";
import { Trash2, ShoppingBag, Calendar, User, IndianRupee, AlertCircle, Phone, MapPin, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, deleteOrder, fetchAllOrders, removeErrors, removeSuccess, updateOrderStatus } from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function OrdersList() {
  const { orders, loading, error, success, message } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (confirm) {
      dispatch(deleteOrder(id));
    }
  };

  const handleStatusUpdate = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
    if (success) {
      if (message) toast.success(message, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(fetchAllOrders());
    }
  }, [dispatch, error, success, message]);

  return (
    <>
      <Navbar />
      <br></br>
      <br />
      <PageTitle title="Order Management - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <header className="admin-table-header">
            <div>
              <h1 className="admin-table-title">Order Management</h1>
              <p className="admin-page-subtitle">Track and fulfill mango shipments globally.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-sm font-bold text-gray-500">
              <ShoppingBag size={16} /> Total: {orders?.length || 0}
            </div>
          </header>

          {loading && !orders.length ? (
            <Loader />
          ) : (
            <div className="admin-list-wrapper">
              {!orders || orders.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <AlertCircle size={48} className="text-gray-300" />
                  <p className="text-xl font-bold text-gray-400">No orders found in the system.</p>
                </div>
              ) : (
                <table className="admin-list-table">
                  <thead>
                    <tr>
                      <th>Order Info</th>
                      <th>Customer Info</th>
                      <th>Update Status</th>
                      <th>Total</th>
                      <th className="text-right px-6">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div className="flex flex-col gap-2">
                            <div>
                                <span className="font-mono text-[10px] text-gray-400 mb-1 tracking-tighter">#{order._id}</span>
                                <span className="flex items-center gap-1 text-xs text-gray-700 font-bold">
                                <Calendar size={12} className="text-[#99cc33]" /> {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Ordered Items</span>
                                {order.orderItems?.map((item, index) => (
                                    <div key={index} className="flex flex-col mb-1.5 last:mb-0">
                                        <span className="text-[11px] font-bold text-[#1a3c34] leading-tight">
                                            {item.name}
                                        </span>
                                        <span className="text-[10px] font-black text-[#99cc33] uppercase">
                                            {item.quantity} kg
                                        </span>
                                    </div>
                                ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <span className="font-black text-[#1a3c34] text-sm uppercase">{order.user?.name || "Guest Customer"}</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                <Phone size={10} /> +91 {order.shippingInfo?.phoneNo || "No Contact"}
                            </span>
                            <div className="flex items-center gap-1 mt-1 font-black text-[10px] text-[#99cc33] uppercase">
                                <Truck size={10} /> {order.shippingInfo?.shippingPartner || "Self Pick"}
                            </div>
                            <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Shipping Address</span>
                                <div className="text-[11px] font-bold text-gray-600 flex items-start gap-1 leading-normal">
                                    <MapPin size={10} className="text-[#99cc33] shrink-0 mt-0.5" />
                                    <span>
                                        {order.shippingInfo?.address}, {order.shippingInfo?.city},<br/>
                                        {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}
                                    </span>
                                </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select 
                            className={`admin-status-dropdown ${
                                order.orderStatus === "Delivered" ? "status-success" : 
                                order.orderStatus === "Shipped" ? "status-shipped" : "status-processing"
                            }`}
                            value={order.orderStatus}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td>
                          <span className="text-sm font-black text-gray-800 flex items-center gap-0.5">
                            <IndianRupee size={12} /> {order.totalPrice.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end px-4">
                            <button
                              className="admin-action-btn btn-delete !rounded-full !w-9 !h-9"
                              onClick={() => handleDelete(order._id)}
                              title="Delete Order"
                              disabled={order.orderStatus !== "Delivered"}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
      <AdminFooter />
    </>
  );
}

export default OrdersList;
