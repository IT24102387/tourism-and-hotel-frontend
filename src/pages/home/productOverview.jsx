import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import { addToCart } from "../../utils/cart";
import toast from "react-hot-toast";

export default function ProductOverview() {
  const params = useParams();
  const key = params.key;
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [product, setProduct] = useState();
  const [totalStock, setTotalStock] = useState(0);

  // How many of this item are already in cart (read localStorage directly)
  const getCartQty = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
      const found = (cart.orderedItems || []).find(i => i.key === key);
      return found ? found.qty : 0;
    } catch { return 0; }
  };

  const [inCartQty, setInCartQty] = useState(getCartQty());

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${key}`)
      .then((res) => {
        setProduct(res.data);
        setTotalStock(res.data.stockCount ?? 0);
        setInCartQty(getCartQty());
        setLoadingStatus("loaded");
      })
      .catch((err) => {
        console.error(err);
        setLoadingStatus("error");
      });
  }, []);

  // remaining = total stock minus what's already in cart
  const remaining = totalStock - inCartQty;
  const outOfStock = remaining <= 0;

  const handleAddToCart = () => {
    if (outOfStock) {
      toast("You have selected all available items!", { icon: "⚠️" });
      return;
    }
    addToCart(product.key, 1);  // local only
    setInCartQty((prev) => prev + 1);
    toast.success("Added to Cart");
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loadingStatus === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#FAF7F2" }}>
        <div
          className="w-20 h-20 rounded-full animate-spin mb-6"
          style={{ border: "4px solid #F5EACF", borderTopColor: "#FBBF24" }}
        />
        <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#D97706" }}>
          Loading product…
        </p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (loadingStatus === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#FAF7F2" }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl"
          style={{ background: "#FEF3C7" }}
        >
          ⚠️
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#292524" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#78716C" }}>We couldn't load this product. Please try again.</p>
      </div>
    );
  }

  // ── Loaded ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>

      {/* ── Dot texture bg strip ── */}
      <div className="relative overflow-hidden" style={{ background: "#F5EDD8" }}>
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #D97706 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── Breadcrumb ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-6">
          <p className="text-xs font-semibold tracking-widest" style={{ color: "#D97706" }}>
            YALA & KATARAGAMA &nbsp;/&nbsp;
            <span style={{ color: "#A8A29E" }}>Equipment Rental</span>
            &nbsp;/&nbsp;
            <span style={{ color: "#292524" }}>{product?.name}</span>
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* ── LEFT: Image slider ── */}
          <div
            className="w-full lg:w-1/2 rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(146,64,14,0.14)" }}
          >
            <div className="h-1.5" style={{ background: "linear-gradient(to right,#FBBF24,#F59E0B,#D97706)" }} />
            <ImageSlider images={product.image} />
          </div>

          {/* ── RIGHT: Product details ── */}
          <div className="w-full lg:w-1/2 flex flex-col">

            {/* Category badge */}
            <div className="mb-4">
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
              >
                {product.category || "GEAR"}
              </span>
            </div>

            {/* Product name */}
            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight" style={{ color: "#292524" }}>
              {product.name}
            </h1>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right,#FBBF24,transparent)" }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D97706" }} />
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed mb-6" style={{ color: "#78716C" }}>
              {product.description}
            </p>

            {/* Stock count display */}
            <div
              className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
              style={{ background: "#FFFBF5", border: "1px solid #F5EACF" }}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: outOfStock ? "#EF4444" : "#F59E0B" }}
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: outOfStock ? "#DC2626" : "#D97706" }}
                >
                  {outOfStock ? "Out of Stock" : "In Stock"}
                </span>
                {!outOfStock && (
                  <span
                    className="text-sm font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#FEF3C7", color: "#92400E" }}
                  >
                    {remaining} unit{remaining !== 1 ? "s" : ""} available
                  </span>
                )}
              </div>
            </div>

            {/* Price card */}
            <div
              className="rounded-2xl p-6 mb-6 flex items-end justify-between"
              style={{
                background: "#FFFBF5",
                border: "1px solid #F5EACF",
                boxShadow: "0 4px 20px rgba(217,119,6,0.08)",
              }}
            >
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#A8A29E" }}>
                  Daily Rental Price
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black" style={{ color: "#D97706" }}>
                    {product.dailyRentalprice?.toLocaleString() || "0"}
                  </span>
                  <span className="text-lg font-semibold mb-0.5" style={{ color: "#A8A29E" }}>
                    LKR / day
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rotate-45 border-2 opacity-20" style={{ borderColor: "#D97706" }} />
            </div>

            {/* Pickup location */}
            {product.pickupLocation && (
              <div
                className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl"
                style={{ background: "#FFFBF5", border: "1px solid #F5EACF" }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#F59E0B" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium" style={{ color: "#78716C" }}>
                  Pickup at: <span className="font-bold" style={{ color: "#292524" }}>{product.pickupLocation}</span>
                </span>
              </div>
            )}

            {/* Add to Cart button */}
            <button
              className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-200 hover:scale-[1.02] hover:opacity-90 flex items-center justify-center gap-3"
              style={{
                background: outOfStock ? "#F5EDD8" : "linear-gradient(135deg,#FBBF24,#F59E0B)",
                color: outOfStock ? "#A8A29E" : "#1C1917",
                boxShadow: outOfStock ? "none" : "0 8px 24px rgba(251,191,36,0.35)",
                cursor: outOfStock ? "not-allowed" : "pointer",
              }}
              onClick={handleAddToCart}
            >
              {outOfStock ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Out of Stock
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex gap-4 mt-6 flex-wrap">
              {[
                { icon: "🛡️", label: "Secure Booking" },
                { icon: "🔄", label: "Free Cancellation" },
                { icon: "⭐", label: "Top Rated Gear" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "#FFFBF5", border: "1px solid #F5EACF", color: "#78716C" }}
                >
                  <span>{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer strip ── */}
      <div className="py-8 text-center mt-8" style={{ background: "#1C1917" }}>
        <p style={{ color: "#78716C" }}>© 2026 Yala & Kataragama Travel Hub. All rights reserved.</p>
      </div>
    </div>
  );
}