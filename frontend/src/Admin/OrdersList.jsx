import React, { useEffect } from "react";
import "../AdminStyles/Dashboard.css";
import "../AdminStyles/AdminTable.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import AdminSidebar from "./AdminSidebar";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { Edit3, Trash2, ShoppingBag, Calendar, User, IndianRupee, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, deleteOrder, fetchAllOrders, removeErrors, removeSuccess } from "../features/admin/adminSlice";
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

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message, { position: "bottom-left", autoClose: 2000 });
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

          {loading ? (
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
                      <th>Order ID</th>
                      <th>Customer Info</th>
                      <th>Items / Status</th>
                      <th>Order Total</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-mono text-xs text-gray-400 mb-1">#{order._id}</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-300" />
                            <span className="admin-item-name">{order.user?.name || "Guest Customer"}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-gray-500">
                              {order.orderItems?.length || 0} items
                            </span>
                            <span className={`status-badge ${order.orderStatus === "Delivered" ? "status-success" :
                                order.orderStatus === "Processing" ? "status-error" :
                                  "bg-blue-100 text-blue-700"
                              }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-lg font-black text-gray-800">
                            ₹{order.totalPrice.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <Link to={`/admin/order/${order._id}`} className="admin-action-btn btn-edit" title="Manage Order">
                              <Edit3 size={18} />
                            </Link>
                            <button
                              className="admin-action-btn btn-delete"
                              onClick={() => handleDelete(order._id)}
                              title="Delete Order"
                            >
                              <Trash2 size={18} />
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
      <Footer />
    </>
  );
}

export default OrdersList;
