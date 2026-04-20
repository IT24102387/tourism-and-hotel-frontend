import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProductCard({ item }) {
  const [stock, setStock] = useState(item.stockCount ?? 0);

  // Re-fetch live stock whenever the tab becomes visible again
  useEffect(() => {
    const fetchStock = () => {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${item.key}`)
        .then((res) => setStock(res.data.stockCount ?? 0))
        .catch(() => {});
    };

    // Fetch on mount
    fetchStock();

    // Fetch whenever user returns to this tab
    const onVisible = () => { if (document.visibilityState === "visible") fetchStock(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [item.key]);

  const outOfStock = stock <= 0;

  return (
    <div className="group w-full max-w-sm rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer mx-3 my-2"
      style={{ background: "#FFFBF5", boxShadow: "0 4px 24px rgba(217,119,6,0.10)" }}>

      {/* Full-bleed Image Section */}
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        <img
          src={item.image?.[0] || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
            style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
            {item.category || "GEAR"}
          </span>
        </div>

        {/* Live Stock badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-sm"
            style={{ background: "rgba(255,251,245,0.92)", color: outOfStock ? "#DC2626" : "#D97706" }}>
            <span className="w-2 h-2 rounded-full"
              style={{ background: outOfStock ? "#EF4444" : "#F59E0B" }} />
            {outOfStock ? "OUT OF STOCK" : `${stock} LEFT`}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow" style={{ background: "#FFFBF5" }}>
        <h3 className="text-xl font-bold capitalize mb-1 line-clamp-1" style={{ color: "#292524" }}>
          {item.name}
        </h3>
        <p className="text-sm line-clamp-2 mb-4" style={{ color: "#A8A29E" }}>
          {item.description}
        </p>

        {/* Bottom row: price + action */}
        <div className="flex items-center justify-between mt-auto gap-2">
          <div>
            <span className="text-2xl font-black" style={{ color: "#D97706" }}>
              {item.dailyRentalprice?.toLocaleString() || "0"}
            </span>
            <span className="text-sm font-semibold ml-1" style={{ color: "#A8A29E" }}>LKR / day</span>
          </div>

          {outOfStock ? (
            <span className="px-4 py-2.5 text-sm font-bold rounded-full"
              style={{ background: "#F5EDD8", color: "#A8A29E" }}>
              Out of Stock
            </span>
          ) : (
            <Link to={"/product/" + item.key}
              className="px-4 py-2.5 text-sm font-bold rounded-full shadow transition-all duration-200 transform hover:scale-105 hover:opacity-90 flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
              Rent Now
            </Link>
          )}
        </div>

       

        {/* Pickup location */}
        {item.pickupLocation && (
          <div className="flex items-center gap-1.5 mt-3 pt-3"
            style={{ borderTop: "1px solid #F5EACF" }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F59E0B" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium truncate" style={{ color: "#A8A29E" }}>
              {item.pickupLocation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}