import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ─── Helpers ───────────────────────────────────────────────
function getToken() { return localStorage.getItem("token"); }
function authHeader() { return { Authorization: `Bearer ${getToken()}` }; }

const EMPTY_ROOM = {
    key: "", roomNumber: "", hotelName: "", roomType: "Standard",
    description: "", price: "", capacity: 2, availability: true, status: "Available",
    facilities: { ac: false, wifi: true, parking: false, tv: false, hotWater: true, miniBar: false },
    images: [""]
};

const HOTEL_NAMES  = ["Kadiraa Beach Resort", "Kadiraa Hill Estate", "Kadiraa Forest Spa"];
const ROOM_TYPES   = ["Standard", "Deluxe", "Suite", "Family Suite", "Pool Villa", "Garden Cottage"];
const FACILITY_KEYS = ["ac", "wifi", "parking", "tv", "hotWater", "miniBar"];
const FACILITY_LABELS = { ac:"AC", wifi:"WiFi", parking:"Parking", tv:"Smart TV", hotWater:"Hot Water", miniBar:"Mini Bar" };

// ─── Styles ────────────────────────────────────────────────
const BG    = { background:"linear-gradient(135deg,#060914 0%,#0a0f22 60%,#060914 100%)", minHeight:"100vh", fontFamily:"'Jost',sans-serif", color:"white" };
const CARD  = { background:"rgba(8,12,28,0.78)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)" };
const INPUT = { background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"white", width:"100%", padding:"10px 14px", borderRadius:"10px", fontSize:"14px", outline:"none" };
const BTN_GOLD = { background:"linear-gradient(135deg,#F5A623,#FFB84D)", color:"#1a0f00", fontWeight:700, border:"none", borderRadius:"10px", padding:"10px 22px", cursor:"pointer", fontSize:"14px" };
const BTN_GHOST = { background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", padding:"10px 22px", cursor:"pointer", fontSize:"14px" };

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@300;400;500;600;700&display=swap');
.font-display{font-family:'Cormorant Garamond',serif!important}
select option{background:#0a0f22;color:white}
input[type="date"]{color-scheme:dark}`;

// ─── Room Form Modal ────────────────────────────────────────
function RoomFormModal({ room, onClose, onSaved }) {
    const [form, setForm] = useState(room || EMPTY_ROOM);
    const [saving, setSaving] = useState(false);
    const isEdit = !!room;

    function setField(key, val) { setForm(f => ({ ...f, [key]: val })); }
    function setFacility(key, val) { setForm(f => ({ ...f, facilities: { ...f.facilities, [key]: val } })); }
    function setImage(idx, val) {
        const imgs = [...form.images];
        imgs[idx] = val;
        setForm(f => ({ ...f, images: imgs }));
    }
    function addImage() { setForm(f => ({ ...f, images: [...f.images, ""] })); }
    function removeImage(idx) { setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) })); }

    async function handleSave() {
        if (!form.key || !form.roomNumber || !form.hotelName || !form.description || !form.price) {
            toast.error("Please fill all required fields"); return;
        }
        setSaving(true);
        try {
            const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity), images: form.images.filter(Boolean) };
            if (isEdit) {
                await axios.put(`${BASE}/api/rooms/${form.key}`, payload, { headers: authHeader() });
                toast.success("Room updated successfully");
            } else {
                await axios.post(`${BASE}/api/rooms`, payload, { headers: authHeader() });
                toast.success("Room added successfully");
            }
            onSaved();
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to save room");
        }
        setSaving(false);
    }

    return (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <div style={{ ...CARD, borderRadius:"20px", width:"100%", maxWidth:"680px", maxHeight:"90vh", overflowY:"auto", padding:"28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"22px" }}>
                    <h2 className="font-display" style={{ fontSize:"22px", color:"white", margin:0 }}>{isEdit ? "Edit Room" : "Add New Room"}</h2>
                    <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"white", borderRadius:"8px", width:"32px", height:"32px", cursor:"pointer", fontSize:"18px" }}>×</button>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                    {/* Key */}
                    <div>
                        <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Room Key *</label>
                        <input value={form.key} onChange={e => setField("key", e.target.value)} disabled={isEdit} placeholder="e.g. RM-101" style={{ ...INPUT, opacity: isEdit ? 0.5 : 1 }} />
                    </div>
                    {/* Room Number */}
                    <div>
                        <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Room Number *</label>
                        <input value={form.roomNumber} onChange={e => setField("roomNumber", e.target.value)} placeholder="e.g. 101" style={INPUT} />
                    </div>
                    {/* Hotel */}
                    <div>
                        <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Hotel *</label>
                        <select value={form.hotelName} onChange={e => setField("hotelName", e.target.value)} style={INPUT}>
                            <option value="">Select hotel…</option>
                            {HOTEL_NAMES.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>
                    {/* Room Type */}
                    <div>
                        <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Room Type *</label>
                        <select value={form.roomType} onChange={e => setField("roomType", e.target.value)} style={INPUT}>
                            {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    {/* Price */}
                    <div>
                        <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Price per Night (LKR) *</label>
                        <input type="number" value={form.price} onChange={e => setField("price", e.target.value)} placeholder="18500" style={INPUT} />
                    </div>
                    {/* Capacity */}
                    <div>
                        <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Max Capacity</label>
                        <input type="number" min="1" max="10" value={form.capacity} onChange={e => setField("capacity", e.target.value)} style={INPUT} />
                    </div>
                    {/* Status */}
                    <div>
                        <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Status</label>
                        <select value={form.status} onChange={e => setField("status", e.target.value)} style={INPUT}>
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    {/* Availability toggle */}
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", paddingTop:"20px" }}>
                        <input type="checkbox" id="avail" checked={form.availability} onChange={e => setField("availability", e.target.checked)} style={{ width:"16px", height:"16px", accentColor:"#F5A623", cursor:"pointer" }} />
                        <label htmlFor="avail" style={{ color:"rgba(255,255,255,0.7)", fontSize:"14px", cursor:"pointer" }}>Show as Available</label>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginTop:"14px" }}>
                    <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px" }}>Description *</label>
                    <textarea value={form.description} rows={3} onChange={e => setField("description", e.target.value)} placeholder="Describe the room…" style={{ ...INPUT, resize:"vertical", lineHeight:"1.6" }} />
                </div>

                {/* Facilities */}
                <div style={{ marginTop:"16px" }}>
                    <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"10px" }}>Facilities</label>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
                        {FACILITY_KEYS.map(fk => (
                            <label key={fk} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 14px", borderRadius:"10px", cursor:"pointer", background: form.facilities[fk] ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.04)", border:`1px solid ${form.facilities[fk] ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.08)"}`, color: form.facilities[fk] ? "#FCD34D" : "rgba(255,255,255,0.45)", fontSize:"13px", fontWeight:600 }}>
                                <input type="checkbox" checked={form.facilities[fk]} onChange={e => setFacility(fk, e.target.checked)} style={{ display:"none" }} />
                                {FACILITY_LABELS[fk]}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div style={{ marginTop:"16px" }}>
                    <label style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"8px" }}>Image URLs</label>
                    {form.images.map((img, idx) => (
                        <div key={idx} style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                            <input value={img} onChange={e => setImage(idx, e.target.value)} placeholder="https://…" style={{ ...INPUT, flex:1 }} />
                            {form.images.length > 1 && (
                                <button onClick={() => removeImage(idx)} style={{ ...BTN_GHOST, padding:"10px 14px" }}>×</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addImage} style={{ ...BTN_GHOST, fontSize:"12px", padding:"7px 14px" }}>+ Add Image</button>
                </div>

                {/* Actions */}
                <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"22px" }}>
                    <button onClick={onClose} style={BTN_GHOST}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={{ ...BTN_GOLD, opacity: saving ? 0.6 : 1 }}>
                        {saving ? "Saving…" : isEdit ? "Update Room" : "Add Room"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Booking Management Tab ─────────────────────────────────
function BookingsTab() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => { loadBookings(); }, []);

    async function loadBookings() {
        try {
            const res = await axios.get(`${BASE}/api/rooms/bookings/all`, { headers: authHeader() });
            setBookings(res.data);
        } catch (e) {
            toast.error("Failed to load bookings");
        }
        setLoading(false);
    }

    async function handleApprove(bookingId) {
        try {
            await axios.put(`${BASE}/api/rooms/bookings/${bookingId}/approve`, {}, { headers: authHeader() });
            toast.success("Booking approved");
            loadBookings();
        } catch (e) { toast.error("Failed to approve"); }
    }

    async function handleReject(bookingId) {
        try {
            await axios.put(`${BASE}/api/rooms/bookings/${bookingId}/reject`, {}, { headers: authHeader() });
            toast.success("Booking rejected");
            loadBookings();
        } catch (e) { toast.error("Failed to reject"); }
    }

    const filtered = filter === "all" ? bookings
        : filter === "pending" ? bookings.filter(b => !b.isApproved && b.paymentStatus !== "rejected")
        : filter === "approved" ? bookings.filter(b => b.isApproved)
        : bookings.filter(b => b.paymentStatus === "rejected");

    if (loading) return <p style={{ color:"rgba(255,255,255,0.4)", textAlign:"center", padding:"40px" }}>Loading bookings…</p>;

    return (
        <div>
            {/* Filter tabs */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
                {["all","pending","approved","rejected"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding:"8px 18px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:600, textTransform:"capitalize", background: filter===f ? "linear-gradient(135deg,#F5A623,#FFB84D)" : "rgba(255,255,255,0.06)", color: filter===f ? "#1a0f00" : "rgba(255,255,255,0.5)" }}>
                        {f} {f==="all" ? `(${bookings.length})` : f==="pending" ? `(${bookings.filter(b=>!b.isApproved&&b.paymentStatus!=="rejected").length})` : f==="approved" ? `(${bookings.filter(b=>b.isApproved).length})` : `(${bookings.filter(b=>b.paymentStatus==="rejected").length})`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <p style={{ color:"rgba(255,255,255,0.35)", textAlign:"center", padding:"40px" }}>No bookings found</p>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {filtered.map(b => (
                    <div key={b.bookingId} style={{ ...CARD, borderRadius:"14px", padding:"18px 20px" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:"14px", alignItems:"center", flexWrap:"wrap" }}>
                            {/* Room info */}
                            <div>
                                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 3px" }}>Room</p>
                                <p style={{ color:"white", fontWeight:600, margin:0 }}>{b.room.roomType}</p>
                                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", margin:"2px 0 0" }}>{b.room.hotelName} · Room {b.room.roomNumber}</p>
                            </div>
                            {/* Dates & guest */}
                            <div>
                                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 3px" }}>Stay</p>
                                <p style={{ color:"white", fontSize:"13px", margin:0 }}>{new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}</p>
                                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", margin:"2px 0 0" }}>{b.numberOfNights} night{b.numberOfNights>1?"s":""} · {b.numberOfGuests} guest{b.numberOfGuests>1?"s":""}</p>
                            </div>
                            {/* Amount & status */}
                            <div>
                                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 3px" }}>Amount</p>
                                <p style={{ color:"#F5A623", fontWeight:700, fontFamily:"monospace", margin:0 }}>LKR {b.totalAmount?.toLocaleString()}</p>
                                <span style={{ display:"inline-block", marginTop:"4px", padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:700,
                                    background: b.isApproved ? "rgba(52,211,153,0.15)" : b.paymentStatus==="rejected" ? "rgba(248,113,113,0.15)" : "rgba(251,191,36,0.15)",
                                    color: b.isApproved ? "#34d399" : b.paymentStatus==="rejected" ? "#f87171" : "#fbbf24",
                                    border: `1px solid ${b.isApproved ? "rgba(52,211,153,0.3)" : b.paymentStatus==="rejected" ? "rgba(248,113,113,0.3)" : "rgba(251,191,36,0.3)"}` }}>
                                    {b.isApproved ? "Approved" : b.paymentStatus==="rejected" ? "Rejected" : "Pending"}
                                </span>
                            </div>
                            {/* Actions */}
                            {!b.isApproved && b.paymentStatus !== "rejected" && (
                                <div style={{ display:"flex", gap:"8px" }}>
                                    <button onClick={() => handleApprove(b.bookingId)} style={{ background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.3)", color:"#34d399", borderRadius:"8px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:700 }}>✓ Approve</button>
                                    <button onClick={() => handleReject(b.bookingId)}  style={{ background:"rgba(248,113,113,0.15)", border:"1px solid rgba(248,113,113,0.3)", color:"#f87171",  borderRadius:"8px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:700 }}>✗ Reject</button>
                                </div>
                            )}
                        </div>
                        {/* Slip + email */}
                        <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:"16px", fontSize:"12px", color:"rgba(255,255,255,0.35)" }}>
                            <span>📧 {b.email}</span>
                            <span>🆔 {b.bookingId}</span>
                            <span>💳 {b.paymentMethod === "bank_deposit" ? "Bank Deposit" : "Online"}</span>
                            {b.paymentSlip && <a href={b.paymentSlip} target="_blank" rel="noreferrer" style={{ color:"#F5A623" }}>View Slip ↗</a>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Admin Room Page ───────────────────────────────────
export default function AdminRoomPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("rooms"); // "rooms" | "bookings"
    const [showForm, setShowForm] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => { if (tab === "rooms") loadRooms(); }, [tab]);

    async function loadRooms() {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE}/api/rooms`, { headers: authHeader() });
            setRooms(res.data);
        } catch (e) {
            toast.error("Failed to load rooms");
        }
        setLoading(false);
    }

    async function handleDelete(key) {
        if (!window.confirm("Delete this room?")) return;
        try {
            await axios.delete(`${BASE}/api/rooms/${key}`, { headers: authHeader() });
            toast.success("Room deleted");
            loadRooms();
        } catch (e) { toast.error("Failed to delete room"); }
    }

    function openAdd()      { setEditRoom(null); setShowForm(true); }
    function openEdit(room) { setEditRoom(room); setShowForm(true); }
    function onSaved()      { setShowForm(false); loadRooms(); }

    const filtered = rooms.filter(r =>
        r.roomType?.toLowerCase().includes(search.toLowerCase()) ||
        r.hotelName?.toLowerCase().includes(search.toLowerCase()) ||
        r.key?.toLowerCase().includes(search.toLowerCase())
    );

    const statusColor = { Available:"#34d399", Booked:"#f87171", Maintenance:"#fbbf24" };

    return (
        <div style={{ ...BG, padding:"28px" }}>
            <style>{FONTS}</style>

            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
                <div>
                    <h1 className="font-display" style={{ fontSize:"28px", color:"white", margin:"0 0 4px" }}>Room Management</h1>
                    <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", margin:0 }}>Manage rooms and booking requests</p>
                </div>
                {tab === "rooms" && (
                    <button onClick={openAdd} style={BTN_GOLD}>+ Add Room</button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", gap:"4px", marginBottom:"22px", background:"rgba(255,255,255,0.04)", padding:"4px", borderRadius:"12px", width:"fit-content" }}>
                {[["rooms","🛏 Rooms"], ["bookings","📋 Bookings"]].map(([t, label]) => (
                    <button key={t} onClick={() => setTab(t)} style={{ padding:"9px 22px", borderRadius:"9px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:600, background: tab===t ? "linear-gradient(135deg,#F5A623,#FFB84D)" : "transparent", color: tab===t ? "#1a0f00" : "rgba(255,255,255,0.5)", transition:"all 0.2s" }}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Rooms Tab */}
            {tab === "rooms" && (
                <>
                    {/* Search */}
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by room type, hotel or key…" style={{ ...INPUT, maxWidth:"340px", marginBottom:"18px" }} />

                    {loading ? (
                        <p style={{ color:"rgba(255,255,255,0.4)", textAlign:"center", padding:"40px" }}>Loading rooms…</p>
                    ) : (
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:"14px" }}>
                            {filtered.map(room => (
                                <div key={room.key} style={{ ...CARD, borderRadius:"16px", overflow:"hidden" }}>
                                    {/* Image */}
                                    <div style={{ height:"160px", overflow:"hidden", position:"relative" }}>
                                        <img src={room.images[0]} alt={room.roomType} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.8 }} />
                                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(6,9,20,0.7) 0%, transparent 60%)" }} />
                                        <span style={{ position:"absolute", top:"10px", right:"10px", padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:700, background:`rgba(${room.status==="Available"?"52,211,153":room.status==="Booked"?"248,113,113":"251,191,36"},0.15)`, color: statusColor[room.status] || "white", border:`1px solid rgba(${room.status==="Available"?"52,211,153":room.status==="Booked"?"248,113,113":"251,191,36"},0.3)` }}>
                                            {room.status}
                                        </span>
                                        <div style={{ position:"absolute", bottom:"10px", left:"12px" }}>
                                            <p style={{ color:"#F5A623", fontWeight:700, fontFamily:"monospace", margin:0, fontSize:"15px" }}>LKR {room.price?.toLocaleString()}<span style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", fontWeight:400 }}>/night</span></p>
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div style={{ padding:"14px 16px" }}>
                                        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 2px" }}>{room.hotelName}</p>
                                        <h3 style={{ color:"white", fontWeight:600, margin:"0 0 4px", fontSize:"15px" }}>{room.roomType} · Room {room.roomNumber}</h3>
                                        <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", margin:"0 0 10px" }}>Key: {room.key} · Max {room.capacity} guests</p>
                                        <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", marginBottom:"12px" }}>
                                            {Object.entries(room.facilities || {}).filter(([,v])=>v).map(([k]) => (
                                                <span key={k} style={{ padding:"3px 9px", borderRadius:"8px", fontSize:"10px", fontWeight:700, background:"rgba(245,166,35,0.1)", color:"#FCD34D", border:"1px solid rgba(245,166,35,0.2)" }}>{FACILITY_LABELS[k]}</span>
                                            ))}
                                        </div>
                                        <div style={{ display:"flex", gap:"8px" }}>
                                            <button onClick={() => openEdit(room)} style={{ ...BTN_GHOST, flex:1, fontSize:"12px", padding:"8px" }}>✏ Edit</button>
                                            <button onClick={() => handleDelete(room.key)} style={{ background:"rgba(248,113,113,0.1)", color:"#f87171", border:"1px solid rgba(248,113,113,0.25)", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>🗑</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <p style={{ color:"rgba(255,255,255,0.3)", gridColumn:"1/-1", textAlign:"center", padding:"40px" }}>No rooms found</p>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Bookings Tab */}
            {tab === "bookings" && <BookingsTab />}

            {/* Form Modal */}
            {showForm && <RoomFormModal room={editRoom} onClose={() => setShowForm(false)} onSaved={onSaved} />}
        </div>
    );
}