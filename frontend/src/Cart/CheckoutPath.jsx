import React from "react";
import "../CartStyles/CheckoutPath.css";
import { Truck, ClipboardList, Wallet, Check } from "lucide-react";

function CheckoutPath({ activePath }) {
  const steps = [
    {
      label: "Shipping Details",
      icon: <Truck size={24} />,
    },
    {
      label: "Order Summary",
      icon: <ClipboardList size={24} />,
    },
    {
      label: "Payment",
      icon: <Wallet size={24} />,
    },
  ];

  return (
    <nav className="checkoutPath" aria-label="Checkout Progress">
      {steps.map((item, index) => (
        <div
          className="checkoutPath-step"
          key={index}
          data-active={activePath === index ? "true" : "false"}
          data-completed={activePath > index ? "true" : "false"}
        >
          <div className="checkoutPath-icon-container">
             {activePath > index ? <Check size={20} strokeWidth={3} /> : item.icon}
          </div>
          <p className="checkoutPath-label">{item.label}</p>
        </div>
      ))}
    </nav>
  );
}

export default CheckoutPath;
