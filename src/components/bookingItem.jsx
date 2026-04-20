import axios from "axios";
import { useEffect, useState } from "react";
import { addToCart, decreaseCartQty, removeFromCart } from "../utils/cart";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function BookingItem({ itemKey, qty, refresh }) {
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${itemKey}`)
        .then((res) => { setItem(res.data); setStatus("success"); })
        .catch((err) => { console.error(err); setStatus("error"); refresh?.(); });
    }
  }, [status, itemKey, refresh]);

  if (status === "loading") {
    return (
      <div className="flex w-full max-w-2xl gap-4 p-4 rounded-2xl animate-pulse"
        style={{ background: "#FFFBF5", boxShadow: "0 4px 24px rgba(217,119,6,0.08)" }}>
        <div className="w-20 h-20 rounded-xl shrink-0" style={{ background: "#F5EACF" }} />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 w-2/5 rounded-full" style={{ background: "#F5EACF" }} />
          <div className="h-3 w-1/4 rounded-full" style={{ background: "#F5EACF" }} />
          <div className="h-3 w-1/3 rounded-full" style={{ background: "#F5EACF" }} />
        </div>
        <div className="w-20 space-y-2 py-1 shrink-0">
          <div className="h-3 w-full rounded-full" style={{ background: "#F5EACF" }} />
          <div className="h-5 w-full rounded-full" style={{ background: "#F5EACF" }} />
        </div>
      </div>
    );
  }

  if (status === "error" || !item) return null;

  const subtotal = (item.dailyRentalprice * qty).toLocaleString();

  // item.stockCount = original total stock (not decremented yet — committed only on booking)
  // atMax = cart qty has reached the total available stock
  const atMax = qty >= (item.stockCount ?? 0);

  const handleIncrease = () => {
    if (atMax) {
      toast("You have selected all available items!", { icon: "⚠️" });
      return;
    }
    addToCart(itemKey, 1);   // local only
    refresh();
  };

  const handleDecrease = () => {
    decreaseCartQty(itemKey); // local only
    refresh();
  };

  const handleRemove = () => {
    removeFromCart(itemKey);  // local only
    refresh();
  };

  return (
    <div className="flex w-full max-w-2xl items-center gap-4 p-4 rounded-2xl transition-shadow duration-200"
      style={{ background: "#FFFBF5", boxShadow: "0 4px 24px rgba(217,119,6,0.08)" }}>

      <img src={item.image?.[0]} alt={item.name}
        className="w-20 h-20 object-cover rounded-xl shrink-0"
        style={{ background: "#F5EACF" }} />

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold capitalize truncate" style={{ color: "#292524" }}>{item.name}</h3>
        <p className="text-xs mt-0.5" style={{ color: "#A8A29E" }}>{item.category}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: "#D97706" }}>
          {item.dailyRentalprice?.toLocaleString()} LKR / day
        </p>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleDecrease}
            className="w-7 h-7 flex items-center justify-center rounded-full font-bold text-base transition-all duration-150 select-none"
            style={{ background: "#F5EACF", color: "#D97706" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FBBF24"; e.currentTarget.style.color = "#1C1917"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#F5EACF"; e.currentTarget.style.color = "#D97706"; }}
          >−</button>

          <span className="w-7 text-center text-sm font-black" style={{ color: "#292524" }}>{qty}</span>

          <button
            onClick={handleIncrease}
            className="w-7 h-7 flex items-center justify-center rounded-full font-bold text-base transition-all duration-150 select-none"
            style={{
              background: atMax ? "#F5EDD8" : "#F5EACF",
              color: atMax ? "#A8A29E" : "#D97706",
            }}
            onMouseEnter={e => {
              if (!atMax) { e.currentTarget.style.background = "#FBBF24"; e.currentTarget.style.color = "#1C1917"; }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = atMax ? "#F5EDD8" : "#F5EACF";
              e.currentTarget.style.color = atMax ? "#A8A29E" : "#D97706";
            }}
          >+</button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="text-right">
          <p className="text-xs" style={{ color: "#A8A29E" }}>Subtotal</p>
          <p className="text-sm font-black" style={{ color: "#D97706" }}>
            {subtotal}{" "}
            <span className="text-xs font-semibold" style={{ color: "#A8A29E" }}>LKR</span>
          </p>
        </div>

        <button
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150"
          style={{ color: "#A8A29E", background: "transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FEF3C7"; e.currentTarget.style.color = "#D97706"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#A8A29E"; }}
          title="Remove item"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </div>
  );
}