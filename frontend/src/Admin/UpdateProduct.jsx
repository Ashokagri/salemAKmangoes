import React, { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import "../AdminStyles/Dashboard.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import AdminFooter from "./AdminFooter";
import AdminSidebar from "./AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails } from "../features/products/productSlice";
import {
  removeErrors,
  removeSuccess,
  updateProduct,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { Box, IndianRupee, FileText, Layers, Activity, CloudUpload, Save, Loader2, Image as ImageIcon } from "lucide-react";

function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const { product } = useSelector((state) => state.product);
  const { success, error, loading } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateId } = useParams();
  const categories = ["Mangoes", "Others"];

  useEffect(() => {
    dispatch(getProductDetails(updateId));
  }, [dispatch, updateId]);

  useEffect(() => {
    if (product && product._id === updateId) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setStock(product.stock);
      setOldImage(product.image || []);
    }
  }, [product, updateId]);

  const handleImageChange = (e) => {
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

  const updateProductSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    image.forEach((img) => {
      myForm.append("image", img);
    });
    dispatch(updateProduct({ id: updateId, formData: myForm }));
  };

  useEffect(() => {
    if (success) {
      toast.success("Product Updated Successfully", {
        position: "bottom-left",
        autoClose: 2000,
      });
      dispatch(removeSuccess());
      navigate("/admin/products");
    }
    if (error) {
      toast.error(error, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      <Navbar />
      <PageTitle title="Update Product - Admin Panel" />

      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="admin-main-content">
          <div className="admin-form-container">
            <header className="mb-10 text-center">
              <h1 className="admin-form-title">Update Product Details</h1>
              <p className="admin-form-subtitle">Modify the specifications for <strong>{name}</strong>.</p>
            </header>

            <form className="admin-form" encType="multipart/form-data" onSubmit={updateProductSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label"><Box size={14} /> Product Name</label>
                <input
                  type="text"
                  className="admin-form-input"
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
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="admin-form-group form-group-full">
                <label className="admin-form-label"><FileText size={14} /> Product Description</label>
                <textarea
                  className="admin-form-textarea"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="admin-form-group form-group-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="admin-form-label mb-4 underline"><ImageIcon size={14} /> Current Product Images</label>
                    <div className="admin-image-previews">
                      {oldImage.map((img, index) => (
                        <img
                          src={img.url}
                          alt="Current Product"
                          className="admin-preview-img opacity-60 grayscale-[50%]"
                          key={index}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="admin-form-label mb-4"><CloudUpload size={14} /> Replace With New Images</label>
                    <div className="custom-file-upload !p-6 !py-8">
                      <CloudUpload size={32} className="mb-2 text-gray-300" />
                      <p className="text-xs font-bold text-gray-500">Upload new gallery</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        multiple
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="admin-image-previews mt-4">
                      {imagePreview.map((img, index) => (
                        <img
                          src={img}
                          alt="New Preview"
                          className="admin-preview-img border-[#1a3c34] scale-110"
                          key={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button className="admin-submit-btn group" disabled={loading}>
                {loading ? (
                  <>
                    Updating <Loader2 size={18} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <Save size={18} /> Update Product Information
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

export default UpdateProduct;
