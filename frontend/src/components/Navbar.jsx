import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBag, User, Menu, X, ArrowRight } from "lucide-react";
import "../componentStyles/Navbar.css";
import Logo from "./Logo";
import UserDashboard from "../User/UserDashboard";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/products" },
    { title: "About Us", path: "/about-us" },
    { title: "Contact Us", path: "/contact-us" },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Logo />
          </div>

          {/* Desktop Links */}
          <div className="navbar-links">
            <ul>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={location.pathname === link.path ? "active" : ""}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Icons & Actions */}
          <div className="navbar-icons">
            {/* Cart Icon */}
            <Link to="/cart" className="icon-button" title="Shopping Cart">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </Link>

            {/* User Account Actions */}
            {isAuthenticated && user ? (
               <UserDashboard user={user} />
            ) : (
              <Link 
                to={isAuthenticated ? "/profile" : "/login"} 
                className="icon-button" 
                title={isAuthenticated ? "Loading..." : "Login"}
              >
                <User size={20} />
              </Link>
            )}

            {/* Hamburger (Mobile) */}
            <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div 
        className={`drawer-overlay ${isMenuOpen ? "active" : ""}`} 
        onClick={toggleMenu} 
      />
      <aside className={`mobile-drawer ${isMenuOpen ? "active" : ""}`}>
        <div className="drawer-header flex justify-between items-center mb-6">
          <Logo />
          <button onClick={toggleMenu} className="p-2 text-[#99cc33]">
            <X size={24} />
          </button>
        </div>
        
        <ul className="mobile-nav-links">
          {navLinks.map((link) => (
            <li key={link.path} onClick={toggleMenu}>
              <Link 
                to={link.path} 
                className={location.pathname === link.path ? "active" : "flex items-center gap-2"}
              >
                {link.title} 
                {location.pathname === link.path && <ArrowRight size={16} />}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Mobile Interaction */}
        <div className="mt-auto px-1">
          {isAuthenticated && user ? (
             <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                <img 
                   src={user?.avatar?.url ? user.avatar.url : "/images/profile.png"} 
                   alt={user?.name || "User Profile"} 
                   className="w-12 h-12 rounded-full border-2 border-[#99cc33] object-cover" 
                />
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{user?.role || "User"}</p>
                   <p className="font-black text-[#1a3c34]">{user?.name || "Guest"}</p>
                </div>
                <Link 
                   to="/profile" 
                   onClick={toggleMenu} 
                   className="ml-auto w-10 h-10 bg-[#99cc33] text-white flex items-center justify-center rounded-xl"
                >
                   <ArrowRight size={18} />
                </Link>
             </div>
          ) : (
             <Link to="/register" onClick={toggleMenu} className="auth-mobile-btn flex justify-center items-center gap-2 bg-[#99cc33] text-white py-3 rounded-xl font-bold">
               <User size={18} /> Join Today
             </Link>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;
