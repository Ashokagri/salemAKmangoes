import React, { useEffect } from "react";
import "../AdminStyles/Dashboard.css";
import "../AdminStyles/AdminTable.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import AdminSidebar from "./AdminSidebar";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Edit3, Trash2, Users, Mail, Shield, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, deleteUser, fetchUsers, removeErrors } from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function UsersList() {
  const { users, loading, error, message } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (confirm) {
      dispatch(deleteUser(userId));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
    if (message) {
      toast.success(message, { position: "bottom-left", autoClose: 2000 });
      dispatch(clearMessage());
      dispatch(fetchUsers());
    }
  }, [dispatch, error, message]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <PageTitle title="User Management - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <header className="admin-table-header">
            <div>
              <h1 className="admin-table-title">User Management</h1>
              <p className="admin-page-subtitle">Manage customer accounts and administrative roles.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-sm font-bold text-gray-500">
              <Users size={16} /> Registered: {users?.length || 0}
            </div>
          </header>

          {loading ? (
            <Loader />
          ) : (
            <div className="admin-list-wrapper">
              {!users || users.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <AlertCircle size={48} className="text-gray-300" />
                  <p className="text-xl font-bold text-gray-400">No users found in the system.</p>
                </div>
              ) : (
                <table className="admin-list-table">
                  <thead>
                    <tr>
                      <th>User Profile</th>
                      <th>Email Address</th>
                      <th>Access Level</th>
                      <th>Joined Date</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="admin-item-name">{user.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">ID: {user._id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${user.role === "admin" ? "status-success" : "bg-gray-100 text-gray-600"}`}>
                            <Shield size={12} className="inline mr-1" /> {user.role}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <Link to={`/admin/user/${user._id}`} className="admin-action-btn btn-edit" title="Update Role">
                              <Edit3 size={18} />
                            </Link>
                            <button
                              className="admin-action-btn btn-delete"
                              onClick={() => handleDelete(user._id)}
                              title="Delete User"
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

export default UsersList;
