import React from "react";
import "../componentStyles/Product.css";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { ArrowRight, Leaf } from "lucide-react";

function Product({ product }) {
  return (
    <Link to={`/product/${product?._id}`} className="product_id group">
      <div className="product-card">
        {/* Organic Badge */}
        <div className="product-badge flex items-center gap-1">
          <Leaf size={12} /> Organic
        </div>

        <div className="product-image-wrapper">
          <img 
            src={product?.image?.[0]?.url ? product.image[0].url : "/images/placeholder.png"} 
            alt={product?.name || "Product Image"} 
            className="product-image-card" 
          />
        </div>

        <div className="product-details">
          <h3 className="product-title">{product?.name || "Premium Mango"}</h3>
          
          <div className="price-row">
            <span className="home-price">₹{product?.price || 0}</span>
            <span className="price-unit">/ kg</span>
          </div>

          <div className="rating-row">
            <Rating
              value={product?.ratings || 0}
              disabled={true}
              size="small"
            />
            {product?.numOfReviews > 0 && (
              <span className="productCardSpan">
                ({product.numOfReviews})
              </span>
            )}
          </div>

          <button className="view-details-btn group-hover:bg-[#1a3c34] group-hover:text-white transition-all">
            View Details <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default Product;
