import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageById } from "../../utils/api";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowLeft,
  FaTag,
} from "react-icons/fa";

export default function PackageOverview() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState("loading");
  const [pkg, setPkg] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getPackageById(packageId)
      .then((res) => {
        setPkg(res.data);
        setState("success");
      })
      .catch(() => setState("error"));
  }, [packageId]);

  if (state === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[50px] h-[50px] border-4 rounded-full border-t-amber-500 animate-spin" />
      </div>
    );
  }

  if (state === "error" || !pkg) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <p className="text-lg" style={{ color: "#78716C" }}>Could not load package details.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-full font-semibold"
          style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full overflow-y-auto" style={{ background: "#FFFBF5" }}>

      {/* ── Back button ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold mb-6 transition hover:opacity-70"
          style={{ color: "#D97706" }}
        >
          <FaArrowLeft /> Back to Packages
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">

        {/* ── Image gallery ─────────────────────────────────────────── */}
        {pkg.images && pkg.images.length > 0 && (
          <div className="mb-10">
            <div className="w-full h-[420px] rounded-2xl overflow-hidden mb-3">
              <img
                src={pkg.images[activeImage]}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
            </div>
            {pkg.images.length > 1 && (
              <div className="flex gap-3">
                {pkg.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="w-20 h-20 rounded-lg overflow-hidden border-2 transition"
                    style={{ borderColor: i === activeImage ? "#D97706" : "transparent" }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: main details ──────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Title & meta */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full tracking-widest"
                  style={{ background: "#FEF3C7", color: "#92400E" }}
                >
                  {pkg.category?.toUpperCase()}
                </span>
                {pkg.availability ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>
                    Available
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                    Unavailable
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: "#292524" }}>{pkg.name}</h1>

              <div className="flex flex-wrap gap-6 text-sm" style={{ color: "#78716C" }}>
                <span className="flex items-center gap-1.5">
                  <FaClock style={{ color: "#D97706" }} />
                  {pkg.duration.days} Day{pkg.duration.days !== 1 ? "s" : ""}
                  {pkg.duration.nights > 0 && ` / ${pkg.duration.nights} Night${pkg.duration.nights !== 1 ? "s" : ""}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaUsers style={{ color: "#D97706" }} />
                  Max {pkg.maxGroupSize} people
                </span>
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt style={{ color: "#D97706" }} />
                  {pkg.meetingPoint}
                </span>
                {pkg.rating > 0 && (
                  <span className="flex items-center gap-1.5">
                    <FaStar style={{ color: "#FBBF24" }} />
                    {pkg.rating}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#292524" }}>About This Package</h2>
              <p className="leading-relaxed" style={{ color: "#57534E" }}>{pkg.description}</p>
            </div>

            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3" style={{ color: "#292524" }}>Highlights</h2>
                <ul className="flex flex-col gap-2">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ color: "#57534E" }}>
                      <FaStar className="mt-0.5 flex-shrink-0" style={{ color: "#FBBF24" }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Includes / Excludes */}
            <div className="grid sm:grid-cols-2 gap-6">
              {pkg.includes && pkg.includes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: "#292524" }}>Included</h2>
                  <ul className="flex flex-col gap-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2" style={{ color: "#57534E" }}>
                        <FaCheckCircle className="mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.excludes && pkg.excludes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: "#292524" }}>Not Included</h2>
                  <ul className="flex flex-col gap-2">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2" style={{ color: "#57534E" }}>
                        <FaTimesCircle className="mt-0.5 flex-shrink-0" style={{ color: "#EF4444" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: booking card ─────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-6 rounded-2xl p-8"
              style={{ background: "#FFFBF5", boxShadow: "0 4px 32px rgba(146,64,14,0.15)", border: "1px solid #F5EACF" }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: "#78716C" }}>Starting from</p>
              <p className="text-5xl font-bold mb-1" style={{ color: "#D97706" }}>
                Rs. {pkg.price.toLocaleString()}
              </p>
              <p className="text-sm mb-6" style={{ color: "#A8A29E" }}>per group</p>

              <div className="flex flex-col gap-3 mb-6 text-sm" style={{ color: "#57534E" }}>
                <div className="flex items-center gap-2">
                  <FaClock style={{ color: "#D97706" }} />
                  <span>
                    {pkg.duration.days} Day{pkg.duration.days !== 1 ? "s" : ""}
                    {pkg.duration.nights > 0 && ` / ${pkg.duration.nights} Night${pkg.duration.nights !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers style={{ color: "#D97706" }} />
                  <span>Max {pkg.maxGroupSize} people</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt style={{ color: "#D97706" }} />
                  <span>{pkg.meetingPoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTag style={{ color: "#D97706" }} />
                  <span>{pkg.category}</span>
                </div>
              </div>

              <button
                className="w-full py-4 rounded-xl font-bold text-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
              >
                Book This Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
