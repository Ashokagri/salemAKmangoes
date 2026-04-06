import React, { useEffect } from "react";
import "../AdminStyles/Dashboard.css";
import {
  Box,
  ShoppingBag,
  Star,
  IndianRupee,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import AdminFooter from "./AdminFooter";
import AdminSidebar from "./AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, fetchAllOrders } from "../features/admin/adminSlice";

function Dashboard() {
  const { products, orders, totalAmount } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const inStock = products.filter((product) => product.stock > 0).length;
  const totalReviews = products.reduce((acc, product) => acc + (product.reviews.length || 0), 0);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <PageTitle title="Admin Dashboard - Salem AK Mangoes" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <header className="admin-page-header">
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <p className="admin-page-subtitle">Real-time statistics for your mango business.</p>
          </header>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon-box">
                <IndianRupee size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-box">
                <ShoppingBag size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{totalOrders}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-box">
                <Box size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Products</span>
                <span className="stat-value">{totalProducts}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-box" style={{ color: "#ef4444" }}>
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Out of Stock</span>
                <span className="stat-value">{outOfStock}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-box" style={{ color: "#22c55e" }}>
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">In Stock</span>
                <span className="stat-value">{inStock}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-box" style={{ color: "#f59e0b" }}>
                <Star size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Reviews</span>
                <span className="stat-value">{totalReviews}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AdminFooter />
    </>
  );
}

export default Dashboard;
