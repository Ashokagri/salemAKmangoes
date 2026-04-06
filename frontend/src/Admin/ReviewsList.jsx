import React, { useEffect, useState } from "react";
import "../AdminStyles/Dashboard.css";
import "../AdminStyles/AdminTable.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import AdminFooter from "./AdminFooter";
import AdminSidebar from "./AdminSidebar";
import { Trash2, Edit3, Eye, Star, X, AlertCircle, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteReview,
  deleteProduct,
  fetchAdminProducts,
  fetchProductReviews,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";

function ReviewsList() {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load all products
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Handle view reviews
  const handleViewReviews = (productId) => {
    setSelectedProduct(productId);
    dispatch(fetchProductReviews(productId));
    setShowModal(true);
  };

  // Handle delete review
  const handleDeleteReview = (productId, reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirmDelete) {
      dispatch(deleteReview({ productId, reviewId })).then(() => {
        dispatch(fetchProductReviews(productId));
      });
    }
  };

  // Handle delete product
  const handleDeleteProduct = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      dispatch(deleteProduct(id)).then((action) => {
        if (action.type === "admin/deleteProduct/fulfilled") {
           toast.success("Product Deleted Successfully", { position: "bottom-left", autoClose: 2000 });
           dispatch(removeSuccess());
           dispatch(fetchAdminProducts());
        }
      });
    }
  };

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }

    if (success) {
      toast.success(message, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeSuccess());
      dispatch(clearMessage());
    }
  }, [dispatch, error, success, message, navigate]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <PageTitle title="Review Management - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <header className="admin-table-header">
            <div>
              <h1 className="admin-table-title">Product Reviews</h1>
              <p className="admin-page-subtitle">Monitor and manage customer feedback for all mango varieties.</p>
            </div>
          </header>

          {loading ? (
            <Loader />
          ) : (
            <div className="admin-list-wrapper">
              {!products || products.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <AlertCircle size={48} className="text-gray-300" />
                  <p className="text-xl font-bold text-gray-400">No products found in the catalog.</p>
                </div>
              ) : (
                <table className="admin-list-table">
                  <thead>
                    <tr>
                      <th>Product Info</th>
                      <th>Rating Stats</th>
                      <th>Review Count</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product?._id}>
                        <td>
                          <div className="flex items-center gap-4">
                            <img 
                              src={product?.image?.[0]?.url ? product.image[0].url : "/images/placeholder.png"} 
                              alt={product?.name || "Product Image"} 
                              className="admin-item-img" 
                            />
                            <div>
                              <span className="admin-item-name">{product?.name || "Premium Product"}</span>
                              <span className="admin-item-sub">ID: {product?._id?.substring(0, 8) || "N/A"}...</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star size={14} fill="currentColor" /> {product?.ratings || 0} / 5.0
                          </div>
                        </td>
                        <td>
                          <span className="status-badge bg-gray-100 text-gray-700">
                            {product?.numOfReviews || 0} Reviews
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <Link to={`/admin/product/${product?._id}`} className="admin-action-btn btn-edit" title="Edit Product">
                              <Edit3 size={18} />
                            </Link>

                            {(product?.numOfReviews || 0) > 0 && (
                              <button
                                className="admin-action-btn bg-blue-50 text-blue-600 hover:bg-blue-100 !w-10 !h-10 !rounded-full"
                                onClick={() => handleViewReviews(product?._id)}
                                title="View Reviews"
                              >
                                <Eye size={18} />
                              </button>
                            )}

                            <button
                               className="admin-action-btn btn-delete"
                               onClick={() => handleDeleteProduct(product?._id)}
                               title="Delete Product"
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

      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <header className="p-6 border-bottom flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-black text-[#1a3c34]">Customer Feedback</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Detailed reviews for the selected product</p>
              </div>
              <button
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-auto p-6">
              {reviews.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-400 font-bold">No active reviews found for this selection.</p>
                </div>
              ) : (
                <table className="admin-list-table">
                  <thead>
                    <tr>
                      <th>Reviewer</th>
                      <th>Rating</th>
                      <th className="w-1/2">Comment</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review._id}>
                        <td>
                          <span className="font-bold text-gray-700">{review.name}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 text-amber-500 font-black">
                            {review.rating} <Star size={12} fill="currentColor" />
                          </div>
                        </td>
                        <td>
                          <p className="text-sm text-gray-600 italic line-clamp-2">"{review.comment}"</p>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <button
                              className="admin-action-btn btn-delete"
                              onClick={() => handleDeleteReview(selectedProduct, review._id)}
                              title="Remove Review"
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

            <footer className="p-6 border-top bg-gray-50 text-right">
              <button
                className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg font-bold hover:bg-[#99cc33] hover:text-[#1a3c34] transition-all"
                onClick={() => setShowModal(false)}
              >
                Close View
              </button>
            </footer>
          </div>
        </div>
      )}

      <AdminFooter />
    </>
  );
}

export default ReviewsList;
