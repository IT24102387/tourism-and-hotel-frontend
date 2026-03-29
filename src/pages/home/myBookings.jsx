import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPackageBookings, cancelMyPackageBooking } from "../../utils/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  Pending:   { bg: "rgba(212,168,67,0.12)",  text: "#c49a20",  border: "rgba(212,168,67,0.4)"  },
  Confirmed: { bg: "rgba(34,197,94,0.12)",   text: "#16a34a",  border: "rgba(34,197,94,0.4)"   },
  Cancelled: { bg: "rgba(239,68,68,0.12)",   text: "#dc2626",  border: "rgba(239,68,68,0.4)"   },
  Completed: { bg: "rgba(99,102,241,0.12)",  text: "#4f46e5",  border: "rgba(99,102,241,0.4)"  },
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
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchBookings();
  }, []);

  function fetchBookings() {
    setLoading(true);
    getMyPackageBookings()
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }

  function handleCancel(bookingId) {
    if (!window.confirm("Cancel this booking? This cannot be undone.")) return;
    setCancelling(bookingId);
    cancelMyPackageBooking(bookingId)
      .then(() => {
        toast.success("Booking cancelled");
        fetchBookings();
      })
      .catch(() => toast.error("Failed to cancel booking"))
      .finally(() => setCancelling(null));
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600&display=swap');
        .mb-wrap { font-family: 'Outfit', sans-serif; }
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

        .mb-addon-tag {
          background: rgba(212,168,67,0.1);
          color: #b8891e;
          border: 1px solid rgba(212,168,67,0.25);
          border-radius: 6px;
          padding: 2px 9px;
          font-size: 11.5px;
          font-weight: 500;
        }

        .mb-empty-icon {
          font-size: 64px;
          opacity: 0.18;
          line-height: 1;
        }

        @media (max-width: 640px) {
          .mb-card { padding: 18px 14px; }
          .mb-row  { gap: 8px 16px; }
        }
      `}</style>

      <div
        className="mb-wrap"
        style={{ minHeight: "100vh", background: "#f8f6f1", paddingTop: "96px", paddingBottom: "60px" }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 20px" }}>

          {/* Page header */}
          <div style={{ marginBottom: "36px" }}>
            <p style={{ fontSize: "12px", color: "#c49a20", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
              My Account
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", color: "#1a1a1a", lineHeight: 1.1, margin: 0 }}>
              My Package <span style={{ color: "#d4a843" }}>Bookings</span>
            </h1>
            <p style={{ color: "#666", fontSize: "15px", marginTop: "8px" }}>
              View and manage all your safari & tour package reservations.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                border: "3px solid rgba(212,168,67,0.2)",
                borderTop: "3px solid #d4a843",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "#999", marginTop: "16px", fontSize: "14px" }}>Loading your bookings…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && bookings.length === 0 && (
            <div style={{
              textAlign: "center", padding: "80px 20px",
              background: "#ffffff", borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div className="mb-empty-icon">🏕️</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#1a1a1a", marginTop: "16px" }}>
                No bookings yet
              </h3>
              <p style={{ color: "#888", fontSize: "15px", marginTop: "6px", marginBottom: "24px" }}>
                Explore our packages and book your next adventure.
              </p>
              <Link to="/packages" style={{
                display: "inline-block",
                padding: "10px 28px",
                borderRadius: "100px",
                background: "#d4a843",
                color: "#0f130e",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(212,168,67,0.35)",
              }}>
                Browse Packages
              </Link>
            </div>
          )}

          {/* Booking cards */}
          {!loading && bookings.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {bookings.map((b) => {
                const addOns = Object.entries(b.addOns || {})
                  .filter(([, v]) => v)
                  .map(([k]) => k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()));

                const canCancel = b.status === "Pending" || b.status === "Confirmed";

                return (
                  <div key={b.bookingId} className="mb-card">
                    {/* Top row: ID + status + date */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "18px" }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Booking ID</p>
                        <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}>{b.bookingId}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    {/* Package name */}
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#1a1a1a", margin: "0 0 14px 0", lineHeight: 1.2 }}>
                      {b.packageName}
                    </h3>

                    {/* Details grid */}
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

                    {/* Activities */}
                    {b.selectedActivities?.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <p className="mb-detail-label" style={{ marginBottom: "6px" }}>Activities</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {b.selectedActivities.map((a) => (
                            <span key={a} className="mb-addon-tag">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add-ons */}
                    {addOns.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <p className="mb-detail-label" style={{ marginBottom: "6px" }}>Add-ons</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {addOns.map((a) => (
                            <span key={a} className="mb-addon-tag">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Divider */}
                    <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "14px 0" }} />

                    {/* Footer: total + actions */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                      <div>
                        <p className="mb-detail-label">Total</p>
                        <p style={{ fontSize: "20px", fontWeight: 700, color: "#d4a843" }}>
                          ${b.totalPrice.toLocaleString()}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <Link to={`/package/${b.packageId}`} className="mb-view-btn">
                          View Package
                        </Link>
                        {canCancel && (
                          <button
                            className="mb-cancel-btn"
                            disabled={cancelling === b.bookingId}
                            onClick={() => handleCancel(b.bookingId)}
                          >
                            {cancelling === b.bookingId ? "Cancelling…" : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}