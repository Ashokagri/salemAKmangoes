import React, { useState } from "react";
import "../CartStyles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { City } from 'country-state-city';
import { toast } from 'react-toastify';
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Globe, Truck, Building, ArrowRight } from "lucide-react";

function Shipping() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");
  const [country] = useState("IN");
  const [state, setState] = useState(shippingInfo.state || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [shippingPartner, setShippingPartner] = useState(shippingInfo.shippingPartner || "");

  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const supportedStates = [
    { code: "TN", name: "Tamil Nadu" },
    { code: "KL", name: "Kerala" },
    { code: "KA", name: "Karnataka" },
    { code: "AP", name: "Andhra Pradesh" },
  ];

  const calculateShipping = () => {
    if (!state || !shippingPartner) return 0;

    let charges = 0;
    if (shippingPartner === "ST Courier") {
      if (state === "TN") charges = totalQty * 40;
      else if (state === "KA" || state === "KL") charges = totalQty * 50;
      else if (state === "AP") charges = totalQty * 60;
    } else if (shippingPartner === "MSS Courier") {
      if (state === "TN") {
        charges = totalQty >= 10 ? 200 : 150;
      } else if (state === "KL" || state === "KA") {
        charges = totalQty >= 10 ? 250 : 200;
      } else if (state === "AP") {
        charges = totalQty >= 10 ? 300 : 250;
      }
    }
    return charges;
  };

  const shippingCharges = calculateShipping();

  const shippingInfoSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error('Invalid Phone number! It should be 10 digits', { position: 'bottom-left', autoClose: 2000 });
      return;
    }
    if (!shippingPartner) {
      toast.error('Please select a Shipping Partner', { position: 'bottom-left', autoClose: 2000 });
      return;
    }
    dispatch(saveShippingInfo({
      address,
      pinCode,
      phoneNumber,
      country,
      state,
      city,
      shippingPartner,
      shippingCharges
    }));
    navigate('/order/confirm');
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="pt-24 lg:pt-32 pb-12">
        <PageTitle title="Shipping Details - Salem AK Mangoes" />
        <CheckoutPath activePath={0} />

        <div className="shipping-form-container">
          <div className="shipping-form-card">
            <h1 className="shipping-form-header">Shipping Details</h1>

            <form className="shipping-form" onSubmit={shippingInfoSubmit}>
              <div className="shipping-grid">
                <div className="shipping-form-group">
                  <label htmlFor="address"><MapPin size={18} /> Delivery Address</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Street, Colony, Floor"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="shipping-form-group">
                  <label htmlFor="pinCode"><MapPin size={18} /> Pin Code</label>
                  <input
                    type="number"
                    id="pinCode"
                    placeholder="6-digit PIN"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    required
                  />
                </div>

                <div className="shipping-form-group">
                  <label htmlFor="phoneNumber"><Phone size={18} /> Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder="10-digit number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="shipping-form-group">
                  <label htmlFor="country"><Globe size={18} /> Country</label>
                  <select name="country" id="country" value={country} disabled>
                    <option value="IN">India</option>
                  </select>
                </div>

                <div className="shipping-form-group">
                  <label htmlFor="state"><Building size={18} /> State</label>
                  <select
                    name="state"
                    id="state"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setCity("");
                    }}
                    required
                  >
                    <option value="">Select State</option>
                    {supportedStates.map((item) => (
                      <option value={item.code} key={item.code}>{item.name}</option>
                    ))}
                  </select>
                </div>

                {state && (
                  <div className="shipping-form-group">
                    <label htmlFor="city"><Building size={18} /> City</label>
                    <select
                      name="city"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    >
                      <option value="">Select City</option>
                      {City && City.getCitiesOfState(country, state).map((item) => (
                        <option value={item.name} key={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="courier-select-row">
                <label className="text-sm font-bold text-gray-700 block mb-3 uppercase tracking-wider">
                  Select Courier Partner
                </label>
                <div className="courier-options">
                  {["ST Courier", "MSS Courier"].map((partner) => (
                    <button
                      key={partner}
                      type="button"
                      className={`courier-option-btn ${shippingPartner === partner ? "active" : ""}`}
                      onClick={() => setShippingPartner(partner)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Truck size={24} />
                        <span className="font-bold">{partner}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {shippingCharges > 0 && (
                <div className="shipping-charge-card">
                  <p>Estimated Shipping Cost</p>
                  <span className="price">₹{shippingCharges}</span>
                  <p className="text-xs !font-normal">Calculated based on {totalQty}kg to {state}</p>
                </div>
              )}

              <button className="shipping-submit-btn group" type="submit">
                Review Order <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Shipping;
