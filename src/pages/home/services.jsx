import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaCartShopping } from "react-icons/fa6"
import ProductCard from "../../components/productCard"
import { getProducts } from "../../utils/api"
import { addToCart, loadCart } from "../../utils/cart"

export default function Services() {
  const [state, setState] = useState("loading") // loading, success, error
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // ── Single source of truth: read orderedItems from the shared "cart" key ──
  const [cart, setCart] = useState(() => loadCart().orderedItems)

  const [toastMsg, setToastMsg] = useState("")

  useEffect(() => {
    if (state === "loading") {
      getProducts()
        .then((res) => {
          setItems(res.data)
          setState("success")
        })
        .catch((err) => {
          console.error(err?.response?.data?.error || "An error occurred")
          setState("error")
        })
    }
  }, [])

  // ── Re-sync cart state whenever the component gains focus (e.g. back from booking) ──
  useEffect(() => {
    const syncCart = () => setCart(loadCart().orderedItems)
    window.addEventListener("focus", syncCart)
    return () => window.removeEventListener("focus", syncCart)
  }, [])

  const handleAddToCart = (item) => {
    addToCart(item.key, 1)              // write via shared utility → "cart" key
    setCart(loadCart().orderedItems)    // sync local state from source of truth

    setToastMsg(`"${item.name}" added to cart!`)
    setTimeout(() => setToastMsg(""), 2500)
  }

  // ── Number of distinct products in cart ──
  const cartCount = cart.length

  // ── Total quantity across all items (for tooltip / accessibility) ──
  const totalQty = cart.reduce((sum, c) => sum + (c.qty || 0), 0)

  const filtered = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen w-full" style={{ background: "#FAF7F2" }}>

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 260 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80')",
            filter: "brightness(0.45)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "#FBBF24" }}
          >
            WildHaven Resort &amp; Safari
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
            style={{ color: "#FFFFFF", fontFamily: "'Georgia', serif" }}
          >
            Explore Our{" "}
            <span style={{ color: "#FBBF24" }}>Gear &amp; Rentals</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Everything you need for the wild — handpicked gear, daily rentals,
            delivered to your adventure.
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="w-full flex justify-center px-6 py-6" style={{ background: "#FAF7F2" }}>
        <div className="relative w-full max-w-md">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "#A8A29E" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-5 py-3 rounded-full text-sm outline-none transition-shadow duration-200"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #F5EACF",
              color: "#292524",
              boxShadow: "0 2px 12px rgba(217,119,6,0.08)",
            }}
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.25)")
            }
            onBlur={(e) =>
              (e.target.style.boxShadow = "0 2px 12px rgba(217,119,6,0.08)")
            }
          />
        </div>
      </div>

      {/* ── Results Count ── */}
      {state === "success" && (
        <div className="px-12 pb-2">
          <p className="text-sm" style={{ color: "#A8A29E" }}>
            Showing{" "}
            <strong style={{ color: "#292524" }}>{filtered.length}</strong>{" "}
            products
          </p>
        </div>
      )}

      {/* ── Loading Spinner ── */}
      {state === "loading" && (
        <div className="w-full flex justify-center items-center py-24">
          <div
            className="w-[50px] h-[50px] border-4 rounded-full animate-spin"
            style={{ borderColor: "#F5EACF", borderTopColor: "#F59E0B" }}
          />
        </div>
      )}

      {/* ── Error State ── */}
      {state === "error" && (
        <div className="w-full flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-base font-semibold" style={{ color: "#A8A29E" }}>
            Failed to load products. Please try again.
          </p>
          <button
            onClick={() => setState("loading")}
            className="px-5 py-2 rounded-full text-sm font-semibold"
            style={{ background: "#F59E0B", color: "#292524" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Product Grid ── */}
      {state === "success" && (
        <div className="px-12 py-4 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {filtered.map((item) => (
              <ProductCard
                key={item.key}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <svg
                className="w-12 h-12"
                style={{ color: "#F5EACF" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <p className="text-base font-semibold" style={{ color: "#A8A29E" }}>
                No products match "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Toast Notification ── */}
      <div
        style={{
          position: "fixed",
          bottom: "6rem",
          left: "50%",
          transform: `translateX(-50%) translateY(${toastMsg ? "0" : "20px"})`,
          opacity: toastMsg ? 1 : 0,
          transition: "all 0.3s ease",
          background: "#292524",
          color: "#FBBF24",
          padding: "10px 20px",
          borderRadius: "999px",
          fontSize: "0.85rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        🛒 {toastMsg}
      </div>

      {/* ── Floating Cart Button ── */}
      <Link
        to="/booking"
        title={`${cartCount} item${cartCount !== 1 ? "s" : ""} (${totalQty} total qty)`}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "#F59E0B",
          color: "#292524",
          borderRadius: "999px",
          padding: "0.85rem 1.4rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontWeight: 700,
          fontSize: "0.95rem",
          boxShadow: "0 6px 24px rgba(245,158,11,0.45)",
          textDecoration: "none",
          zIndex: 50,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)"
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(245,158,11,0.55)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(245,158,11,0.45)"
        }}
      >
        <FaCartShopping size={18} />
        <span>Cart</span>

        {/* Badge: number of distinct product types in cart */}
        {cartCount > 0 && (
          <span
            style={{
              background: "#292524",
              color: "#FBBF24",
              borderRadius: "999px",
              padding: "2px 8px",
              fontSize: "0.78rem",
              fontWeight: 800,
              minWidth: "22px",
              textAlign: "center",
            }}
          >
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  )
}