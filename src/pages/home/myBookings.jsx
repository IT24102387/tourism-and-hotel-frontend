import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPackageBookings, cancelMyPackageBooking } from "../../utils/api";
import axios from "axios";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  Pending:   { bg: "rgba(212,168,67,0.12)",  text: "#c49a20",  border: "rgba(212,168,67,0.4)"  },
  Confirmed: { bg: "rgba(34,197,94,0.12)",   text: "#16a34a",  border: "rgba(34,197,94,0.4)"   },
  Cancelled: { bg: "rgba(239,68,68,0.12)",   text: "#dc2626",  border: "rgba(239,68,68,0.4)"   },
  Completed: { bg: "rgba(99,102,241,0.12)",  text: "#4f46e5",  border: "rgba(99,102,241,0.4)"  },
  Approved:  { bg: "rgba(34,197,94,0.12)",   text: "#16a34a",  border: "rgba(34,197,94,0.4)"   },
  Rejected:  { bg: "rgba(239,68,68,0.12)",   text: "#dc2626",  border: "rgba(239,68,68,0.4)"   },
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span style={{
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: "100px",
      padding: "3px 12px",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      display: "inline-block",
    }}>
      {status}
    </span>
  );
}

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("packages");
  const [packageBookings, setPackageBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchPackageBookings();
    fetchOrders();
  }, []);

  function fetchPackageBookings() {
    setLoadingPackages(true);
    getMyPackageBookings()
      .then((res) => setPackageBookings(res.data))
      .catch(() => toast.error("Failed to load package bookings"))
      .finally(() => setLoadingPackages(false));
  }

  function fetchOrders() {
    setLoadingOrders(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoadingOrders(false));
  }

  function handleCancel(bookingId, status, createdAt) {
    if (status === "Confirmed") {
      toast.error("This booking has been confirmed and cannot be cancelled.");
      return;
    }
    const hoursSinceBooking = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceBooking > 24) {
      toast.error("The cancellation window has expired. Bookings can only be cancelled within 24 hours of placing them.");
      return;
    }
    if (!window.confirm("Cancel this booking? This cannot be undone.")) return;
    setCancelling(bookingId);
    cancelMyPackageBooking(bookingId)
      .then(() => {
        toast.success("Booking cancelled successfully.");
        fetchPackageBookings();
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to cancel booking"))
      .finally(() => setCancelling(null));
  }

  const isLoading = activeTab === "packages" ? loadingPackages : loadingOrders;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600&display=swap');

        .mb-wrap { font-family: 'Outfit', sans-serif; }

        /* ── Tab Bar ── */
        .mb-tab-bar {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(212,168,67,0.2);
          border-radius: 100px;
          padding: 4px;
          backdrop-filter: blur(8px);
          width: fit-content;
          margin-bottom: 36px;
        }
        .mb-tab {
          padding: 9px 28px;
          border-radius: 100px;
          border: none;
          background: transparent;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #888;
          cursor: pointer;
          transition: all 0.22s ease;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .mb-tab.active {
          background: #d4a843;
          color: #0f130e;
          box-shadow: 0 4px 16px rgba(212,168,67,0.35);
        }
        .mb-tab:not(.active):hover { color: #c49a20; }
        .mb-tab-count {
          background: rgba(0,0,0,0.08);
          border-radius: 100px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 700;
        }
        .mb-tab.active .mb-tab-count {
          background: rgba(0,0,0,0.15);
        }

        /* ── Cards ── */
        .mb-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .mb-card:hover { box-shadow: 0 8px 36px rgba(0,0,0,0.1); transform: translateY(-2px); }

        .mb-row { display: flex; flex-wrap: wrap; gap: 8px 24px; }
        .mb-detail-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
        .mb-detail-value { font-size: 14px; color: #1a1a1a; font-weight: 500; }

        /* ── Buttons ── */
        .mb-cancel-btn {
          padding: 7px 18px;
          border-radius: 100px;
          border: 1.5px solid rgba(220,60,60,0.5);
          background: transparent;
          color: #e05050;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
        }
        .mb-cancel-btn:hover:not(:disabled) {
          background: rgba(220,60,60,0.1);
          box-shadow: 0 3px 12px rgba(220,60,60,0.2);
        }
        .mb-cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .mb-view-btn {
          padding: 7px 18px;
          border-radius: 100px;
          border: 1.5px solid rgba(212,168,67,0.5);
          background: transparent;
          color: #c49a20;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          display: inline-block;
        }
        .mb-view-btn:hover {
          background: #d4a843;
          color: #0f130e;
          box-shadow: 0 3px 12px rgba(212,168,67,0.35);
        }

        .mb-expand-btn {
          padding: 7px 18px;
          border-radius: 100px;
          border: 1.5px solid rgba(99,102,241,0.4);
          background: transparent;
          color: #6366f1;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
        }
        .mb-expand-btn:hover {
          background: rgba(99,102,241,0.08);
          box-shadow: 0 3px 12px rgba(99,102,241,0.15);
        }

        /* ── Tags ── */
        .mb-addon-tag {
          background: rgba(212,168,67,0.1);
          color: #b8891e;
          border: 1px solid rgba(212,168,67,0.25);
          border-radius: 6px;
          padding: 2px 9px;
          font-size: 11.5px;
          font-weight: 500;
        }

        /* ── Order items table ── */
        .mb-items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 14px;
          font-size: 13px;
        }
        .mb-items-table th {
          background: rgba(212,168,67,0.08);
          color: #8a6a10;
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          padding: 8px 12px;
          text-align: left;
        }
        .mb-items-table th:first-child { border-radius: 8px 0 0 8px; }
        .mb-items-table th:last-child  { border-radius: 0 8px 8px 0; text-align: right; }
        .mb-items-table td {
          padding: 10px 12px;
          color: #333;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          vertical-align: middle;
        }
        .mb-items-table td:last-child { text-align: right; font-weight: 600; }
        .mb-items-table tr:last-child td { border-bottom: none; }
        .mb-items-table img {
          width: 38px; height: 38px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.08);
        }

        /* ── Expand animation ── */
        .mb-expand-area {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }
        .mb-expand-area.open  { max-height: 600px; opacity: 1; }
        .mb-expand-area.closed { max-height: 0; opacity: 0; }

        /* ── Divider ── */
        .mb-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 14px 0; }

        /* ── Empty state ── */
        .mb-empty-icon { font-size: 64px; opacity: 0.18; line-height: 1; }

        /* ── Stats strip ── */
        .mb-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .mb-stat-pill {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .mb-stat-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .mb-card { padding: 18px 14px; }
          .mb-row  { gap: 8px 16px; }
          .mb-tab  { padding: 8px 16px; font-size: 13px; }
        }
      `}</style>

      <div
        className="mb-wrap"
        style={{ minHeight: "100vh", background: "#f8f6f1", paddingTop: "96px", paddingBottom: "60px" }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 20px" }}>

          {/* ── Page header ── */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "12px", color: "#c49a20", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
              My Account
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", color: "#1a1a1a", lineHeight: 1.1, margin: 0 }}>
              My <span style={{ color: "#d4a843" }}>Dashboard</span>
            </h1>
            <p style={{ color: "#666", fontSize: "15px", marginTop: "8px" }}>
              Track all your reservations — safari packages and gear rental orders in one place.
            </p>
          </div>

          {/* ── Stats strip ── */}
          {!loadingPackages && !loadingOrders && (
            <div className="mb-stats">
              <div className="mb-stat-pill">
                <span className="mb-stat-dot" style={{ background: "#d4a843" }} />
                {packageBookings.length} Package {packageBookings.length === 1 ? "Booking" : "Bookings"}
              </div>
              <div className="mb-stat-pill">
                <span className="mb-stat-dot" style={{ background: "#6366f1" }} />
                {orders.length} Rental {orders.length === 1 ? "Order" : "Orders"}
              </div>
              {packageBookings.some(b => b.status === "Pending") && (
                <div className="mb-stat-pill">
                  <span className="mb-stat-dot" style={{ background: "#c49a20" }} />
                  {packageBookings.filter(b => b.status === "Pending").length} Awaiting Confirmation
                </div>
              )}
            </div>
          )}

          {/* ── Tab bar ── */}
          <div className="mb-tab-bar">
            <button
              className={`mb-tab ${activeTab === "packages" ? "active" : ""}`}
              onClick={() => setActiveTab("packages")}
            >
              🏕️ Package Bookings
              {!loadingPackages && (
                <span className="mb-tab-count">{packageBookings.length}</span>
              )}
            </button>
            <button
              className={`mb-tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              🎒 Rental Orders
              {!loadingOrders && (
                <span className="mb-tab-count">{orders.length}</span>
              )}
            </button>
          </div>

          {/* ── Loading ── */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                border: "3px solid rgba(212,168,67,0.2)",
                borderTop: "3px solid #d4a843",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto",
              }} />
              <p style={{ color: "#999", marginTop: "16px", fontSize: "14px" }}>Loading…</p>
            </div>
          )}

          {/* ════════════════════════════════
              TAB 1 — PACKAGE BOOKINGS
          ════════════════════════════════ */}
          {!isLoading && activeTab === "packages" && (
            <>
              {packageBookings.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "80px 20px",
                  background: "#ffffff", borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div className="mb-empty-icon">🏕️</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#1a1a1a", marginTop: "16px" }}>
                    No package bookings yet
                  </h3>
                  <p style={{ color: "#888", fontSize: "15px", marginTop: "6px", marginBottom: "24px" }}>
                    Explore our packages and book your next adventure.
                  </p>
                  <Link to="/packages" style={{
                    display: "inline-block", padding: "10px 28px",
                    borderRadius: "100px", background: "#d4a843",
                    color: "#0f130e", fontWeight: 700, fontSize: "14px",
                    textDecoration: "none", boxShadow: "0 4px 16px rgba(212,168,67,0.35)",
                  }}>
                    Browse Packages
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {packageBookings.map((b) => {
                    const addOns = Array.isArray(b.addOns) ? b.addOns : [];
                    const hoursSinceBooking = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);
                    const canCancel = b.status === "Pending" && hoursSinceBooking <= 24;
                    const isConfirmed = b.status === "Confirmed";
                    const isPendingExpired = b.status === "Pending" && hoursSinceBooking > 24;

                    return (
                      <div key={b.bookingId} className="mb-card">
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "18px" }}>
                          <div>
                            <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Booking ID</p>
                            <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}>{b.bookingId}</p>
                          </div>
                          <StatusBadge status={b.status} />
                        </div>

                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#1a1a1a", margin: "0 0 14px 0", lineHeight: 1.2 }}>
                          {b.packageName}
                        </h3>

                        <div className="mb-row" style={{ marginBottom: "14px" }}>
                          <div>
                            <p className="mb-detail-label">Tour Date</p>
                            <p className="mb-detail-value">{new Date(b.tourDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </div>
                          <div>
                            <p className="mb-detail-label">Guests</p>
                            <p className="mb-detail-value">{b.guests} {b.guests === 1 ? "person" : "people"}</p>
                          </div>
                          {b.selectedVehicle?.vehicleName && (
                            <div>
                              <p className="mb-detail-label">Vehicle</p>
                              <p className="mb-detail-value">{b.selectedVehicle.vehicleName}</p>
                            </div>
                          )}
                          <div>
                            <p className="mb-detail-label">Booked On</p>
                            <p className="mb-detail-value">{new Date(b.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                        </div>

                        {b.selectedActivities?.length > 0 && (
                          <div style={{ marginBottom: "12px" }}>
                            <p className="mb-detail-label" style={{ marginBottom: "6px" }}>Activities</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {b.selectedActivities.map((a) => <span key={a} className="mb-addon-tag">{a}</span>)}
                            </div>
                          </div>
                        )}

                        {addOns.length > 0 && (
                          <div style={{ marginBottom: "12px" }}>
                            <p className="mb-detail-label" style={{ marginBottom: "6px" }}>Add-ons</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {addOns.map((a) => (
                                <span key={a.addonId || a.name} className="mb-addon-tag">
                                  {a.name}{a.price ? ` — LKR ${Number(a.price).toLocaleString()}` : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mb-divider" />

                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <div>
                            <p className="mb-detail-label">Total</p>
                            <p style={{ fontSize: "20px", fontWeight: 700, color: "#d4a843" }}>
                              LKR {b.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <Link to={`/package/${b.packageId}`} className="mb-view-btn">View Package</Link>
                            {canCancel && (
                              <button
                                className="mb-cancel-btn"
                                disabled={cancelling === b.bookingId}
                                onClick={() => handleCancel(b.bookingId, b.status, b.createdAt)}
                              >
                                {cancelling === b.bookingId ? "Cancelling…" : "Cancel Booking"}
                              </button>
                            )}
                            {isConfirmed && (
                              <span style={{
                                fontSize: "12px", fontWeight: 600, color: "#92400e",
                                background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.4)",
                                borderRadius: "100px", padding: "6px 14px",
                              }}>
                                ✓ Confirmed — cannot cancel
                              </span>
                            )}
                            {isPendingExpired && (
                              <span style={{
                                fontSize: "12px", fontWeight: 600, color: "#dc2626",
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
                                borderRadius: "100px", padding: "6px 14px",
                              }}>
                                ⏰ Cancellation window expired
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════
              TAB 2 — RENTAL ORDERS
          ════════════════════════════════ */}
          {!isLoading && activeTab === "orders" && (
            <>
              {orders.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "80px 20px",
                  background: "#ffffff", borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div className="mb-empty-icon">🎒</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#1a1a1a", marginTop: "16px" }}>
                    No rental orders yet
                  </h3>
                  <p style={{ color: "#888", fontSize: "15px", marginTop: "6px", marginBottom: "24px" }}>
                    Browse our adventure gear and equipment for your next trip.
                  </p>
                  <Link to="/services" style={{
                    display: "inline-block", padding: "10px 28px",
                    borderRadius: "100px", background: "#d4a843",
                    color: "#0f130e", fontWeight: 700, fontSize: "14px",
                    textDecoration: "none", boxShadow: "0 4px 16px rgba(212,168,67,0.35)",
                  }}>
                    Browse Equipment
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {orders.map((order) => {
                    const isExpanded = expandedOrder === order._id;
                    return (
                      <div key={order._id} className="mb-card">
                        {/* Top row */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "18px" }}>
                          <div>
                            <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Order ID</p>
                            <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a", fontFamily: "monospace" }}>{order.orderId}</p>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>

                        {/* Details grid */}
                        <div className="mb-row" style={{ marginBottom: "14px" }}>
                          <div>
                            <p className="mb-detail-label">Start Date</p>
                            <p className="mb-detail-value">{new Date(order.startingDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <div>
                            <p className="mb-detail-label">End Date</p>
                            <p className="mb-detail-value">{new Date(order.endingDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <div>
                            <p className="mb-detail-label">Duration</p>
                            <p className="mb-detail-value">{order.days} {order.days === 1 ? "day" : "days"}</p>
                          </div>
                          <div>
                            <p className="mb-detail-label">Order Date</p>
                            <p className="mb-detail-value">{new Date(order.orderDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                        </div>

                        {/* Items count preview */}
                        {order.orderedItems?.length > 0 && (
                          <div style={{ marginBottom: "12px" }}>
                            <p className="mb-detail-label" style={{ marginBottom: "6px" }}>Items ({order.orderedItems.length})</p>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {order.orderedItems.slice(0, 3).map((item) => (
                                <span key={item.product?.key || item._id} className="mb-addon-tag">
                                  {item.product?.name} ×{item.quantity}
                                </span>
                              ))}
                              {order.orderedItems.length > 3 && (
                                <span className="mb-addon-tag">+{order.orderedItems.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expandable items table */}
                        <div className={`mb-expand-area ${isExpanded ? "open" : "closed"}`}>
                          <div className="mb-divider" />
                          <p className="mb-detail-label" style={{ marginBottom: "0" }}>Order Items</p>
                          <table className="mb-items-table">
                            <thead>
                              <tr>
                                <th style={{ width: "48px" }}></th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th style={{ textAlign: "right" }}>Per Day</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderedItems?.map((item) => (
                                <tr key={item.product?.key || item._id}>
                                  <td>
                                    {item.product?.image && (
                                      <img src={item.product.image} alt={item.product.name} />
                                    )}
                                  </td>
                                  <td style={{ fontWeight: 500 }}>{item.product?.name}</td>
                                  <td style={{ color: "#666" }}>{item.quantity}</td>
                                  <td>Rs. {item.product?.dailyRentalprice?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mb-divider" />

                        {/* Footer */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <div>
                            <p className="mb-detail-label">Total Amount</p>
                            <p style={{ fontSize: "20px", fontWeight: 700, color: "#d4a843" }}>
                              Rs. {order.totalAmount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <button
                            className="mb-expand-btn"
                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                          >
                            {isExpanded ? "Hide Items ▲" : "View Items ▼"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}