import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPackageBookings, cancelMyPackageBooking } from "../../utils/api";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL;
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// ── Shared status config ──────────────────────────────────────────────────────
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

// ── Normalise a raw room-booking from the API ─────────────────────────────────
function normalizeRoomBooking(b) {
  const isPast   = new Date(b.checkOutDate) < new Date();
  const rejected = b.paymentStatus === "rejected";
  const status   = rejected
    ? "Cancelled"
    : b.isApproved
      ? isPast ? "Completed" : "Confirmed"
      : "Pending";
  return {
    id:       b.bookingId,
    roomType: b.room?.roomType  || "Room",
    hotel:    b.room?.hotelName || "",
    checkIn:  b.checkInDate,
    checkOut: b.checkOutDate,
    nights:   b.numberOfNights || 0,
    amount:   b.totalAmount    || 0,
    status,
    img:      b.room?.image    || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75",
    raw:      b,
  };
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

// ── Invoice generator ──────────────────────────────────────────────────────
function downloadInvoice(booking) {
  const tax   = Math.round(booking.amount * 0.1);
  const grand = booking.amount + tax;
  const html  = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Invoice ${booking.id}</title>
<style>
  body { font-family:'Helvetica Neue',Arial,sans-serif; margin:0; padding:40px; background:#FAF7F2; color:#292524; }
  .header { background:linear-gradient(135deg,#1C1208,#3B1F00); color:white; padding:36px 40px; border-radius:16px; margin-bottom:28px; }
  .logo { font-size:26px; font-weight:700; color:#d4a843; font-family:Georgia,serif; margin-bottom:4px; }
  .sub  { color:rgba(212,168,67,0.6); font-size:11px; letter-spacing:3px; text-transform:uppercase; }
  .inv-title { font-size:13px; color:rgba(255,255,255,0.5); margin-top:20px; letter-spacing:2px; text-transform:uppercase; }
  .inv-id    { font-size:22px; font-weight:700; color:#d4a843; font-family:monospace; }
  .section   { background:white; border-radius:14px; padding:24px 28px; margin-bottom:16px; border:1px solid #F5EACF; }
  .sec-title { font-size:10px; font-weight:700; color:#D97706; text-transform:uppercase; letter-spacing:2px; margin-bottom:16px; }
  .row       { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #FEF3C7; }
  .row:last-child { border-bottom:none; }
  .label { color:#78716C; font-size:13px; }
  .value { font-weight:600; font-size:13px; }
  .total-box { background:linear-gradient(135deg,#FEF3C7,#FDE8C8); border-radius:12px; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; margin-top:8px; }
  .total-label  { font-size:14px; font-weight:700; color:#92400E; }
  .total-amount { font-size:28px; font-weight:800; color:#D97706; font-family:monospace; }
  .footer { text-align:center; color:#A8A29E; font-size:11px; margin-top:28px; line-height:1.8; }
</style></head><body>
  <div class="header">
    <div class="logo">WildHaven Resort &amp; Safari</div>
    <div class="sub">Tourism &amp; Services</div>
    <div class="inv-title">Invoice</div>
    <div class="inv-id">${booking.id}</div>
  </div>
  <div class="section">
    <div class="sec-title">Booking Details</div>
    <div class="row"><span class="label">Room Type</span><span class="value">${booking.roomType}</span></div>
    <div class="row"><span class="label">Hotel / Resort</span><span class="value">${booking.hotel}</span></div>
    <div class="row"><span class="label">Status</span><span class="value">${booking.status}</span></div>
  </div>
  <div class="section">
    <div class="sec-title">Stay Period</div>
    <div class="row"><span class="label">Check-In</span><span class="value">${new Date(booking.checkIn).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span></div>
    <div class="row"><span class="label">Check-Out</span><span class="value">${new Date(booking.checkOut).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span></div>
    <div class="row"><span class="label">Duration</span><span class="value">${booking.nights} night${booking.nights !== 1 ? "s" : ""}</span></div>
  </div>
  <div class="section">
    <div class="sec-title">Payment Summary</div>
    <div class="row"><span class="label">Room Rate</span><span class="value">LKR ${booking.amount.toLocaleString()}</span></div>
    <div class="row"><span class="label">Tax &amp; Service (10%)</span><span class="value">LKR ${tax.toLocaleString()}</span></div>
    <div class="total-box">
      <span class="total-label">TOTAL AMOUNT DUE</span>
      <span class="total-amount">LKR ${grand.toLocaleString()}</span>
    </div>
  </div>
  <div class="footer">
    <strong>WildHaven Resort &amp; Safari</strong><br/>
    Thank you for choosing us.<br/>
    Support: support@wildhaven.lk | +94 77 964 3177<br/>
    Generated on ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
  </div>
</body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

// ─────────────────────────────────────────────────────────────────────────────
export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("packages");

  // Tab 1 — Package bookings
  const [packageBookings,  setPackageBookings]  = useState([]);
  const [loadingPackages,  setLoadingPackages]  = useState(true);
  const [cancelling,       setCancelling]       = useState(null);

  // Tab 2 — Rental orders
  const [orders,           setOrders]           = useState([]);
  const [loadingOrders,    setLoadingOrders]    = useState(true);
  const [expandedOrder,    setExpandedOrder]    = useState(null);

  // Tab 3 — Room bookings
  const [roomBookings,     setRoomBookings]     = useState([]);
  const [loadingRooms,     setLoadingRooms]     = useState(true);
  const [cancellingRoom,   setCancellingRoom]   = useState(null);
  const [roomFilter,       setRoomFilter]       = useState("All");

  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchPackageBookings();
    fetchOrders();
    fetchRoomBookings();
  }, []);

  // ── Fetchers ──────────────────────────────────────────────────────────────
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
      .get(`${BASE}/api/orders/`, { headers: authH() })
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
    }
  
  function fetchRoomBookings() {
    setLoadingRooms(true);
    axios
      .get(`${BASE}/api/rooms/bookings/my`, { headers: authH() })
      .then((res) => setRoomBookings(res.data.map(normalizeRoomBooking)))
      .catch(() => toast.error("Failed to load room bookings"))
      .finally(() => setLoadingRooms(false));
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  function handleCancelPackage(bookingId) {
    if (!window.confirm("Cancel this booking? This cannot be undone.")) return;
    setCancelling(bookingId);
    cancelMyPackageBooking(bookingId)
      .then(() => { toast.success("Booking cancelled"); fetchPackageBookings(); })
      .catch(() => toast.error("Failed to cancel booking"))
      .finally(() => setCancelling(null));
  }

  // Cancellation Rules (Policy):
  // Online Transfer / Bank Deposit : cancel window = 2-3 days (48-72 hrs) before check-in. Admin refunds.
  // Pay at Checkout                : can cancel within 48 hours of BOOKING CREATION. No refund.
  function getCancelEligibility(booking) {
    const now              = new Date();
    const checkIn          = new Date(booking.checkIn);
    const bookedOn         = new Date(booking.raw?.createdAt || booking.raw?.bookingDate || now);
    const hoursToCheckIn   = (checkIn - now) / (1000 * 60 * 60);
    const hoursSinceBooked = (now - bookedOn) / (1000 * 60 * 60);
    const method     = booking.raw?.paymentMethod || "";
    const isCheckout = method === "checkout";
    const isPaid     = method === "bank_deposit" || method === "online";

    // PAY AT CHECKOUT: cancel allowed within 48 hours of booking creation
    if (isCheckout) {
      if (hoursSinceBooked > 48) {
        const hrs = Math.floor(hoursSinceBooked);
        return {
          allowed: false,
          reason: "Pay at Checkout bookings can only be cancelled within 48 hours of booking. You booked " + hrs + " hours ago - the cancellation window has closed.",
        };
      }
      const hoursLeft = Math.floor(48 - hoursSinceBooked);
      return {
        allowed: true,
        needsRefund: false,
        notice: "You can cancel within " + hoursLeft + " more hour" + (hoursLeft !== 1 ? "s" : "") + " (Pay at Checkout - no refund needed).",
      };
    }

    // ONLINE TRANSFER / BANK DEPOSIT: cancel window is 2-3 days before check-in (48-72 hrs)
    if (isPaid) {
      if (hoursToCheckIn <= 0) {
        return { allowed: false, reason: "Your check-in date has already passed. Cancellation is not allowed." };
      }
      if (hoursToCheckIn > 72) {
        const days = Math.floor(hoursToCheckIn / 24);
        return {
          allowed: false,
          reason: "Cancellation is only allowed 2-3 days before check-in. Your check-in is " + days + " days away. You can cancel between 48-72 hours before arrival.",
        };
      }
      if (hoursToCheckIn < 48) {
        const hrs = Math.ceil(hoursToCheckIn);
        return {
          allowed: false,
          reason: "Cancellation window has closed. Only " + hrs + " hour" + (hrs !== 1 ? "s" : "") + " left before check-in. Cancellation was allowed 2-3 days before arrival.",
        };
      }
      // hoursToCheckIn is between 48 and 72 = exactly 2-3 days window
      const hrs = Math.floor(hoursToCheckIn);
      return {
        allowed: true,
        needsRefund: true,
        notice: "You are within the cancellation window (" + hrs + " hours before check-in). If cancelled, the administrator will process your refund.",
      };
    }

    return { allowed: false, reason: "Unable to determine cancellation eligibility." };
  }

  async function handleCancelRoom(booking) {
    const { allowed, reason, needsRefund } = getCancelEligibility(booking);

    if (!allowed) {
      toast.error(reason, { duration: 5000 });
      return;
    }

    let confirmMsg = "Are you sure you want to cancel this room booking?\n\n";
    if (needsRefund) {
      confirmMsg += "You paid via Online Transfer or Bank Deposit.\nThe administrator will review your cancellation and process a refund.\n\n";
    } else {
      confirmMsg += "No payment was made upfront (Pay at Checkout).\nNo refund is required.\n\n";
    }
    confirmMsg += "This action cannot be undone.";

    if (!window.confirm(confirmMsg)) return;

    setCancellingRoom(booking.id);
    try {
      await axios.delete(
        `${BASE}/api/rooms/bookings/${booking.id}/cancel`,
        {
          headers: authH(),
          data: { refundRequired: needsRefund || false },
        }
      );
      if (needsRefund) {
        toast.success("Booking cancelled. A refund will be processed by the administrator.", { duration: 5000 });
      } else {
        toast.success("Room booking cancelled.");
      }
      fetchRoomBookings();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to cancel room booking");
    } finally {
      setCancellingRoom(null);
    }
  }

  // ── Room bookings filtered list ───────────────────────────────────────────
  const filteredRoomBookings = roomFilter === "All"
    ? roomBookings
    : roomBookings.filter((b) => b.status === roomFilter);

  // ── Room stats ────────────────────────────────────────────────────────────
  const roomStats = {
    total:    roomBookings.length,
    revenue:  roomBookings.reduce((s, b) => s + b.amount, 0),
    nights:   roomBookings.reduce((s, b) => s + b.nights, 0),
    confirmed: roomBookings.filter((b) => b.status === "Confirmed").length,
    completed: roomBookings.filter((b) => b.status === "Completed").length,
    pending:   roomBookings.filter((b) => b.status === "Pending").length,
    cancelled: roomBookings.filter((b) => b.status === "Cancelled").length,
  };

  // ── Loading flag per active tab ───────────────────────────────────────────
  const isLoading =
    activeTab === "packages" ? loadingPackages :
    activeTab === "orders"   ? loadingOrders   :
    loadingRooms;

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
          flex-wrap: wrap;
        }
        .mb-tab {
          padding: 9px 22px;
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
        .mb-tab.active .mb-tab-count { background: rgba(0,0,0,0.15); }

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
        .mb-cancel-btn:hover:not(:disabled) { background: rgba(220,60,60,0.1); box-shadow: 0 3px 12px rgba(220,60,60,0.2); }
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
        .mb-view-btn:hover { background: #d4a843; color: #0f130e; box-shadow: 0 3px 12px rgba(212,168,67,0.35); }

        .mb-invoice-btn {
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
        .mb-invoice-btn:hover { background: rgba(99,102,241,0.08); box-shadow: 0 3px 12px rgba(99,102,241,0.15); }

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
        .mb-expand-btn:hover { background: rgba(99,102,241,0.08); box-shadow: 0 3px 12px rgba(99,102,241,0.15); }

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

        /* ── Room card image strip ── */
        .mb-room-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 12px 12px 0 0;
          display: block;
        }

        /* ── Order items table ── */
        .mb-items-table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
        .mb-items-table th {
          background: rgba(212,168,67,0.08); color: #8a6a10;
          font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.1em;
          font-weight: 700; padding: 8px 12px; text-align: left;
        }
        .mb-items-table th:first-child { border-radius: 8px 0 0 8px; }
        .mb-items-table th:last-child  { border-radius: 0 8px 8px 0; text-align: right; }
        .mb-items-table td {
          padding: 10px 12px; color: #333;
          border-bottom: 1px solid rgba(0,0,0,0.05); vertical-align: middle;
        }
        .mb-items-table td:last-child { text-align: right; font-weight: 600; }
        .mb-items-table tr:last-child td { border-bottom: none; }
        .mb-items-table img { width: 38px; height: 38px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); }

        /* ── Expand animation ── */
        .mb-expand-area { overflow: hidden; transition: max-height 0.3s ease, opacity 0.3s ease; }
        .mb-expand-area.open   { max-height: 600px; opacity: 1; }
        .mb-expand-area.closed { max-height: 0;     opacity: 0; }

        /* ── Divider ── */
        .mb-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 14px 0; }

        /* ── Empty state ── */
        .mb-empty-icon { font-size: 64px; opacity: 0.18; line-height: 1; }

        /* ── Stats strip ── */
        .mb-stats { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
        .mb-stat-pill {
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 100px; padding: 7px 18px;
          font-size: 13px; font-weight: 600; color: #555;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .mb-stat-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* ── Room stats cards ── */
        .mb-room-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .mb-room-stat-card {
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mb-room-stat-icon {
          font-size: 20px;
          line-height: 1;
          margin-bottom: 8px;
        }
        .mb-room-stat-label {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
        }
        .mb-room-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.1;
        }

        /* ── Room filter bar ── */
        .mb-room-filter-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .mb-room-filter-btn {
          padding: 6px 16px;
          border-radius: 100px;
          border: 1.5px solid rgba(0,0,0,0.1);
          background: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.18s ease;
        }
        .mb-room-filter-btn:hover { border-color: rgba(212,168,67,0.5); color: #c49a20; }
        .mb-room-filter-btn.active {
          background: #d4a843;
          color: #0f130e;
          border-color: #d4a843;
          box-shadow: 0 3px 12px rgba(212,168,67,0.3);
        }
        .mb-room-filter-count {
          background: rgba(0,0,0,0.08);
          border-radius: 100px;
          padding: 0 7px;
          font-size: 11px;
          font-weight: 700;
          min-width: 18px;
          text-align: center;
        }

        /* ── Countdown banner ── */
        .mb-countdown {
          padding: 8px 16px;
          font-size: 12px; font-weight: 600;
          border-radius: 8px 8px 0 0;
          border-bottom: 1px solid rgba(212,168,67,0.15);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .mb-card { padding: 18px 14px; }
          .mb-row  { gap: 8px 16px; }
          .mb-tab  { padding: 8px 14px; font-size: 13px; }
          .mb-room-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .mb-room-stat-value { font-size: 20px; }
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
              Track all your reservations — safari packages, gear rentals and room stays in one place.
            </p>
          </div>

          {/* ── Stats strip ── */}
          {!loadingPackages && !loadingOrders && !loadingRooms && (
            <div className="mb-stats">
              <div className="mb-stat-pill">
                <span className="mb-stat-dot" style={{ background: "#d4a843" }} />
                {packageBookings.length} Package {packageBookings.length === 1 ? "Booking" : "Bookings"}
              </div>
              <div className="mb-stat-pill">
                <span className="mb-stat-dot" style={{ background: "#6366f1" }} />
                {orders.length} Rental {orders.length === 1 ? "Order" : "Orders"}
              </div>
              <div className="mb-stat-pill">
                <span className="mb-stat-dot" style={{ background: "#16a34a" }} />
                {roomBookings.length} Room {roomBookings.length === 1 ? "Booking" : "Bookings"}
              </div>
              {packageBookings.some((b) => b.status === "Pending") && (
                <div className="mb-stat-pill">
                  <span className="mb-stat-dot" style={{ background: "#c49a20" }} />
                  {packageBookings.filter((b) => b.status === "Pending").length} Awaiting Confirmation
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
              {!loadingPackages && <span className="mb-tab-count">{packageBookings.length}</span>}
            </button>
            <button
              className={`mb-tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              🎒 Rental Orders
              {!loadingOrders && <span className="mb-tab-count">{orders.length}</span>}
            </button>
            <button
              className={`mb-tab ${activeTab === "rooms" ? "active" : ""}`}
              onClick={() => setActiveTab("rooms")}
            >
              🛏️ Room Bookings
              {!loadingRooms && <span className="mb-tab-count">{roomBookings.length}</span>}
            </button>
          </div>

          {/* ── Loading spinner ── */}
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

          {/* ════════════════════════════════════════════════════
              TAB 1 — PACKAGE BOOKINGS
          ════════════════════════════════════════════════════ */}
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

          {/* ════════════════════════════════════════════════════
              TAB 2 — RENTAL ORDERS
          ════════════════════════════════════════════════════ */}
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
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "18px" }}>
                          <div>
                            <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Order ID</p>
                            <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a", fontFamily: "monospace" }}>{order.orderId}</p>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>

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
                                  <td>{item.product?.image && <img src={item.product.image} alt={item.product.name} />}</td>
                                  <td style={{ fontWeight: 500 }}>{item.product?.name}</td>
                                  <td style={{ color: "#666" }}>{item.quantity}</td>
                                  <td>Rs. {item.product?.dailyRentalprice?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mb-divider" />

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

          {/* ════════════════════════════════════════════════════
              TAB 3 — ROOM BOOKINGS
          ════════════════════════════════════════════════════ */}
          {!isLoading && activeTab === "rooms" && (
            <>
              {roomBookings.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "80px 20px",
                  background: "#ffffff", borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div className="mb-empty-icon">🛏️</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#1a1a1a", marginTop: "16px" }}>
                    No room bookings yet
                  </h3>
                  <p style={{ color: "#888", fontSize: "15px", marginTop: "6px", marginBottom: "24px" }}>
                    Browse our luxury resort rooms and suites.
                  </p>
                  <Link to="/services/resort-rooms" style={{
                    display: "inline-block", padding: "10px 28px",
                    borderRadius: "100px", background: "#d4a843",
                    color: "#0f130e", fontWeight: 700, fontSize: "14px",
                    textDecoration: "none", boxShadow: "0 4px 16px rgba(212,168,67,0.35)",
                  }}>
                    Browse Rooms
                  </Link>
                </div>
              ) : (
                <>
                  {/* ── Room Stats Cards ── */}
                  <div className="mb-room-stats-grid">
                    <div className="mb-room-stat-card" style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}>
                      <div className="mb-room-stat-icon">🗓️</div>
                      <p className="mb-room-stat-label">Total bookings</p>
                      <p className="mb-room-stat-value">{roomStats.total}</p>
                    </div>
                    <div className="mb-room-stat-card" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                      <div className="mb-room-stat-icon">Rs</div>
                      <p className="mb-room-stat-label">Total revenue</p>
                      <p className="mb-room-stat-value" style={{ fontSize: roomStats.revenue >= 1000000 ? "18px" : "24px" }}>
                        LKR {roomStats.revenue >= 1000000
                          ? `${(roomStats.revenue / 1000000).toFixed(1)}M`
                          : roomStats.revenue >= 1000
                            ? `${Math.round(roomStats.revenue / 1000)}K`
                            : roomStats.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="mb-room-stat-card" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <div className="mb-room-stat-icon">🌙</div>
                      <p className="mb-room-stat-label">Total nights</p>
                      <p className="mb-room-stat-value">{roomStats.nights}</p>
                    </div>
                  </div>

                  {/* ── Filter bar ── */}
                  <div className="mb-room-filter-bar">
                    {[
                      { label: "All",       count: roomStats.total },
                      { label: "Confirmed", count: roomStats.confirmed },
                      { label: "Completed", count: roomStats.completed },
                      { label: "Pending",   count: roomStats.pending },
                      { label: "Cancelled", count: roomStats.cancelled },
                    ].map(({ label, count }) => (
                      <button
                        key={label}
                        className={`mb-room-filter-btn ${roomFilter === label ? "active" : ""}`}
                        onClick={() => setRoomFilter(label)}
                      >
                        {label}
                        <span className="mb-room-filter-count">{count}</span>
                      </button>
                    ))}
                  </div>

                  {/* ── Booking cards ── */}
                  {filteredRoomBookings.length === 0 ? (
                    <div style={{
                      textAlign: "center", padding: "48px 20px",
                      background: "#fff", borderRadius: "16px",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}>
                      <p style={{ color: "#aaa", fontSize: "15px" }}>No {roomFilter.toLowerCase()} bookings found.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {filteredRoomBookings.map((b) => {
                        const daysLeft = Math.ceil((new Date(b.checkIn) - new Date()) / (1000 * 60 * 60 * 24));
                        const showCountdown = b.status === "Confirmed" && daysLeft >= 0 && daysLeft <= 7;
                        const canCancel    = b.status === "Confirmed" || b.status === "Pending";
                        const eligibility  = canCancel ? getCancelEligibility(b) : null;

                        return (
                          <div key={b.id} className="mb-card" style={{ padding: 0, overflow: "hidden" }}>

                            {/* Check-in countdown banner */}
                            {showCountdown && (
                              <div className="mb-countdown" style={{
                                background: daysLeft === 0 ? "rgba(34,197,94,0.1)" : "rgba(212,168,67,0.1)",
                                color: daysLeft === 0 ? "#16a34a" : "#c49a20",
                              }}>
                                ⏰ {daysLeft === 0
                                  ? "Your check-in is TODAY!"
                                  : `Check-in in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} — ${formatDate(b.checkIn)}`}
                              </div>
                            )}

                            {/* Room image */}
                            <img
                              src={b.img}
                              alt={b.roomType}
                              className="mb-room-img"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75"; }}
                            />

                            <div style={{ padding: "20px 24px" }}>
                              {/* Top row: ID + status */}
                              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                                <div>
                                  <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Booking ID</p>
                                  <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a", fontFamily: "monospace" }}>{b.id}</p>
                                </div>
                                <StatusBadge status={b.status} />
                              </div>

                              {/* Room name + hotel */}
                              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#1a1a1a", margin: "0 0 4px 0", lineHeight: 1.2 }}>
                                {b.roomType}
                              </h3>
                              {b.hotel && (
                                <p style={{ fontSize: "13px", color: "#888", marginBottom: "14px" }}>📍 {b.hotel}</p>
                              )}

                              {/* Details grid */}
                              <div className="mb-row" style={{ marginBottom: "14px" }}>
                                <div>
                                  <p className="mb-detail-label">Check-In</p>
                                  <p className="mb-detail-value">{formatDate(b.checkIn)}</p>
                                </div>
                                <div>
                                  <p className="mb-detail-label">Check-Out</p>
                                  <p className="mb-detail-value">{formatDate(b.checkOut)}</p>
                                </div>
                                <div>
                                  <p className="mb-detail-label">Duration</p>
                                  <p className="mb-detail-value">{b.nights} {b.nights === 1 ? "night" : "nights"}</p>
                                </div>
                                {b.raw?.numberOfGuests && (
                                  <div>
                                    <p className="mb-detail-label">Guests</p>
                                    <p className="mb-detail-value">{b.raw.numberOfGuests} {b.raw.numberOfGuests === 1 ? "person" : "people"}</p>
                                  </div>
                                )}
                              </div>

                              {/* Special requests */}
                              {b.raw?.specialRequests && (
                                <div style={{ marginBottom: "12px" }}>
                                  <p className="mb-detail-label" style={{ marginBottom: "4px" }}>Special Requests</p>
                                  <p style={{ fontSize: "13px", color: "#555", fontStyle: "italic" }}>
                                    "{b.raw.specialRequests}"
                                  </p>
                                </div>
                              )}

                              {/* Payment method tag + cancellation policy notice */}
                              {b.raw?.paymentMethod && (
                                <div style={{ marginBottom: "12px" }}>
                                  <span className="mb-addon-tag">
                                    {b.raw.paymentMethod === "bank_deposit"
                                      ? "🏦 Bank Deposit"
                                      : b.raw.paymentMethod === "checkout"
                                        ? "🏨 Pay at Checkout"
                                        : "💳 Online Payment"}
                                  </span>
                                  {canCancel && eligibility && (
                                    <p style={{ fontSize: "11px", marginTop: "8px", padding: "8px 12px", borderRadius: "8px",
                                      background: eligibility.allowed ? (eligibility.needsRefund ? "rgba(99,102,241,0.07)" : "rgba(34,197,94,0.07)") : "rgba(239,68,68,0.07)",
                                      color: eligibility.allowed ? (eligibility.needsRefund ? "#4f46e5" : "#16a34a") : "#dc2626",
                                      border: `1px solid ${eligibility.allowed ? (eligibility.needsRefund ? "rgba(99,102,241,0.2)" : "rgba(34,197,94,0.2)") : "rgba(239,68,68,0.2)"}`,
                                    }}>
                                      {!eligibility.allowed
                                        ? eligibility.reason
                                        : eligibility.notice || ""}
                                    </p>
                                  )}
                                </div>
                              )}

                              <div className="mb-divider" />

                              {/* Footer: total + actions */}
                              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                                <div>
                                  <p className="mb-detail-label">Total</p>
                                  <p style={{ fontSize: "20px", fontWeight: 700, color: "#d4a843" }}>
                                    LKR {b.amount.toLocaleString()}
                                  </p>
                                </div>

                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                  <button className="mb-invoice-btn" onClick={() => downloadInvoice(b)}>
                                    🧾 Invoice
                                  </button>
                                  <Link to="/rooms/" className="mb-view-btn">
                                    View Rooms
                                  </Link>
                                  {canCancel && (
                                    <button
                                      className="mb-cancel-btn"
                                      disabled={cancellingRoom === b.id}
                                      onClick={() => handleCancelRoom(b)}
                                    >
                                      {cancellingRoom === b.id ? "Cancelling…" : "Cancel"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}