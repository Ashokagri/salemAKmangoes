import React, { useEffect } from "react";
import "../AdminStyles/Dashboard.css";
import "../AdminStyles/AdminTable.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import AdminFooter from "./AdminFooter";
import AdminSidebar from "./AdminSidebar";
import { Link } from "react-router-dom";
import { Edit3, Trash2, Plus, AlertCircle, CheckCircle2, Star, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchAdminProducts, removeErrors, removeSuccess } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function ProductsList() {
  const { products, loading, error, deleting } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handleDelete = (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (isConfirmed) {
      dispatch(deleteProduct(productId)).then((action) => {
        if (action.type === "admin/deleteProduct/fulfilled") {
          toast.success("Product Deleted Successfully", { position: "bottom-left", autoClose: 2000 });
          dispatch(removeSuccess());
        }
      });
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <PageTitle title="All Products - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <header className="admin-table-header">
            <div>
              <h1 className="admin-table-title">Product Inventory</h1>
              <p className="admin-page-subtitle">Manage your mango catalog across all seasons.</p>
            </div>
            <Link to="/admin/product/create" className="admin-create-btn group">
              <Plus size={20} /> Add New Product
            </Link>
          </header>

          {loading ? (
            <Loader />
          ) : (
            <div className="admin-list-wrapper">
              {!products || products.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <AlertCircle size={48} className="text-gray-300" />
                  <p className="text-xl font-bold text-gray-400">No products found in the catalog.</p>
                  <Link to="/admin/product/create" className="text-[#99cc33] font-bold hover:underline">
                    Create your first product
                  </Link>
                </div>
              ) : (
                <table className="admin-list-table">
                  <thead>
                    <tr>
                      <th>Info</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th>Ratings</th>
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
                          <span className="text-xs font-bold uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product?.category || "Uncategorized"}
                          </span>
                        </td>
                        <td>
                          <span className="font-bold text-gray-700">₹{product?.price?.toLocaleString() || 0}</span>
                        </td>
                        <td>
                          {product?.stock > 0 ? (
                            <span className="status-badge status-success">
                              <CheckCircle2 size={12} className="inline mr-1" /> {product.stock} Units
                            </span>
                          ) : (
                            <span className="status-badge status-error">
                              <AlertCircle size={12} className="inline mr-1" /> Out of Stock
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star size={14} fill="currentColor" /> {product?.ratings || 0}
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <Link to={`/admin/product/${product?._id}`} className="admin-action-btn btn-edit" title="Edit Product">
                              <Edit3 size={18} />
                            </Link>
                            <button
                              className="admin-action-btn btn-delete"
                              disabled={deleting?.[product?._id]}
                              onClick={() => handleDelete(product?._id)}
                              title="Delete Product"
                            >
                              {deleting?.[product?._id] ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
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
      <AdminFooter />
    </>
  );
}

export default ProductsList;
