import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL;
const getToken   = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

/* ── theme ── */
const BG     = "#f4f6fb";
const CARD   = "#ffffff";
const AMBER  = "#F5A623";
const AMBERT = "#FFB84D";
const TEXT   = "#1e2230";
const MUTED  = "#6b7280";
const BORDER = "#e5e7eb";

const inp = { background:"#f9fafb", border:`1.5px solid ${BORDER}`, color:TEXT, width:"100%", padding:"10px 14px", borderRadius:"10px", fontSize:"14px", outline:"none" };
const goldBtn  = { background:`linear-gradient(135deg,${AMBER},${AMBERT})`, color:"#fff", fontWeight:700, border:"none", borderRadius:"10px", padding:"10px 22px", cursor:"pointer", fontSize:"14px" };
const ghostBtn = { background:"#f3f4f6", color:MUTED, border:`1px solid ${BORDER}`, borderRadius:"10px", padding:"10px 22px", cursor:"pointer", fontSize:"14px" };

const ROOM_TYPES    = ["Standard","Deluxe","Suite","Family Suite","Pool Villa","Garden Cottage"];
const FAC_KEYS      = ["ac","wifi","parking","tv","hotWater","miniBar"];
const FAC_LABELS    = { ac:"AC", wifi:"WiFi", parking:"Parking", tv:"Smart TV", hotWater:"Hot Water", miniBar:"Mini Bar" };
const FAC_ICONS     = { ac:"❄️", wifi:"📶", parking:"🅿️", tv:"📺", hotWater:"🚿", miniBar:"🍾" };
const AMENITY_KEYS  = ["pool","spa","gym","restaurant","bar","beachAccess"];
const AMENITY_LABELS= { pool:"Pool", spa:"Spa", gym:"Gym", restaurant:"Restaurant", bar:"Bar", beachAccess:"Beach Access" };
const AMENITY_ICONS = { pool:"🏊", spa:"💆", gym:"🏋️", restaurant:"🍽️", bar:"🍸", beachAccess:"🏖️" };
const STATUS_COLORS = { Available:{ bg:"#d1fae5", text:"#065f46" }, Booked:{ bg:"#fee2e2", text:"#991b1b" }, Maintenance:{ bg:"#fef3c7", text:"#92400e" } };

function genHotelId() { return `HTL-${Date.now().toString().slice(-4)}${Math.random().toString(36).slice(2,5).toUpperCase()}`; }
function genRoomKey()  { return `RM-${Date.now().toString().slice(-4)}${Math.random().toString(36).slice(2,4).toUpperCase()}`; }

function Label({ children }) {
    return <label style={{ fontSize:"11px", color:MUTED, textTransform:"uppercase", letterSpacing:"1px", display:"block", marginBottom:"6px", fontWeight:600 }}>{children}</label>;
}

/* ══════════════════════════════════════════════════
   HOTEL FORM MODAL
══════════════════════════════════════════════════ */
function HotelFormModal({ hotel, onClose, onSaved }) {
    const isEdit = !!hotel;
    const [form, setForm] = useState(hotel
        ? { ...hotel, images: hotel.images?.length ? hotel.images : [""] }
        : { hotelId: genHotelId(), name:"", location:"", description:"", starRating:3, contactEmail:"", contactPhone:"", amenities:{ pool:false, spa:false, gym:false, restaurant:false, bar:false, beachAccess:false }, images:[""], isActive:true });
    const [saving, setSaving] = useState(false);

    const set  = (k,v) => setForm(f => ({ ...f, [k]:v }));
    const setA = (k,v) => setForm(f => ({ ...f, amenities:{ ...f.amenities, [k]:v } }));
    const setImg = (i,v) => { const imgs=[...form.images]; imgs[i]=v; setForm(f=>({...f,images:imgs})); };

    async function save() {
        if (!form.name || !form.location || !form.description) { toast.error("Fill all required fields"); return; }
        setSaving(true);
        try {
            const payload = { ...form, starRating:Number(form.starRating), images:form.images.filter(Boolean) };
            if (isEdit) { await axios.put(`${BASE}/api/hotels/${form.hotelId}`, payload, { headers:authHeader() }); toast.success("Hotel updated"); }
            else        { await axios.post(`${BASE}/api/hotels`, payload, { headers:authHeader() }); toast.success("Hotel added"); }
            onSaved();
        } catch(e) { toast.error(e.response?.data?.message || "Failed to save hotel"); }
        setSaving(false);
    }

    return (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", backdropFilter:"blur(4px)" }}>
            <div style={{ background:CARD, borderRadius:"20px", width:"100%", maxWidth:"700px", maxHeight:"92vh", overflowY:"auto", padding:"28px", boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>

                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
                    <div>
                        <h2 style={{ fontSize:"22px", color:TEXT, margin:"0 0 4px", fontWeight:700 }}>{isEdit ? "✏️ Edit Hotel" : "🏨 Add New Hotel"}</h2>
                        <p style={{ color:MUTED, fontSize:"13px", margin:0 }}>{isEdit ? "Update hotel details" : "Fill in the details to add a new hotel"}</p>
                    </div>
                    <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", color:MUTED, borderRadius:"10px", width:"36px", height:"36px", cursor:"pointer", fontSize:"20px" }}>×</button>
                </div>

                {/* Hotel ID pill */}
                <div style={{ marginBottom:"20px", padding:"10px 16px", borderRadius:"10px", background:"#fffbeb", border:"1.5px solid #fde68a", display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontSize:"11px", color:"#92400e", textTransform:"uppercase", letterSpacing:"1px", fontWeight:700 }}>Hotel ID</span>
                    <span style={{ fontFamily:"monospace", fontSize:"13px", color:AMBER, fontWeight:700 }}>{form.hotelId}</span>
                    <span style={{ fontSize:"11px", color:MUTED, marginLeft:"auto" }}>Auto-generated</span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                    <div>
                        <Label>Hotel Name *</Label>
                        <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Amaya Hills" style={inp}/>
                    </div>
                    <div>
                        <Label>Location *</Label>
                        <input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Kandy, Sri Lanka" style={inp}/>
                    </div>
                    <div>
                        <Label>Star Rating</Label>
                        <select value={form.starRating} onChange={e=>set("starRating",e.target.value)} style={inp}>
                            {[1,2,3,4,5].map(s=><option key={s} value={s}>{s} Star{s>1?"s":""}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Contact Email</Label>
                        <input type="email" value={form.contactEmail} onChange={e=>set("contactEmail",e.target.value)} placeholder="info@hotel.com" style={inp}/>
                    </div>
                    <div>
                        <Label>Contact Phone</Label>
                        <input value={form.contactPhone} onChange={e=>set("contactPhone",e.target.value)} placeholder="+94 11 234 5678" style={inp}/>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", paddingTop:"22px" }}>
                        <input type="checkbox" id="hotelActive" checked={form.isActive} onChange={e=>set("isActive",e.target.checked)} style={{ width:"18px", height:"18px", accentColor:AMBER, cursor:"pointer" }}/>
                        <label htmlFor="hotelActive" style={{ color:TEXT, fontSize:"14px", cursor:"pointer", fontWeight:500 }}>Hotel is Active & Visible</label>
                    </div>
                </div>

                <div style={{ marginTop:"16px" }}>
                    <Label>Description *</Label>
                    <textarea value={form.description} rows={3} onChange={e=>set("description",e.target.value)} placeholder="Describe the hotel…" style={{ ...inp, resize:"vertical", lineHeight:"1.6" }}/>
                </div>

                {/* Amenities */}
                <div style={{ marginTop:"20px" }}>
                    <Label>Amenities</Label>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
                        {AMENITY_KEYS.map(k => (
                            <label key={k} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 14px", borderRadius:"10px", cursor:"pointer",
                                background:form.amenities[k]?"#fffbeb":"#f9fafb",
                                border:`1.5px solid ${form.amenities[k]?"#fde68a":BORDER}`,
                                color:form.amenities[k]?"#92400e":MUTED, fontSize:"13px", fontWeight:600 }}>
                                <input type="checkbox" checked={form.amenities[k]} onChange={e=>setA(k,e.target.checked)} style={{ display:"none" }}/>
                                {AMENITY_ICONS[k]} {AMENITY_LABELS[k]}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Image URLs */}
                <div style={{ marginTop:"20px" }}>
                    <Label>Image URLs</Label>
                    {form.images.map((img,i) => (
                        <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                            <input value={img} onChange={e=>setImg(i,e.target.value)} placeholder="https://…" style={{ ...inp, flex:1 }}/>
                            {form.images.length>1 && <button onClick={()=>setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))} style={{ ...ghostBtn, padding:"10px 14px" }}>×</button>}
                        </div>
                    ))}
                    <button onClick={()=>setForm(f=>({...f,images:[...f.images,""]}))} style={{ ...ghostBtn, fontSize:"12px", padding:"7px 14px" }}>+ Add Image URL</button>
                </div>

                <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"24px", paddingTop:"20px", borderTop:`1px solid ${BORDER}` }}>
                    <button onClick={onClose} style={ghostBtn}>Cancel</button>
                    <button onClick={save} disabled={saving} style={{ ...goldBtn, opacity:saving?0.7:1 }}>
                        {saving ? "Saving…" : isEdit ? "Update Hotel" : "Add Hotel"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   ROOM FORM MODAL
══════════════════════════════════════════════════ */
function RoomFormModal({ room, hotels, preselectedHotel, onClose, onSaved }) {
    const isEdit = !!room;
    const [form, setForm] = useState(room || {
        key: genRoomKey(), roomNumber:"", hotelName: preselectedHotel || "",
        roomType:"Standard", description:"", price:"", capacity:2,
        availability:true, status:"Available",
        facilities:{ ac:false, wifi:true, parking:false, tv:false, hotWater:true, miniBar:false },
        images:[""]
    });
    const [saving, setSaving] = useState(false);

    const set  = (k,v) => setForm(f=>({...f,[k]:v}));
    const setF = (k,v) => setForm(f=>({...f,facilities:{...f.facilities,[k]:v}}));
    const setImg=(i,v)=>{ const imgs=[...form.images]; imgs[i]=v; setForm(f=>({...f,images:imgs})); };

    async function save() {
        if (!form.roomNumber || !form.hotelName || !form.price) { toast.error("Fill all required fields"); return; }
        setSaving(true);
        try {
            const payload = { ...form, price:Number(form.price), capacity:Number(form.capacity), images:form.images.filter(Boolean) };
            if (isEdit) { await axios.put(`${BASE}/api/rooms/${form.key}`, payload, { headers:authHeader() }); toast.success("Room updated"); }
            else        { await axios.post(`${BASE}/api/rooms`, payload, { headers:authHeader() }); toast.success("Room added"); }
            onSaved();
        } catch(e) { toast.error(e.response?.data?.message || "Failed to save room"); }
        setSaving(false);
    }

    return (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", backdropFilter:"blur(4px)" }}>
            <div style={{ background:CARD, borderRadius:"20px", width:"100%", maxWidth:"680px", maxHeight:"92vh", overflowY:"auto", padding:"28px", boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
                    <div>
                        <h2 style={{ fontSize:"22px", color:TEXT, margin:"0 0 4px", fontWeight:700 }}>{isEdit ? "✏️ Edit Room" : "🛏 Add New Room"}</h2>
                        {preselectedHotel && !isEdit && <p style={{ color:AMBER, fontSize:"13px", margin:0, fontWeight:600 }}>🏨 {preselectedHotel}</p>}
                    </div>
                    <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", color:MUTED, borderRadius:"10px", width:"36px", height:"36px", cursor:"pointer", fontSize:"20px" }}>×</button>
                </div>

                {/* Room Key pill */}
                <div style={{ marginBottom:"20px", padding:"10px 16px", borderRadius:"10px", background:"#fffbeb", border:"1.5px solid #fde68a", display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontSize:"11px", color:"#92400e", textTransform:"uppercase", letterSpacing:"1px", fontWeight:700 }}>Room Key</span>
                    <span style={{ fontFamily:"monospace", fontSize:"13px", color:AMBER, fontWeight:700 }}>{form.key}</span>
                    <span style={{ fontSize:"11px", color:MUTED, marginLeft:"auto" }}>Auto-generated</span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                    <div>
                        <Label>Room Number *</Label>
                        <input value={form.roomNumber} onChange={e=>set("roomNumber",e.target.value)} placeholder="e.g. 101" style={inp}/>
                    </div>
                    <div>
                        <Label>Hotel *</Label>
                        <select value={form.hotelName} onChange={e=>set("hotelName",e.target.value)} style={inp}>
                            <option value="">Select hotel…</option>
                            {hotels.map(h=><option key={h.hotelId} value={h.name}>{h.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Room Type</Label>
                        <select value={form.roomType} onChange={e=>set("roomType",e.target.value)} style={inp}>
                            {ROOM_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Price per Night (LKR) *</Label>
                        <input type="number" value={form.price} onChange={e=>set("price",e.target.value)} placeholder="18500" style={inp}/>
                    </div>
                    <div>
                        <Label>Max Capacity (guests)</Label>
                        <input type="number" min="1" max="10" value={form.capacity} onChange={e=>set("capacity",e.target.value)} style={inp}/>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <select value={form.status} onChange={e=>set("status",e.target.value)} style={inp}>
                            <option value="Available">Available</option>
                            {isEdit && <option value="Booked">Booked</option>}
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop:"16px" }}>
                    <Label>Description</Label>
                    <textarea value={form.description} rows={2} onChange={e=>set("description",e.target.value)} placeholder="Describe the room…" style={{ ...inp, resize:"vertical", lineHeight:"1.6" }}/>
                </div>

                {/* Facilities */}
                <div style={{ marginTop:"20px" }}>
                    <Label>Facilities</Label>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
                        {FAC_KEYS.map(k=>(
                            <label key={k} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 14px", borderRadius:"10px", cursor:"pointer",
                                background:form.facilities[k]?"#fffbeb":"#f9fafb",
                                border:`1.5px solid ${form.facilities[k]?"#fde68a":BORDER}`,
                                color:form.facilities[k]?"#92400e":MUTED, fontSize:"13px", fontWeight:600 }}>
                                <input type="checkbox" checked={form.facilities[k]} onChange={e=>setF(k,e.target.checked)} style={{ display:"none" }}/>
                                {FAC_ICONS[k]} {FAC_LABELS[k]}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div style={{ marginTop:"20px" }}>
                    <Label>Image URLs</Label>
                    {form.images.map((img,i)=>(
                        <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                            <input value={img} onChange={e=>setImg(i,e.target.value)} placeholder="https://…" style={{ ...inp, flex:1 }}/>
                            {form.images.length>1 && <button onClick={()=>setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))} style={{ ...ghostBtn, padding:"10px 14px" }}>×</button>}
                        </div>
                    ))}
                    <button onClick={()=>setForm(f=>({...f,images:[...f.images,""]}))} style={{ ...ghostBtn, fontSize:"12px", padding:"7px 14px" }}>+ Add Image URL</button>
                </div>

                <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"24px", paddingTop:"20px", borderTop:`1px solid ${BORDER}` }}>
                    <button onClick={onClose} style={ghostBtn}>Cancel</button>
                    <button onClick={save} disabled={saving} style={{ ...goldBtn, opacity:saving?0.7:1 }}>
                        {saving ? "Saving…" : isEdit ? "Update Room" : "Add Room"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   HOTEL CARD with its rooms inline
══════════════════════════════════════════════════ */
function HotelCard({ hotel, rooms, onEditHotel, onDeleteHotel, onAddRoom, onEditRoom, onDeleteRoom }) {
    const [expanded, setExpanded] = useState(true);
    const hotelRooms = rooms.filter(r => r.hotelName === hotel.name);
    const stars = "★".repeat(hotel.starRating) + "☆".repeat(5 - hotel.starRating);

    return (
        <div style={{ background:CARD, borderRadius:"20px", overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.07)", border:`1px solid ${BORDER}`, marginBottom:"24px" }}>

            {/* Hotel header */}
            <div style={{ position:"relative", height:"200px", overflow:"hidden" }}>
                <img src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"} alt={hotel.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    onError={e=>e.target.src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)" }}/>

                {/* Active badge */}
                <span style={{ position:"absolute", top:"14px", right:"14px", padding:"5px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:700,
                    background:hotel.isActive?"#d1fae5":"#fee2e2", color:hotel.isActive?"#065f46":"#991b1b" }}>
                    {hotel.isActive ? "● Active" : "● Inactive"}
                </span>

                {/* Stars */}
                <div style={{ position:"absolute", bottom:"14px", left:"16px" }}>
                    <span style={{ color:"#FBBF24", fontSize:"16px", letterSpacing:"2px" }}>{stars}</span>
                </div>
            </div>

            {/* Hotel info */}
            <div style={{ padding:"18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div>
                        <p style={{ color:MUTED, fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 3px", fontWeight:600 }}>{hotel.location}</p>
                        <h3 style={{ color:TEXT, fontWeight:700, margin:"0 0 3px", fontSize:"20px" }}>{hotel.name}</h3>
                        <p style={{ color:MUTED, fontSize:"12px", margin:0 }}>ID: {hotel.hotelId} · {hotel.starRating}-Star · {hotelRooms.length} room{hotelRooms.length!==1?"s":""}</p>
                    </div>
                    <div style={{ display:"flex", gap:"8px" }}>
                        <button onClick={()=>onEditHotel(hotel)} style={{ ...ghostBtn, padding:"8px 14px", fontSize:"12px" }}>✏ Edit</button>
                        <button onClick={()=>onDeleteHotel(hotel.hotelId)} style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>🗑</button>
                    </div>
                </div>

                {/* Amenities */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"16px" }}>
                    {Object.entries(hotel.amenities||{}).filter(([,v])=>v).map(([k])=>(
                        <span key={k} style={{ padding:"4px 12px", borderRadius:"8px", fontSize:"11px", fontWeight:700, background:"#fffbeb", color:"#92400e", border:"1px solid #fde68a" }}>
                            {AMENITY_ICONS[k]} {AMENITY_LABELS[k]}
                        </span>
                    ))}
                </div>

                {/* Rooms section */}
                <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:"16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
                        <button onClick={()=>setExpanded(e=>!e)} style={{ background:"none", border:"none", cursor:"pointer", color:TEXT, fontWeight:700, fontSize:"14px", display:"flex", alignItems:"center", gap:"6px", padding:0 }}>
                            🛏 Rooms ({hotelRooms.length}) {expanded ? "▲" : "▼"}
                        </button>
                        <button onClick={()=>onAddRoom(hotel.name)} style={{ ...goldBtn, padding:"7px 16px", fontSize:"12px" }}>
                            + Add Room
                        </button>
                    </div>

                    {expanded && hotelRooms.length === 0 && (
                        <div style={{ textAlign:"center", padding:"24px", borderRadius:"12px", background:"#f9fafb", border:`1px dashed ${BORDER}` }}>
                            <p style={{ color:MUTED, margin:"0 0 10px", fontSize:"14px" }}>No rooms added yet</p>
                            <button onClick={()=>onAddRoom(hotel.name)} style={{ ...goldBtn, padding:"8px 18px", fontSize:"13px" }}>+ Add First Room</button>
                        </div>
                    )}

                    {expanded && hotelRooms.length > 0 && (
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"12px" }}>
                            {hotelRooms.map(room => {
                                const sc = STATUS_COLORS[room.status] || STATUS_COLORS.Available;
                                return (
                                    <div key={room.key} style={{ background:"#f9fafb", borderRadius:"14px", overflow:"hidden", border:`1px solid ${BORDER}` }}>
                                        <div style={{ position:"relative", height:"140px", overflow:"hidden" }}>
                                            <img src={room.images?.[0]} alt={room.roomType}
                                                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                                                onError={e=>e.target.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80"}/>
                                            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)" }}/>
                                            {/* Status badge */}
                                            <span style={{ position:"absolute", top:"8px", left:"8px", padding:"3px 10px", borderRadius:"20px", fontSize:"10px", fontWeight:700, background:sc.bg, color:sc.text }}>
                                                ● {room.status}
                                            </span>
                                            {/* Room type badge */}
                                            <span style={{ position:"absolute", top:"8px", right:"8px", padding:"3px 10px", borderRadius:"20px", fontSize:"10px", fontWeight:700, background:`linear-gradient(135deg,${AMBER},${AMBERT})`, color:"#1C1917" }}>
                                                {room.roomType}
                                            </span>
                                            <div style={{ position:"absolute", bottom:"8px", left:"10px" }}>
                                                <span style={{ color:"white", fontWeight:700, fontSize:"14px", textShadow:"0 1px 4px rgba(0,0,0,0.5)" }}>
                                                    LKR {room.price?.toLocaleString()}<span style={{ fontSize:"10px", fontWeight:400 }}>/night</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ padding:"12px 14px" }}>
                                            <p style={{ color:TEXT, fontWeight:700, margin:"0 0 2px", fontSize:"14px" }}>Room {room.roomNumber}</p>
                                            <p style={{ color:MUTED, fontSize:"12px", margin:"0 0 8px" }}>Max {room.capacity} guests · {room.key}</p>
                                            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"10px" }}>
                                                {Object.entries(room.facilities||{}).filter(([,v])=>v).slice(0,4).map(([k])=>(
                                                    <span key={k} style={{ padding:"2px 8px", borderRadius:"6px", fontSize:"10px", fontWeight:700, background:"#fffbeb", color:"#92400e" }}>
                                                        {FAC_ICONS[k]} {FAC_LABELS[k]}
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ display:"flex", gap:"6px" }}>
                                                <button onClick={()=>onEditRoom(room)} style={{ ...ghostBtn, flex:1, fontSize:"11px", padding:"6px" }}>✏ Edit</button>
                                                <button onClick={()=>onDeleteRoom(room.key)} style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:"8px", padding:"6px 12px", cursor:"pointer", fontSize:"11px", fontWeight:600 }}>🗑</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   BOOKINGS PANEL
══════════════════════════════════════════════════ */
function BookingsPanel() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading]  = useState(true);
    const [filter, setFilter]    = useState("all");

    useEffect(() => { load(); }, []);

    async function load() {
        try { const r = await axios.get(`${BASE}/api/rooms/bookings/all`, { headers:authHeader() }); setBookings(r.data); }
        catch { toast.error("Failed to load bookings"); }
        setLoading(false);
    }

    async function approve(id) {
        try { await axios.put(`${BASE}/api/rooms/bookings/${id}/approve`, {}, { headers:authHeader() }); toast.success("Booking approved"); load(); }
        catch { toast.error("Failed"); }
    }
    async function reject(id) {
        try { await axios.put(`${BASE}/api/rooms/bookings/${id}/reject`, {}, { headers:authHeader() }); toast.success("Rejected"); load(); }
        catch { toast.error("Failed"); }
    }

    const counts = { all:bookings.length, pending:bookings.filter(b=>!b.isApproved&&b.paymentStatus!=="rejected").length, approved:bookings.filter(b=>b.isApproved).length, rejected:bookings.filter(b=>b.paymentStatus==="rejected").length };
    const shown  = filter==="all" ? bookings : filter==="pending" ? bookings.filter(b=>!b.isApproved&&b.paymentStatus!=="rejected") : filter==="approved" ? bookings.filter(b=>b.isApproved) : bookings.filter(b=>b.paymentStatus==="rejected");

    if (loading) return <div style={{ textAlign:"center", padding:"60px", color:MUTED }}>Loading bookings…</div>;

    return (
        <div>
            <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
                {["all","pending","approved","rejected"].map(f=>(
                    <button key={f} onClick={()=>setFilter(f)} style={{ padding:"8px 18px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:600, textTransform:"capitalize",
                        background:filter===f?`linear-gradient(135deg,${AMBER},${AMBERT})`:"#f3f4f6",
                        color:filter===f?"#fff":MUTED }}>
                        {f} ({counts[f]})
                    </button>
                ))}
            </div>

            {shown.length === 0 && <div style={{ textAlign:"center", padding:"60px", color:MUTED }}>No bookings found.</div>}

            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {shown.map(b => {
                    const isPending  = !b.isApproved && b.paymentStatus !== "rejected";
                    const statusBg   = b.isApproved ? "#d1fae5" : b.paymentStatus==="rejected" ? "#fee2e2" : "#fef3c7";
                    const statusColor= b.isApproved ? "#065f46" : b.paymentStatus==="rejected" ? "#991b1b" : "#92400e";
                    const statusText = b.isApproved ? "Approved" : b.paymentStatus==="rejected" ? "Rejected" : "Pending";
                    return (
                        <div key={b.bookingId} style={{ background:CARD, borderRadius:"16px", padding:"18px 20px", border:`1px solid ${BORDER}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:"16px", alignItems:"center" }}>
                                <div>
                                    <p style={{ color:MUTED, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 3px", fontWeight:600 }}>Room</p>
                                    <p style={{ color:TEXT, fontWeight:700, margin:"0 0 2px" }}>{b.room?.roomType}</p>
                                    <p style={{ color:MUTED, fontSize:"12px", margin:0 }}>{b.room?.hotelName} · Room {b.room?.roomNumber}</p>
                                </div>
                                <div>
                                    <p style={{ color:MUTED, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 3px", fontWeight:600 }}>Stay</p>
                                    <p style={{ color:TEXT, fontSize:"13px", fontWeight:600, margin:"0 0 2px" }}>{new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}</p>
                                    <p style={{ color:MUTED, fontSize:"12px", margin:0 }}>{b.numberOfNights} nights · {b.numberOfGuests} guests</p>
                                </div>
                                <div>
                                    <p style={{ color:MUTED, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 3px", fontWeight:600 }}>Amount</p>
                                    <p style={{ color:AMBER, fontWeight:700, fontFamily:"monospace", margin:"0 0 5px", fontSize:"15px" }}>LKR {b.totalAmount?.toLocaleString()}</p>
                                    <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:700, background:statusBg, color:statusColor }}>{statusText}</span>
                                </div>
                                {isPending && (
                                    <div style={{ display:"flex", gap:"8px" }}>
                                        <button onClick={()=>approve(b.bookingId)} style={{ background:"#d1fae5", color:"#065f46", border:"1px solid #6ee7b7", borderRadius:"8px", padding:"8px 14px", cursor:"pointer", fontSize:"12px", fontWeight:700 }}>✓ Approve</button>
                                        <button onClick={()=>reject(b.bookingId)}  style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:"8px", padding:"8px 14px", cursor:"pointer", fontSize:"12px", fontWeight:700 }}>✗ Reject</button>
                                    </div>
                                )}
                            </div>
                            <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:`1px solid ${BORDER}`, display:"flex", gap:"16px", fontSize:"12px", color:MUTED }}>
                                <span>📧 {b.email}</span>
                                <span>🆔 {b.bookingId}</span>
                                <span>💳 {b.paymentMethod==="bank_deposit"?"Bank Deposit":"Online"}</span>
                                {b.paymentSlip && <a href={b.paymentSlip} target="_blank" rel="noreferrer" style={{ color:AMBER, fontWeight:600 }}>View Slip ↗</a>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
export default function HotelRoomManagement() {
    const [tab, setTab]         = useState("hotels");
    const [hotels, setHotels]   = useState([]);
    const [rooms,  setRooms]    = useState([]);
    const [loadH,  setLoadH]    = useState(true);
    const [loadR,  setLoadR]    = useState(true);
    const [search, setSearch]   = useState("");

    // modals
    const [hotelModal, setHotelModal] = useState(null); // null | "add" | hotel
    const [roomModal,  setRoomModal]  = useState(null); // null | "add" | room
    const [preHotel,   setPreHotel]   = useState("");   // preselected hotel name for add room

    useEffect(() => { loadHotels(); loadRooms(); }, []);

    async function loadHotels() { setLoadH(true); try { const r=await axios.get(`${BASE}/api/hotels`,{headers:authHeader()}); setHotels(r.data); } catch{toast.error("Failed to load hotels");} setLoadH(false); }
    async function loadRooms()  { setLoadR(true); try { const r=await axios.get(`${BASE}/api/rooms`, {headers:authHeader()}); setRooms(r.data);  } catch{toast.error("Failed to load rooms");} setLoadR(false); }

    async function deleteHotel(id) {
        if (!window.confirm("Delete this hotel? Rooms will remain but won't be linked.")) return;
        try { await axios.delete(`${BASE}/api/hotels/${id}`,{headers:authHeader()}); toast.success("Hotel deleted"); loadHotels(); } catch { toast.error("Failed"); }
    }
    async function deleteRoom(key) {
        if (!window.confirm("Delete this room?")) return;
        try { await axios.delete(`${BASE}/api/rooms/${key}`,{headers:authHeader()}); toast.success("Room deleted"); loadRooms(); } catch { toast.error("Failed"); }
    }

    function openAddRoom(hotelName = "") { setPreHotel(hotelName); setRoomModal("add"); }

    const filteredHotels = hotels.filter(h =>
        h.name?.toLowerCase().includes(search.toLowerCase()) ||
        h.location?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding:"28px", minHeight:"100vh", fontFamily:"'Outfit','Jost',sans-serif", background:BG, color:TEXT }}>

            {/* Page header */}
            <div style={{ marginBottom:"28px" }}>
                <h1 style={{ fontSize:"28px", color:TEXT, margin:"0 0 4px", fontWeight:800 }}>🏨 Hotel & Room Management</h1>
                <p style={{ color:MUTED, fontSize:"14px", margin:0 }}>
                    Manage your hotels and rooms · <span style={{ color:AMBER, fontWeight:700 }}>{hotels.length}</span> hotels · <span style={{ color:AMBER, fontWeight:700 }}>{rooms.length}</span> rooms
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", gap:"4px", marginBottom:"28px", background:"#e5e7eb", padding:"4px", borderRadius:"14px", width:"fit-content" }}>
                {[["hotels","🏨 Hotels",hotels.length],["rooms","🛏 All Rooms",rooms.length],["bookings","📋 Bookings",null]].map(([t,label,count])=>(
                    <button key={t} onClick={()=>setTab(t)} style={{ padding:"10px 24px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:700,
                        background:tab===t?`linear-gradient(135deg,${AMBER},${AMBERT})`:"transparent",
                        color:tab===t?"#fff":MUTED, transition:"all 0.2s" }}>
                        {label}{count!==null?` (${count})`:""}
                    </button>
                ))}
            </div>

            {/* ── HOTELS TAB ── */}
            {tab === "hotels" && (
                <div>
                    <div style={{ display:"flex", gap:"12px", marginBottom:"24px", flexWrap:"wrap", alignItems:"center" }}>
                        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search hotels by name or location…"
                            style={{ ...inp, maxWidth:"320px" }}/>
                        <button onClick={()=>setHotelModal("add")} style={goldBtn}>+ Add Hotel</button>
                        <button onClick={()=>openAddRoom()} style={{ ...goldBtn, background:`linear-gradient(135deg,#6366f1,#8b5cf6)` }}>+ Add Room</button>
                    </div>

                    {loadH ? (
                        <div style={{ textAlign:"center", padding:"60px", color:MUTED }}>Loading hotels…</div>
                    ) : filteredHotels.length === 0 ? (
                        <div style={{ textAlign:"center", padding:"60px", borderRadius:"20px", background:CARD, border:`1px dashed ${BORDER}` }}>
                            <div style={{ fontSize:"48px", marginBottom:"16px" }}>🏨</div>
                            <p style={{ color:TEXT, fontSize:"18px", fontWeight:700, marginBottom:"8px" }}>No hotels yet</p>
                            <p style={{ color:MUTED, marginBottom:"20px" }}>Add your first hotel to get started</p>
                            <button onClick={()=>setHotelModal("add")} style={goldBtn}>+ Add Hotel</button>
                        </div>
                    ) : (
                        filteredHotels.map(hotel => (
                            <HotelCard key={hotel.hotelId} hotel={hotel} rooms={rooms}
                                onEditHotel={h=>setHotelModal(h)}
                                onDeleteHotel={deleteHotel}
                                onAddRoom={openAddRoom}
                                onEditRoom={r=>{ setPreHotel(""); setRoomModal(r); }}
                                onDeleteRoom={deleteRoom}
                            />
                        ))
                    )}
                </div>
            )}

            {/* ── ALL ROOMS TAB ── */}
            {tab === "rooms" && (
                <div>
                    <div style={{ display:"flex", gap:"12px", marginBottom:"24px", flexWrap:"wrap", alignItems:"center" }}>
                        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rooms…" style={{ ...inp, maxWidth:"280px" }}/>
                        <select onChange={e=>setSearch(e.target.value)} style={{ ...inp, maxWidth:"220px", width:"auto" }}>
                            <option value="">All Hotels</option>
                            {hotels.map(h=><option key={h.hotelId} value={h.name}>{h.name}</option>)}
                        </select>
                        <button onClick={()=>openAddRoom()} style={goldBtn}>+ Add Room</button>
                    </div>
                    {loadR ? <div style={{ textAlign:"center", padding:"60px", color:MUTED }}>Loading rooms…</div> : (
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"16px" }}>
                            {rooms.filter(r=>r.roomType?.toLowerCase().includes(search.toLowerCase())||r.hotelName?.toLowerCase().includes(search.toLowerCase())||!search).map(room=>{
                                const sc=STATUS_COLORS[room.status]||STATUS_COLORS.Available;
                                return (
                                    <div key={room.key} style={{ background:CARD, borderRadius:"16px", overflow:"hidden", border:`1px solid ${BORDER}`, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                                        <div style={{ position:"relative", height:"160px", overflow:"hidden" }}>
                                            <img src={room.images?.[0]} alt={room.roomType} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80"}/>
                                            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)" }}/>
                                            <span style={{ position:"absolute", top:"10px", left:"10px", padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:700, background:sc.bg, color:sc.text }}>● {room.status}</span>
                                            <span style={{ position:"absolute", top:"10px", right:"10px", padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:700, background:`linear-gradient(135deg,${AMBER},${AMBERT})`, color:"#1C1917" }}>{room.roomType}</span>
                                            <div style={{ position:"absolute", bottom:"10px", left:"12px" }}>
                                                <span style={{ color:"white", fontWeight:700, fontSize:"15px", textShadow:"0 1px 4px rgba(0,0,0,0.5)" }}>LKR {room.price?.toLocaleString()}<span style={{ fontSize:"11px", fontWeight:400 }}>/night</span></span>
                                            </div>
                                        </div>
                                        <div style={{ padding:"14px 16px" }}>
                                            <p style={{ color:MUTED, fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 2px", fontWeight:600 }}>{room.hotelName}</p>
                                            <h3 style={{ color:TEXT, fontWeight:700, margin:"0 0 3px", fontSize:"15px" }}>Room {room.roomNumber} · {room.roomType}</h3>
                                            <p style={{ color:MUTED, fontSize:"12px", margin:"0 0 10px" }}>Max {room.capacity} guests · {room.key}</p>
                                            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"12px" }}>
                                                {Object.entries(room.facilities||{}).filter(([,v])=>v).map(([k])=>(
                                                    <span key={k} style={{ padding:"3px 8px", borderRadius:"6px", fontSize:"10px", fontWeight:700, background:"#fffbeb", color:"#92400e" }}>{FAC_ICONS[k]} {FAC_LABELS[k]}</span>
                                                ))}
                                            </div>
                                            <div style={{ display:"flex", gap:"8px" }}>
                                                <button onClick={()=>{setPreHotel("");setRoomModal(room);}} style={{ ...ghostBtn, flex:1, fontSize:"12px", padding:"8px" }}>✏ Edit</button>
                                                <button onClick={()=>deleteRoom(room.key)} style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>🗑</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {tab === "bookings" && <BookingsPanel />}

            {/* Modals */}
            {hotelModal && (
                <HotelFormModal
                    hotel={hotelModal === "add" ? null : hotelModal}
                    onClose={()=>setHotelModal(null)}
                    onSaved={()=>{ setHotelModal(null); loadHotels(); }}
                />
            )}
            {roomModal && (
                <RoomFormModal
                    room={roomModal === "add" ? null : roomModal}
                    hotels={hotels}
                    preselectedHotel={preHotel}
                    onClose={()=>{ setRoomModal(null); setPreHotel(""); }}
                    onSaved={()=>{ setRoomModal(null); setPreHotel(""); loadRooms(); }}
                />
            )}
        </div>
    );
}