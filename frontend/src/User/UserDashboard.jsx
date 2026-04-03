import React, { useState } from "react";
import "../UserStyles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, removeSuccess } from "../features/user/userSlice";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  User as UserIcon, 
  ShoppingCart as CartIcon, 
  LogOut,
  ChevronDown
} from "lucide-react";

function UserDashboard({ user }) {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  // Guard: If user is not yet loaded, return basic loading state to prevent crash
  if (!user) return null;

  const options = [
    { name: "My Orders", icon: <ShoppingBag size={18} />, func: () => navigate("/orders/user") },
    { name: "Account", icon: <UserIcon size={18} />, func: () => navigate("/profile") },
    { 
      name: "Cart", 
      icon: <CartIcon size={18} />, 
      func: () => navigate("/cart"),
      badge: cartItems?.length > 0 ? cartItems.length : null 
    },
  ];

  if (user?.role === "admin") {
    options.unshift({
      name: "Admin Panel",
      icon: <LayoutDashboard size={18} />,
      func: () => navigate("/admin/dashboard"),
    });
  }

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Logout Successful", { position: "bottom-left", autoClose: 2000 });
        dispatch(removeSuccess());
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message || "Logout Failed", { position: "bottom-left", autoClose: 2000 });
      });
  };

  return (
    <div className="dashboard-container">
      {/* Avatar Toggle Button */}
      <button 
        className="profile-avatar-trigger" 
        onClick={toggleMenu}
        aria-expanded={menuVisible}
        aria-haspopup="true"
      >
        <img 
          src={user?.avatar?.url ? user.avatar.url : "/images/profile.png"} 
          alt={user?.name} 
          className="profile-avatar-img-small" 
        />
        <ChevronDown size={14} className={`ml-1 transition-transform ${menuVisible ? "rotate-180" : ""}`} />
      </button>

      {/* Global Overlay for closing */}
      {menuVisible && <div className="user-menu-overlay" onClick={toggleMenu}></div>}

      {/* Dropdown Menu */}
      {menuVisible && (
        <nav className="user-menu-dropdown">
          <div className="user-menu-header">
            <span className="user-menu-role">{user?.role}</span>
            <span className="user-menu-name">{user?.name}</span>
          </div>

          <div className="menu-options-list">
            {options.map((item) => (
              <button key={item.name} className="menu-option-item" onClick={() => { item.func(); toggleMenu(); }}>
                {item.icon}
                <span>{item.name}</span>
                {item.badge && <span className="cart-count-badge">{item.badge}</span>}
              </button>
            ))}
            
            <button className="menu-option-item logout" onClick={() => { handleLogout(); toggleMenu(); }}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default UserDashboard;
