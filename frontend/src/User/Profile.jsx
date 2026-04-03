import React, { useEffect } from "react";
import "../UserStyles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import { Edit3, User, Mail, Calendar, ShoppingBag, Lock, Shield } from "lucide-react";

function Profile() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="pt-24 lg:pt-32 pb-12">
        <PageTitle title={`${user?.name}'s Profile - Salem AK Mangoes`} />

        {loading ? (
          <Loader />
        ) : (
          <div className="container-custom">
            <div className="profile-container">
              <div className="profile-header-banner"></div>

              <div className="profile-content">
                <div className="profile-avatar-wrapper">
                  <img
                    src={user?.avatar?.url ? user.avatar.url : "/images/profile.png"}
                    alt={user?.name}
                    className="profile-avatar-img"
                  />
                  <Link to="/profile/update" className="edit-profile-btn" title="Edit Profile">
                    <Edit3 size={18} />
                  </Link>
                </div>

                <h1 className="profile-name">{user?.name}</h1>
                <div className="profile-role-badge">
                  <Shield size={12} className="inline mr-1" /> {user?.role || "Customer"}
                </div>

                <div className="profile-details-grid">
                  <div className="profile-info-item">
                    <span className="profile-info-label"><User size={14} /> Full Name</span>
                    <span className="profile-info-value">{user?.name}</span>
                  </div>

                  <div className="profile-info-item">
                    <span className="profile-info-label"><Mail size={14} /> Email Address</span>
                    <span className="profile-info-value">{user?.email}</span>
                  </div>

                  <div className="profile-info-item">
                    <span className="profile-info-label"><Calendar size={14} /> Joined On</span>
                    <span className="profile-info-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      }) : "N/A"}
                    </span>
                  </div>

                  <div className="profile-info-item">
                    <span className="profile-info-label"><Shield size={14} /> Account Status</span>
                    <span className="profile-info-value text-green-500">Verified</span>
                  </div>
                </div>

                <div className="profile-action-buttons">
                  <Link to="/orders/user" className="profile-btn profile-btn-primary">
                    <ShoppingBag size={18} /> My Orders
                  </Link>
                  <Link to="/password/update" className="profile-btn profile-btn-secondary">
                    <Lock size={18} /> Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Profile;
