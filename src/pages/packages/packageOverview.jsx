import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageById, getPackageVehicles, getAddons, createPackageBooking } from "../../utils/api";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowLeft,
  FaTag,
  FaTimes,
  FaChevronRight,
  FaPhone,
  FaCalendarAlt,
  FaCar,
} from "react-icons/fa";

const featureLabels = {
  ac: "A/C",
  openRoof: "Open Roof",
  fourWheelDrive: "4WD",
  wifi: "WiFi",
  firstAidKit: "First Aid",
  coolerBox: "Cooler Box",
};

export default function PackageOverview() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState("loading");
  const [pkg, setPkg] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Canvas / booking wizard state
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    tourDate: "",
    guests: 1,
    phone: "",
    vehicle: null,
  });
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesState, setVehiclesState] = useState("idle");
  const [addons, setAddons] = useState([]);
  const [addonsState, setAddonsState] = useState("idle");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("idle"); // idle | loading | success | error
  const [bookingError, setBookingError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  const vehicleCost = form.vehicle ? form.vehicle.pricePerDay * (pkg?.duration?.days || 1) : 0;
  const addonsCost = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = pkg ? pkg.price * form.guests + vehicleCost + addonsCost : 0;

  function openCanvas() {
    setStep(1);
    setForm((prev) => ({ ...prev, vehicle: null }));
    setVehiclesState("idle");
    setVehicles([]);
    setAddonsState("idle");
    setAddons([]);
    setSelectedAddons([]);
    setBookingStatus("idle");
    setBookingError("");
    setBookingResult(null);
    setCanvasOpen(true);
  }
  function closeCanvas() {
    setCanvasOpen(false);
  }
  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function toggleAddon(addon) {
    setSelectedAddons((prev) =>
      prev.some((a) => a.addonId === addon.addonId)
        ? prev.filter((a) => a.addonId !== addon.addonId)
        : [...prev, addon]
    );
  }
  function handleBookNow() {
    const token = localStorage.getItem("token");
    if (!token) {
      setBookingError("Please log in to complete your booking.");
      setBookingStatus("error");
      return;
    }
    setBookingStatus("loading");
    const payload = {
      packageId: pkg.packageId || String(pkg._id),
      packageName: pkg.name,
      userPhone: form.phone,
      tourDate: form.tourDate,
      guests: form.guests,
      selectedActivities: [],
      selectedVehicle: form.vehicle
        ? {
            vehicleId: form.vehicle.vehicleId,
            vehicleName: form.vehicle.name,
            vehicleType: form.vehicle.type,
            vehiclePricePerDay: form.vehicle.pricePerDay,
          }
        : { vehicleId: null, vehicleName: null, vehicleType: null, vehiclePricePerDay: 0 },
      addOns: pkg.customizationEnabled ? selectedAddons : (pkg.includes || []),
      specialRequests: "",
      basePricePerPerson: pkg.price,
      vehicleTotal: vehicleCost,
      addOnTotal: addonsCost,
      totalPrice,
    };
    createPackageBooking(payload)
      .then((res) => {
        setBookingResult(res.data.booking);
        setBookingStatus("success");
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message || "Failed to create booking. Please try again.";
        setBookingError(msg);
        setBookingStatus("error");
      });
  }
  function step1Valid() {
    return form.tourDate && form.guests >= 1 && form.phone.trim().length >= 7;
  }

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  function phoneValid(value) {
    return /^0\d{9}$/.test(value.trim());
  }
  function dateValid(value) {
    if (!value) return false;
    return value >= today && value <= maxDate;
  }
  function step1Valid() {
    return dateValid(form.tourDate) && form.guests >= 1 && phoneValid(form.phone);
  }

  useEffect(() => {
    getPackageById(packageId)
      .then((res) => {
        setPkg(res.data);
        setState("success");
      })
      .catch(() => setState("error"));
  }, [packageId]);

  useEffect(() => {
    if (!canvasOpen || step !== 2 || vehiclesState !== "idle") return;
    setVehiclesState("loading");
    getPackageVehicles()
      .then((res) => {
        setVehicles(res.data);
        setVehiclesState("success");
      })
      .catch(() => setVehiclesState("error"));
  }, [canvasOpen, step, vehiclesState]);

  useEffect(() => {
    if (!canvasOpen || step !== 3 || addonsState !== "idle") return;
    setAddonsState("loading");
    getAddons()
      .then((res) => {
        setAddons(res.data);
        setAddonsState("success");
      })
      .catch(() => setAddonsState("error"));
  }, [canvasOpen, step, addonsState]);

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
      <div className="max-w-6xl mx-auto px-4 pt-24">
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
                onClick={openCanvas}
                className="w-full py-4 rounded-xl font-bold text-lg transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
              >
                {pkg.customizationEnabled ? "Customize & Book" : "Book"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Modal ─────────────────────────────────────────────── */}
      {canvasOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={closeCanvas}
        >
          <div
            className="relative flex flex-col rounded-2xl overflow-hidden w-full"
            style={{
              maxWidth: "520px",
              maxHeight: "90vh",
              background: "#FFFBF5",
              boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
              style={{ borderColor: "#F5EACF" }}
            >
              <div>
                <p className="text-xs font-semibold tracking-widest mb-0.5" style={{ color: "#D97706" }}>{pkg?.customizationEnabled ? "CUSTOMIZE & BOOK" : "BOOK"}</p>
                <h2 className="text-lg font-bold" style={{ color: "#292524" }}>{pkg?.name}</h2>
              </div>
              <button onClick={closeCanvas} className="p-2 rounded-full transition hover:bg-amber-50" style={{ color: "#78716C" }}>
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 px-6 pt-5 pb-3 flex-shrink-0">
              {pkg?.customizationEnabled ? (
                <>
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition"
                        style={{
                          background: step >= s ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "#F5EACF",
                          color: step >= s ? "#1C1917" : "#A8A29E",
                        }}
                      >
                        {s}
                      </div>
                      {s < 4 && <div className="flex-1 h-px w-5" style={{ background: step > s ? "#F59E0B" : "#F5EACF" }} />}
                    </div>
                  ))}
                  <span className="ml-2 text-xs font-medium" style={{ color: "#78716C" }}>
                    {step === 1 && "Trip Details"}
                    {step === 2 && "Vehicle"}
                    {step === 3 && "Add-ons"}
                    {step === 4 && "Confirm"}
                  </span>
                </>
              ) : (
                <>
                  {[1, 2].map((s) => {
                    const active = s === 1 ? step >= 1 : step >= 4;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition"
                          style={{
                            background: active ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "#F5EACF",
                            color: active ? "#1C1917" : "#A8A29E",
                          }}
                        >
                          {s}
                        </div>
                        {s < 2 && <div className="flex-1 h-px w-5" style={{ background: step === 4 ? "#F59E0B" : "#F5EACF" }} />}
                      </div>
                    );
                  })}
                  <span className="ml-2 text-xs font-medium" style={{ color: "#78716C" }}>
                    {step === 1 && "Trip Details"}
                    {step === 4 && "Confirm"}
                  </span>
                </>
              )}
            </div>

            {/* ── Step 1: Trip Details ──────────────────────────────── */}
            {step === 1 && (
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">

                {/* Tour Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#292524" }}>
                    <FaCalendarAlt className="inline mr-1.5" style={{ color: "#D97706" }} />
                    Tour Date
                  </label>
                  <input
                    type="date"
                    value={form.tourDate}
                    min={today}
                    max={maxDate}
                    onChange={(e) => handleFormChange("tourDate", e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                    style={{
                      borderColor: form.tourDate && !dateValid(form.tourDate) ? "#EF4444" : "#E7D9B8",
                      background: "#FFFBF5",
                      color: "#292524",
                    }}
                  />
                  {form.tourDate && form.tourDate < today && (
                    <p className="text-xs mt-1" style={{ color: "#EF4444" }}>Tour date cannot be in the past.</p>
                  )}
                  {form.tourDate && form.tourDate > maxDate && (
                    <p className="text-xs mt-1" style={{ color: "#EF4444" }}>Please select a date within the next 2 years.</p>
                  )}
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#292524" }}>
                    <FaUsers className="inline mr-1.5" style={{ color: "#D97706" }} />
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFormChange("guests", Math.max(1, form.guests - 1))}
                      className="w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center transition hover:opacity-80"
                      style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-8 text-center" style={{ color: "#292524" }}>{form.guests}</span>
                    <button
                      onClick={() => handleFormChange("guests", Math.min(pkg?.maxGroupSize || 20, form.guests + 1))}
                      className="w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center transition hover:opacity-80"
                      style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
                    >
                      +
                    </button>
                    <span className="text-xs ml-1" style={{ color: "#A8A29E" }}>Max {pkg?.maxGroupSize}</span>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#292524" }}>
                    <FaPhone className="inline mr-1.5" style={{ color: "#D97706" }} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0771234567"
                    value={form.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                    style={{
                      borderColor: form.phone && !phoneValid(form.phone) ? "#EF4444" : "#E7D9B8",
                      background: "#FFFBF5",
                      color: "#292524",
                    }}
                  />
                  {form.phone && !phoneValid(form.phone) && (
                    <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                      {!/^0/.test(form.phone)
                        ? "Phone number must start with 0."
                        : "Phone number must be exactly 10 digits."}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="rounded-xl p-4" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: "#92400E" }}>PRICE BREAKDOWN</p>
                  <div className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                    <span>Base price per person</span>
                    <span>Rs. {pkg?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3" style={{ color: "#57534E" }}>
                    <span>&times; {form.guests} guest{form.guests !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2" style={{ color: "#292524", borderColor: "#FDE68A" }}>
                    <span>Total</span>
                    <span style={{ color: "#D97706" }}>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Choose Vehicle ────────────────────────────── */}
            {step === 2 && (
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                <p className="text-sm" style={{ color: "#78716C" }}>
                  Select a vehicle for your trip. A standard vehicle is included — upgrading adds to the total.
                </p>

                {/* Standard Vehicle Card */}
                

                {/* Loading state */}
                {vehiclesState === "loading" && (
                  <div className="flex justify-center py-4">
                    <div className="w-8 h-8 border-4 rounded-full border-t-amber-500 animate-spin" />
                  </div>
                )}

                {/* Error state */}
                {vehiclesState === "error" && (
                  <p className="text-sm text-center py-2" style={{ color: "#78716C" }}>
                    Could not load additional vehicles. You may proceed with the standard option.
                  </p>
                )}

                {/* Vehicle cards grid */}
                {vehiclesState === "success" && vehicles.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {vehicles.map((v) => {
                      const selected = form.vehicle != null && String(form.vehicle._id) === String(v._id);
                      const addedCost = v.pricePerDay * (pkg?.duration?.days || 1);
                      const activeFeatures = Object.entries(v.features || {})
                        .filter(([, val]) => val)
                        .map(([key]) => featureLabels[key] || key);
                      return (
                        <button
                          key={v._id}
                          onClick={() => handleFormChange("vehicle", selected ? null : v)}
                          className="text-left rounded-xl border-2 overflow-hidden transition"
                          style={{
                            borderColor: selected ? "#D97706" : "#E7D9B8",
                            background: selected ? "#FFFBF5" : "#FAFAFA",
                          }}
                        >
                          {v.images?.[0] && (
                            <div className="w-full h-28 overflow-hidden">
                              <img
                                src={v.images[0]}
                                alt={v.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div>
                                <p className="font-bold text-sm" style={{ color: "#292524" }}>{v.name}</p>
                                <p className="text-xs" style={{ color: "#78716C" }}>
                                  {v.type} &middot; {v.capacity} seats
                                </p>
                              </div>
                              {selected && (
                                <FaCheckCircle className="flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                              )}
                            </div>
                            {activeFeatures.length > 0 && (
                              <div className="flex flex-wrap gap-1 my-2">
                                {activeFeatures.map((f) => (
                                  <span
                                    key={f}
                                    className="text-xs px-1.5 py-0.5 rounded-full"
                                    style={{ background: "#FEF3C7", color: "#92400E" }}
                                  >
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-sm font-bold mt-1" style={{ color: "#D97706" }}>
                              +Rs. {addedCost.toLocaleString()}
                            </p>
                            <p className="text-xs" style={{ color: "#A8A29E" }}>
                              Rs. {v.pricePerDay.toLocaleString()}/day &times; {pkg?.duration?.days} days
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {vehiclesState === "success" && vehicles.length === 0 && (
                  <p className="text-sm text-center py-2" style={{ color: "#78716C" }}>
                    No additional vehicles available. Your trip will use the standard vehicle.
                  </p>
                )}

                {/* Price breakdown */}
                <div className="rounded-xl p-4 mt-2" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: "#92400E" }}>PRICE BREAKDOWN</p>
                  <div className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                    <span>Package &times; {form.guests} guest{form.guests !== 1 ? "s" : ""}</span>
                    <span>Rs. {(pkg?.price * form.guests).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3" style={{ color: "#57534E" }}>
                    <span>Vehicle</span>
                    {form.vehicle ? (
                      <span>Rs. {vehicleCost.toLocaleString()}</span>
                    ) : (
                      <span style={{ color: "#10B981" }}>Included</span>
                    )}
                  </div>
                  <div
                    className="flex justify-between font-bold text-base border-t pt-2"
                    style={{ color: "#292524", borderColor: "#FDE68A" }}
                  >
                    <span>Total</span>
                    <span style={{ color: "#D97706" }}>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Add-ons ──────────────────────────────── */}
            {step === 3 && (
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                <p className="text-sm" style={{ color: "#78716C" }}>
                  Enhance your trip with optional add-ons. Select as many as you like.
                </p>

                {/* Loading state */}
                {addonsState === "loading" && (
                  <div className="flex justify-center py-6">
                    <div className="w-8 h-8 border-4 rounded-full border-t-amber-500 animate-spin" />
                  </div>
                )}

                {/* Error state */}
                {addonsState === "error" && (
                  <p className="text-sm text-center py-2" style={{ color: "#78716C" }}>
                    Could not load add-ons. You may proceed without any.
                  </p>
                )}

                {/* Addons grid */}
                {addonsState === "success" && addons.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {addons.map((addon) => {
                      const selected = selectedAddons.some((a) => a.addonId === addon.addonId);
                      return (
                        <button
                          key={addon.addonId}
                          onClick={() => toggleAddon(addon)}
                          className="text-left rounded-xl border-2 p-4 transition flex flex-col gap-2"
                          style={{
                            borderColor: selected ? "#D97706" : "#E7D9B8",
                            background: selected ? "#FFFBF5" : "#FAFAFA",
                          }}
                        >
                          {/* Category badge + checkbox row */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: "#FEF3C7", color: "#92400E" }}
                            >
                              {addon.category}
                            </span>
                            <div
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition"
                              style={{
                                borderColor: selected ? "#D97706" : "#D1D5DB",
                                background: selected ? "#D97706" : "transparent",
                              }}
                            >
                              {selected && (
                                <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none">
                                  <path d="M1 5l3 4 7-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>

                          <p className="font-bold text-sm" style={{ color: "#292524" }}>{addon.name}</p>

                          {addon.description && (
                            <p className="text-xs leading-relaxed" style={{ color: "#78716C" }}>
                              {addon.description}
                            </p>
                          )}

                          <p className="text-sm font-bold mt-auto pt-1" style={{ color: "#D97706" }}>
                            Rs. {addon.price.toLocaleString()}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {addonsState === "success" && addons.length === 0 && (
                  <p className="text-sm text-center py-4" style={{ color: "#78716C" }}>
                    No add-ons available for this package.
                  </p>
                )}

                {/* Price breakdown */}
                <div className="rounded-xl p-4 mt-2" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: "#92400E" }}>PRICE BREAKDOWN</p>
                  <div className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                    <span>Package &times; {form.guests} guest{form.guests !== 1 ? "s" : ""}</span>
                    <span>Rs. {(pkg?.price * form.guests).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                    <span>Vehicle</span>
                    {form.vehicle ? (
                      <span>Rs. {vehicleCost.toLocaleString()}</span>
                    ) : (
                      <span style={{ color: "#10B981" }}>Included</span>
                    )}
                  </div>
                  {selectedAddons.map((a) => (
                    <div key={a.addonId} className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                      <span>{a.name}</span>
                      <span>Rs. {a.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between font-bold text-base border-t pt-2"
                    style={{ color: "#292524", borderColor: "#FDE68A" }}
                  >
                    <span>Total</span>
                    <span style={{ color: "#D97706" }}>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Review & Confirm ─────────────────────── */}
            {step === 4 && bookingStatus !== "success" && (
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">

                {/* Trip Details */}
                <div className="rounded-xl p-4" style={{ background: "#F9F5EE", border: "1px solid #E7D9B8" }}>
                  <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#92400E" }}>TRIP DETAILS</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#57534E" }}>
                      <FaCalendarAlt className="flex-shrink-0" style={{ color: "#D97706" }} />
                      <span>
                        {new Date(form.tourDate + "T00:00:00").toLocaleDateString("en-GB", {
                          weekday: "short", year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#57534E" }}>
                      <FaUsers className="flex-shrink-0" style={{ color: "#D97706" }} />
                      <span>{form.guests} guest{form.guests !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#57534E" }}>
                      <FaPhone className="flex-shrink-0" style={{ color: "#D97706" }} />
                      <span>{form.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#57534E" }}>
                      <FaClock className="flex-shrink-0" style={{ color: "#D97706" }} />
                      <span>
                        {pkg.duration.days} Day{pkg.duration.days !== 1 ? "s" : ""}
                        {pkg.duration.nights > 0 && ` / ${pkg.duration.nights} Night${pkg.duration.nights !== 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="rounded-xl p-4" style={{ background: "#F9F5EE", border: "1px solid #E7D9B8" }}>
                  <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#92400E" }}>VEHICLE</p>
                  {form.vehicle ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FEF3C7" }}>
                          <FaCar style={{ color: "#D97706" }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#292524" }}>{form.vehicle.name}</p>
                          <p className="text-xs" style={{ color: "#78716C" }}>
                            {form.vehicle.type} &middot; {form.vehicle.capacity} seats
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold flex-shrink-0" style={{ color: "#D97706" }}>
                        Rs. {vehicleCost.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FEF3C7" }}>
                          <FaCar style={{ color: "#D97706" }} />
                        </div>
                        <span className="text-sm" style={{ color: "#57534E" }}>Standard Vehicle</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>Included</span>
                    </div>
                  )}
                </div>

                {/* Add-ons / Includes */}
                <div className="rounded-xl p-4" style={{ background: "#F9F5EE", border: "1px solid #E7D9B8" }}>
                  <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#92400E" }}>
                    {pkg?.customizationEnabled ? "ADD-ONS" : "WHAT'S INCLUDED"}
                  </p>
                  {pkg?.customizationEnabled ? (
                    selectedAddons.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {selectedAddons.map((a) => (
                          <div key={a.addonId} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <FaCheckCircle className="flex-shrink-0" style={{ color: "#10B981", fontSize: "0.85rem" }} />
                              <div>
                                <p className="text-sm font-medium" style={{ color: "#292524" }}>{a.name}</p>
                                <p className="text-xs" style={{ color: "#78716C" }}>{a.category}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold flex-shrink-0" style={{ color: "#D97706" }}>
                              Rs. {a.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "#A8A29E" }}>No add-ons selected</p>
                    )
                  ) : (
                    pkg?.includes && pkg.includes.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {pkg.includes.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <FaCheckCircle className="flex-shrink-0" style={{ color: "#10B981", fontSize: "0.85rem" }} />
                            <p className="text-sm" style={{ color: "#292524" }}>{item}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "#A8A29E" }}>No inclusions listed</p>
                    )
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="rounded-xl p-4" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                  <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#92400E" }}>PRICE BREAKDOWN</p>
                  <div className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                    <span>Package &times; {form.guests} guest{form.guests !== 1 ? "s" : ""}</span>
                    <span>Rs. {(pkg.price * form.guests).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                    <span>Vehicle</span>
                    {form.vehicle
                      ? <span>Rs. {vehicleCost.toLocaleString()}</span>
                      : <span style={{ color: "#10B981" }}>Included</span>}
                  </div>
                  {selectedAddons.map((a) => (
                    <div key={a.addonId} className="flex justify-between text-sm mb-2" style={{ color: "#57534E" }}>
                      <span>{a.name}</span>
                      <span>Rs. {a.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-base border-t pt-2" style={{ color: "#292524", borderColor: "#FDE68A" }}>
                    <span>Total</span>
                    <span style={{ color: "#D97706" }}>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Booking error */}
                {bookingStatus === "error" && (
                  <div className="rounded-xl px-4 py-3 text-sm text-center" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                    {bookingError}
                  </div>
                )}
              </div>
            )}

            {/* Success screen */}
            {step === 4 && bookingStatus === "success" && (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-5 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "#D1FAE5" }}
                >
                  <FaCheckCircle className="text-3xl" style={{ color: "#10B981" }} />
                </div>
                <div>
                  <p className="text-xl font-bold mb-1" style={{ color: "#292524" }}>Booking Confirmed!</p>
                  <p className="text-sm" style={{ color: "#78716C" }}>Your booking has been created successfully.</p>
                </div>
                {bookingResult && (
                  <div
                    className="rounded-xl px-6 py-4 w-full"
                    style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
                  >
                    <p className="text-xs font-bold tracking-widest mb-1" style={{ color: "#92400E" }}>BOOKING ID</p>
                    <p className="text-lg font-bold" style={{ color: "#D97706" }}>{bookingResult.bookingId}</p>
                  </div>
                )}
                <p className="text-sm" style={{ color: "#78716C" }}>
                  Our team will contact you shortly to confirm the details.
                </p>
              </div>
            )}

            {/* Modal footer */}
            <div className="px-6 py-5 border-t flex-shrink-0" style={{ borderColor: "#F5EACF" }}>
              {step === 1 && (
                <button
                  onClick={() => setStep(pkg?.customizationEnabled ? 2 : 4)}
                  disabled={!step1Valid()}
                  className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition"
                  style={{
                    background: step1Valid() ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "#F5EACF",
                    color: step1Valid() ? "#1C1917" : "#A8A29E",
                    cursor: step1Valid() ? "pointer" : "not-allowed",
                  }}
                >
                  Next <FaChevronRight />
                </button>
              )}
              {step === 2 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition hover:opacity-80"
                    style={{ background: "#F5EACF", color: "#78716C" }}
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}
              {step === 3 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition hover:opacity-80"
                    style={{ background: "#F5EACF", color: "#78716C" }}
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}
              {step === 4 && bookingStatus !== "success" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(pkg?.customizationEnabled ? 3 : 1)}
                    disabled={bookingStatus === "loading"}
                    className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition hover:opacity-80"
                    style={{
                      background: "#F5EACF",
                      color: bookingStatus === "loading" ? "#D1C4A8" : "#78716C",
                      cursor: bookingStatus === "loading" ? "not-allowed" : "pointer",
                    }}
                  >
                    <FaArrowLeft /> Back
                  </button>
                  <button
                    onClick={handleBookNow}
                    disabled={bookingStatus === "loading"}
                    className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition"
                    style={{
                      background: bookingStatus === "loading"
                        ? "#F5EACF"
                        : "linear-gradient(135deg,#FBBF24,#F59E0B)",
                      color: bookingStatus === "loading" ? "#A8A29E" : "#1C1917",
                      cursor: bookingStatus === "loading" ? "not-allowed" : "pointer",
                    }}
                  >
                    {bookingStatus === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </div>
              )}
              {step === 4 && bookingStatus === "success" && (
                <button
                  onClick={closeCanvas}
                  className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
