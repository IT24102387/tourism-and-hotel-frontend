import { useEffect, useState } from "react"
import ProductCard from "../../components/productCard"
import { getProducts } from "../../utils/api"
export default function Services() {
  const [state, setState] = useState("loading") // loading, success, error
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (state == "loading") {
      getProducts()
        .then((res) => {
          console.log(res.data)
          setItems(res.data)
          setState("success")
        })
        .catch((err) => {
          console.error(err?.response?.data?.error || "An error occured")
          setState("error")
        })
    }
  }, [])

  const filtered = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen w-full" style={{ background: "#FAF7F2" }}>

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 260 }}>
        {/* BG image — swap URL for your own */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80')",
            filter: "brightness(0.45)",
          }}
        />
        {/* Gradient depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Text */}
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

      {/* ── Product Grid ── */}
      {state === "success" && (
        <div className="px-12 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {filtered.map((item) => (
              <ProductCard key={item.key} item={item} />
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
    </div>
  )
}