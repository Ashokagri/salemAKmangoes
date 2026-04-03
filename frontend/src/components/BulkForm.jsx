import { useState } from "react";
import "../componentStyles/BulkForm.css";

export default function BulkForm() {
  const [result, setResult] = useState("");
const [quantity, setQuantity] = useState("");

const onSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  // REQUIRED for Web3Forms
  formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    setResult("Success!");
    event.target.reset();  // CLEAR FORM
    setQuantity(""); 
          // Clear quantity state
  } else {
    setResult("Error: " + data.message);
  }
};


  return (
    <div className="bulk-form-container">
      <form className="bulk-form" onSubmit={onSubmit}>
        <h2 className="bulk-form-title">Bulk Order Form</h2>
        <input type="hidden" name="subject" value="New Bulk Order Request" />
        
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="Enter your full name" required />
        </div>

        <div className="form-group" id="bulk-section">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="Enter your email" required />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input type="text" name="mobile" placeholder="Enter your phone number" required />
        </div>

        <div className="form-group">
          <label>Delivery Address</label>
          <textarea name="address" placeholder="Full delivery address" required />
        </div>

        <div className="form-group">
          <label>Quantity (in kg)</label>
          <input
            type="number"
            name="quantity"
            placeholder="Min 21 kg"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />
          {quantity <= 20 && quantity !== "" && (
            <p className="warning-text">Minimum 21 kg required for bulk booking</p>
          )}
        </div>

        <button type="submit" className="bulk-submit-btn" disabled={quantity <= 20}>
          Submit Request
        </button>

        {result && <p className={`result ${result.includes("Error") ? "error" : "success"}`}>{result}</p>}
      </form>
    </div>
  );
}
