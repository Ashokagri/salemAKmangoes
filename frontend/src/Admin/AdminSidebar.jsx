import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Box, 
  Plus, 
  Users, 
  ShoppingBag, 
  Star,
  Menu,
  X 
} from "lucide-react";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle Button - Hidden on Desktop (lg and up) */}
      <button 
        className={`admin-sidebar-toggle lg:hidden ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
        aria-label="Toggle admin sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`admin-sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={closeSidebar} 
      />

      <aside className={`admin-sidebar shadow-xl ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <LayoutDashboard className="sidebar-logo-icon" size={24} />
          <h2 className="sidebar-title">Management</h2>
          <button className="mobile-close-btn" onClick={closeSidebar}>
             <X size={20} />
          </button>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">
            <h3 className="nav-section-title">Inventory</h3>
            <div className="nav-links">
              <Link to="/admin/dashboard" onClick={closeSidebar} className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/admin/products" onClick={closeSidebar} className={`nav-link ${isActive("/admin/products") ? "active" : ""}`}>
                <Box size={18} /> All Products
              </Link>
              <Link to="/admin/product/create" onClick={closeSidebar} className={`nav-link ${isActive("/admin/product/create") ? "active" : ""}`}>
                <Plus size={18} /> Create Product
              </Link>
            </div>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Sales & Customers</h3>
            <div className="nav-links">
              <Link to="/admin/orders" onClick={closeSidebar} className={`nav-link ${isActive("/admin/orders") ? "active" : ""}`}>
                <ShoppingBag size={18} /> All Orders
              </Link>
              <Link to="/admin/users" onClick={closeSidebar} className={`nav-link ${isActive("/admin/users") ? "active" : ""}`}>
                <Users size={18} /> All Users
              </Link>
            </div>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Feedback</h3>
            <div className="nav-links">
              <Link to="/admin/reviews" onClick={closeSidebar} className={`nav-link ${isActive("/admin/reviews") ? "active" : ""}`}>
                <Star size={18} /> Product Reviews
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;
