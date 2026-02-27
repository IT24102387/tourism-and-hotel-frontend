import { BsGraphUp } from "react-icons/bs";
import { FaRegBookmark, FaRegUser, FaCar, FaUmbrellaBeach } from "react-icons/fa";
import { PiBagSimpleBold } from "react-icons/pi";
import { LuPackageSearch } from "react-icons/lu";
import { MdOutlinePayments, MdOutlineReviews } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineBed } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { BsCalendar2Event } from "react-icons/bs";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import AdminItemPage from "./adminItemPage";
import AddItemPage from "./addItemPage";
import UpdateItemPage from "./updateItemPage";
import { useState, useEffect } from "react";




const navItems = [
  { label: "Dashboard",          icon: BsGraphUp,            to: "/admin/dashboard" },
  { label: "Bookings",           icon: FaRegBookmark,        to: "/admin/bookings" },
  { label: "Rooms",              icon: MdOutlineBed,         to: "/admin/rooms" },
  { label: "Storage/Equipment",  icon: PiBagSimpleBold,      to: "/admin/items" },
  { label: "Tour Packages",      icon: LuPackageSearch,      to: "/admin/packages" },
  { label: "Transportation",     icon: FaCar,                to: "/admin/transport" },
  { label: "Payments",           icon: MdOutlinePayments,    to: "/admin/payments" },
  { label: "Restaurant",         icon: IoFastFoodOutline,    to: "/admin/restaurant" },
  { label: "Reviews",            icon: MdOutlineReviews,     to: "/admin/reviews" },
  { label: "Event Calendar",     icon: BsCalendar2Event ,    to: "/admin/Eventcalendar" },
  { label: "Google Maps",        icon: FiMapPin ,            to: "/admin/googlemap" },
  { label: "Users",              icon: FaRegUser,            to: "/admin/users" },
];

function NavItem({ item }) {
  const location = useLocation();
  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 20px",
        margin: "2px 10px",
        borderRadius: "12px",
        textDecoration: "none",
        background: isActive
          ? "linear-gradient(90deg, #FF9A3C 0%, #FF6B00 100%)"
          : "transparent",
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: isActive ? 600 : 400,
        fontSize: "15px",
        letterSpacing: "0.2px",
        transition: "background 0.2s ease, opacity 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={e => {
        if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={e => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon style={{ fontSize: "20px", flexShrink: 0 }} />
      <span>{item.label}</span>
      {isActive && (
        <span
          style={{
            marginLeft: "auto",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#fff",
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
}

function LiveDateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      style={{
        margin: "0 10px 10px",
        padding: "10px 14px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.10)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.55)",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.3px",
          marginBottom: "2px",
        }}
      >
        {dateStr}
      </div>
      <div
        style={{
          color: "#ffffff",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "18px",
          fontWeight: 600,
          letterSpacing: "1px",
        }}
      >
        {timeStr}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div style={{ width: "100%", height: "100vh", display: "flex" }}>

      {/* ── Sidebar ── */}
      <div
        style={{
          width: "260px",
          minWidth: "260px",
          height: "100%",
          background: "linear-gradient(180deg, #2E2F8F 0%, #1E1F6B 100%)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "24px 20px 20px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #FF9A3C, #FF6B00)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FaUmbrellaBeach style={{ color: "#fff", fontSize: "22px" }} />
          </div>
          <div>
            <div
              style={{
                color: "#ffffff",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: 1.1,
              }}
            >
              Admin
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12px",
                fontWeight: 400,
              }}
            >
              Tourism & Services
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 20px 10px" }} />

        {/* ── Live Date & Time ── */}
        <LiveDateTime />

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 20px 10px" }} />

        {/* Nav items */}
        <nav style={{ flex: 1, paddingBottom: "10px" }}>
          {navItems.map(item => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 20px 6px" }} />

        {/* Logout */}
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "12px 20px",
            margin: "4px 10px 16px",
            borderRadius: "12px",
            textDecoration: "none",
            color: "rgba(255,255,255,0.65)",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "15px",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.65)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <IoMdLogOut style={{ fontSize: "20px" }} />
          <span>Logout</span>
        </Link>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflow: "auto", background: "#f4f6fb" }}>
        <Routes>
          <Route path="/bookings"  element={<h1>Booking</h1>} />
          <Route path="/rooms"     element={<h1>Rooms</h1>} />
          <Route path="/items"     element={<AdminItemPage />} />
          <Route path="/items/add" element={<AddItemPage />} />
          <Route path="/items/edit"element={<UpdateItemPage/>}/>
        </Routes>
      </div>
    </div>
  );
}