import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const getToken   = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

/* ── theme tokens ── */
const BG     = "#FAF7F2";
const CARD   = "#FFFBF5";
const AMBER  = "#D97706";
const AMBERT = "#FBBF24";
const TEXT   = "#292524";
const MUTED  = "#78716C";
const BORDER = "#F5EACF";
const GREEN  = "#059669";
const inp    = { background:"#FEF3C7", border:`1.5px solid #FCD34D`, color:TEXT, width:"100%", padding:"10px 14px", borderRadius:"12px", fontSize:"14px", outline:"none", colorScheme:"light" };
const goldBtn  = { background:`linear-gradient(135deg,${AMBERT},${AMBER})`, color:"#1C1917", fontWeight:700, border:"none", borderRadius:"12px", padding:"10px 22px", cursor:"pointer", fontSize:"14px" };
const ghostBtn = { background:CARD, color:MUTED, border:`1px solid ${BORDER}`, borderRadius:"12px", padding:"10px 22px", cursor:"pointer", fontSize:"14px", fontWeight:600 };
const greenBtn = { background:"linear-gradient(135deg,#34d399,#059669)", color:"#fff", fontWeight:700, border:"none", borderRadius:"12px", padding:"10px 22px", cursor:"pointer", fontSize:"14px" };

/* ─── helper: decode JWT to get role ─── */
function getRole() {
    try {
        const tok = getToken();
        if (!tok) return "";
        return JSON.parse(atob(tok.split(".")[1]))?.role || "";
    } catch { return ""; }
}

/* ══════════════════════════════════════════════════
   PAYMENT SLIP MODAL (user side)
══════════════════════════════════════════════════ */
function SlipModal({ booking, onClose, onUploaded }) {
    const [slipUrl,   setSlipUrl]   = useState("");
    const [uploading, setUploading] = useState(false);

    async function handleUpload() {
        if (!slipUrl.trim()) { toast.error("Please enter the image URL"); return; }
        setUploading(true);
        try {
            await axios.put(
                `${BASE}/api/rooms/bookings/${booking.bookingId}/payment-slip`,
                { paymentSlip: slipUrl },
                { headers: authHeader() }
            );
            toast.success("Payment slip uploaded!");
            onUploaded();
        } catch { toast.error("Failed to upload slip"); }
        setUploading(false);
    }

    return (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", backdropFilter:"blur(6px)" }}>
            <div style={{ background:CARD, borderRadius:"20px", padding:"28px", width:"100%", maxWidth:"460px", boxShadow:"0 24px 60px rgba(0,0,0,0.15)", border:`1px solid ${BORDER}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
                    <div>
                        <h2 style={{ color:TEXT, margin:"0 0 4px", fontSize:"20px", fontWeight:700 }}>📎 Upload Payment Slip</h2>
                        <p style={{ color:MUTED, fontSize:"13px", margin:0 }}>Booking: {booking.bookingId}</p>
                    </div>
                    <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", color:MUTED, borderRadius:"10px", width:"34px", height:"34px", cursor:"pointer", fontSize:"18px" }}>×</button>
                </div>
                <div style={{ background:"rgba(217,119,6,0.06)", border:`1px solid ${BORDER}`, borderRadius:"14px", padding:"16px", marginBottom:"20px", fontSize:"13px", color:MUTED, lineHeight:"1.75" }}>
                    <strong style={{ color:AMBER, display:"block", marginBottom:"6px" }}>🏦 Bank Transfer Details</strong>
                    Bank: Commercial Bank of Ceylon<br/>
                    Account Name: Kadiraa Tourism Pvt Ltd<br/>
                    Account No: <strong style={{ color:TEXT }}>1234567890</strong><br/>
                    Amount: <strong style={{ color:AMBER }}>LKR {booking.totalAmount?.toLocaleString()}</strong>
                </div>
                <label style={{ fontSize:"11px", color:MUTED, textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"8px", fontWeight:700 }}>
                    Payment Slip Image URL
                </label>
                <input value={slipUrl} onChange={e => setSlipUrl(e.target.value)}
                    placeholder="Paste Cloudinary / Supabase image URL…" style={inp}/>
                <p style={{ color:MUTED, fontSize:"11px", marginTop:"6px" }}>
                    Upload your slip to Cloudinary or Supabase, then paste the URL here.
                </p>
                <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"22px" }}>
                    <button onClick={onClose} style={ghostBtn}>Cancel</button>
                    <button onClick={handleUpload} disabled={uploading} style={{ ...goldBtn, opacity: uploading ? 0.65 : 1 }}>
                        {uploading ? "Uploading…" : "Submit Slip"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   CHECKOUT EMAIL MODAL (admin only)
   Shows bill preview & confirm button before sending
══════════════════════════════════════════════════ */
function CheckoutEmailModal({ booking, onClose, onSent }) {
    const [sending, setSending] = useState(false);

    const nights    = booking.numberOfNights;
    const roomPrice = booking.room?.price || 0;
    const subtotal  = roomPrice * nights;
    const tax       = Math.round(subtotal * 0.15);
    const grand     = subtotal + tax;
    const checkOut  = new Date(booking.checkOutDate).toLocaleDateString("en-US", {
        weekday:"long", year:"numeric", month:"long", day:"numeric"
    });

    async function handleSend() {
        setSending(true);
        try {
            const res = await axios.post(
                `${BASE}/api/rooms/bookings/${booking.bookingId}/send-checkout-email`,
                {},
                { headers: authHeader() }
            );
            toast.success(`✅ Bill email sent to ${res.data.sentTo}`);
            onSent();
        } catch(e) {
            toast.error(e.response?.data?.message || "Failed to send email");
        }
        setSending(false);
    }

    return (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", backdropFilter:"blur(8px)" }}>
            <div style={{ background:CARD, borderRadius:"24px", padding:"0", width:"100%", maxWidth:"520px", boxShadow:"0 32px 80px rgba(0,0,0,0.2)", border:`1px solid ${BORDER}`, overflow:"hidden" }}>

                {/* Header */}
                <div style={{ background:"linear-gradient(135deg,#1a0a00,#3d1a00)", padding:"24px 28px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", textTransform:"uppercase", letterSpacing:"2px", margin:"0 0 6px" }}>Admin Action</p>
                            <h2 style={{ color:"#F5A623", margin:0, fontSize:"20px", fontWeight:700 }}>📧 Send Checkout Bill Email</h2>
                        </div>
                        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"rgba(255,255,255,0.7)", borderRadius:"10px", width:"34px", height:"34px", cursor:"pointer", fontSize:"18px" }}>×</button>
                    </div>
                </div>

                <div style={{ padding:"24px 28px" }}>
                    {/* Recipient */}
                    <div style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"12px", padding:"14px 16px", marginBottom:"20px" }}>
                        <p style={{ color:MUTED, fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 4px", fontWeight:700 }}>Email will be sent to</p>
                        <p style={{ color:GREEN, fontWeight:700, fontSize:"15px", margin:0 }}>✉ {booking.email}</p>
                    </div>

                    {/* Booking info */}
                    <div style={{ marginBottom:"20px" }}>
                        <p style={{ color:MUTED, fontSize:"12px", textTransform:"uppercase", letterSpacing:"1px", fontWeight:700, margin:"0 0 10px" }}>Booking Summary</p>
                        {[
                            ["Booking ID",  booking.bookingId],
                            ["Room",        `${booking.room?.roomType} — Room ${booking.room?.roomNumber}`],
                            ["Hotel",       booking.room?.hotelName],
                            ["Check-Out",   checkOut],
                            ["Nights",      `${nights} night${nights !== 1 ? "s" : ""}`],
                        ].map(([l, v]) => (
                            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${BORDER}` }}>
                                <span style={{ color:MUTED, fontSize:"13px" }}>{l}</span>
                                <span style={{ color:TEXT, fontSize:"13px", fontWeight:600 }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bill preview */}
                    <div style={{ background:"#fdf8ef", border:`1px solid ${BORDER}`, borderRadius:"14px", padding:"16px", marginBottom:"22px" }}>
                        <p style={{ color:MUTED, fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px", fontWeight:700, margin:"0 0 12px" }}>Bill Preview</p>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", color:MUTED, marginBottom:"6px" }}>
                            <span>Room charges ({nights} nights × LKR {roomPrice.toLocaleString()})</span>
                            <span>LKR {subtotal.toLocaleString()}</span>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", color:MUTED, marginBottom:"10px" }}>
                            <span>Tax & Service (15%)</span>
                            <span>LKR {tax.toLocaleString()}</span>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"16px", fontWeight:800, color:TEXT, borderTop:`2px solid ${BORDER}`, paddingTop:"10px" }}>
                            <span>Total Due</span>
                            <span style={{ color:AMBER }}>LKR {grand.toLocaleString()}</span>
                        </div>
                    </div>

                    {booking.checkoutEmailSent && (
                        <div style={{ background:"#fef3c7", border:"1px solid #fde68a", borderRadius:"10px", padding:"10px 14px", marginBottom:"16px", fontSize:"12px", color:"#92400e" }}>
                            ⚠️ A checkout email was already sent on {new Date(booking.checkoutEmailSentAt).toLocaleString()}. Sending again will resend the bill.
                        </div>
                    )}

                    <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end" }}>
                        <button onClick={onClose} style={ghostBtn}>Cancel</button>
                        <button onClick={handleSend} disabled={sending}
                            style={{ ...greenBtn, opacity: sending ? 0.65 : 1, display:"flex", alignItems:"center", gap:"8px" }}>
                            {sending ? "Sending…" : "📧 Send Bill Email"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   BOOKING CARD
══════════════════════════════════════════════════ */
function BookingCard({ booking, isAdmin, onCancel, onUploadSlip, onApprove, onReject, onSendCheckoutEmail }) {
    const isApproved = booking.isApproved;
    const isRejected = booking.paymentStatus === "rejected";
    const isPending  = !isApproved && !isRejected;
    const hasSlip    = !!booking.paymentSlip;
    const isCheckout = booking.paymentMethod === "checkout";

    const statusLabel = isApproved ? "✅ Confirmed" : isRejected ? "❌ Rejected" : "⏳ Pending Review";
    const statusStyle = {
        padding:"5px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:700, display:"inline-block",
        background: isApproved ? "#d1fae5" : isRejected ? "#fee2e2" : "#fef3c7",
        color:      isApproved ? "#065f46" : isRejected ? "#991b1b" : "#92400e",
        border:     `1px solid ${isApproved ? "#6ee7b7" : isRejected ? "#fca5a5" : "#fde68a"}`
    };

    const payLabel = isCheckout ? "🏨 Pay at Checkout" : booking.paymentMethod === "bank_deposit" ? "🏦 Bank Deposit" : "💳 Online";

    return (
        <div style={{ background:CARD, borderRadius:"18px", overflow:"hidden", border:`1px solid ${isCheckout ? "rgba(16,185,129,0.3)" : BORDER}`, boxShadow:`0 4px 16px ${isCheckout ? "rgba(16,185,129,0.08)" : "rgba(217,119,6,0.07)"}` }}>
            {isCheckout && (
                <div style={{ background:"linear-gradient(90deg,rgba(16,185,129,0.1),transparent)", borderBottom:"1px solid rgba(16,185,129,0.15)", padding:"6px 20px", fontSize:"11px", color:GREEN, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>
                    🏨 Pay at Checkout Booking
                    {booking.checkoutEmailSent && <span style={{ marginLeft:"12px", color:MUTED, fontWeight:400 }}>📧 Bill emailed {new Date(booking.checkoutEmailSentAt).toLocaleDateString()}</span>}
                </div>
            )}
            <div style={{ display:"flex" }}>
                {/* Room image */}
                <div style={{ width:"140px", flexShrink:0, overflow:"hidden", position:"relative" }}>
                    <img src={booking.room?.image || booking.room?.images?.[0]}
                        alt={booking.room?.roomType}
                        style={{ width:"100%", height:"100%", objectFit:"cover", minHeight:"160px" }}
                        onError={e => e.target.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80"}/>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,transparent 60%,rgba(255,251,245,0.4))" }}/>
                </div>

                {/* Details */}
                <div style={{ flex:1, padding:"18px 20px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"8px", marginBottom:"10px" }}>
                        <div>
                            <p style={{ color:AMBER, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1.5px", margin:"0 0 3px", fontWeight:700 }}>{booking.room?.hotelName}</p>
                            <h3 style={{ color:TEXT, fontWeight:700, margin:0, fontSize:"17px" }}>{booking.room?.roomType} · Room {booking.room?.roomNumber}</h3>
                            {isAdmin && <p style={{ color:MUTED, fontSize:"12px", margin:"4px 0 0" }}>Guest: {booking.email}</p>}
                        </div>
                        <span style={statusStyle}>{statusLabel}</span>
                    </div>

                    {/* Info pills */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", fontSize:"12px", color:MUTED, marginBottom:"14px" }}>
                        <span>📅 {new Date(booking.checkInDate).toLocaleDateString()} → {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                        <span>🌙 {booking.numberOfNights} night{booking.numberOfNights > 1 ? "s" : ""}</span>
                        <span>👥 {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? "s" : ""}</span>
                        <span style={{ color: isCheckout ? GREEN : MUTED, fontWeight: isCheckout ? 700 : 400 }}>{payLabel}</span>
                    </div>

                    {/* Price + Actions */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
                        <p style={{ color:AMBER, fontWeight:800, margin:0, fontSize:"18px" }}>
                            LKR {booking.totalAmount?.toLocaleString()}
                        </p>
                        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>

                            {/* ── ADMIN actions ── */}
                            {isAdmin && isPending && !isCheckout && (
                                <>
                                    <button onClick={() => onApprove(booking.bookingId)}
                                        style={{ ...greenBtn, padding:"8px 16px", fontSize:"12px" }}>
                                        ✅ Approve
                                    </button>
                                    <button onClick={() => onReject(booking.bookingId)}
                                        style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:"12px", padding:"8px 16px", cursor:"pointer", fontSize:"12px", fontWeight:700 }}>
                                        ❌ Reject
                                    </button>
                                </>
                            )}

                            {/* ── Send checkout email (admin only, checkout payment) ── */}
                            {isAdmin && isCheckout && (
                                <button onClick={() => onSendCheckoutEmail(booking)}
                                    style={{ ...greenBtn, padding:"8px 16px", fontSize:"12px", opacity: booking.checkoutEmailSent ? 0.75 : 1 }}>
                                    {booking.checkoutEmailSent ? "📧 Resend Bill Email" : "📧 Send Checkout Bill"}
                                </button>
                            )}

                            {/* ── User slip upload ── */}
                            {!isAdmin && booking.paymentMethod === "bank_deposit" && isPending && !hasSlip && (
                                <button onClick={() => onUploadSlip(booking)} style={{ ...goldBtn, padding:"8px 16px", fontSize:"12px" }}>
                                    📎 Upload Slip
                                </button>
                            )}
                            {hasSlip && (
                                <a href={booking.paymentSlip} target="_blank" rel="noreferrer"
                                    style={{ ...ghostBtn, padding:"8px 16px", fontSize:"12px", textDecoration:"none" }}>
                                    View Slip ↗
                                </a>
                            )}
                            {!isAdmin && isPending && (
                                <button onClick={() => onCancel(booking.bookingId)}
                                    style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:"12px", padding:"8px 16px", cursor:"pointer", fontSize:"12px", fontWeight:700 }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer meta */}
                    <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:`1px solid ${BORDER}`, fontSize:"12px", color:MUTED, display:"flex", gap:"16px", flexWrap:"wrap" }}>
                        <span>🆔 {booking.bookingId}</span>
                        {booking.specialRequests && <span>📝 {booking.specialRequests}</span>}
                        {isAdmin && booking.paymentSlip && (
                            <a href={booking.paymentSlip} target="_blank" rel="noreferrer" style={{ color:AMBER, fontWeight:700 }}>View Payment Slip ↗</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE  (works for both user & admin)
══════════════════════════════════════════════════ */
export default function MyRoomBookingsPage() {
    const navigate = useNavigate();
    const isAdmin  = getRole() === "admin";

    const [bookings,       setBookings]       = useState([]);
    const [loading,        setLoading]        = useState(true);
    const [slipBooking,    setSlipBooking]     = useState(null);
    const [checkoutModal,  setCheckoutModal]  = useState(null); // booking object
    const [activeTab,      setActiveTab]      = useState("all");
    const [searchQ,        setSearchQ]        = useState("");

    useEffect(() => {
        if (!getToken()) { navigate("/login"); return; }
        loadBookings();
    }, []);

    async function loadBookings() {
        setLoading(true);
        try {
            const endpoint = isAdmin
                ? `${BASE}/api/rooms/bookings/all`
                : `${BASE}/api/rooms/bookings/my`;
            const res = await axios.get(endpoint, { headers: authHeader() });
            setBookings(res.data);
        } catch { toast.error("Failed to load bookings"); }
        setLoading(false);
    }

    async function handleCancel(bookingId) {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await axios.delete(`${BASE}/api/rooms/bookings/${bookingId}/cancel`, { headers: authHeader() });
            toast.success("Booking cancelled");
            loadBookings();
        } catch(e) { toast.error(e.response?.data?.message || "Failed to cancel"); }
    }

    async function handleApprove(bookingId) {
        try {
            await axios.put(`${BASE}/api/rooms/bookings/${bookingId}/approve`, {}, { headers: authHeader() });
            toast.success("Booking approved ✅");
            loadBookings();
        } catch { toast.error("Failed to approve"); }
    }

    async function handleReject(bookingId) {
        if (!window.confirm("Reject this booking?")) return;
        try {
            await axios.put(`${BASE}/api/rooms/bookings/${bookingId}/reject`, {}, { headers: authHeader() });
            toast.success("Booking rejected");
            loadBookings();
        } catch { toast.error("Failed to reject"); }
    }

    /* ── filtered lists ── */
    const confirmed  = bookings.filter(b =>  b.isApproved);
    const pending    = bookings.filter(b => !b.isApproved && b.paymentStatus !== "rejected");
    const rejected   = bookings.filter(b =>  b.paymentStatus === "rejected");
    const checkoutBk = bookings.filter(b =>  b.paymentMethod === "checkout");

    const tabList = [
        { key:"all",      label:"All",           list:bookings,   count:bookings.length   },
        { key:"pending",  label:"Pending",        list:pending,    count:pending.length    },
        { key:"confirmed",label:"Confirmed",      list:confirmed,  count:confirmed.length  },
        { key:"rejected", label:"Rejected",       list:rejected,   count:rejected.length   },
        { key:"checkout", label:"Pay at Checkout",list:checkoutBk, count:checkoutBk.length },
    ];

    const baseList = tabList.find(t => t.key === activeTab)?.list || bookings;
    const shown = searchQ.trim()
        ? baseList.filter(b =>
            b.bookingId.toLowerCase().includes(searchQ.toLowerCase()) ||
            b.email?.toLowerCase().includes(searchQ.toLowerCase()) ||
            b.room?.roomType?.toLowerCase().includes(searchQ.toLowerCase()) ||
            b.room?.roomNumber?.toLowerCase().includes(searchQ.toLowerCase())
          )
        : baseList;

    const title = isAdmin ? "🛏 All Room Bookings" : "🛏 My Room Bookings";

    return (
        <div style={{ minHeight:"100vh", background:BG, padding:"32px 24px", fontFamily:"'Outfit','Jost',sans-serif" }}>
            <div style={{ maxWidth:"920px", margin:"0 auto" }}>

                {/* ── Header ── */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px", flexWrap:"wrap", gap:"12px" }}>
                    <div>
                        <h1 style={{ fontSize:"28px", color:TEXT, margin:"0 0 4px", fontWeight:800 }}>{title}</h1>
                        <p style={{ color:MUTED, fontSize:"14px", margin:0 }}>{bookings.length} booking{bookings.length !== 1 ? "s" : ""} total</p>
                    </div>
                    {!isAdmin && <button onClick={() => navigate("/rooms")} style={goldBtn}>+ New Booking</button>}
                    {isAdmin  && <button onClick={loadBookings} style={ghostBtn}>🔄 Refresh</button>}
                </div>

                {loading ? (
                    <div style={{ textAlign:"center", padding:"80px", color:MUTED }}>
                        <div style={{ width:"40px", height:"40px", border:"4px solid #fcd34d", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }}/>
                        <p>Loading bookings…</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div style={{ background:CARD, borderRadius:"24px", padding:"70px", textAlign:"center", border:`1px solid ${BORDER}` }}>
                        <div style={{ fontSize:"52px", marginBottom:"16px" }}>🛏</div>
                        <h2 style={{ color:TEXT, fontSize:"22px", fontWeight:700, margin:"0 0 8px" }}>No bookings yet</h2>
                        <p style={{ color:MUTED, marginBottom:"24px" }}>
                            {isAdmin ? "No room bookings have been made yet." : "Browse our rooms and make your first booking"}
                        </p>
                        {!isAdmin && <button onClick={() => navigate("/rooms")} style={goldBtn}>Browse Rooms</button>}
                    </div>
                ) : (
                    <>
                        {/* ── Stats row ── */}
                        <div style={{ display:"grid", gridTemplateColumns:`repeat(${isAdmin ? 4 : 3},1fr)`, gap:"12px", marginBottom:"24px" }}>
                            {[
                                ["✅ Confirmed",        confirmed.length,  "#d1fae5","#065f46","#6ee7b7"],
                                ["⏳ Pending",          pending.length,    "#fef3c7","#92400e","#fde68a"],
                                ["❌ Rejected",         rejected.length,   "#fee2e2","#991b1b","#fca5a5"],
                                ...(isAdmin ? [["🏨 Pay at Checkout", checkoutBk.length, "rgba(16,185,129,0.1)","#065f46","rgba(16,185,129,0.3)"]] : [])
                            ].map(([label, count, bg, color, border]) => (
                                <div key={label} style={{ background:bg, borderRadius:"14px", padding:"18px", textAlign:"center", border:`1px solid ${border}` }}>
                                    <p style={{ color, fontSize:"11px", fontWeight:700, margin:"0 0 5px", textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</p>
                                    <p style={{ color, fontWeight:800, fontSize:"26px", margin:0 }}>{count}</p>
                                </div>
                            ))}
                        </div>

                        {/* ── Search ── */}
                        {isAdmin && (
                            <div style={{ marginBottom:"18px" }}>
                                <input
                                    value={searchQ}
                                    onChange={e => setSearchQ(e.target.value)}
                                    placeholder="🔍  Search by booking ID, email, room type…"
                                    style={{ ...inp, maxWidth:"420px" }}
                                />
                            </div>
                        )}

                        {/* ── Filter tabs ── */}
                        <div style={{ display:"flex", gap:"6px", marginBottom:"20px", background:"#e5e7eb", padding:"4px", borderRadius:"14px", width:"fit-content", flexWrap:"wrap" }}>
                            {tabList.map(t => (
                                <button key={t.key} onClick={() => setActiveTab(t.key)}
                                    style={{ padding:"8px 16px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:700,
                                        background: activeTab===t.key ? `linear-gradient(135deg,${AMBERT},${AMBER})` : "transparent",
                                        color:      activeTab===t.key ? "#fff" : MUTED }}>
                                    {t.label} ({t.count})
                                </button>
                            ))}
                        </div>

                        {/* ── Checkout tab helper banner (admin) ── */}
                        {isAdmin && activeTab === "checkout" && checkoutBk.length > 0 && (
                            <div style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:"14px", padding:"14px 18px", marginBottom:"18px", fontSize:"13px", color:GREEN, lineHeight:1.6 }}>
                                <strong>📧 Pay at Checkout bookings</strong> — These guests will pay on departure.
                                Use the <strong>"Send Checkout Bill"</strong> button on each card to email them a detailed bill before their checkout date.
                            </div>
                        )}

                        {/* ── Booking list ── */}
                        {shown.length === 0 ? (
                            <div style={{ textAlign:"center", padding:"48px", color:MUTED, background:CARD, borderRadius:"20px", border:`1px solid ${BORDER}` }}>
                                No {activeTab === "all" ? "" : activeTab} bookings found.
                            </div>
                        ) : (
                            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                                {shown.map(b => (
                                    <BookingCard key={b.bookingId} booking={b}
                                        isAdmin={isAdmin}
                                        onCancel={handleCancel}
                                        onUploadSlip={setSlipBooking}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        onSendCheckoutEmail={setCheckoutModal}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {slipBooking && (
                <SlipModal
                    booking={slipBooking}
                    onClose={() => setSlipBooking(null)}
                    onUploaded={() => { setSlipBooking(null); loadBookings(); }}/>
            )}
            {checkoutModal && (
                <CheckoutEmailModal
                    booking={checkoutModal}
                    onClose={() => setCheckoutModal(null)}
                    onSent={() => { setCheckoutModal(null); loadBookings(); }}/>
            )}

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}