import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/productCard";
import { getProducts, getPackages } from "../../utils/api";
import {
  FaBed,
  FaCampground,
  FaUtensils,
  FaCar,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const heroImages = [
  "https://www.andbeyond.com/wp-content/uploads/sites/5/yala-national-park-sri-lanka-scenery.jpg",
  "elephant.jpeg",
  "couple-hiking-mountains.jpg",
  "09c3f9ed-e05b-4371-ad35-010f5777f80d_istockphoto-1338160197-2048x2048.jpeg",
  "e44a5a77.avif",
];

const popularPlaces = [
  {
    name: "Yala National Park",
    location: "Block 1",
    distance: "2 km from entrance",
    image: "https://www.andbeyond.com/wp-content/uploads/sites/5/asian-leopard-yala-national-park-sri-lanka.jpg",
  },
  {
    name: "Kataragama Temple",
    location: "Kataragama",
    distance: "1 km",
    image: "https://nexttravelsrilanka.com/wp-content/uploads/2023/02/Kataragama.jpg",
  },
  {
    name: "Sithulpawwa Rock Temple",
    location: "Ancient monastery",
    distance: "12 km",
    image: "https://theportuguesetraveler.com/wp-content/uploads/2024/11/sithulpawwa-rock-temple-yala-sri-lanka-35.jpg.webp",
  },
];

/* ── Reviewer Avatar: real photo → coloured initials → icon ── */
function ReviewerAvatar({ src, name }) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  const avatarColors = [
    { bg: '#FEF3C7', text: '#92400E' },
    { bg: '#D1FAE5', text: '#065F46' },
    { bg: '#DBEAFE', text: '#1D4ED8' },
    { bg: '#FCE7F3', text: '#9D174D' },
    { bg: '#EDE9FE', text: '#5B21B6' },
    { bg: '#FFEDD5', text: '#9A3412' },
  ];
  const colorPick = name ? name.charCodeAt(0) % avatarColors.length : 0;
  const { bg, text } = avatarColors[colorPick];

  // Real photo
  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        style={{ border: "2px solid #F5EACF" }}
      />
    );
  }

  // Coloured initials fallback
  if (initials) {
    return (
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{ background: bg, color: text, border: "2px solid #F5EACF" }}
      >
        {initials}
      </div>
    );
  }

  // Generic icon fallback
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "#F5EDD8", border: "2px solid #F5EACF" }}
    >
      <FaUser size={16} style={{ color: "#D97706" }} />
    </div>
  );
}

/* ── Room Card ── */
function RoomCard({ room, checkIn, checkOut }) {
  const navigate = useNavigate();
  const isAvailable = room.availability && room.status !== "Maintenance";

  function handleBook(e) {
    e.stopPropagation();
    navigate(`/rooms/${room.key}`, { state: { checkIn, checkOut } });
  }

  return (
    <div
      className="group w-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
      style={{ background: "#FFFBF5", boxShadow: "0 4px 24px rgba(217,119,6,0.10)" }}
      onClick={handleBook}
    >
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <img
          src={room.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"}
          alt={room.roomType}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
            style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
            {room.roomType}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-sm"
            style={{ background: "rgba(255,251,245,0.92)", color: isAvailable ? "#D97706" : "#DC2626" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: isAvailable ? "#F59E0B" : "#EF4444" }} />
            {isAvailable ? "Available" : room.status === "Maintenance" ? "Maintenance" : "Unavailable"}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow" style={{ background: "#FFFBF5" }}>
        <h3 className="text-lg font-bold capitalize mb-1 line-clamp-1" style={{ color: "#292524" }}>
          {room.roomType} — Room {room.roomNumber}
        </h3>
        <p className="text-sm line-clamp-2 mb-3" style={{ color: "#A8A29E" }}>
          {room.description || `Capacity: ${room.capacity} guests · ${room.hotelName}`}
        </p>
        {room.facilities && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {Object.entries(room.facilities).filter(([, v]) => v).slice(0, 3).map(([k]) => (
              <span key={k} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                style={{ background: "#F5EDD8", color: "#D97706" }}>
                {k === "ac" ? "AC" : k === "wifi" ? "WiFi" : k === "tv" ? "TV" : k === "hotWater" ? "Hot Water" : k === "miniBar" ? "Mini Bar" : k === "parking" ? "Parking" : k}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-black" style={{ color: "#D97706" }}>{(room.price || 0).toLocaleString()}</span>
            <span className="text-xs font-semibold ml-1" style={{ color: "#A8A29E" }}>LKR / night</span>
          </div>
          {isAvailable ? (
            <button onClick={handleBook} className="px-4 py-2 text-xs font-bold rounded-full shadow transition-all duration-200 transform hover:scale-105 hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
              Book Now
            </button>
          ) : (
            <span className="px-4 py-2 text-xs font-bold rounded-full" style={{ background: "#F5EDD8", color: "#A8A29E" }}>Unavailable</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: "1px solid #F5EACF" }}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F59E0B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-xs font-medium truncate" style={{ color: "#A8A29E" }}>{room.hotelName}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [equipmentState, setEquipmentState] = useState("loading");
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [packagesState, setPackagesState] = useState("loading");
  const [packagesData, setPackagesData] = useState([]);
  const [safariVehicles, setSafariVehicles] = useState([]);
  const [vehiclesState, setVehiclesState] = useState("loading");
  const navigate = useNavigate();

  const [approvedReviews, setApprovedReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventsByDate, setEventsByDate] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [roomsState, setRoomsState] = useState("loading");
  const [liveRooms, setLiveRooms] = useState([]);

  const today    = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [checkIn,  setCheckIn]  = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guestCount,         setGuestCount]         = useState("");
  const [roomTypeFilter,     setRoomTypeFilter]     = useState("");
  const [roomsSearching,     setRoomsSearching]     = useState(false);
  const [roomsSearchDone,    setRoomsSearchDone]    = useState(false);
  const [roomsSearchResults, setRoomsSearchResults] = useState([]);

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));

  async function handleRoomsSearch() {
    if (!checkIn || !checkOut) return;
    setRoomsSearching(true); setRoomsSearchDone(false);
    try {
      const params = new URLSearchParams({ checkIn, checkOut });
      if (roomTypeFilter) params.append("roomType", roomTypeFilter);
      if (guestCount)     params.append("capacity", guestCount);
      const res = await axios.get(`${BASE}/api/rooms/search?${params}`);
      setRoomsSearchResults(res.data); setRoomsSearchDone(true);
    } catch { setRoomsSearchResults([]); setRoomsSearchDone(true); }
    setRoomsSearching(false);
  }

  function clearRoomsSearch() {
    setRoomsSearchDone(false); setRoomsSearchResults([]);
    setCheckIn(today); setCheckOut(tomorrow);
    setGuestCount(""); setRoomTypeFilter("");
  }

  useEffect(() => {
    axios.get('${import.meta.env.VITE_BACKEND_URL}/api/reviews')
      .then(res => setApprovedReviews(res.data))
      .catch(err => console.error('Failed to fetch reviews', err))
      .finally(() => setLoadingReviews(false));
  }, []);

  useEffect(() => { setCurrentReviewIndex(0); }, [approvedReviews]);

  useEffect(() => {
    axios.get('${import.meta.env.VITE_BACKEND_URL}/api/events')
      .then(res => {
        const allEvents = res.data.events || res.data;
        const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
        const upcoming = allEvents.filter(e => new Date(e.date) >= todayDate);
        const grouped = {};
        upcoming.forEach(event => {
          const key = format(new Date(event.date), 'yyyy-MM-dd');
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(event);
        });
        setEventsByDate(grouped);
      })
      .catch(err => console.error('Failed to fetch events:', err))
      .finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`)
      .then(res => { setSafariVehicles(res.data.slice(0, 4)); setVehiclesState("success"); })
      .catch(() => setVehiclesState("error"));
  }, []);

  useEffect(() => {
    axios.get(`${BASE}/api/rooms`)
      .then(res => {
        const available = res.data.filter(r => r.availability && r.status !== "Maintenance");
        setLiveRooms(available.slice(0, 4)); setRoomsState("success");
      })
      .catch(() => setRoomsState("error"));
  }, []);

  const monthStart     = startOfMonth(currentMonth);
  const monthEnd       = endOfMonth(currentMonth);
  const daysInMonth    = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const calendarDays   = [];
  for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
  calendarDays.push(...daysInMonth);
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  for (let i = calendarDays.length; i < totalCells; i++) calendarDays.push(null);

  const getEventsForDay = day => {
    if (!day) return [];
    return eventsByDate[format(day, 'yyyy-MM-dd')] || [];
  };
  const handleMouseEnter = (e, day) => {
    if (getEventsForDay(day).length === 0) return;
    setHoveredDay(day);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
  };
  const handleMouseLeave = () => setHoveredDay(null);
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => setCurrentImage(p => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  useEffect(() => {
    getProducts()
      .then(res => { setEquipmentItems(res.data.slice(0, 4)); setEquipmentState("success"); })
      .catch(() => setEquipmentState("error"));
  }, []);

  useEffect(() => {
    getPackages()
      .then(res => { setPackagesData(res.data); setPackagesState("success"); })
      .catch(() => setPackagesState("error"));
  }, []);

  const nextImage = () => { setIsAutoplay(false); setCurrentImage(p => (p + 1) % heroImages.length); };
  const prevImage = () => { setIsAutoplay(false); setCurrentImage(p => (p - 1 + heroImages.length) % heroImages.length); };

  const totalReviewPages  = Math.ceil(approvedReviews.length / 3);
  const currentReviewPage = Math.floor(currentReviewIndex / 3);

  return (
    <div className="w-full min-h-screen" style={{ background: "#FFFBF5" }}>

      {/* ── Hero ── */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {heroImages.map((img, index) => (
          <div key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,20,10,0.72) 0%, rgba(28,20,10,0.35) 60%, transparent 100%)" }} />
          </div>
        ))}
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white p-3 rounded-full transition"
          style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)" }}>
          <FaChevronLeft className="text-2xl" />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white p-3 rounded-full transition"
          style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)" }}>
          <FaChevronRight className="text-2xl" />
        </button>
        <div className="relative z-10 h-full flex flex-col justify-center items-start text-white px-8 md:px-16 max-w-7xl mx-auto">
          <div className="animate-fade-in max-w-3xl">
            <p className="text-lg md:text-xl font-light tracking-widest mb-4" style={{ color: "#FCD34D" }}>AN ISLAND ESCAPE AWAITS YOU</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to<br /><span style={{ color: "#FBBF24" }}>Yala & Kataragama</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed" style={{ color: "#F5F0E8" }}>
              Savour the unique experiences this island treasure has to offer — wildlife, heritage, and warm Sri Lankan hospitality.
            </p>
            <button className="font-semibold px-8 py-4 rounded-full shadow-2xl transition transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1C1917" }}>
              Discover Yala & Kataragama
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroImages.map((_, index) => (
            <button key={index} onClick={() => { setCurrentImage(index); setIsAutoplay(false); }} className="h-3 rounded-full transition-all"
              style={{ width: index === currentImage ? "2rem" : "0.75rem", background: index === currentImage ? "#FBBF24" : "rgba(255,255,255,0.5)" }} />
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#92400E" }}>Our Services</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#78716C" }}>Everything you need for an unforgettable trip</p>
        </div>
        <div className="grid md:grid-cols-4 gap-10">
          {[
            { icon: FaBed,        title: "Room Booking",     desc: "Comfortable lodges, hotels, and safari tents.",        grad: "linear-gradient(135deg,#FBBF24,#D97706)", route: "/rooms" },
            { icon: FaCampground, title: "Equipment Rental", desc: "Camping gear, sleeping bags, stoves, and more.",        grad: "linear-gradient(135deg,#F97316,#EA580C)", route: "/services" },
            { icon: FaUtensils,   title: "Restaurant Food",  desc: "Authentic Sri Lankan meals and fresh seafood.",         grad: "linear-gradient(135deg,#EF4444,#B91C1C)", route: "/restaurants" },
            { icon: FaCar,        title: "Vehicle Hire",     desc: "Safari jeeps, cars, and bikes with or without driver.", grad: "linear-gradient(135deg,#D97706,#92400E)", route: "/safari-vehicles" },
          ].map((item, index) => (
            <div key={index} onClick={() => navigate(item.route)}
              className="group rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border cursor-pointer"
              style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 24px rgba(217,119,6,0.08)" }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: item.grad }}>
                <item.icon className="text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#292524" }}>{item.title}</h3>
              <p style={{ color: "#78716C" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Popular Places ── */}
      <div className="py-20 px-6 md:px-8" style={{ background: "#F5EDD8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D97706" }}>Discover the Region</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Near Popular Places</h2>
            <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#78716C" }}>
              Wildlife sanctuaries, ancient temples, and breathtaking landscapes — all within reach from your stay.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {popularPlaces.map((place, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 20px rgba(217,119,6,0.08)" }}>
                <div className="relative h-56 overflow-hidden">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(41,37,36,0.55) 0%, transparent 60%)" }} />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(251,191,36,0.92)", color: "#78350F" }}>
                    <FaMapMarkerAlt className="text-xs" />{place.distance}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#D97706" }}>{place.location}</p>
                  <h3 className="text-xl font-bold mb-5" style={{ color: "#292524" }}>{place.name}</h3>
                  <button onClick={() => navigate(`/place/${place.name}`, { state: { image: place.image } })}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.45)", letterSpacing: "0.04em" }}>
                    <FaMapMarkerAlt className="text-xs" />Explore This Place
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hotels & Rooms ── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Our Hotels & Rooms</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Choose your perfect stay</p>
        </div>
        <div className="rounded-2xl p-5 mb-10" style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}>
          <div className="flex flex-wrap items-end gap-4">
            {[
              { label: "Check-In", icon: "📅", type: "date", value: checkIn, min: today, onChange: e => { setCheckIn(e.target.value); setRoomsSearchDone(false); } },
              { label: "Check-Out", icon: "📅", type: "date", value: checkOut, min: checkIn, onChange: e => { setCheckOut(e.target.value); setRoomsSearchDone(false); } },
            ].map(({ label, icon, type, value, min, onChange }) => (
              <div key={label} className="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#92400E" }}>{label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none">{icon}</span>
                  <input type={type} value={value} min={min} onChange={onChange}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "#FFFBF5", border: "1.5px solid #FCD34D", color: "#292524", colorScheme: "light" }} />
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#92400E" }}>Guests</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none">👥</span>
                <select value={guestCount} onChange={e => setGuestCount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                  style={{ background: "#FFFBF5", border: "1.5px solid #FCD34D", color: "#292524" }}>
                  <option value="">Any</option>
                  {["1","2","3","4"].map(n => <option key={n} value={n}>{n}{n==="4"?"+":""} Guest{n!=="1"?"s":""}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#92400E" }}>Room Type</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none">🛏</span>
                <select value={roomTypeFilter} onChange={e => setRoomTypeFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                  style={{ background: "#FFFBF5", border: "1.5px solid #FCD34D", color: "#292524" }}>
                  <option value="">Any Type</option>
                  {["Standard","Deluxe","Suite","Family"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleRoomsSearch} disabled={roomsSearching}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: roomsSearching ? "#E8D9B8" : "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917", cursor: roomsSearching ? "not-allowed" : "pointer", marginTop: "21px", whiteSpace: "nowrap" }}>
              {roomsSearching ? <><span className="w-4 h-4 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" /> Searching…</> : <>🔍 Check Availability</>}
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(217,119,6,0.12)", color: "#D97706", border: "1px solid rgba(217,119,6,0.25)" }}>
              📅 {checkIn} → {checkOut} · {nights} night{nights !== 1 ? "s" : ""}
            </span>
            {roomsSearchDone && (
              <>
                {roomsSearchResults.length === 0
                  ? <span className="text-xs font-semibold" style={{ color: "#DC2626" }}>😔 No rooms available for these dates</span>
                  : <span className="text-xs font-semibold" style={{ color: "#059669" }}>✅ {roomsSearchResults.length} room{roomsSearchResults.length !== 1 ? "s" : ""} available</span>}
                <button onClick={clearRoomsSearch} className="text-xs font-bold px-3 py-1 rounded-full border transition hover:bg-amber-50"
                  style={{ color: "#D97706", borderColor: "#D97706" }}>Clear ×</button>
              </>
            )}
          </div>
        </div>
        {roomsState === "loading" && <div className="flex flex-col justify-center items-center py-20 gap-4"><div className="w-12 h-12 border-4 rounded-full border-amber-200 border-t-amber-500 animate-spin" /><p className="text-sm font-medium" style={{ color: "#A8A29E" }}>Loading rooms...</p></div>}
        {roomsState === "error" && (
          <div className="text-center py-16 rounded-2xl border border-dashed max-w-md mx-auto" style={{ borderColor: "#F5EACF", background: "#FFFFFF" }}>
            <div className="text-5xl mb-4">🛏</div>
            <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>Could not load rooms</p>
            <p className="text-sm mb-6" style={{ color: "#78716C" }}>Please check your connection and try again.</p>
            <button onClick={() => navigate("/rooms")} className="px-8 py-3 rounded-full font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>Browse All Rooms</button>
          </div>
        )}
        {roomsSearching && <div className="flex flex-col items-center justify-center py-20 gap-4"><div className="w-12 h-12 border-4 rounded-full border-amber-200 border-t-amber-500 animate-spin" /><p className="text-sm font-semibold" style={{ color: "#78716C" }}>Checking availability…</p></div>}
        {roomsSearchDone && !roomsSearching && (
          <>
            {roomsSearchResults.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed max-w-md mx-auto" style={{ borderColor: "#F5EACF", background: "#FFFFFF" }}>
                <div className="text-5xl mb-4">🛏</div>
                <p className="text-xl font-bold mb-2" style={{ color: "#292524" }}>No rooms available</p>
                <p className="mb-6" style={{ color: "#78716C" }}>Try different dates or adjust filters.</p>
                <button onClick={clearRoomsSearch} className="px-6 py-2.5 rounded-full font-semibold text-sm" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>Clear & Browse All</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-4 gap-8">
                {roomsSearchResults.map(room => <RoomCard key={room._id} room={room} checkIn={checkIn} checkOut={checkOut} />)}
              </div>
            )}
            <div className="text-center mt-12">
              <button onClick={() => navigate("/rooms")} className="group inline-flex items-center gap-2 px-10 py-3.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.40)" }}>
                View All Rooms <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </>
        )}
        {roomsState === "success" && !roomsSearchDone && !roomsSearching && (
          <>
            {liveRooms.length === 0 ? (
              <div className="text-center py-16"><div className="text-5xl mb-4">🛏</div><p className="text-lg font-semibold" style={{ color: "#78716C" }}>No rooms available at the moment.</p></div>
            ) : (
              <div className="grid md:grid-cols-4 gap-8">
                {liveRooms.map(room => <RoomCard key={room._id} room={room} checkIn={checkIn} checkOut={checkOut} />)}
              </div>
            )}
            <div className="text-center mt-12">
              <button onClick={() => navigate("/rooms")} className="group inline-flex items-center gap-2 px-10 py-3.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.40)" }}>
                View All Rooms <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Equipment Rental ── */}
      <div className="py-20 px-6 md:px-8" style={{ background: "#F8F4EE" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D97706" }}>Gear Up for Adventure</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Rent Equipment</h2>
            <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#78716C" }}>Everything you need for the wild — tents, sleeping bags, safari gear and more, available to hire.</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #D97706)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#D97706" }} />
              <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #D97706)" }} />
            </div>
          </div>
          {equipmentState === "loading" && <div className="flex flex-col justify-center items-center py-20 gap-4"><div className="w-12 h-12 border-4 rounded-full border-amber-200 border-t-amber-500 animate-spin" /><p className="text-sm font-medium" style={{ color: "#A8A29E" }}>Loading equipment...</p></div>}
          {equipmentState === "error" && (
            <div className="text-center py-16 rounded-2xl border border-dashed max-w-md mx-auto" style={{ borderColor: "#F5EACF", background: "#FFFFFF" }}>
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>Could not load equipment</p>
              <p className="text-sm mb-6" style={{ color: "#78716C" }}>Please check your connection and try again.</p>
              <button onClick={() => navigate("/services")} className="px-8 py-3 rounded-full font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>Browse All Equipment</button>
            </div>
          )}
          {equipmentState === "success" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {equipmentItems.map(item => (
                  <div key={item._id} className="group rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ background: "#FFFFFF", borderColor: "#EDE8DF", boxShadow: "0 2px 12px rgba(217,119,6,0.07)" }}>
                    <ProductCard item={item} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-14">
                <button onClick={() => navigate("/services")} className="group inline-flex items-center gap-2 px-10 py-3.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.40)" }}>
                  View All Equipment <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Safari Vehicles ── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Booking Safari Vehicles</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Explore Yala in style — jeeps and cars available</p>
        </div>
        {vehiclesState === "loading" && <div className="flex flex-col justify-center items-center py-20 gap-4"><div className="w-12 h-12 border-4 rounded-full border-amber-200 border-t-amber-500 animate-spin" /><p className="text-sm font-medium" style={{ color: "#A8A29E" }}>Loading vehicles...</p></div>}
        {vehiclesState === "error" && (
          <div className="text-center py-16 rounded-2xl border border-dashed max-w-md mx-auto" style={{ borderColor: "#F5EACF", background: "#FFFFFF" }}>
            <div className="text-5xl mb-4">🚗</div>
            <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>Could not load vehicles</p>
            <p className="text-sm mb-6" style={{ color: "#78716C" }}>Please check your connection and try again.</p>
            <button onClick={() => navigate("/safari-vehicles")} className="px-8 py-3 rounded-full font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>Browse All Vehicles</button>
          </div>
        )}
        {vehiclesState === "success" && (
          <>
            <div className="grid md:grid-cols-4 gap-8">
              {safariVehicles.map(vehicle => (
                <div key={vehicle._id} className="rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border"
                  style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 20px rgba(217,119,6,0.08)" }}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={vehicle.image?.[0] || "/placeholder-vehicle.jpg"} alt={vehicle.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm" style={{ background: vehicle.availability ? "#10B981" : "#EF4444", color: "white" }}>
                        {vehicle.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.70)", color: "#F59E0B" }}>
                        {vehicle.type === "Safari Jeep" ? "4×4" : "CAR"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-base mb-1" style={{ color: "#292524" }}>{vehicle.name}</h4>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: "#A8A29E" }}>{vehicle.description || "No description available"}</p>
                    <div className="flex items-center justify-between text-xs mb-3" style={{ color: "#6B7280" }}>
                      <div className="flex items-center gap-1"><FaMapMarkerAlt className="text-[10px]" style={{ color: "#F59E0B" }} /><span>Kataragama</span></div>
                      <div className="flex items-center gap-1"><FaUsers className="text-[10px]" /><span>{vehicle.capacity} persons</span></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-lg" style={{ color: "#D97706" }}>
                        LKR {vehicle.pricePerDay?.toLocaleString()}
                        <span className="text-xs font-normal ml-1" style={{ color: "#9CA3AF" }}>/day</span>
                      </span>
                      <button onClick={() => navigate("/safari-vehicles", { state: { bookVehicleId: vehicle._id } })}
                        disabled={!vehicle.availability}
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition hover:opacity-90"
                        style={{ background: vehicle.availability ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "#E5E7EB", color: vehicle.availability ? "#1C1917" : "#9CA3AF", cursor: vehicle.availability ? "pointer" : "not-allowed" }}>
                        {vehicle.availability ? "Book Vehicle" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button onClick={() => navigate("/safari-vehicles")} className="group inline-flex items-center gap-2 px-10 py-3.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.40)" }}>
                View All Vehicles <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Events Calendar ── */}
      <div className="py-20 px-4 relative overflow-hidden" style={{ background: "#F5EDD8" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #D97706 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Upcoming Events & Festivals</h2>
            <p className="text-lg" style={{ color: "#78716C" }}>Experience the vibrant culture and celebrations</p>
          </div>
          {loadingEvents ? (
            <div className="text-center py-8 text-gray-500">Loading events...</div>
          ) : Object.keys(eventsByDate).length === 0 ? (
            <div className="text-center py-8 text-gray-500">No upcoming events at the moment.</div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-100/50">
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-amber-100/50 bg-gradient-to-r from-amber-50 to-white">
                <button onClick={prevMonth} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors" style={{ color: "#D97706" }}><FaChevronLeft /></button>
                <h3 className="text-xl md:text-2xl font-semibold tracking-wide" style={{ color: "#292524" }}>{format(currentMonth, 'MMMM yyyy')}</h3>
                <button onClick={nextMonth} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors" style={{ color: "#D97706" }}><FaChevronRight /></button>
              </div>
              <div className="grid grid-cols-7 bg-amber-50/40 border-b border-amber-100/50">
                {weekDays.map(day => <div key={day} className="py-3 text-center text-sm font-semibold uppercase tracking-wider" style={{ color: "#92400E" }}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="p-3 border-r border-b border-amber-100/30" style={{ background: "#FFFBF5" }} />;
                  const eventsForDay   = getEventsForDay(day);
                  const hasEvents      = eventsForDay.length > 0;
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isTodayFlag    = isToday(day);
                  return (
                    <div key={day.toISOString()}
                      className={`relative group p-3 md:p-4 border-r border-b border-amber-100/30 transition-all duration-200 ${!isCurrentMonth ? 'opacity-30' : 'hover:shadow-md hover:z-10'} ${hasEvents ? 'cursor-pointer' : ''}`}
                      style={{ background: isTodayFlag ? '#FFF7ED' : '#FFFBF5' }}
                      onMouseEnter={e => handleMouseEnter(e, day)} onMouseLeave={handleMouseLeave}>
                      <div className={`text-right mb-2 ${isTodayFlag ? 'font-bold' : ''}`}>
                        <span className={`inline-block w-8 h-8 leading-8 text-center rounded-full text-sm font-medium ${isTodayFlag ? 'bg-amber-500 text-white shadow-md' : 'text-gray-700'} ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                          {format(day, 'd')}
                        </span>
                      </div>
                      {hasEvents && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm">{eventsForDay.length}</div>
                        </div>
                      )}
                      {hasEvents && <div className="absolute inset-0 bg-amber-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Safari Packages ── */}
      <div className="py-20 px-6 md:px-8" style={{ background: "linear-gradient(135deg, #F5EDD8 0%, #EDE0C4 50%, #E8D5B0 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#B45309" }}>WildHaven Resort & Safari</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Special Safari Packages</h2>
            <p className="text-lg" style={{ color: "#78716C" }}>Handcrafted experiences — from thrilling safaris to serene cultural journeys</p>
          </div>
          {packagesState === "loading" && <div className="flex justify-center items-center py-20"><div className="w-12 h-12 border-4 rounded-full border-amber-800 border-t-amber-400 animate-spin" /></div>}
          {packagesState === "error" && <div className="text-center py-16"><p className="text-lg mb-6" style={{ color: "#FDE68A" }}>Could not load packages. Please try again.</p></div>}
          {packagesState === "success" && (
            <>
              <div className="relative">
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${Math.floor(currentPackageIndex / 3) * 100}%)` }}>
                    {Array.from({ length: Math.ceil(packagesData.length / 3) }).map((_, slideIdx) => (
                      <div key={slideIdx} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-7">
                        {packagesData.slice(slideIdx * 3, slideIdx * 3 + 3).map((pkg, i) => {
                          const index = slideIdx * 3 + i;
                          const isPopular = index === 0;
                          const includesArray = Array.isArray(pkg.includes) ? pkg.includes : (pkg.includes ? [pkg.includes] : []);
                          return (
                            <div key={pkg._id || index} onClick={() => navigate(`/package/${pkg.packageId}`)}
                              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col"
                              style={{ background: "#FFFFFF", boxShadow: isPopular ? "0 0 0 2.5px #D4A843, 0 12px 40px rgba(0,0,0,0.15)" : "0 4px 24px rgba(0,0,0,0.10)" }}>
                              <div className="relative h-52 overflow-hidden flex-shrink-0">
                                <img src={pkg.images?.[0] || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80"} alt={pkg.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80"; }} />
                                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />
                                {isPopular && <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "#D4A843", color: "#1C1409" }}>★ Most Popular</div>}
                                {pkg.category && <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(0,0,0,0.65)", color: "#F5F0E8", backdropFilter: "blur(4px)" }}>{pkg.category}</div>}
                                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 px-4 py-2.5">
                                  {pkg.duration && <span className="flex items-center gap-1.5 text-xs font-semibold text-white"><FaClock className="text-amber-400 text-[10px]" />{pkg.duration.days}D / {pkg.duration.nights}N</span>}
                                  {pkg.maxGroupSize && <span className="flex items-center gap-1.5 text-xs font-semibold text-white"><FaUsers className="text-amber-400 text-[10px]" />Max {pkg.maxGroupSize}</span>}
                                </div>
                              </div>
                              <div className="p-5 flex flex-col flex-grow" style={{ background: "#FFFFFF" }}>
                                <h3 className="text-xl font-bold mb-2 leading-snug" style={{ color: "#1C1409" }}>{pkg.name}</h3>
                                <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#78716C" }}>{pkg.description}</p>
                                {includesArray.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {includesArray.slice(0, 4).map((inc, j) => <span key={j} className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: "#FEF3C7", color: "#92400E" }}>{inc}</span>)}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid #F5EACF" }}>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#A8A29E" }}>FROM</p>
                                    <p className="text-xl font-black leading-none" style={{ color: "#D97706" }}>LKR {(pkg.price || 0).toLocaleString()}<span className="text-xs font-medium ml-1" style={{ color: "#A8A29E" }}>/person</span></p>
                                  </div>
                                  <button onClick={e => { e.stopPropagation(); navigate(`/package/${pkg.packageId}`); }}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 hover:shadow-lg hover:scale-105"
                                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1409" }}>
                                    Explore <FaChevronRight className="text-[10px]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                {packagesData.length > 3 && (
                  <>
                    <button onClick={() => setCurrentPackageIndex(prev => Math.max(0, prev - 3))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)", color: "#92400E" }}>
                      <FaChevronLeft className="text-xl" />
                    </button>
                    <button onClick={() => setCurrentPackageIndex(prev => Math.min(packagesData.length - 1, prev + 3))}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)", color: "#92400E" }}>
                      <FaChevronRight className="text-xl" />
                    </button>
                  </>
                )}
              </div>
              {packagesData.length > 3 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.ceil(packagesData.length / 3) }).map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentPackageIndex(idx * 3)} className="h-2.5 rounded-full transition-all duration-300"
                      style={{ width: Math.floor(currentPackageIndex / 3) === idx ? "2rem" : "0.625rem", background: Math.floor(currentPackageIndex / 3) === idx ? "#D97706" : "rgba(217,119,6,0.3)" }} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── What Our Customers Say ── */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>What Our Customers Say</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Real experiences from our guests</p>
        </div>

        {loadingReviews ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-10 h-10 border-4 rounded-full border-amber-200 border-t-amber-500 animate-spin" />
            <p className="text-sm font-medium" style={{ color: "#A8A29E" }}>Loading reviews...</p>
          </div>
        ) : approvedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to share your experience!</div>
        ) : (
          <div>
            {/* 3-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {approvedReviews.slice(currentReviewIndex, currentReviewIndex + 3).map((review, index) => (
                <div key={index}
                  className="rounded-2xl p-6 border flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 24px rgba(217,119,6,0.08)" }}>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} style={{
                        fontSize: "18px",
                        color: i < review.rating ? "#FBBF24" : "#E7E5E4",
                        filter: i < review.rating ? "drop-shadow(0 1px 2px rgba(251,191,36,0.4))" : "none",
                      }} />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="italic leading-relaxed flex-1 text-sm" style={{ color: "#57534E" }}>
                    "{review.comment}"
                  </p>

                  {/* Divider */}
                  <div className="h-px w-full" style={{ background: "#F5EACF" }} />

                  {/* Reviewer — real photo with fallback */}
                  <div className="flex items-center gap-3">
                    <ReviewerAvatar src={review.profilePicture} name={review.name} />
                    <div>
                      <p className="font-bold text-sm leading-tight" style={{ color: "#292524" }}>{review.name}</p>
                      {review.section && review.section !== "All" && (
                        <p className="text-xs mt-0.5" style={{ color: "#D97706" }}>{review.section}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prev · dots · Next */}
            {approvedReviews.length > 3 && (
              <div className="flex items-center justify-center gap-5 mb-8">
                <button
                  onClick={() => setCurrentReviewIndex(prev => Math.max(0, prev - 3))}
                  disabled={currentReviewIndex === 0}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ borderColor: "#D97706", color: "#D97706", background: "transparent" }}>
                  <FaChevronLeft className="text-sm" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalReviewPages }).map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentReviewIndex(idx * 3)}
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{ width: currentReviewPage === idx ? "2rem" : "0.625rem", background: currentReviewPage === idx ? "#D97706" : "rgba(217,119,6,0.3)" }} />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentReviewIndex(prev => Math.min(approvedReviews.length - 3, prev + 3))}
                  disabled={currentReviewIndex + 3 >= approvedReviews.length}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ borderColor: "#D97706", color: "#D97706", background: "transparent" }}>
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}

            {/* View All Reviews */}
            <div className="text-center">
              <button onClick={() => navigate("/reviews")}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold border-2 transition-all duration-200 hover:scale-105 hover:bg-amber-50"
                style={{ borderColor: "#D97706", color: "#D97706", background: "transparent" }}>
                Share Your Experience →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="text-white py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #D97706, #B45309, #92400E)" }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for Your Sri Lankan Adventure?</h2>
          <p className="text-xl mb-8 leading-relaxed" style={{ color: "#FEF3C7" }}>
            Sign up today and get 10% off your first booking. No hidden fees, cancel anytime.
          </p>
          <button className="font-bold px-10 py-4 rounded-full shadow-2xl transition transform hover:scale-105 text-lg" style={{ background: "#FBBF24", color: "#1C1917" }}>
            Get Started
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="py-12 px-4" style={{ background: "#1C1917" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: "#78716C" }}>© 2026 Yala & Kataragama Travel Hub. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            {["Privacy", "Terms", "Contact"].map(link => (
              <a key={link} href="#" className="transition hover:text-amber-400" style={{ color: "#78716C" }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Calendar tooltip */}
      {hoveredDay && (
        <div className="fixed z-50 bg-white rounded-lg shadow-lg p-3 border border-amber-200 max-w-xs"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y, transform: 'translate(-50%, -100%)', pointerEvents: 'none' }}>
          <div className="text-sm font-bold mb-1" style={{ color: "#D97706" }}>{format(hoveredDay, 'MMMM d, yyyy')}</div>
          {getEventsForDay(hoveredDay).map(event => (
            <div key={event._id} className="mb-2 last:mb-0">
              <div className="font-semibold" style={{ color: "#292524" }}>{event.title}</div>
              <div className="text-xs text-gray-500">{event.startTime && event.endTime && `${event.startTime} – ${event.endTime}`}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{event.description}</div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </div>
  );
}