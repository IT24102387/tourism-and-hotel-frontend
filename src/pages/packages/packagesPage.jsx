import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPackages } from "../../utils/api";
import {
  FaClock,
  FaUsers,
  FaStar,
  FaMapMarkerAlt,
  FaSearch,
  FaChevronRight,
} from "react-icons/fa";

const CATEGORIES = ["All", "Safari", "Wildlife", "Pilgrimage", "Adventure", "Cultural", "Nature", "Combined"];

export default function PackagesPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [state, setState] = useState("loading");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getPackages()
      .then((res) => {
        setPackages(res.data);
        setState("success");
      })
      .catch(() => setState("error"));
  }, []);

  const filtered = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || pkg.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-full overflow-y-auto" style={{ background: "#FFFBF5" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600&display=swap');

        .pkg-hero {
          background: linear-gradient(135deg, #0f130e 0%, #1c2b18 60%, #2a3d20 100%);
          position: relative;
          overflow: hidden;
        }
        .pkg-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=80') center/cover no-repeat;
          opacity: 0.18;
        }
        .pkg-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .pkg-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.13);
        }
        .pkg-card:hover .pkg-card-cta {
          background: #D97706;
          color: #fff;
        }
        .pkg-card-img {
          width: 100%;
          height: 210px;
          object-fit: cover;
          display: block;
        }
        .pkg-cat-badge {
          display: inline-block;
          padding: 3px 11px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          background: #FEF3C7;
          color: #92400E;
          text-transform: uppercase;
        }
        .pkg-card-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: 100px;
          border: 1.5px solid #D97706;
          color: #D97706;
          font-weight: 600;
          font-size: 13.5px;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .pkg-search-input {
          width: 100%;
          padding: 12px 44px 12px 18px;
          border-radius: 100px;
          border: 1.5px solid rgba(0,0,0,0.1);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          color: #292524;
        }
        .pkg-search-input:focus {
          border-color: #D97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.12);
        }
        .pkg-filter-btn {
          padding: 8px 22px;
          border-radius: 100px;
          border: 1.5px solid rgba(0,0,0,0.1);
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 13px;
          background: #fff;
          color: #57534E;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .pkg-filter-btn.active {
          background: #D97706;
          border-color: #D97706;
          color: #fff;
          box-shadow: 0 4px 14px rgba(217,119,6,0.3);
        }
        .pkg-filter-btn:not(.active):hover {
          border-color: #D97706;
          color: #D97706;
        }
        .unavailable-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="pkg-hero" style={{ paddingTop: "100px", paddingBottom: "72px" }}>
        <div className="relative max-w-4xl mx-auto px-5 text-center">
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em", color: "#d4a843", textTransform: "uppercase", marginBottom: "14px" }}>
            WildHaven Resort & Safari
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 6vw, 62px)",
              fontWeight: 700,
              color: "#f5f0e8",
              lineHeight: 1.1,
              marginBottom: "18px",
            }}
          >
            Explore Our <span style={{ color: "#d4a843" }}>Safari Packages</span>
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,240,232,0.72)", fontSize: "16px", maxWidth: "540px", margin: "0 auto" }}>
            Handcrafted experiences in the wild — from thrilling safaris to serene cultural journeys.
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              className="pkg-search-input"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch
              style={{
                position: "absolute", right: "16px", top: "50%",
                transform: "translateY(-50%)", color: "#aaa", fontSize: "13px",
              }}
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`pkg-filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {state === "loading" && (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 rounded-full border-t-amber-500 animate-spin" />
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <p style={{ color: "#78716C", fontSize: "16px" }}>Failed to load packages. Please try again.</p>
            <button
              onClick={() => { setState("loading"); getPackages().then((r) => { setPackages(r.data); setState("success"); }).catch(() => setState("error")); }}
              style={{ background: "#D97706", color: "#fff", padding: "10px 28px", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              Retry
            </button>
          </div>
        )}

        {state === "success" && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-32 text-center">
            <p style={{ color: "#78716C", fontSize: "16px" }}>No packages found matching your search.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              style={{ color: "#D97706", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
            >
              Clear filters
            </button>
          </div>
        )}

        {state === "success" && filtered.length > 0 && (
          <>
            <p style={{ color: "#78716C", fontSize: "13px", marginBottom: "20px" }}>
              Showing <strong style={{ color: "#292524" }}>{filtered.length}</strong> package{filtered.length !== 1 ? "s" : ""}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "28px",
              }}
            >
              {filtered.map((pkg) => (
                <div
                  key={pkg._id}
                  className="pkg-card"
                  onClick={() => navigate(`/package/${pkg.packageId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/package/${pkg.packageId}`)}
                >
                  {/* Image */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={pkg.images?.[0] || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                      alt={pkg.name}
                      className="pkg-card-img"
                    />
                    {!pkg.availability && (
                      <div className="unavailable-overlay">
                        <span style={{ background: "rgba(0,0,0,0.7)", color: "#fff", padding: "6px 18px", borderRadius: "100px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.06em" }}>
                          UNAVAILABLE
                        </span>
                      </div>
                    )}
                    {pkg.rating > 0 && (
                      <div style={{
                        position: "absolute", top: "12px", right: "12px",
                        background: "rgba(0,0,0,0.65)", color: "#FBBF24",
                        padding: "4px 10px", borderRadius: "100px",
                        display: "flex", alignItems: "center", gap: "5px",
                        fontSize: "12px", fontWeight: 700,
                      }}>
                        <FaStar style={{ fontSize: "11px" }} />
                        {pkg.rating}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    <span className="pkg-cat-badge">{pkg.category}</span>

                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 700, color: "#292524", lineHeight: 1.2, margin: 0 }}>
                      {pkg.name}
                    </h3>

                    <p style={{ fontSize: "13.5px", color: "#78716C", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {pkg.description}
                    </p>

                    {/* Meta */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "12.5px", color: "#78716C", marginTop: "2px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <FaClock style={{ color: "#D97706" }} />
                        {pkg.duration.days}D / {pkg.duration.nights}N
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <FaUsers style={{ color: "#D97706" }} />
                        Max {pkg.maxGroupSize}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <FaMapMarkerAlt style={{ color: "#D97706" }} />
                        {pkg.meetingPoint}
                      </span>
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "14px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "#aaa", margin: 0, fontWeight: 500 }}>FROM</p>
                        <p style={{ fontSize: "20px", fontWeight: 700, color: "#D97706", margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                          LKR {pkg.price.toLocaleString()}
                          <span style={{ fontSize: "12px", color: "#aaa", fontWeight: 500 }}> /person</span>
                        </p>
                      </div>
                      <button className="pkg-card-cta">
                        View Details <FaChevronRight style={{ fontSize: "11px" }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
