import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addItemsToCart,
  removeErrors,
  removeItemFromCart,
  removeMessage,
} from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Plus, Minus, RefreshCw } from "lucide-react";

function CartItem({ item }) {
  const { success, loading, error, message } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  
  const decreaseQuantity = () => {
    if (quantity <= 3) {
      toast.error("Minimum order quantity is 3 kg", {
        position: "bottom-left",
        autoClose: 2000,
      });
      return;
    }
    setQuantity(qty => qty - 1);
  };

  const increaseQuantity = () => {
    if (item.stock <= quantity) {
      toast.error("Cannot exceed available Stock!", {
        position: "bottom-left",
        autoClose: 2000,
      });
      return;
    }
    if (quantity >= 20) {
      toast.error("Any order exceeding 20 kg will be treated as a bulk order.", {
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    }
    setQuantity(qty => qty + 1);
  };

  const handleUpdate = () => {
    if (loading) return;
    if (quantity !== item.quantity) {
      dispatch(addItemsToCart({ id: item.product, quantity }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "bottom-left", autoClose: 2000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "bottom-left",
        autoClose: 2000,
        toastId: "cart-update",
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const handleRemove = () => {
    if (loading) return;
    dispatch(removeItemFromCart(item.product));
    toast.success("Item removed from cart successfully", {
        position: "bottom-left",
        autoClose: 2000
    });
  };

  return (
    <div className="cart-item">
      {/* Product Information */}
      <div className="item-info">
        <img src={item.image} alt={item.name} className="item-image" />
        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-price-unit">₹{item.price} / kg</p>
        </div>
      </div>

      {/* Quantity Control System */}
      <div className="flex flex-col items-center gap-2">
        <div className="quantity-controls">
          <button
            className="quantity-button"
            onClick={decreaseQuantity}
            disabled={loading}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            value={quantity}
            className="quantity-input"
            readOnly
          />
          <button
            className="quantity-button"
            onClick={increaseQuantity}
            disabled={loading}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        
        {quantity !== item.quantity && (
           <button 
             className="text-xs font-bold text-[#99cc33] flex items-center gap-1 hover:underline underline-offset-4"
             onClick={handleUpdate}
             disabled={loading}
           >
             <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
             Click to Update
           </button>
        )}
      </div>

      {/* Item Total */}
      <div className="item-total">
        <span className="item-total-price">
          ₹{(item.price * item.quantity).toLocaleString()}/-
        </span>
      </div>

      {/* Remove Action */}
      <div className="flex justify-end">
        <button
          className="remove-item-icon-btn"
          disabled={loading}
          onClick={handleRemove}
          title="Remove Item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
