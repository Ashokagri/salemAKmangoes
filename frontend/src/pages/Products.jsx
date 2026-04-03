import React, { useEffect, useState } from "react";
import "../pageStyles/Products.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";
import { Button, Container } from "@mui/material";

function Products() {
  const { loading, error, products, resultsPerPage, productCount } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const urlCategory = searchParams.get("category"); // Renamed to avoid shadowing
  const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
  const navigate = useNavigate();
  const categories = ["Mangoes", "Others"];

  useEffect(() => {
    dispatch(getProduct({ keyword, page: pageFromURL, category: urlCategory }));
  }, [dispatch, keyword, pageFromURL, urlCategory]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Error loading products", { position: "bottom-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);


  const handleCategoryClick = (cat) => {
    const newSearchParams = new URLSearchParams(location.search);
    if (urlCategory === cat) {
      newSearchParams.delete("category");
    } else {
      newSearchParams.set("category", cat);
    }
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`);
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("page", page);
    navigate(`?${newSearchParams.toString()}`);
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <main className="pt-24 lg:pt-28 min-h-screen">
          <Container>
            <div className="filter-section my-8">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`btn-category ${urlCategory === cat ? "active" : ""}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Container>
          <br />
          <br />
          <Container>
            <div className="products-view-container">
              {products && products.length > 0 ? (
                <div className="home-container pb-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product, index) => (
                      <Product product={product} key={product._id || index} />
                    ))}
                  </div>

                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={pageFromURL}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-20">
                  <NoProducts />
                </div>
              )}
            </div>
          </Container>
          <Footer />
        </main>
      )}
    </>
  );
}

export default Products;
