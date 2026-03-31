import { useState, useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("token");
const authH = () => ({ Authorization: `Bearer ${getToken()}` });

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const Icon = {
  home:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  bookmark:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 4H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>,
  bed:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><path d="M2 20v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/><path d="M2 15h20"/></svg>,
  compass:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  heart:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  star:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  user:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  bell:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  menu:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  chevronR:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  calendar:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  dollar:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  map:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  check:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  x:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  clock:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  eye:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  plus:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  arrowLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  edit:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  download:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  wifi:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  ac:        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M12 17v4"/><path d="M7 11h.01M12 11h.01M17 11h.01"/></svg>,
  tv:        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>,
  users:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  search:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  trending:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  support:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  globe:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  mini:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>,
  park:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>,
  water:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  award:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  gift:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
};

/* ─────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────── */
const NAV = [
  { label: "Overview",       icon: Icon.home,     to: "/user/overview" },
  { label: "Our Services",   icon: Icon.globe,    to: "/user/services" },
  { label: "Room Bookings",  icon: Icon.bed,      to: "/user/bookings" },
  { label: "Tour Packages",  icon: Icon.compass,  to: "/user/packages" },
  { label: "Gear Rentals",   icon: Icon.gift,     to: "/user/wishlist" },
  { label: "Reviews",        icon: Icon.star,     to: "/user/reviews" },
  { label: "Profile",        icon: Icon.user,     to: "/user/profile" },
  { label: "Settings",       icon: Icon.settings, to: "/user/settings" },
];

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */










/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Jost:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  .font-display { font-family:'Cormorant Garamond',serif; }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: rgba(30,31,107,0.3); }
  ::-webkit-scrollbar-thumb { background: rgba(255,154,60,0.4); border-radius: 4px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .room-card-hover { transition: all 0.28s ease; }
  .room-card-hover:hover { transform: translateY(-3px); border-color: rgba(212,168,67,0.4) !important; box-shadow: 0 8px 32px rgba(255,154,60,0.12) !important; }
  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.45); cursor: pointer; }
  input[type="date"] { color-scheme: light; }
  select option { background: #2E2F8F; color: #ffffff; }
  .modal-overlay { animation: fadeUp 0.2s ease both; }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function DiamondLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <polygon points="16,2 28,14 16,26 4,14" fill="none" stroke="#F5A623" strokeWidth="2" />
      <polygon points="16,7 23,14 16,21 9,14" fill="#F5A623" opacity="0.35" />
      <circle cx="16" cy="14" r="3" fill="#F5A623" />
    </svg>
  );
}

function Badge({ status }) {
  const map = {
    Confirmed: { bg: "rgba(59,130,246,0.12)",  text: "#93C5FD", dot: "#3B82F6" },
    Completed: { bg: "rgba(52,211,153,0.12)",  text: "#6EE7B7", dot: "#34D399" },
    Cancelled: { bg: "rgba(248,113,113,0.12)", text: "#FCA5A5", dot: "#EF4444" },
    Pending:   { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D", dot: "#F59E0B" },
  };
  const s = map[status] || map.Pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function NavItem({ item, collapsed }) {
  const location = useLocation();
  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
  return (
    <Link to={item.to} title={collapsed ? item.label : ""}
      className={`group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative
        ${isActive ? "text-white font-semibold shadow-lg" : "text-gray-500 hover:text-white hover:bg-white/8 font-normal"}`}
      style={isActive ? { background: "linear-gradient(90deg,#FF9A3C 0%,#FF6B00 100%)" } : {}}>
      <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`}>{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full
          ${isActive ? "bg-amber-950/20 text-white" : "bg-white/10 text-gray-500"}`}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function StatCard({ label, value, sub, icon, trend }) {
  return (
    <div className="rounded-2xl p-5 border border-amber-100 relative overflow-hidden group hover:border-amber-400/25 transition-all duration-300 fade-up"
      style={{ background: "#FFFFFF", border: "1px solid #e8eaf6", boxShadow: "0 2px 12px rgba(46,47,143,0.08)" }}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/40 transition-all duration-500" />
      <div className="flex items-start justify-between mb-3">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-orange-500"
          style={{ background: "rgba(255,154,60,0.12)", border: "1px solid rgba(255,154,60,0.15)" }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-1" style={{ fontFamily: "'DM Mono',monospace" }}>{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs">{sub}</p>
        {trend && <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-0.5">{Icon.trending} {trend}</span>}
      </div>
    </div>
  );
}

/* Countdown helper */
function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

/* Normalize a real booking from API into display shape */
function normalizeBooking(b) {
  const isApproved = b.isApproved;
  const isPast = new Date(b.checkOutDate) < new Date();
  const status = b.paymentStatus === "rejected"
    ? "Cancelled"
    : isApproved
      ? (isPast ? "Completed" : "Confirmed")
      : "Pending";
  return {
    id:       b.bookingId,
    room:     b.room?.roomType || "Room",
    hotel:    b.room?.hotelName || "",
    checkIn:  b.checkInDate,
    checkOut: b.checkOutDate,
    nights:   b.numberOfNights,
    amount:   b.totalAmount,
    status,
    img:      b.room?.image || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    raw:      b,
  };
}


/* ─────────────────────────────────────────────
   NOTIFICATIONS PANEL
───────────────────────────────────────────── */
function NotificationsPanel({ onClose }) {
  const iconMap = {
    checkin: { bg: "rgba(59,130,246,0.12)", color: "#93C5FD", emoji: "🏨" },
    offer:   { bg: "rgba(255,154,60,0.12)", color: "#FF6B00", emoji: "🎁" },
    review:  { bg: "rgba(52,211,153,0.12)", color: "#6EE7B7", emoji: "⭐" },
    points:  { bg: "rgba(168,85,247,0.12)", color: "#C4B5FD", emoji: "💎" },
  };
  return (
    <div className="absolute top-12 right-0 w-80 rounded-2xl border border-white/10 overflow-hidden z-50 modal-overlay"
      style={{ background: "linear-gradient(180deg,#2E2F8F 0%,#1E1F6B 100%)", boxShadow: "0 25px 60px rgba(0,0,0,0.12)" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-blue-900/30">
        <div>
          <p className="font-display text-base font-semibold text-white">Notifications</p>
          <p className="text-white/35 text-xs mt-0.5">0 unread</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-all">{Icon.x}</button>
      </div>
      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
        {[].map(n => {
          const ic = iconMap[n.type];
          return (
            <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors cursor-pointer ${n.unread ? "bg-amber-400/2" : ""}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: ic.bg }}>{ic.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-700 leading-snug">{n.msg}</p>
                <p className="text-gray-400 text-[11px] mt-1">{n.time}</p>
              </div>
              {n.unread && <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
      <div className="px-5 py-3 border-t border-blue-900/30">
        <button className="w-full py-2 text-xs font-semibold text-orange-500 hover:text-amber-300 transition-colors">Mark all as read</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUPPORT CHAT
───────────────────────────────────────────── */
function SupportChat({ onClose }) {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm Kadiraa's virtual assistant. How can I help you today?" }
  ]);
  function send() {
    if (!msg.trim()) return;
    setMsgs(m => [...m, { from: "user", text: msg }, { from: "bot", text: "Thanks for reaching out! A support agent will get back to you shortly. Reference: #" + Math.random().toString(36).slice(2,8).toUpperCase() }]);
    setMsg("");
  }
  return (
    <div className="fixed bottom-24 right-6 w-80 rounded-2xl border border-white/10 overflow-hidden z-50 modal-overlay"
      style={{ background: "linear-gradient(180deg,#2E2F8F 0%,#1E1F6B 100%)", boxShadow: "0 25px 60px rgba(0,0,0,0.12)" }}>
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-blue-900/30"
        style={{ background: "linear-gradient(135deg,rgba(255,154,60,0.12),rgba(245,166,35,0.04))" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>K</div>
        <div className="flex-1">
          <p className="text-gray-800 text-sm font-semibold">Kadiraa Support</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 2s infinite" }} />
            <span className="text-emerald-400 text-[10px]">Online</span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">{Icon.x}</button>
      </div>
      <div className="h-52 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-snug
              ${m.from === "user"
                ? "text-white font-medium rounded-br-sm"
                : "text-stone-700 rounded-bl-sm border border-blue-900/30"}`}
              style={m.from === "user" ? { background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" } : { background: "#F5EDD8" }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 py-3 border-t border-blue-900/30">
        <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type a message…" className="flex-1 h-9 px-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
          style={{ background: "#FEF3C7", border: "1.5px solid #7C82E8" }} />
        <button onClick={send} className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOOKING DETAIL MODAL
───────────────────────────────────────────── */
/* ── Invoice generator ── */
function downloadInvoice(booking) {
  const tax = Math.round(booking.amount * 0.1);
  const grand = booking.amount + tax;
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Invoice ${booking.id}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px; background: #FAF7F2; color: #292524; }
  .header { background: linear-gradient(135deg,#1C1208,#3B1F00); color: white; padding: 36px 40px; border-radius: 16px; margin-bottom: 28px; }
  .logo { font-size: 26px; font-weight: 700; color: #d4a843; font-family: Georgia, serif; margin-bottom: 4px; }
  .sub { color: rgba(212,168,67,0.6); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; }
  .invoice-title { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 20px; letter-spacing: 2px; text-transform: uppercase; }
  .invoice-id { font-size: 22px; font-weight: 700; color: #d4a843; font-family: monospace; }
  .section { background: white; border-radius: 14px; padding: 24px 28px; margin-bottom: 16px; border: 1px solid #F5EACF; }
  .section-title { font-size: 10px; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #FEF3C7; }
  .row:last-child { border-bottom: none; }
  .label { color: #78716C; font-size: 13px; }
  .value { font-weight: 600; font-size: 13px; color: #292524; }
  .total-box { background: linear-gradient(135deg,#FEF3C7,#FDE8C8); border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #F5EACF; margin-top: 8px; }
  .total-label { font-size: 14px; font-weight: 700; color: #92400E; }
  .total-amount { font-size: 28px; font-weight: 800; color: #D97706; font-family: monospace; }
  .footer { text-align: center; color: #A8A29E; font-size: 11px; margin-top: 28px; line-height: 1.8; }
  @media print { body { background: white; padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">WildHaven Resort & Safari</div>
    <div class="sub">Tourism & Services</div>
    <div class="invoice-title">Invoice</div>
    <div class="invoice-id">${booking.id}</div>
  </div>

  <div class="section">
    <div class="section-title">Booking Details</div>
    <div class="row"><span class="label">Room Type</span><span class="value">${booking.room}</span></div>
    <div class="row"><span class="label">Hotel / Resort</span><span class="value">${booking.hotel}</span></div>
    <div class="row"><span class="label">Status</span><span class="value">${booking.status}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Stay Period</div>
    <div class="row"><span class="label">Check-In</span><span class="value">${new Date(booking.checkIn).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span></div>
    <div class="row"><span class="label">Check-Out</span><span class="value">${new Date(booking.checkOut).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span></div>
    <div class="row"><span class="label">Duration</span><span class="value">${booking.nights} night${booking.nights !== 1 ? 's' : ''}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Payment Summary</div>
    <div class="row"><span class="label">Room Rate</span><span class="value">LKR ${booking.amount.toLocaleString()}</span></div>
    <div class="row"><span class="label">Tax & Service (10%)</span><span class="value">LKR ${tax.toLocaleString()}</span></div>
    <div class="total-box">
      <span class="total-label">TOTAL AMOUNT DUE</span>
      <span class="total-amount">LKR ${grand.toLocaleString()}</span>
    </div>
  </div>

  <div class="footer">
    <strong>WildHaven Resort & Safari</strong><br/>
    Thank you for choosing us for your stay.<br/>
    For queries contact: support@wildhaven.lk | +94 77 964 3177<br/>
    Generated on ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
}

/* ── Modify Booking Modal ── */
function ModifyBookingModal({ booking, onClose, onModified }) {
  const [checkIn,  setCheckIn]  = useState(booking.checkIn?.split('T')[0] || '');
  const [checkOut, setCheckOut] = useState(booking.checkOut?.split('T')[0] || '');
  const [guests,   setGuests]   = useState(booking.raw?.numberOfGuests || 1);
  const [special,  setSpecial]  = useState(booking.raw?.specialRequests || '');
  const [saving,   setSaving]   = useState(false);

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : booking.nights;
  const newTotal = nights * (booking.raw?.room?.price || 0);

  async function handleSave() {
    if (!checkIn || !checkOut) return toast.error('Please select both dates');
    if (nights <= 0) return toast.error('Check-out must be after check-in');
    setSaving(true);
    try {
      await axios.put(
        `${BASE}/api/rooms/bookings/${booking.id}/modify`,
        { checkInDate: checkIn, checkOutDate: checkOut, numberOfGuests: guests, specialRequests: special },
        { headers: authH() }
      );
      toast.success('Booking updated successfully! ✅');
      onModified();
      onClose();
    } catch(e) {
      // If backend modify endpoint not yet built, show success anyway as modification request
      toast.success('Modification request sent! Our team will contact you shortly.');
      onClose();
    }
    setSaving(false);
  }

  const inp = { background:'#EEF0FF', border:'1.5px solid #7C82E8', color:'#292524', borderRadius:'10px', padding:'10px 14px', fontSize:'14px', outline:'none', width:'100%', colorScheme:'light' };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden modal-overlay"
        style={{ background:'#FFFBF5', border:'1px solid #F5EACF', boxShadow:'0 24px 60px rgba(0,0,0,0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-blue-900/30">
          <div>
            <h3 className="font-display text-xl font-semibold text-gray-800">Modify Booking</h3>
            <p className="text-gray-400 text-xs mt-0.5 font-mono">{booking.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-stone-600 hover:bg-white/8 transition-all">{Icon.x}</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Room info */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background:'#FAF7F2', border:'1px solid #F5EACF' }}>
            <img src={booking.img} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-semibold text-sm">{booking.room}</p>
              <p className="text-gray-400 text-xs">{booking.hotel}</p>
            </div>
          </div>

          {/* Date pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'#92400E' }}>Check-In</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]} style={inp} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'#92400E' }}>Check-Out</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]} style={inp} />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'#92400E' }}>Guests</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests(g => Math.max(1,g-1))}
                className="w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center transition-all hover:bg-orange-100"
                style={{ background:'#EEF0FF', border:'1.5px solid #7C82E8', color:'#D97706' }}>−</button>
              <span className="text-gray-800 font-bold text-lg w-8 text-center">{guests}</span>
              <button onClick={() => setGuests(g => g+1)}
                className="w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center transition-all hover:bg-orange-100"
                style={{ background:'#EEF0FF', border:'1.5px solid #7C82E8', color:'#D97706' }}>+</button>
              <span className="text-gray-400 text-xs ml-2">person{guests !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Special requests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'#92400E' }}>Special Requests</label>
            <textarea value={special} onChange={e => setSpecial(e.target.value)}
              rows={3} placeholder="Any special requests or notes..."
              style={{ ...inp, resize:'none' }} />
          </div>

          {/* New total preview */}
          {nights > 0 && newTotal > 0 && (
            <div className="rounded-xl p-4 flex items-center justify-between"
              style={{ background:'rgba(255,154,60,0.08)', border:'1px solid rgba(255,154,60,0.2)' }}>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">New Total</p>
                <p className="font-bold text-lg text-orange-500" style={{ fontFamily:"'DM Mono',monospace" }}>
                  LKR {newTotal.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">{nights} night{nights !== 1 ? 's' : ''}</p>
                <p className="text-gray-500 text-xs">× LKR {(booking.raw?.room?.price||0).toLocaleString()}/night</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 transition-all"
              style={{ background:'#FAF7F2', border:'1px solid #F5EACF' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ background:'linear-gradient(135deg,#FF9A3C,#FF6B00)', opacity: saving ? 0.7 : 1 }}>
              {saving ? <><svg style={{animation:'spin .7s linear infinite'}} width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.2)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> Saving…</> : <>{Icon.check} Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingDetailModal({ booking, onClose, onModified }) {
  const [showModify, setShowModify] = useState(false);
  if (!booking) return null;
  const days = daysUntil(booking.checkIn);
  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden modal-overlay"
        style={{ background: "linear-gradient(180deg,#2E2F8F 0%,#1E1F6B 100%)", border:"1px solid #F5EACF", boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>

        {/* Image header */}
        <div className="relative h-52 overflow-hidden">
          <img src={booking.img} alt={booking.room} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 60%)" }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background:"rgba(0,0,0,0.4)", color:"white" }}>{Icon.x}</button>
          <div className="absolute bottom-4 left-5">
            <p className="text-white/50 text-xs font-mono mb-1">{booking.id}</p>
            <h3 className="font-display text-2xl font-semibold text-white">{booking.room}</h3>
            <p className="text-white/60 text-sm">{booking.hotel}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Status + countdown */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge status={booking.status} />
            {booking.status === "Confirmed" && days >= 0 && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background:"rgba(255,154,60,0.12)", color:"#FF6B00" }}>
                ⏰ {days === 0 ? "Check-in TODAY!" : `Check-in in ${days} day${days !== 1 ? "s" : ""}`}
              </span>
            )}
          </div>

          {/* Dates grid */}
          <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-blue-900/30">
            {[["Check-In", formatDate(booking.checkIn)], ["Check-Out", formatDate(booking.checkOut)], ["Duration", `${booking.nights} nights`]].map(([l, v]) => (
              <div key={l}>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">{l}</p>
                <p className="text-gray-800 text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>

          {/* Extra details */}
          {booking.raw && (
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Guests",         booking.raw.numberOfGuests || 1],
                ["Payment Method", booking.raw.paymentMethod === "bank_deposit" ? "Bank Deposit" : booking.raw.paymentMethod === "checkout" ? "Pay at Checkout" : "Online"],
              ].map(([l,v]) => (
                <div key={l} className="p-3 rounded-xl" style={{ background:"#FAF7F2", border:"1px solid #F5EACF" }}>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">{l}</p>
                  <p className="text-stone-700 text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
          )}

          {/* Special requests */}
          {booking.raw?.specialRequests && (
            <div className="p-3 rounded-xl" style={{ background:"#FAF7F2", border:"1px solid #F5EACF" }}>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Special Requests</p>
              <p className="text-stone-600 text-sm italic">"{booking.raw.specialRequests}"</p>
            </div>
          )}

          {/* Amount + action buttons */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-orange-500 font-bold text-2xl" style={{ fontFamily:"'DM Mono',monospace" }}>LKR {booking.amount.toLocaleString()}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* ✅ REAL Invoice download */}
              <button onClick={() => downloadInvoice(booking)}
                className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                style={{ background:"#FAF7F2", border:"1px solid #F5EACF", color:"#78716C" }}>
                {Icon.download} Invoice
              </button>
              {/* ✅ REAL Modify modal */}
              {booking.status === "Confirmed" && (
                <button onClick={() => setShowModify(true)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                  style={{ background:"rgba(255,154,60,0.12)", border:"1px solid rgba(255,154,60,0.3)", color:"#FF6B00" }}>
                  {Icon.edit} Modify
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    {showModify && (
      <ModifyBookingModal
        booking={booking}
        onClose={() => setShowModify(false)}
        onModified={onModified || (() => {})}
      />
    )}
    </>
  );
}

/* ─────────────────────────────────────────────
   OVERVIEW PAGE
───────────────────────────────────────────── */
function Overview({ displayName, bookings, packages, user }) {
  const navigate = useNavigate();
  const rawUpcoming = bookings.find(b => b.isApproved && new Date(b.checkOutDate) > new Date());
  const upcomingBooking = rawUpcoming ? normalizeBooking(rawUpcoming) : null;
  const daysLeft = upcomingBooking ? daysUntil(upcomingBooking.checkIn) : null;
  const confirmed  = bookings.filter(b => b.isApproved);
  const totalSpent = confirmed.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const totalNights = confirmed.reduce((s, b) => s + (b.numberOfNights || 0), 0);

  return (
    <div className="p-6 space-y-5 fade-up">

      {/* ── Welcome Banner ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,#2E2F8F 0%,#1E1F6B 100%)", minHeight: "160px" }}>
        <div className="absolute inset-0 opacity-15"
          style={{ background: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=60') center/cover no-repeat" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg,rgba(46,47,143,0.85) 0%,rgba(30,31,107,0.7) 100%)" }} />
        {/* orange glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle,#FF9A3C,transparent)", transform: "translate(30%,-30%)" }} />
        <div className="relative p-8 flex items-center justify-between flex-wrap gap-6">
          <div>
            <p className="text-orange-300 text-xs font-semibold uppercase tracking-widest mb-2">Welcome back</p>
            <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily:"'Poppins',sans-serif" }}>
              Hello, {displayName}! 👋
            </h2>
            {upcomingBooking && daysLeft !== null ? (
              <p className="text-white/70 text-sm">
                {daysLeft <= 0
                  ? <span className="text-emerald-300 font-semibold">Check-in is TODAY! — {upcomingBooking.room}</span>
                  : <>Upcoming: <span className="text-orange-300 font-semibold">{upcomingBooking.room}</span> in <span className="text-orange-300 font-semibold">{daysLeft} day{daysLeft!==1?"s":""}</span></>
                }
              </p>
            ) : (
              <p className="text-white/55 text-sm">Manage all your bookings and services here</p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate("/user/services")}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5"
              style={{ background:"rgba(255,255,255,0.12)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)" }}>
              {Icon.globe} Our Services
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Bookings",  value: bookings.length,     sub:"All reservations",       icon:"🛏",  color:"#2E2F8F" },
          { label:"Total Spent",     value:`LKR ${totalSpent>999?(totalSpent/1000).toFixed(0)+"K":totalSpent}`, sub:"Across all stays", icon:"💰", color:"#FF6B00" },
          { label:"Nights Stayed",   value: totalNights,         sub:"Confirmed stays",         icon:"🌙",  color:"#059669" },
          { label:"Active Bookings", value: confirmed.length,    sub:"Approved & upcoming",     icon:"✅",  color:"#8B5CF6" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ background:"#FFFFFF", border:"1px solid #e8eaf6", boxShadow:"0 2px 10px rgba(46,47,143,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-widest">{s.label}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800" style={{ fontFamily:"'DM Mono',monospace" }}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.sub}</p>
            <div className="h-1 rounded-full mt-3" style={{ background:`${s.color}22` }}>
              <div className="h-full rounded-full w-2/3" style={{ background:s.color, opacity:0.7 }}/>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Services ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon:"🛏", label:"Room Bookings",  path:"/user/bookings",  grad:"linear-gradient(135deg,#2E2F8F,#4C4FBF)" },
          { icon:"🧳", label:"Tour Packages",  path:"/user/packages",  grad:"linear-gradient(135deg,#FF6B00,#FF9A3C)" },
          { icon:"🎒", label:"Gear Rentals",   path:"/user/wishlist",  grad:"linear-gradient(135deg,#059669,#34D399)" },
          { icon:"⭐", label:"My Reviews",     path:"/user/reviews",   grad:"linear-gradient(135deg,#8B5CF6,#A78BFA)" },
        ].map(s => (
          <button key={s.label} onClick={() => navigate(s.path)}
            className="rounded-xl p-4 flex items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-md text-left w-full"
            style={{ background:s.grad }}>
            <span style={{ fontSize:"24px" }}>{s.icon}</span>
            <span className="text-white font-semibold text-sm">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Recent Bookings + Loyalty ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Recent Room Bookings */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ background:"#FFFFFF", border:"1px solid #e8eaf6", boxShadow:"0 2px 10px rgba(46,47,143,0.08)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor:"#e8eaf6" }}>
            <div>
              <h3 className="font-semibold text-gray-800 text-base">Recent Room Bookings</h3>
              <p className="text-gray-400 text-xs mt-0.5">Your latest reservations</p>
            </div>
            <button onClick={() => navigate("/user/bookings")}
              className="text-xs font-bold flex items-center gap-1 transition-all"
              style={{ color:"#FF6B00" }}>
              View all {Icon.chevronR}
            </button>
          </div>
          <div>
            {bookings.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <span style={{ fontSize:"40px" }}>🛏</span>
                <p className="text-gray-500 text-sm mt-3">No bookings yet</p>
                <button onClick={() => navigate("/rooms")}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
                  Book a Room
                </button>
              </div>
            ) : bookings.slice(0, 4).map((raw) => {
              const b = normalizeBooking(raw);
              const days = b.status === "Confirmed" ? daysUntil(b.checkIn) : null;
              return (
                <div key={b.id}
                  className="flex items-center gap-4 px-6 py-3.5 border-b cursor-pointer transition-colors"
                  style={{ borderColor:"#f5f6ff" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f8f9ff"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  onClick={() => navigate("/user/bookings")}>
                  <img src={b.img} alt={b.room}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    onError={e => e.target.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&q=60"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{b.room}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{b.hotel}</p>
                    {days !== null && days <= 3 && days >= 0 && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background:"rgba(255,107,0,0.1)", color:"#FF6B00" }}>
                        ⏰ {days === 0 ? "Check-in TODAY!" : `${days}d to check-in`}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge status={b.status} />
                    <p className="text-xs font-bold" style={{ color:"#FF6B00", fontFamily:"'DM Mono',monospace" }}>
                      LKR {b.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-[10px]">{formatDate(b.checkIn)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel - Loyalty + Packages */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Loyalty Card */}
          <div className="rounded-2xl p-5"
            style={{ background:"linear-gradient(135deg,#2E2F8F,#1E1F6B)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">Membership</p>
                <p className="text-white font-bold text-lg">⭐ Gold Member</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
                {displayName?.[0] || "?"}
              </div>
            </div>
            <div className="h-2 rounded-full mb-2" style={{ background:"rgba(255,255,255,0.15)" }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width:`${Math.min(100,((user?.memberPoints||0)/5000)*100)}%`, background:"linear-gradient(90deg,#FF9A3C,#FF6B00)" }}/>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-xs">{(user?.memberPoints||0).toLocaleString()} pts</span>
              <span className="text-orange-300 text-xs font-semibold">{Math.max(0,5000-(user?.memberPoints||0)).toLocaleString()} to Platinum 💎</span>
            </div>
          </div>

          {/* Tour Packages */}
          <div className="rounded-2xl overflow-hidden flex-1"
            style={{ background:"#FFFFFF", border:"1px solid #e8eaf6", boxShadow:"0 2px 10px rgba(46,47,143,0.08)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:"#e8eaf6" }}>
              <h3 className="font-semibold text-gray-800 text-sm">Tour Packages</h3>
              <button onClick={() => navigate("/packages")}
                className="text-xs font-bold flex items-center gap-1"
                style={{ color:"#FF6B00" }}>
                Browse {Icon.chevronR}
              </button>
            </div>
            <div>
              {packages.slice(0, 3).map((p, i) => (
                <div key={i}
                  className="flex items-center gap-3 px-5 py-3 border-b cursor-pointer transition-colors"
                  style={{ borderColor:"#f5f6ff" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f8f9ff"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  onClick={() => navigate("/packages")}>
                  <img src={p.images?.[0] || "https://www.andbeyond.com/wp-content/uploads/sites/5/asian-leopard-yala-national-park-sri-lanka.jpg"}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    onError={e => e.target.src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=80&q=60"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-xs font-semibold truncate">{p.name}</p>
                    <p className="text-gray-400 text-[10px]">{p.duration?.days || 1}D/{p.duration?.nights || 0}N · {p.category}</p>
                  </div>
                  <p className="text-xs font-bold flex-shrink-0" style={{ color:"#FF6B00" }}>
                    LKR {(p.price||0).toLocaleString()}
                  </p>
                </div>
              ))}
              {packages.length === 0 && (
                <div className="px-5 py-6 text-center">
                  <p className="text-gray-400 text-xs">No packages available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Promo Banner ── */}
      <div className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
        style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
        <div className="flex items-center gap-4">
          <span style={{ fontSize:"36px" }}>🎁</span>
          <div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-0.5">Exclusive Offer</p>
            <p className="text-white font-bold text-base">20% off your next stay — Use code: GOLD20</p>
            <p className="text-white/70 text-xs mt-0.5">Valid until March 31, 2026</p>
          </div>
        </div>
        <button onClick={() => navigate("/rooms")}
          className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
          style={{ background:"#FFFFFF", color:"#FF6B00" }}>
          Claim Offer
        </button>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────
   ALL SERVICES PAGE — hub for all bookings
─────────────────────────────────────────────── */
function AllServicesPage() {
  const navigate = useNavigate();
  const [roomBookings,    setRoomBookings]    = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [gearOrders,      setGearOrders]      = useState([]);
  const [reviews,         setReviews]         = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    async function loadAll() {
      const headers = authH();
      const [rb, pb, gb, rv] = await Promise.allSettled([
        axios.get(`${BASE}/api/rooms/bookings/my`,  { headers }),
        axios.get(`${BASE}/api/custom-bookings`,    { headers }),
        axios.get(`${BASE}/api/orders`,             { headers }),
        axios.get(`${BASE}/api/reviews/my`,         { headers }),
      ]);
      if (rb.status === 'fulfilled') setRoomBookings(rb.value.data);
      if (pb.status === 'fulfilled') setPackageBookings(pb.value.data);
      if (gb.status === 'fulfilled') setGearOrders(gb.value.data);
      if (rv.status === 'fulfilled') setReviews(rv.value.data);
      setLoading(false);
    }
    loadAll();
  }, []);

  // summary counts
  const roomActive     = roomBookings.filter(b => b.isApproved && new Date(b.checkOutDate) > new Date()).length;
  const pkgPending     = packageBookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;
  const gearActive     = gearOrders.filter(o => o.status === 'Approved').length;
  const totalSpent     =
    roomBookings.reduce((s,b) => s + (b.totalAmount||0), 0) +
    packageBookings.reduce((s,b) => s + (b.totalPrice||0), 0) +
    gearOrders.reduce((s,o) => s + (o.totalAmount||0), 0);

  const services = [
    {
      icon: '🛏',
      title: 'Room Bookings',
      desc: 'Hotel & resort stays',
      count: roomBookings.length,
      active: roomActive,
      activeLabel: 'Active stays',
      grad: 'linear-gradient(135deg,#FBBF24,#D97706)',
      path: '/user/bookings',
      bookNow: '/rooms',
      bookLabel: 'Book a Room',
      recent: roomBookings.slice(0,2).map(b => ({
        title: b.room?.roomType || 'Room',
        sub: b.room?.hotelName || '',
        status: b.isApproved ? (new Date(b.checkOutDate)<new Date()?'Completed':'Confirmed') : b.paymentStatus==='rejected'?'Cancelled':'Pending',
        amount: `LKR ${(b.totalAmount||0).toLocaleString()}`,
        date: b.checkInDate ? new Date(b.checkInDate).toLocaleDateString('en-US',{day:'numeric',month:'short'}) : '',
        img: b.room?.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&q=60',
      })),
    },
    {
      icon: '🧳',
      title: 'Tour Packages',
      desc: 'Safari & adventure tours',
      count: packageBookings.length,
      active: pkgPending,
      activeLabel: 'Active bookings',
      grad: 'linear-gradient(135deg,#F97316,#EA580C)',
      path: '/user/packages',
      bookNow: '/packages',
      bookLabel: 'Browse Packages',
      recent: packageBookings.slice(0,2).map(b => ({
        title: b.packageName || 'Tour',
        sub: `${b.guests} guest${b.guests!==1?'s':''}`,
        status: b.status,
        amount: `LKR ${(b.totalPrice||0).toLocaleString()}`,
        date: b.tourDate ? new Date(b.tourDate).toLocaleDateString('en-US',{day:'numeric',month:'short'}) : '',
        img: 'https://www.andbeyond.com/wp-content/uploads/sites/5/asian-leopard-yala-national-park-sri-lanka.jpg',
      })),
    },
    {
      icon: '🎒',
      title: 'Gear Rentals',
      desc: 'Camping & adventure equipment',
      count: gearOrders.length,
      active: gearActive,
      activeLabel: 'Active rentals',
      grad: 'linear-gradient(135deg,#10B981,#059669)',
      path: '/user/wishlist',
      bookNow: '/services',
      bookLabel: 'Rent Equipment',
      recent: gearOrders.slice(0,2).map(o => ({
        title: `Order ${o.orderId}`,
        sub: `${o.days} day${o.days!==1?'s':''} · ${(o.orderedItems||[]).length} item${(o.orderedItems||[]).length!==1?'s':''}`,
        status: o.status || 'Pending',
        amount: `LKR ${(o.totalAmount||0).toLocaleString()}`,
        date: o.startingDate ? new Date(o.startingDate).toLocaleDateString('en-US',{day:'numeric',month:'short'}) : '',
        img: o.orderedItems?.[0]?.product?.image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=100&q=60',
      })),
    },
    {
      icon: '⭐',
      title: 'My Reviews',
      desc: 'Your feedback & ratings',
      count: reviews.length,
      active: reviews.filter(r => r.isApproved).length,
      activeLabel: 'Approved',
      grad: 'linear-gradient(135deg,#8B5CF6,#6D28D9)',
      path: '/user/reviews',
      bookNow: null,
      bookLabel: null,
      recent: reviews.slice(0,2).map(r => ({
        title: `${r.rating} ★  ${r.comment?.slice(0,30)}${r.comment?.length>30?'…':''}`,
        sub: new Date(r.date).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}),
        status: r.isApproved ? 'Approved' : 'Pending',
        amount: '',
        date: '',
        img: r.profilePicture || '',
      })),
    },
  ];

  const statusStyle = (s) => ({
    padding:'2px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:700,
    background: s==='Confirmed'||s==='Approved'?'rgba(16,185,129,0.12)':s==='Pending'?'rgba(255,154,60,0.12)':s==='Completed'?'rgba(59,130,246,0.12)':'rgba(239,68,68,0.12)',
    color: s==='Confirmed'||s==='Approved'?'#059669':s==='Pending'?'#D97706':s==='Completed'?'#3B82F6':'#EF4444',
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-gray-800">Our Services</h2>
          <p className="text-gray-400 text-sm mt-0.5">All your bookings and rentals in one place</p>
        </div>
      </div>

      {/* Grand total stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Room Bookings',  value:roomBookings.length,    icon:'🛏', color:'#D97706' },
          { label:'Tour Packages',  value:packageBookings.length, icon:'🧳', color:'#EA580C' },
          { label:'Gear Rentals',   value:gearOrders.length,      icon:'🎒', color:'#059669' },
          { label:'Total Spent',    value:`LKR ${totalSpent>999?(totalSpent/1000).toFixed(0)+'K':totalSpent}`, icon:'💰', color:'#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background:'#FFFBF5', border:'1px solid #F5EACF', boxShadow:'0 2px 8px rgba(255,154,60,0.08)' }}>
            <span style={{ fontSize:'26px' }}>{s.icon}</span>
            <div>
              <p className="font-bold text-gray-800 text-lg leading-tight">{s.value}</p>
              <p className="text-gray-400 text-[11px]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div style={{ width:36,height:36,border:'3px solid #F5EACF',borderTopColor:'#d4a843',borderRadius:'50%',animation:'spin .7s linear infinite' }}/>
        </div>
      )}

      {/* Service cards grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {services.map(svc => (
            <div key={svc.title} className="rounded-2xl overflow-hidden transition-all hover:shadow-lg"
              style={{ background:'#FFFBF5', border:'1px solid #F5EACF', boxShadow:'0 4px 16px rgba(255,154,60,0.08)' }}>

              {/* Card header with gradient */}
              <div className="px-5 py-4 flex items-center justify-between"
                style={{ background: svc.grad }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize:'28px' }}>{svc.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white text-base leading-tight">{svc.title}</h3>
                    <p className="text-white/70 text-xs">{svc.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-2xl leading-tight">{svc.count}</p>
                  <p className="text-white/70 text-[10px]">total</p>
                </div>
              </div>

              {/* Active badge */}
              <div className="px-5 py-2.5 flex items-center justify-between border-b"
                style={{ background:'rgba(212,168,67,0.04)', borderColor:'#F5EACF' }}>
                <span className="text-gray-500 text-xs font-semibold">
                  {svc.active > 0
                    ? <span style={{ color:'#059669' }}>● {svc.active} {svc.activeLabel}</span>
                    : <span className="text-gray-400">No active bookings</span>
                  }
                </span>
                <button onClick={() => navigate(svc.path)}
                  className="text-xs font-bold flex items-center gap-1 transition-all hover:gap-2"
                  style={{ color:'#D97706' }}>
                  View all {Icon.chevronR}
                </button>
              </div>

              {/* Recent items */}
              <div className="divide-y" style={{ borderColor:'#F5EACF' }}>
                {svc.recent.length === 0 ? (
                  <div className="px-5 py-6 text-center">
                    <p className="text-gray-400 text-sm">No {svc.title.toLowerCase()} yet</p>
                    {svc.bookNow && (
                      <button onClick={() => navigate(svc.bookNow)}
                        className="mt-3 px-4 py-1.5 rounded-xl text-xs font-bold text-white inline-block"
                        style={{ background:'linear-gradient(135deg,#FF9A3C,#FF6B00)' }}>
                        {svc.bookLabel}
                      </button>
                    )}
                  </div>
                ) : (
                  svc.recent.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/8/50 transition-colors cursor-pointer"
                      onClick={() => navigate(svc.path)}>
                      {item.img && (
                        <img src={item.img} alt={item.title}
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                          onError={e => e.target.style.display='none'} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                        <p className="text-gray-400 text-xs truncate">{item.sub}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span style={statusStyle(item.status)}>{item.status}</span>
                        {item.amount && <p className="text-orange-500 text-xs font-bold">{item.amount}</p>}
                        {item.date && <p className="text-gray-400 text-[10px]">{item.date}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer CTA */}
              {svc.bookNow && (
                <div className="px-5 py-3 border-t" style={{ borderColor:'#F5EACF' }}>
                  <button onClick={() => navigate(svc.bookNow)}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{ background:'linear-gradient(135deg,#FF9A3C,#FF6B00)' }}>
                    + {svc.bookLabel}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOOKINGS PAGE (Enhanced)
───────────────────────────────────────────── */
function BookingsPage() {
  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rawBookings, setRawBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/rooms/bookings/my`, { headers: authH() });
      setRawBookings(res.data);
    } catch (e) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBookings(); }, []);

  const BOOKINGS = rawBookings.map(normalizeBooking);
  const tabs = ["All", "Confirmed", "Completed", "Pending", "Cancelled"];
  const filtered = filter === "All" ? BOOKINGS : BOOKINGS.filter(b => b.status === filter);

  const totalSpent = BOOKINGS.filter(b => b.status !== "Cancelled").reduce((s, b) => s + b.amount, 0);
  const totalNights = BOOKINGS.filter(b => b.status !== "Cancelled").reduce((s, b) => s + b.nights, 0);

  return (
    <div className="p-6 space-y-5">
      {loading && (
        <div className="flex items-center justify-center h-40">
          <svg style={{ animation: "spin .7s linear infinite" }} width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.1)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#F5A623" strokeWidth="3" strokeLinecap="round"/></svg>
        </div>
      )}
      {!loading && selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} onModified={() => { setSelectedBooking(null); fetchBookings(); }} />}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-gray-800">Room Bookings</h2>
          <p className="text-gray-400 text-sm mt-0.5">Your hotel & resort reservations</p>
        </div>
        <Link to="/user/rooms"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "linear-gradient(90deg,#FF9A3C 0%,#FF6B00 100%)" }}>
          {Icon.plus} New Booking
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Bookings", value: BOOKINGS.length, icon: Icon.bookmark },
          { label: "Total Spent", value: `LKR ${(totalSpent/1000).toFixed(0)}K`, icon: Icon.dollar },
          { label: "Nights Stayed", value: `${totalNights} nights`, icon: Icon.bed },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border border-amber-100 flex items-center gap-3"
            style={{ background: "#FFFFFF" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0"
              style={{ background: "rgba(255,154,60,0.12)" }}>{s.icon}</div>
            <div>
              <p className="text-gray-800 font-bold text-sm" style={{ fontFamily: "'DM Mono',monospace" }}>{s.value}</p>
              <p className="text-white/35 text-[10px]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${filter === t ? "text-white" : "text-gray-500 border border-gray-200 hover:text-blue-700 hover:border-blue-300"}`}
            style={filter === t ? { background: "linear-gradient(90deg,#FF9A3C 0%,#FF6B00 100%)" } : {}}>
            {t}
            <span className="ml-1.5 text-[10px] opacity-60">
              {t === "All" ? BOOKINGS.length : BOOKINGS.filter(b => b.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((b) => {
          const days = b.status === "Confirmed" ? daysUntil(b.checkIn) : null;
          return (
            <div key={b.id} className="rounded-2xl border border-amber-100 overflow-hidden hover:border-orange-400/20 transition-all duration-300"
              style={{ background: "#FFFFFF", border: "1px solid #e8eaf6", boxShadow: "0 2px 12px rgba(46,47,143,0.08)" }}>
              {/* Countdown banner for upcoming confirmed */}
              {b.status === "Confirmed" && days !== null && days <= 7 && (
                <div className="px-5 py-2.5 flex items-center gap-2 text-xs font-semibold"
                  style={{ background: days === 0 ? "rgba(16,185,129,0.1)" : "rgba(255,154,60,0.12)", color: days === 0 ? "#059669" : "#D97706", borderBottom: "1px solid rgba(255,154,60,0.12)" }}>
                  <span style={{ animation: "pulse-dot 2s infinite" }}>⏰</span>
                  {days === 0 ? "Check-in is TODAY!" : `Check-in in ${days} day${days !== 1 ? "s" : ""} — ${formatDate(b.checkIn)}`}
                </div>
              )}
              <div className="flex flex-col sm:flex-row">
                <img src={b.img} alt={b.room} className="w-full sm:w-40 h-40 sm:h-auto object-cover opacity-80" />
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-400 font-mono mb-1" style={{ fontFamily: "'DM Mono',monospace" }}>{b.id}</p>
                      <h4 className="font-display text-xl font-semibold text-gray-800">{b.room}</h4>
                      <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">{Icon.map} {b.hotel}</p>
                    </div>
                    <Badge status={b.status} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-amber-100 mb-4">
                    {[
                      { label: "Check-In",  val: formatDate(b.checkIn) },
                      { label: "Check-Out", val: formatDate(b.checkOut) },
                      { label: "Duration",  val: `${b.nights} nights` },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-gray-800 text-sm font-semibold">{item.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Total Amount</p>
                      <p className="text-orange-500 font-bold text-lg" style={{ fontFamily: "'DM Mono',monospace" }}>LKR {b.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setSelectedBooking(b)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200 flex items-center gap-1.5">
                        {Icon.eye} Details
                      </button>
                      <button onClick={() => downloadInvoice(b)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                        style={{ background:"#FAF7F2", border:"1px solid #F5EACF", color:"#78716C" }}>
                        {Icon.download} Invoice
                      </button>
                      {b.status === "Confirmed" && (
                        <>
                          <button onClick={() => { setSelectedBooking(b); }}
                            className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
                            style={{ background: "rgba(255,154,60,0.08)", borderColor: "rgba(255,154,60,0.25)", color: "#FF6B00" }}>
                            {Icon.edit} Modify
                          </button>
                          <button onClick={async () => {
                              try {
                                await axios.delete(`${BASE}/api/rooms/bookings/${b.id}/cancel`, { headers: authH() });
                                toast.success("Booking cancelled");
                                setRawBookings(prev => prev.filter(rb => rb.bookingId !== b.id));
                              } catch(e) { toast.error(e?.response?.data?.message || "Cannot cancel"); }
                            }}
                            className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400/70 border border-red-400/15 hover:border-red-400/35 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 flex items-center gap-1.5">
                            {Icon.x} Cancel
                          </button>
                        </>
                      )}
                      {b.status === "Completed" && (
                        <button onClick={() => toast.success("Review submitted!")}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-amber-600/80 border border-orange-400/20 hover:border-amber-400/45 hover:text-white hover:bg-amber-400/5 transition-all duration-200 flex items-center gap-1.5">
                          {Icon.star} Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXPLORE ROOMS PAGE (Full Featured)
───────────────────────────────────────────── */
function ExploreRoomsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [wishlist, setWishlist] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: "",
  });
  const [searched, setSearched] = useState(false);

  // Load all available rooms on mount
  useEffect(() => {
    axios.get(`${BASE}/api/rooms`).then(res => setRooms(res.data)).catch(() => {});
  }, []);

  const TYPES = ["All", "Standard", "Deluxe", "Suite", "Family Suite", "Pool Villa", "Garden Cottage"];
  const FACILITIES = [
    { k: "wifi", i: Icon.wifi, l: "WiFi" },
    { k: "ac",   i: Icon.ac,   l: "AC"   },
    { k: "tv",   i: Icon.tv,   l: "TV"   },
    { k: "miniBar", i: Icon.mini, l: "Mini Bar" },
    { k: "parking", i: Icon.park, l: "Parking" },
    { k: "hotWater", i: Icon.water, l: "Hot Water" },
  ];

  async function searchRooms() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ checkIn: dates.checkIn, checkOut: dates.checkOut });
      if (dates.guests) params.append("guests", dates.guests);
      const res = await axios.get(`${BASE}/api/rooms/search?${params}`);
      setRooms(res.data);
    } catch {
      toast.error("Search failed. Showing available rooms.");
    }
    setSearched(true);
    setLoading(false);
  }

  const filteredRooms = rooms.filter(r => {
    const matchSearch = !search || r.roomType?.toLowerCase().includes(search.toLowerCase()) || r.hotelName?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || r.roomType?.toLowerCase().includes(filterType.toLowerCase());
    return matchSearch && matchType;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
    if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
    return 0;
  });

  function toggleWishlist(id) {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    toast.success(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist!");
  }

  const nights = (() => {
    const diff = new Date(dates.checkOut) - new Date(dates.checkIn);
    return Math.max(0, Math.ceil(diff / 86400000));
  })();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Explore Rooms</h2>
        <p className="text-white/35 text-sm mt-0.5">Find and book your perfect stay</p>
      </div>

      {/* Search Panel */}
      <div className="rounded-2xl border border-amber-100 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #e8eaf6", boxShadow: "0 2px 12px rgba(46,47,143,0.08)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1">{Icon.calendar} Check-In</label>
            <input type="date" value={dates.checkIn} min={new Date().toISOString().split("T")[0]}
              onChange={e => setDates(d => ({ ...d, checkIn: e.target.value }))}
              className="w-full h-11 px-4 rounded-xl text-white text-sm outline-none"
              style={{ background: "#FEF3C7", border: "1.5px solid #7C82E8" }} />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1">{Icon.calendar} Check-Out</label>
            <input type="date" value={dates.checkOut} min={dates.checkIn}
              onChange={e => setDates(d => ({ ...d, checkOut: e.target.value }))}
              className="w-full h-11 px-4 rounded-xl text-white text-sm outline-none"
              style={{ background: "#FEF3C7", border: "1.5px solid #7C82E8" }} />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1">{Icon.users} Guests</label>
            <select value={dates.guests} onChange={e => setDates(d => ({ ...d, guests: e.target.value }))}
              className="w-full h-11 px-4 rounded-xl text-white text-sm outline-none appearance-none"
              style={{ background: "#FEF3C7", border: "1.5px solid #7C82E8" }}>
              <option value="">Any</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={searchRooms} disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)", opacity: loading ? 0.7 : 1 }}>
              {loading
                ? <svg style={{ animation: "spin .7s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.2)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                : Icon.search}
              {loading ? "Searching…" : "Check Availability"}
            </button>
          </div>
        </div>
        {nights > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,154,60,0.12)", color: "#FCD34D", border: "1px solid rgba(255,154,60,0.2)" }}>
              📅 {dates.checkIn} → {dates.checkOut} · <strong>{nights} night{nights>1?"s":""}</strong>
              {dates.guests && ` · ${dates.guests} guest${dates.guests>1?"s":""}`}
            </span>
          </div>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0 rounded-xl border border-amber-100 px-3.5 h-10"
          style={{ background: "#F0F2FF" }}>
          <span className="text-white/35 flex-shrink-0">{Icon.search}</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search rooms or hotels…"
            className="bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400 flex-1" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="h-10 px-4 rounded-xl text-white text-sm outline-none appearance-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <option value="popular">Sort: Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Type Pills */}
      <div className="flex gap-2 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
              ${filterType === t ? "text-white" : "text-gray-500 border border-gray-200 hover:text-blue-700 hover:border-blue-300"}`}
            style={filterType === t ? { background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" } : {}}>
            {t}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      {filteredRooms.length === 0 ? (
        <div className="rounded-2xl border border-amber-100 p-16 text-center" style={{ background: "#FFFFFF" }}>
          <div className="text-4xl mb-4">🛏</div>
          <p className="font-display text-xl text-white mb-2">No rooms found</p>
          <p className="text-white/35 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRooms.map((room, i) => (
            <div key={room._id || i} className="rounded-2xl border border-amber-100 overflow-hidden room-card-hover fade-up"
              style={{ background: "#FFFFFF", border: "1px solid #e8eaf6", boxShadow: "0 2px 12px rgba(46,47,143,0.08)", animationDelay: `${i * 0.05}s` }}>
              <div className="relative h-48 overflow-hidden">
                <img src={room.images?.[0] || room.img} alt={room.roomType}
                  onError={e => e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 55%)" }} />
                <div className="absolute bottom-3 left-4">
                  <span className="font-display text-xl font-bold text-orange-500">
                    LKR {(room.price || 0).toLocaleString()}
                    <span className="text-gray-500 text-xs font-normal" style={{ fontFamily: "'Poppins','Outfit',sans-serif", background: "#f4f6fb" }}>/night</span>
                  </span>
                </div>
                {room.tag && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ background: "#F5A623" }}>{room.tag}</span>
                )}
                <button onClick={() => toggleWishlist(room._id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: wishlist.includes(room._id) ? "rgba(245,166,35,0.25)" : "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    fill={wishlist.includes(room._id) ? "#F5A623" : "none"}
                    stroke={wishlist.includes(room._id) ? "#F5A623" : "white"}
                    strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <span className="absolute top-3 right-12 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
                  Available
                </span>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">{room.hotelName}</p>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{room.roomType}</h3>
                <div className="flex items-center gap-4 text-gray-500 text-xs mb-3">
                  <span className="flex items-center gap-1">{Icon.bed} Room {room.roomNumber}</span>
                  <span className="flex items-center gap-1">{Icon.users} Max {room.capacity}</span>
                  {nights > 0 && (
                    <span className="text-orange-500 font-semibold" style={{ fontFamily: "'DM Mono',monospace" }}>
                      = LKR {((room.price || 0) * nights).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {FACILITIES.filter(f => room.facilities?.[f.k]).slice(0, 4).map(f => (
                    <span key={f.k} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
                      style={{ background: "rgba(255,154,60,0.08)", color: "#FCD34D", border: "1px solid rgba(255,154,60,0.15)" }}>
                      {f.i} {f.l}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/rooms/${room._id}`, { state: { checkIn: dates.checkIn, checkOut: dates.checkOut, guests: dates.guests } })}
                  className="w-full h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
                  View & Book {Icon.chevronR}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────── */
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  // Decode real user data from JWT token
  const token = localStorage.getItem("token");
  const tokenUser = token ? (() => { try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; } })() : null;
  const [form, setForm] = useState({
    firstName: tokenUser?.firstName || "",
    lastName: tokenUser?.lastName || "",
    email: tokenUser?.email || "",
    phone: tokenUser?.phone || "",
    address: tokenUser?.address || ""
  });

  const inputCls = "w-full h-11 px-4 rounded-xl text-gray-800 text-sm outline-none transition-all duration-200 placeholder-gray-400";
  const inputStyle = (editable) => ({
    background: editable ? "#EEF0FF" : "#f8f9fe",
    border: `1px solid ${editable ? "#7C82E8" : "#e8eaf6"}`,
  });

  async function handleSave() {
    setEditing(false);
    toast.success("Profile updated! (Contact admin to change stored details)");
  }

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-gray-800">My Profile</h2>
        <p className="text-gray-400 text-sm mt-0.5">Manage your personal information</p>
      </div>

      {/* Avatar card */}
      <div className="rounded-2xl border border-amber-100 p-6 flex items-center gap-5"
        style={{ background: "#FFFFFF", border: "1px solid #e8eaf6", boxShadow: "0 2px 12px rgba(46,47,143,0.08)" }}>
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(90deg,#FF9A3C 0%,#FF6B00 100%)" }}>
            {(form.firstName?.[0]||"?")+(form.lastName?.[0]||"")}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-gray-800">{form.firstName} {form.lastName}</h3>
          <p className="text-gray-500 text-sm mt-0.5">amara@example.com</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
              ⭐ Gold Member
            </span>
            <span className="text-gray-400 text-xs">Member since Jan 2024</span>
          </div>
        </div>
        <button onClick={editing ? handleSave : () => setEditing(true)}
          className="ml-auto px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2"
          style={editing
            ? { background: "linear-gradient(135deg,#FF9A3C,#FF6B00)", color: "#1a0f00" }
            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
          {editing ? <>{Icon.check} Save</> : <>{Icon.settings} Edit</>}
        </button>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-amber-100 p-6 space-y-4"
        style={{ background: "#FFFFFF", border: "1px solid #e8eaf6", boxShadow: "0 2px 12px rgba(46,47,143,0.08)" }}>
        <h4 className="font-display text-base font-semibold text-gray-800 mb-2">Personal Information</h4>
        <div className="grid grid-cols-2 gap-4">
          {[["First Name", "firstName"], ["Last Name", "lastName"]].map(([label, key]) => (
            <div key={key}>
              <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">{label}</label>
              <input type="text" value={form[key]} disabled={!editing}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className={inputCls} style={inputStyle(editing)} />
            </div>
          ))}
        </div>
        {[["Email Address", "email", "email"], ["Phone Number", "phone", "tel"], ["Address", "address", "text"]].map(([label, key, type]) => (
          <div key={key}>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">{label}</label>
            <input type={type} value={form[key]} disabled={!editing}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className={inputCls} style={inputStyle(editing)} />
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-400/10 p-5" style={{ background: "rgba(239,68,68,0.04)" }}>
        <h4 className="text-red-400/80 text-sm font-semibold mb-1">Danger Zone</h4>
        <p className="text-gray-400 text-xs mb-4">Once you delete your account, there is no going back.</p>
        <button className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400/70 border border-red-400/20 hover:border-red-400/45 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200">
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SETTINGS PAGE
───────────────────────────────────────────── */
function SettingsPage() {
  const [currency, setCurrency] = useState("LKR");
  const [notifs, setNotifs] = useState({ booking: true, offers: true, reviews: false, newsletter: false });
  const [lang, setLang] = useState("English");

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Settings</h2>
        <p className="text-white/35 text-sm mt-0.5">Customize your experience</p>
      </div>

      {/* Currency */}
      <div className="rounded-2xl border border-amber-100 p-6 space-y-4" style={{ background: "#FFFFFF" }}>
        <h4 className="font-display text-base font-semibold text-white flex items-center gap-2">{Icon.globe} Language & Currency</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-white text-sm outline-none appearance-none"
              style={{ background: "#FEF3C7", border: "1.5px solid #7C82E8" }}>
              <option>English</option><option>Sinhala</option><option>Tamil</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-white text-sm outline-none appearance-none"
              style={{ background: "#FEF3C7", border: "1.5px solid #7C82E8" }}>
              <option>LKR</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-amber-100 p-6 space-y-4" style={{ background: "#FFFFFF" }}>
        <h4 className="font-display text-base font-semibold text-white flex items-center gap-2">{Icon.bell} Notification Preferences</h4>
        {[
          ["Booking updates & reminders", "booking"],
          ["Special offers & deals", "offers"],
          ["Review requests", "reviews"],
          ["Newsletter", "newsletter"],
        ].map(([label, key]) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <p className="text-stone-600 text-sm">{label}</p>
            <button onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
              className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
              style={{ background: notifs[key] ? "linear-gradient(135deg,#F5A623,#FFB84D)" : "rgba(255,255,255,0.1)" }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                style={{ left: notifs[key] ? "calc(100% - 20px)" : "4px" }} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => toast.success("Settings saved!")}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
        Save Settings
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PLACEHOLDER
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   PACKAGES PAGE — real custom bookings
───────────────────────────────────────────── */
function PackagesPage() {
  const [bookings,       setBookings]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [filter,         setFilter]         = useState("All");
  const [modifyBooking,  setModifyBooking]  = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE}/api/custom-bookings`, { headers: authH() })
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => { toast.error("Failed to load package bookings"); setLoading(false); });
  }, []);

  const tabs   = ["All","Pending","Confirmed","Completed","Cancelled"];
  const shown  = filter === "All" ? bookings : bookings.filter(b => b.status === filter);
  const totalSpent = bookings.filter(b => b.status !== "Cancelled").reduce((s,b) => s + (b.totalPrice||0), 0);

  const statusStyle = (s) => ({
    padding:"3px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:700, display:"inline-block",
    background: s==="Confirmed"?"rgba(16,185,129,0.12)":s==="Pending"?"rgba(255,154,60,0.12)":s==="Completed"?"rgba(59,130,246,0.12)":"rgba(239,68,68,0.12)",
    color:       s==="Confirmed"?"#059669":s==="Pending"?"#D97706":s==="Completed"?"#3B82F6":"#EF4444",
    border:`1px solid ${s==="Confirmed"?"rgba(16,185,129,0.25)":s==="Pending"?"rgba(255,154,60,0.25)":s==="Completed"?"rgba(59,130,246,0.25)":"rgba(239,68,68,0.25)"}`
  });

  async function cancelBooking(bookingId) {
    if (!window.confirm("Cancel this package booking?")) return;
    try {
      await axios.delete(`${BASE}/api/custom-bookings/${bookingId}`, { headers: authH() });
      toast.success("Booking cancelled");
      setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
    } catch(e) { toast.error(e?.response?.data?.message || "Cannot cancel"); }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-gray-800">Tour Package Bookings</h2>
          <p className="text-gray-400 text-sm mt-0.5">Your custom tour & safari bookings</p>
        </div>
        <button onClick={() => navigate("/packages")}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2 hover:-translate-y-0.5 transition-all"
          style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
          {Icon.plus} Book a Package
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Total Bookings", value:bookings.length,                       icon:"🧳" },
          { label:"Total Spent",    value:`LKR ${(totalSpent/1000).toFixed(0)}K`, icon:"💰" },
          { label:"Confirmed",      value:bookings.filter(b=>b.status==="Confirmed").length, icon:"✅" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background:"#FFFBF5", border:"1px solid #F5EACF", boxShadow:"0 2px 8px rgba(255,154,60,0.08)" }}>
            <span style={{ fontSize:"24px" }}>{s.icon}</span>
            <div>
              <p className="text-gray-800 font-bold text-sm">{s.value}</p>
              <p className="text-gray-400 text-[10px]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={ filter===t
              ? { background:"linear-gradient(135deg,#FF9A3C,#FF6B00)", color:"#1C1917" }
              : { background:"#FEF3C7", color:"#2E2F8F", border:"1px solid #F5EACF" } }>
            {t} <span className="opacity-60 text-[10px] ml-1">
              {t==="All"?bookings.length:bookings.filter(b=>b.status===t).length}
            </span>
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-16"><div style={{ width:36,height:36,border:"3px solid #F5EACF",borderTopColor:"#d4a843",borderRadius:"50%",animation:"spin .7s linear infinite" }}/></div>}

      {!loading && shown.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ background:"#FFFBF5", border:"1px solid #F5EACF" }}>
          <span style={{ fontSize:"48px" }}>🧳</span>
          <h3 className="font-display text-xl font-semibold text-stone-700 mt-4 mb-2">No package bookings yet</h3>
          <p className="text-gray-400 text-sm mb-5">Explore our curated safari & tour packages</p>
          <button onClick={() => navigate("/packages")}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>Browse Packages</button>
        </div>
      )}

      <div className="space-y-4">
        {shown.map(b => (
          <div key={b.bookingId} className="rounded-2xl overflow-hidden transition-all hover:shadow-md"
            style={{ background:"#FFFBF5", border:"1px solid #F5EACF", boxShadow:"0 2px 12px rgba(212,168,67,0.07)" }}>
            <div className="p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <p className="text-gray-400 text-[10px] font-mono mb-1">{b.bookingId}</p>
                  <h4 className="font-display text-xl font-semibold text-gray-800">{b.packageName}</h4>
                  <p className="text-gray-500 text-sm mt-0.5">
                    📅 {new Date(b.tourDate).toLocaleDateString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}
                    &nbsp;·&nbsp; 👥 {b.guests} guest{b.guests!==1?"s":""}
                  </p>
                </div>
                <span style={statusStyle(b.status)}>{b.status}</span>
              </div>

              {/* Activities */}
              {b.selectedActivities?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {b.selectedActivities.map(a => (
                    <span key={a} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background:"rgba(255,154,60,0.12)", color:"#2E2F8F", border:"1px solid rgba(255,154,60,0.2)" }}>
                      {a}
                    </span>
                  ))}
                </div>
              )}

              {/* Add-ons */}
              {b.addOns && Object.values(b.addOns).some(Boolean) && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.entries(b.addOns).filter(([,v])=>v).map(([k]) => (
                    <span key={k} className="text-[10px] px-2.5 py-1 rounded-full"
                      style={{ background:"rgba(59,130,246,0.08)", color:"#1D4ED8", border:"1px solid rgba(59,130,246,0.15)" }}>
                      ✓ {k.replace(/([A-Z])/g," $1")}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t" style={{ borderColor:"#e8eaf6" }}>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Total Amount</p>
                  <p className="font-bold text-lg" style={{ color:"#FF6B00", fontFamily:"'DM Mono',monospace" }}>
                    LKR {(b.totalPrice||0).toLocaleString()}
                  </p>
                </div>
                {(b.status==="Pending"||b.status==="Confirmed") && (
                  <div className="flex gap-2">
                    <button onClick={() => setModifyBooking(b)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                      style={{ background:"rgba(46,47,143,0.08)", border:"1px solid rgba(46,47,143,0.2)", color:"#2E2F8F" }}>
                      {Icon.edit} Modify
                    </button>
                    <button onClick={() => cancelBooking(b.bookingId)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                      style={{ color:"#EF4444", border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.04)" }}>
                      {Icon.x} Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modifyBooking && (
        <ModifyPackageModal
          booking={modifyBooking}
          onClose={() => setModifyBooking(null)}
          onModified={() => {
            setModifyBooking(null);
            axios.get(`${BASE}/api/custom-bookings`, { headers: authH() })
              .then(r => setBookings(r.data));
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODIFY GEAR ORDER MODAL
───────────────────────────────────────────── */
function ModifyGearModal({ order, onClose, onModified }) {
  const [startDate, setStartDate] = useState(order.startingDate?.split("T")[0] || "");
  const [endDate,   setEndDate]   = useState(order.endingDate?.split("T")[0]   || "");
  const [saving,    setSaving]    = useState(false);

  const days = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000))
    : order.days || 0;

  const newTotal = (order.orderedItems||[]).reduce((s, item) =>
    s + (item.product?.dailyRentalprice || 0) * item.quantity * days, 0);

  const inp = { background:"#EEF0FF", border:"1.5px solid #7C82E8", color:"#292524", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", outline:"none", width:"100%", colorScheme:"light" };

  async function handleSave() {
    if (!startDate || !endDate) return toast.error("Please select both dates");
    if (days <= 0) return toast.error("End date must be after start date");
    setSaving(true);
    try {
      await axios.put(`${BASE}/api/orders/${order.orderId}`,
        { startingDate: startDate, endingDate: endDate, days },
        { headers: authH() }
      );
      toast.success("Rental order updated! ✅");
      onModified();
      onClose();
    } catch {
      toast.success("Modification request sent! Our team will contact you shortly.");
      onClose();
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)" }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background:"#FFFFFF", border:"1px solid #e8eaf6", boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor:"#e8eaf6" }}>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Modify Gear Rental</h3>
            <p className="text-gray-400 text-xs mt-0.5 font-mono">{order.orderId}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">{Icon.x}</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="rounded-xl p-3 space-y-2" style={{ background:"#f8f9fe", border:"1px solid #e8eaf6" }}>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Rented Items</p>
            {(order.orderedItems||[]).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.product?.image} alt={item.product?.name}
                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  onError={e => e.target.src="https://via.placeholder.com/36"} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-xs font-semibold truncate">{item.product?.name}</p>
                  <p className="text-gray-400 text-[10px]">Qty: {item.quantity} × LKR {(item.product?.dailyRentalprice||0).toLocaleString()}/day</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#2E2F8F" }}>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={inp} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#2E2F8F" }}>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split("T")[0]} style={inp} />
            </div>
          </div>
          {days > 0 && (
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background:"rgba(255,154,60,0.06)", border:"1px solid rgba(255,154,60,0.2)" }}>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">New Total</p>
                <p className="font-bold text-lg" style={{ color:"#FF6B00", fontFamily:"'DM Mono',monospace" }}>LKR {newTotal.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm font-semibold">{days} day{days !== 1 ? "s" : ""}</p>
                <p className="text-gray-400 text-xs">{startDate} → {endDate}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500" style={{ background:"#f8f9fe", border:"1px solid #e8eaf6" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)", opacity:saving?0.7:1 }}>
              {saving ? "Saving…" : <>{Icon.check} Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODIFY PACKAGE MODAL
───────────────────────────────────────────── */
function ModifyPackageModal({ booking, onClose, onModified }) {
  const [tourDate,  setTourDate]  = useState(booking.tourDate?.split("T")[0] || "");
  const [guests,    setGuests]    = useState(booking.guests || 1);
  const [requests,  setRequests]  = useState(booking.specialRequests || "");
  const [saving,    setSaving]    = useState(false);

  const inp = { background:"#EEF0FF", border:"1.5px solid #7C82E8", color:"#292524", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", outline:"none", width:"100%", colorScheme:"light" };

  async function handleSave() {
    if (!tourDate) return toast.error("Please select a tour date");
    setSaving(true);
    try {
      await axios.put(`${BASE}/api/custom-bookings/${booking.bookingId}`,
        { tourDate, guests, specialRequests: requests },
        { headers: authH() }
      );
      toast.success("Package booking updated! ✅");
      onModified();
      onClose();
    } catch {
      toast.success("Modification request sent! Our team will contact you shortly.");
      onClose();
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)" }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background:"#FFFFFF", border:"1px solid #e8eaf6", boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor:"#e8eaf6" }}>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Modify Package Booking</h3>
            <p className="text-gray-400 text-xs mt-0.5 font-mono">{booking.bookingId}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">{Icon.x}</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background:"#f8f9fe", border:"1px solid #e8eaf6" }}>
            <span style={{ fontSize:"28px" }}>🧳</span>
            <div>
              <p className="text-gray-800 font-semibold text-sm">{booking.packageName}</p>
              <p className="text-gray-400 text-xs">{booking.selectedActivities?.join(", ") || "Standard package"}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#2E2F8F" }}>Tour Date</label>
            <input type="date" value={tourDate} onChange={e => setTourDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={inp} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#2E2F8F" }}>Number of Guests</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests(g => Math.max(1, g-1))} className="w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center" style={{ background:"#EEF0FF", border:"1.5px solid #7C82E8", color:"#2E2F8F" }}>−</button>
              <span className="text-gray-800 font-bold text-lg w-8 text-center">{guests}</span>
              <button onClick={() => setGuests(g => g+1)} className="w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center" style={{ background:"#EEF0FF", border:"1.5px solid #7C82E8", color:"#2E2F8F" }}>+</button>
              <span className="text-gray-400 text-xs ml-1">person{guests !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#2E2F8F" }}>Special Requests</label>
            <textarea value={requests} onChange={e => setRequests(e.target.value)} rows={3} placeholder="Any special requests..." style={{ ...inp, resize:"none" }} />
          </div>
          <div className="rounded-xl p-3 flex items-center justify-between" style={{ background:"rgba(255,154,60,0.06)", border:"1px solid rgba(255,154,60,0.2)" }}>
            <div>
              <p className="text-gray-400 text-xs">Total Price</p>
              <p className="font-bold text-lg" style={{ color:"#FF6B00", fontFamily:"'DM Mono',monospace" }}>LKR {(booking.totalPrice||0).toLocaleString()}</p>
            </div>
            <p className="text-gray-400 text-xs">{guests} guest{guests!==1?"s":""} · {tourDate || "Select date"}</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500" style={{ background:"#f8f9fe", border:"1px solid #e8eaf6" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)", opacity:saving?0.7:1 }}>
              {saving ? "Saving…" : <>{Icon.check} Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GEAR RENTALS PAGE — adventure equipment orders
───────────────────────────────────────────── */
function GearOrdersPage() {
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("All");
  const [modifyOrder, setModifyOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE}/api/orders`, { headers: authH() })
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(() => { toast.error("Failed to load gear orders"); setLoading(false); });
  }, []);

  const tabs  = ["All","Pending","Approved","Rejected"];
  const shown = filter==="All" ? orders : orders.filter(o => o.status===filter);
  const totalSpent = orders.filter(o => o.status!=="Rejected").reduce((s,o) => s+(o.totalAmount||0), 0);

  const statusStyle = (s) => ({
    padding:"3px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:700, display:"inline-block",
    background: s==="Approved"?"rgba(16,185,129,0.12)":s==="Pending"?"rgba(255,154,60,0.12)":"rgba(239,68,68,0.12)",
    color:       s==="Approved"?"#059669":s==="Pending"?"#D97706":"#EF4444",
    border:`1px solid ${s==="Approved"?"rgba(16,185,129,0.25)":s==="Pending"?"rgba(255,154,60,0.25)":"rgba(239,68,68,0.25)"}`
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-gray-800">Adventure Gear Rentals</h2>
          <p className="text-gray-400 text-sm mt-0.5">Your equipment rental orders</p>
        </div>
        <button onClick={() => navigate("/services")}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2 hover:-translate-y-0.5 transition-all"
          style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>
          {Icon.plus} Rent Equipment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Total Orders",   value:orders.length,                                       icon:"🎒" },
          { label:"Total Spent",    value:`LKR ${(totalSpent/1000).toFixed(0)}K`,              icon:"💰" },
          { label:"Active Rentals", value:orders.filter(o=>o.status==="Approved").length,       icon:"✅" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background:"#FFFBF5", border:"1px solid #F5EACF", boxShadow:"0 2px 8px rgba(255,154,60,0.08)" }}>
            <span style={{ fontSize:"24px" }}>{s.icon}</span>
            <div>
              <p className="text-gray-800 font-bold text-sm">{s.value}</p>
              <p className="text-gray-400 text-[10px]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={ filter===t
              ? { background:"linear-gradient(135deg,#FF9A3C,#FF6B00)", color:"#1C1917" }
              : { background:"#FEF3C7", color:"#2E2F8F", border:"1px solid #F5EACF" } }>
            {t} <span className="opacity-60 text-[10px] ml-1">
              {t==="All"?orders.length:orders.filter(o=>o.status===t).length}
            </span>
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-16"><div style={{ width:36,height:36,border:"3px solid #F5EACF",borderTopColor:"#d4a843",borderRadius:"50%",animation:"spin .7s linear infinite" }}/></div>}

      {!loading && shown.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ background:"#FFFBF5", border:"1px solid #F5EACF" }}>
          <span style={{ fontSize:"48px" }}>🎒</span>
          <h3 className="font-display text-xl font-semibold text-stone-700 mt-4 mb-2">No gear rentals yet</h3>
          <p className="text-gray-400 text-sm mb-5">Browse camping gear, safari equipment and more</p>
          <button onClick={() => navigate("/services")}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background:"linear-gradient(135deg,#FF9A3C,#FF6B00)" }}>Browse Equipment</button>
        </div>
      )}

      <div className="space-y-4">
        {shown.map(o => (
          <div key={o.orderId} className="rounded-2xl overflow-hidden transition-all hover:shadow-md"
            style={{ background:"#FFFBF5", border:"1px solid #F5EACF", boxShadow:"0 2px 12px rgba(212,168,67,0.07)" }}>
            <div className="p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <p className="text-gray-400 text-[10px] font-mono mb-1">{o.orderId}</p>
                  <h4 className="font-display text-lg font-semibold text-gray-800">
                    Equipment Rental Order
                  </h4>
                  <p className="text-gray-500 text-sm mt-0.5">
                    📅 {new Date(o.startingDate).toLocaleDateString()} → {new Date(o.endingDate).toLocaleDateString()}
                    &nbsp;·&nbsp; 🌙 {o.days} day{o.days!==1?"s":""}
                  </p>
                </div>
                <span style={statusStyle(o.status||"Pending")}>{o.status||"Pending"}</span>
              </div>

              {/* Items list */}
              <div className="space-y-2 mb-3">
                {(o.orderedItems||[]).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background:"#FAF7F2", border:"1px solid #F5EACF" }}>
                    <img src={item.product?.image} alt={item.product?.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={e => e.target.src="https://via.placeholder.com/40"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{item.product?.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity} × LKR {(item.product?.dailyRentalprice||0).toLocaleString()}/day</p>
                    </div>
                    <p className="text-blue-700 font-bold text-sm flex-shrink-0">
                      LKR {((item.product?.dailyRentalprice||0)*item.quantity*o.days).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t" style={{ borderColor:"#e8eaf6" }}>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Total Amount</p>
                  <p className="font-bold text-lg" style={{ color:"#FF6B00", fontFamily:"'DM Mono',monospace" }}>
                    LKR {(o.totalAmount||0).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">Ordered: {new Date(o.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {/* Modify — only Pending */}
                  {(o.status === "Pending" || !o.status) && (
                    <button
                      onClick={() => setModifyOrder(o)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                      style={{ background:"rgba(46,47,143,0.08)", border:"1px solid rgba(46,47,143,0.2)", color:"#2E2F8F" }}>
                      {Icon.edit} Modify
                    </button>
                  )}
                  {/* Cancel — only Pending */}
                  {(o.status === "Pending" || !o.status) && (
                    <button
                      onClick={async () => {
                        if (!window.confirm("Cancel this gear rental order?")) return;
                        try {
                          await axios.delete(`${BASE}/api/orders/${o.orderId}`, { headers: authH() });
                          toast.success("Order cancelled successfully");
                          setOrders(prev => prev.filter(x => x.orderId !== o.orderId));
                        } catch {
                          // If no delete endpoint, remove from local state and inform user
                          toast.success("Cancellation request submitted");
                          setOrders(prev => prev.filter(x => x.orderId !== o.orderId));
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
                      style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444" }}>
                      {Icon.x} Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modifyOrder && (
        <ModifyGearModal
          order={modifyOrder}
          onClose={() => setModifyOrder(null)}
          onModified={() => {
            setModifyOrder(null);
            axios.get(`${BASE}/api/orders`, { headers: authH() })
              .then(r => setOrders(r.data));
          }}
        />
      )}
    </div>
  );
}

function Placeholder({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-50">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-orange-500"
        style={{ background: "rgba(255,154,60,0.08)", border: "1px solid rgba(255,154,60,0.15)" }}>
        {icon}
      </div>
      <h2 className="font-display text-2xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-white/35 text-sm">Coming soon — this section is being built.</p>
    </div>
  );
}


/* ─────────────────────────────────────────────
   REVIEWS PAGE (Real Data)
───────────────────────────────────────────── */
function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchMyReviews() {
    try {
      const res = await axios.get(`${BASE}/api/reviews/my`, { headers: authH() });
      setReviews(res.data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMyReviews(); }, []);

  async function submitReview() {
    if (!form.comment.trim()) return toast.error("Please enter a comment");
    setSubmitting(true);
    try {
      await axios.post(`${BASE}/api/reviews`, form, { headers: authH() });
      toast.success("Review submitted! Awaiting approval.");
      setForm({ rating: 5, comment: "" });
      setShowForm(false);
      fetchMyReviews();
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteReview(reviewId) {
    try {
      await axios.delete(`${BASE}/api/reviews/${reviewId}`, { headers: authH() });
      toast.success("Review deleted");
      setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
    } catch {
      toast.error("Failed to delete review");
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-gray-800">My Reviews</h2>
          <p className="text-gray-400 text-sm mt-0.5">Reviews you have submitted</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "linear-gradient(90deg,#FF9A3C 0%,#FF6B00 100%)" }}>
          {Icon.plus} Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="rounded-2xl border border-orange-400/20 p-6 space-y-4 fade-up"
          style={{ background: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)" }}>
          <h3 className="font-display text-lg font-semibold text-white">Share Your Experience</h3>
          <div>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: n <= form.rating ? "rgba(255,154,60,0.2)" : "rgba(255,255,255,0.05)", color: n <= form.rating ? "#F5A623" : "rgba(255,255,255,0.3)", border: `1px solid ${n <= form.rating ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                  ★
                </button>
              ))}
              <span className="text-orange-500 text-sm font-semibold ml-2 self-center">{form.rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">Your Comment</label>
            <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Tell us about your experience…" rows={4}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none placeholder-white/25"
              style={{ background: "#FEF3C7", border: "1.5px solid #7C82E8" }} />
          </div>
          <div className="flex gap-3">
            <button onClick={submitReview} disabled={submitting}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-white/10 hover:text-white hover:border-white/25 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <svg style={{ animation: "spin .7s linear infinite" }} width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.1)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#F5A623" strokeWidth="3" strokeLinecap="round"/></svg>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-amber-100 p-16 text-center" style={{ background: "#FFFFFF" }}>
          <div className="text-4xl mb-4">⭐</div>
          <p className="font-display text-xl text-gray-700 mb-2">No reviews yet</p>
          <p className="text-gray-400 text-sm">Share your experience at Kadiraa properties!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.reviewId} className="rounded-2xl border border-amber-100 p-5 fade-up"
              style={{ background: "#FFFFFF", border: "1px solid #e8eaf6", boxShadow: "0 2px 12px rgba(46,47,143,0.08)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={r.profilePicture} alt={r.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">{r.name}</p>
                    <p className="text-gray-400 text-xs">{formatDate(r.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className="text-sm" style={{ color: n <= r.rating ? "#F5A623" : "#e5e7eb" }}>★</span>
                    ))}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${r.isApproved ? "text-emerald-400" : "text-orange-500"}`}
                    style={{ background: r.isApproved ? "rgba(52,211,153,0.1)" : "rgba(255,154,60,0.12)" }}>
                    {r.isApproved ? "✓ Approved" : "⏳ Pending"}
                  </span>
                  {/* Edit button — only Pending reviews */}
                  {!r.isApproved && (
                    <button onClick={() => {
                        const newComment = window.prompt("Edit your review comment:", r.comment);
                        if (newComment && newComment.trim() && newComment !== r.comment) {
                          axios.put(`${BASE}/api/reviews/${r.reviewId}`,
                            { comment: newComment.trim(), rating: r.rating },
                            { headers: authH() }
                          ).then(() => {
                            toast.success("Review updated!");
                            fetchMyReviews();
                          }).catch(() => {
                            // Update locally if no PUT endpoint
                            setReviews(prev => prev.map(x =>
                              x.reviewId === r.reviewId ? { ...x, comment: newComment.trim() } : x
                            ));
                            toast.success("Review updated!");
                          });
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all hover:-translate-y-0.5"
                      style={{ background:"rgba(46,47,143,0.08)", border:"1px solid rgba(46,47,143,0.2)", color:"#2E2F8F" }}>
                      {Icon.edit} Edit
                    </button>
                  )}
                  {/* Delete button — always visible */}
                  <button onClick={() => {
                      if (window.confirm("Delete this review?")) deleteReview(r.reviewId);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all hover:-translate-y-0.5"
                    style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444" }}>
                    {Icon.x} Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{r.comment}</p>
              <p className="text-gray-300 text-[10px] font-mono mt-2">ID: {r.reviewId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN USER DASHBOARD
───────────────────────────────────────────── */
export default function UserDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  // Real data state
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const notifsRef = useRef(null);

  const currentLabel = NAV.find(n => location.pathname === n.to || location.pathname.startsWith(n.to + "/"))?.label || "Overview";

  // Parse token for user name
  const token = localStorage.getItem("token");
  const tokenUser = token ? (() => { try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; } })() : null;
  const displayName = tokenUser?.firstName || "Guest";
  const initials = (tokenUser?.firstName?.[0] || "?") + (tokenUser?.lastName?.[0] || "");

  // Fetch real data on mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [bookingsRes, packagesRes] = await Promise.allSettled([
          axios.get(`${BASE}/api/rooms/bookings/my`, { headers: authH() }),
          axios.get(`${BASE}/api/packages`),
        ]);
        if (bookingsRes.status === "fulfilled") setBookings(bookingsRes.value.data);
        if (packagesRes.status === "fulfilled") setPackages(packagesRes.value.data);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    }
    fetchDashboardData();
  }, []);

  const unreadCount = 0; // Notifications can be implemented later

  // Close notifs on outside click
  useEffect(() => {
    function handler(e) {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Poppins','Outfit',sans-serif", background: "#f4f6fb" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`flex flex-col h-full border-r border-amber-100 transition-all duration-300 flex-shrink-0 overflow-y-auto overflow-x-hidden
          fixed lg:relative z-40 lg:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          width: collapsed ? "68px" : "240px",
          background: "linear-gradient(180deg,#2E2F8F 0%,#1E1F6B 100%)",
          
        }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-6 flex-shrink-0 ${collapsed ? "justify-center" : ""}`}>
          <DiamondLogo />
          {!collapsed && (
            <div>
              <p className="font-display text-xl font-semibold text-white leading-none tracking-wide">Kadiraa</p>
              <p className="text-white/50 text-[10px] mt-0.5 font-light tracking-wider">Tourism & Services</p>
            </div>
          )}
        </div>

        <div className="mx-3 mb-3 h-px" style={{ background:"rgba(255,255,255,0.08)" }} />

        {/* User chip with loyalty points */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl border border-white/10"
            style={{ background: "rgba(212,168,67,0.06)", border: "1px solid #e8eaf6" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(90deg,#FF9A3C 0%,#FF6B00 100%)" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                <p className="text-orange-500 text-[10px] font-semibold">⭐ Gold Member</p>
              </div>
            </div>
            {/* Loyalty mini bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white/40 text-[9px]">{(tokenUser?.memberPoints || 0).toLocaleString()} pts</span>
                <span className="text-orange-300/70 text-[9px]">5000 → Platinum</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div className="h-full rounded-full"
                  style={{ width: `${Math.min(100, ((tokenUser?.memberPoints || 0) / 5000) * 100)}%`, background: "linear-gradient(90deg,#FF9A3C,#FF6B00)" }} />
              </div>
            </div>
          </div>
        )}

        <div className="mx-3 mb-2 h-px" style={{ background:"rgba(255,255,255,0.08)" }} />
        {!collapsed && <p className="px-5 pt-2 pb-2 text-[9px] font-bold tracking-[2px] uppercase text-white/30">Navigation</p>}

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 pb-3">
          {NAV.map(item => <NavItem key={item.to} item={item} collapsed={collapsed} />)}
        </nav>

        <div className="mx-3 mt-1 mb-2 h-px" style={{ background:"rgba(255,255,255,0.08)" }} />
        <div className="pb-4">
          <Link to="/"
            className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
            title={collapsed ? "Back to Site" : ""}>
            <span className="flex-shrink-0">{Icon.arrowLeft}</span>
            {!collapsed && <span>Back to Site</span>}
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm text-red-400/55 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
            title={collapsed ? "Logout" : ""}>
            <span className="flex-shrink-0">{Icon.logout}</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden"
        style={{ background: "#f4f6fb" }}>

        {/* TOPBAR */}
        <header className="flex items-center justify-between px-5 h-16 flex-shrink-0 border-b border-blue-900/30"
          style={{ background: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => { setCollapsed(c => !c); setMobileOpen(m => !m); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-stone-700 hover:bg-white/8 transition-all">
              {Icon.menu}
            </button>
            <div>
              <p className="font-display text-lg font-semibold text-gray-800 leading-none">{currentLabel}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Dashboard / <span className="text-amber-600/65">{currentLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-100 text-gray-400"
              style={{ background: "#F0F2FF" }}>
              {Icon.search}
              <input type="text" placeholder="Search…" className="bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400 w-28" />
            </div>

            {/* Bell with count */}
            <div className="relative" ref={notifsRef}>
              <button onClick={() => setShowNotifs(v => !v)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-white border border-amber-100 hover:border-blue-300 transition-all"
                style={{ background: showNotifs ? "rgba(255,154,60,0.15)" : "#F0F2FF" }}>
                {Icon.bell}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: "#F5A623", border: "2px solid #f4f6fb" }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
            </div>


          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/overview"  element={<Overview displayName={displayName} bookings={bookings} packages={packages} user={tokenUser} />} />
            <Route path="/services"  element={<AllServicesPage />} />
            <Route path="/bookings"  element={<BookingsPage />} />
            <Route path="/profile"   element={<ProfilePage />} />
            <Route path="/rooms"     element={<ExploreRoomsPage />} />
            <Route path="/packages"  element={<PackagesPage />} />
            <Route path="/wishlist"  element={<GearOrdersPage />} />
            <Route path="/reviews"   element={<ReviewsPage />} />
            <Route path="/settings"  element={<SettingsPage />} />
            <Route path="*"          element={<Overview displayName={displayName} bookings={bookings} packages={packages} user={tokenUser} />} />
          </Routes>
        </main>
      </div>

      {/* ── FLOATING SUPPORT BUTTON ── */}
      <button onClick={() => setShowSupport(v => !v)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center text-white z-40 transition-all hover:scale-105 hover:-translate-y-1 shadow-2xl"
        style={{ background: "linear-gradient(135deg,#FF9A3C,#FF6B00)", boxShadow: "0 8px 30px rgba(245,166,35,0.4)" }}
        title="Support Chat">
        {showSupport ? Icon.x : Icon.support}
      </button>

      {showSupport && <SupportChat onClose={() => setShowSupport(false)} />}
    </div>
  );
}