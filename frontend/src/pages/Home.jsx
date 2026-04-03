import React, { useEffect } from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Product from "../components/Product";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Homebanner from "../components/Homebanner";
import NoProducts from "../components/NoProducts";
import BulkForm from "../components/BulkForm";
import { ArrowRight, ShoppingBag, Truck } from "lucide-react";

function Home() {
  const { loading, error, products } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct({ keyword: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "bottom-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <br />
      {loading ? (
        <Loader />
      ) : (
        <main className="pt-24 lg:pt-28">
          <PageTitle title="Salem AK Mangoes - Premium Organic Fruits" />

          <div className="container-custom">
            {/* Hero Section */}
            <Homebanner />

            {/* Featured Products Section */}
            <section className="home-section">
              <h2 className="home-heading">Fresh Harvest</h2>
              <div className="products-container">
                {products && products.length > 0 ? (
                  <>
                    <div className="product-grid-refined">
                      {products.slice(0, 4).map((product, index) => (
                        <Product product={product} key={product._id || index} />
                      ))}
                    </div>

                    <div className="load-more-container">
                      <Link to="/products" className="btn-see-more">
                        <ShoppingBag size={20} /> View All Mangoes <ArrowRight size={18} />
                      </Link>
                    </div>
                  </>
                ) : (
                  <NoProducts />
                )}
              </div>
            </section>

            <hr className="custom-hr" />

            {/* Bulk Order Section */}
            <section className="home-section">
              <div className="bulk-order-section">
                <div className="bulk-order-header">
                  <div className="flex justify-center mb-4 text-[#99cc33]">
                    <Truck size={48} />
                  </div>
                  <h2>Wholesale & Bulk Orders</h2>
                  <p>
                    Are you a retailer or planning a large event?
                    We offer special pricing for bulk orders above 20kg.
                    Fill out the form below and our team will get in touch.
                  </p>
                </div>
                <BulkForm />
              </div>
            </section>
          </div>
        </main>
      )}
      <Footer />
    </>
  );
}

export default Home;
