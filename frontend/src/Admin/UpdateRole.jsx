import React, { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import "../AdminStyles/Dashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import AdminSidebar from "./AdminSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser, removeErrors, removeSuccess, updateUserRole } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { User, Mail, ShieldCheck, Save, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function UpdateRole() {
  const { userId } = useParams();
  const { user, success, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    dispatch(getSingleUser(userId));
  }, [dispatch, userId]);

  const { name, email, role } = formData;

  useEffect(() => {
    if (user && user._id === userId) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserRole({ userId, role }));
  };

  useEffect(() => {
    if (success) {
      toast.success("User Role Updated Successfully", { position: "bottom-left", autoClose: 2000 });
      dispatch(removeSuccess());
      navigate("/admin/users");
    }
    if (error) {
      toast.error(error.message || error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      <Navbar />
      <PageTitle title="Update User Role - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <div className="admin-form-container !max-w-2xl">
            <header className="mb-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-[#99cc33]/20 rounded-full flex items-center justify-center text-[#1a3c34]">
                   <ShieldCheck size={40} />
                </div>
              </div>
              <h1 className="admin-form-title">Assign User Access</h1>
              <p className="admin-form-subtitle">Update administrative permissions for <strong>{name}</strong>.</p>
            </header>

            <form className="admin-form !grid-cols-1" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label"><User size={14} /> Full Name</label>
                <input 
                  type="text" 
                  className="admin-form-input !bg-gray-50 !text-gray-400" 
                  readOnly 
                  value={name} 
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label"><Mail size={14} /> Registered Email</label>
                <input
                  type="email"
                  className="admin-form-input !bg-gray-50 !text-gray-400"
                  readOnly
                  value={email}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label"><ShieldCheck size={14} /> Security Role</label>
                <select 
                  name="role" 
                  className="admin-form-select" 
                  required 
                  value={role} 
                  onChange={handleChange}
                >
                  <option value="">Select Access Level</option>
                  <option value="user">Standard User (Customer)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <button className="admin-submit-btn mt-6" disabled={loading}>
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Confirm Permissions Update
                  </>
                )}
              </button>
              
              <Link to="/admin/users" className="text-center text-sm font-bold text-gray-400 hover:text-[#1a3c34] flex items-center justify-center gap-1 mt-4 transition-colors">
                <ArrowLeft size={14} /> Back to User List
              </Link>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default UpdateRole;
