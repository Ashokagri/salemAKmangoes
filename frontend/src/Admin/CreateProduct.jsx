import React, { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import "../AdminStyles/Dashboard.css";
import Navbar from "../components/Navbar";
import AdminFooter from "./AdminFooter";
import PageTitle from "../components/PageTitle";
import AdminSidebar from "./AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { Box, IndianRupee, FileText, Layers, Activity, CloudUpload, Save, Loader2 } from "lucide-react";

function CreateProduct() {
  const { success, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const categories = ["Mangoes", "Others"];

  const createProductSubmit = (e) => {
    e.preventDefault();
    if (image.length === 0) {
      toast.error("Please upload at least one image", { position: "bottom-left" });
      return;
    }
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    image.forEach((img) => {
      myForm.append("image", img);
    });
    dispatch(createProduct(myForm));
  };

  const createProductImage = (e) => {
    const files = Array.from(e.target.files);
    setImage([]);
    setImagePreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
          setImage((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Product Created successfully", {
        position: "bottom-left",
        autoClose: 2000,
      });
      dispatch(removeSuccess());
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setImage([]);
      setImagePreview([]);
    }
  }, [dispatch, error, success]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <PageTitle title="Create Product - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <div className="admin-form-container">
            <header className="mb-10 text-center">
              <h1 className="admin-form-title">Create New Product</h1>
              <p className="admin-form-subtitle">Add another premium mango variety to your seasonal catalog.</p>
            </header>

            <form className="admin-form" encType="multipart/form-data" onSubmit={createProductSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label"><Box size={14} /> Product Name</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g., Imam Pasand (Alphonso)"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label"><IndianRupee size={14} /> Price per kg (₹)</label>
                <input
                  type="number"
                  className="admin-form-input"
                  placeholder="Enter unit price"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label"><Layers size={14} /> Category</label>
                <select
                  className="admin-form-select"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Choose a Category</option>
                  {categories.map((item) => (
                    <option value={item} key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label"><Activity size={14} /> Stock Available (kg)</label>
                <input
                  type="number"
                  className="admin-form-input"
                  placeholder="Quantity in stock"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="admin-form-group form-group-full">
                <label className="admin-form-label"><FileText size={14} /> Detailed Description</label>
                <textarea
                  className="admin-form-textarea"
                  placeholder="Describe the taste, origin, and characteristics of this mango..."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="admin-form-group form-group-full">
                <label className="admin-form-label"><CloudUpload size={14} /> Product Gallery</label>
                <div className="custom-file-upload">
                  <CloudUpload size={48} className="mb-4 text-gray-300" />
                  <p className="text-sm font-bold text-gray-600">Click or drag images to upload</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Recommended size: 800x800px</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden-file-input"
                    multiple
                    onChange={createProductImage}
                  />
                </div>

                <div className="admin-image-previews">
                  {imagePreview.map((img, index) => (
                    <img
                      src={img}
                      alt="Product Preview"
                      className="admin-preview-img"
                      key={index}
                    />
                  ))}
                </div>
              </div>

              <button className="admin-submit-btn group" disabled={loading}>
                {loading ? (
                  <>
                    Adding Product <Loader2 size={18} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save & Publish Product
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
      <AdminFooter />
    </>
  );
}

export default CreateProduct;
