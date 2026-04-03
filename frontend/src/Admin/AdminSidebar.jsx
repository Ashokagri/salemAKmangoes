import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Box, 
  Plus, 
  Users, 
  ShoppingBag, 
  Star 
} from "lucide-react";

function AdminSidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="admin-sidebar shadow-xl">
      <div className="sidebar-header">
        <LayoutDashboard className="sidebar-logo-icon" size={24} />
        <h2 className="sidebar-title">Management</h2>
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <h3 className="nav-section-title">Inventory</h3>
          <div className="nav-links">
            <Link to="/admin/dashboard" className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/admin/products" className={`nav-link ${isActive("/admin/products") ? "active" : ""}`}>
              <Box size={18} /> All Products
            </Link>
            <Link to="/admin/product/create" className={`nav-link ${isActive("/admin/product/create") ? "active" : ""}`}>
              <Plus size={18} /> Create Product
            </Link>
          </div>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Sales & Customers</h3>
          <div className="nav-links">
            <Link to="/admin/orders" className={`nav-link ${isActive("/admin/orders") ? "active" : ""}`}>
              <ShoppingBag size={18} /> All Orders
            </Link>
            <Link to="/admin/users" className={`nav-link ${isActive("/admin/users") ? "active" : ""}`}>
              <Users size={18} /> All Users
            </Link>
          </div>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Feedback</h3>
          <div className="nav-links">
            <Link to="/admin/reviews" className={`nav-link ${isActive("/admin/reviews") ? "active" : ""}`}>
              <Star size={18} /> Product Reviews
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
