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
  FaTag,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';

//hero images
const heroImages = [
  "https://www.andbeyond.com/wp-content/uploads/sites/5/yala-national-park-sri-lanka-scenery.jpg",
  "elephant.jpeg",
  "https://adventuresnolimits.com/wp-content/uploads/2023/05/Yala_National_Park_Sri_Lanka_2012-przerobione.jpg",
  "https://www.honeymoonguidesrilanka.com/wp-content/uploads/2024/10/Kathragama-1200x630-1.jpg",
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

const availableRooms = [
  {
    name: "Safari Lodge Room",
    capacity: "2 Adults",
    price: "$85/night",
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
  },
  {
    name: "Eco Cabin",
    capacity: "4 Adults",
    price: "$120/night",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
  },
  {
    name: "Luxury Safari Tent",
    capacity: "2 Adults",
    price: "$95/night",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1175&q=80",
  },
  {
    name: "Hotel Deluxe (Kataragama)",
    capacity: "2 Adults + 1 Child",
    price: "$70/night",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  },
];

const testimonials = [
  { name: "David W.", rating: 5, text: "Unforgettable experience in Yala! The jeep safari was thrilling and the lodge was very comfortable." },
  { name: "Priya K.", rating: 5, text: "Kataragama temple visit was spiritual, and the hotel staff were incredibly welcoming. Will come again." },
  { name: "Mike T.", rating: 5, text: "The camping gear was top-notch, and the food at the restaurant was delicious. Highly recommended!" },
];

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

  // Reviews carousel
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Calendar state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventsByDate, setEventsByDate] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Fetch approved reviews
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        setApprovedReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchApprovedReviews();
  }, []);

  // Reset review carousel index
  useEffect(() => {
    setCurrentReviewIndex(0);
  }, [approvedReviews]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        const allEvents = response.data.events || response.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = allEvents.filter(event => new Date(event.date) >= today);
        setEvents(upcoming);

        const grouped = {};
        upcoming.forEach(event => {
          const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(event);
        });
        setEventsByDate(grouped);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch safari vehicles
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`)
      .then((res) => {
        setSafariVehicles(res.data.slice(0, 4));
        setVehiclesState("success");
      })
      .catch(() => setVehiclesState("error"));
  }, []);

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  calendarDays.push(...daysInMonth);
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  for (let i = calendarDays.length; i < totalCells; i++) {
    calendarDays.push(null);
  }

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateKey = format(day, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  };

  const handleMouseEnter = (e, day) => {
    const eventsForDay = getEventsForDay(day);
    if (eventsForDay.length === 0) return;
    setHoveredDay(day);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => setHoveredDay(null);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Hero slideshow autoplay
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  useEffect(() => {
    getProducts()
      .then((res) => { setEquipmentItems(res.data.slice(0, 4)); setEquipmentState("success"); })
      .catch(() => setEquipmentState("error"));
  }, []);

  useEffect(() => {
    getPackages()
      .then((res) => { setPackagesData(res.data); setPackagesState("success"); })
      .catch(() => setPackagesState("error"));
  }, []);

  const nextImage = () => { setIsAutoplay(false); setCurrentImage((prev) => (prev + 1) % heroImages.length); };
  const prevImage = () => { setIsAutoplay(false); setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length); };

  return (
    <div className="w-full min-h-screen" style={{ background: "#FFFBF5" }}>

      {/* ── Hero Slideshow ─────────────────────────────────────────────── */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,20,10,0.72) 0%, rgba(28,20,10,0.35) 60%, transparent 100%)" }} />
          </div>
        ))}
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white p-3 rounded-full transition" style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)" }}>
          <FaChevronLeft className="text-2xl" />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white p-3 rounded-full transition" style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)" }}>
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
            <button className="font-semibold px-8 py-4 rounded-full shadow-2xl transition transform hover:scale-105" style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)", color: "#1C1917" }}>
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

      {/* ── Services ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#92400E" }}>Our Services</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#78716C" }}>Everything you need for an unforgettable trip</p>
        </div>
        <div className="grid md:grid-cols-4 gap-10">
          {[
            { icon: FaBed, title: "Room Booking", desc: "Comfortable lodges, hotels, and safari tents.", grad: "linear-gradient(135deg,#FBBF24,#D97706)", route: "/room-booking" },
            { icon: FaCampground, title: "Equipment Rental", desc: "Camping gear, sleeping bags, stoves, and more.", grad: "linear-gradient(135deg,#F97316,#EA580C)", route: "/services" },
            { icon: FaUtensils, title: "Restaurant Food", desc: "Authentic Sri Lankan meals and fresh seafood.", grad: "linear-gradient(135deg,#EF4444,#B91C1C)", route: "/restaurant-food" },
            { icon: FaCar, title: "Vehicle Hire", desc: "Safari jeeps, cars, and bikes with or without driver.", grad: "linear-gradient(135deg,#D97706,#92400E)", route: "/safari-vehicles" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.route)}
              className="group rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border cursor-pointer"
              style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 24px rgba(217,119,6,0.08)" }}
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: item.grad }}>
                <item.icon className="text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#292524" }}>{item.title}</h3>
              <p style={{ color: "#78716C" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Popular Places ─────────────────────────────────────────────── */}
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
              <div
                key={i}
                className="group rounded-2xl overflow-hidden border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 20px rgba(217,119,6,0.08)" }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(41,37,36,0.55) 0%, transparent 60%)" }} />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(251,191,36,0.92)", color: "#78350F" }}>
                    <FaMapMarkerAlt className="text-xs" />
                    {place.distance}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#D97706" }}>{place.location}</p>
                  <h3 className="text-xl font-bold mb-5" style={{ color: "#292524" }}>{place.name}</h3>
                  <button
                    onClick={() => navigate(`/place/${place.name}`, { state: { image: place.image } })}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
                    style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.45)", letterSpacing: "0.04em" }}
                  >
                    <FaMapMarkerAlt className="text-xs" />
                    Explore This Place
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Available Rooms ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Available Rooms</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Choose your perfect stay</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {availableRooms.map((room, index) => (
            <div key={index} className="rounded-xl overflow-hidden hover:shadow-2xl transition" style={{ background: "#FFFBF5", boxShadow: "0 4px 20px rgba(146,64,14,0.10)" }}>
              <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h4 className="font-bold text-lg mb-1" style={{ color: "#292524" }}>{room.name}</h4>
                <p className="text-sm mb-4" style={{ color: "#A8A29E" }}>{room.capacity}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xl" style={{ color: "#D97706" }}>{room.price}</span>
                  <button onClick={() => navigate("/room-booking")} className="px-4 py-2 rounded-lg text-sm font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Equipment Rental — live from API via ProductCard ───────────── */}
      <div className="py-20 px-6 md:px-8" style={{ background: "#F8F4EE" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D97706" }}>Gear Up for Adventure</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Rent Equipment</h2>
            <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#78716C" }}>
              Everything you need for the wild — tents, sleeping bags, safari gear and more, available to hire.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #D97706)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#D97706" }} />
              <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #D97706)" }} />
            </div>
          </div>

          {equipmentState === "loading" && (
            <div className="flex flex-col justify-center items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 rounded-full border-amber-200 border-t-amber-500 animate-spin" />
              <p className="text-sm font-medium" style={{ color: "#A8A29E" }}>Loading equipment...</p>
            </div>
          )}

          {equipmentState === "error" && (
            <div className="text-center py-16 rounded-2xl border border-dashed max-w-md mx-auto" style={{ borderColor: "#F5EACF", background: "#FFFFFF" }}>
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>Could not load equipment</p>
              <p className="text-sm mb-6" style={{ color: "#78716C" }}>Please check your connection and try again.</p>
              <button onClick={() => navigate("/services")} className="px-8 py-3 rounded-full font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
                Browse All Equipment
              </button>
            </div>
          )}

          {equipmentState === "success" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {equipmentItems.map((item) => (
                  <div
                    key={item._id}
                    className="group rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ background: "#FFFFFF", borderColor: "#EDE8DF", boxShadow: "0 2px 12px rgba(217,119,6,0.07)" }}
                  >
                    <ProductCard item={item} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-14">
                <button
                  onClick={() => navigate("/services")}
                  className="group inline-flex items-center gap-2 px-10 py-3.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.40)" }}
                >
                  View All Equipment
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Rent Safari Vehicles — live from API ───────────────────────── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Rent Safari Vehicles</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Explore Yala in style — jeeps and cars available</p>
        </div>

        {vehiclesState === "loading" && (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="w-12 h-12 border-4 rounded-full border-amber-200 border-t-amber-500 animate-spin" />
            <p className="text-sm font-medium" style={{ color: "#A8A29E" }}>Loading vehicles...</p>
          </div>
        )}

        {vehiclesState === "error" && (
          <div className="text-center py-16 rounded-2xl border border-dashed max-w-md mx-auto" style={{ borderColor: "#F5EACF", background: "#FFFFFF" }}>
            <div className="text-5xl mb-4">🚗</div>
            <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>Could not load vehicles</p>
            <p className="text-sm mb-6" style={{ color: "#78716C" }}>Please check your connection and try again.</p>
            <button onClick={() => navigate("/safari-vehicles", { state: { bookVehicleId: vehicle._id } })} className="px-8 py-3 rounded-full font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
              Browse All Vehicles
            </button>
          </div>
        )}

        {vehiclesState === "success" && (
          <>
            <div className="grid md:grid-cols-4 gap-8">
              {safariVehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border"
                  style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 20px rgba(217,119,6,0.08)" }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={vehicle.image?.[0] || "/placeholder-vehicle.jpg"}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                        style={{ background: vehicle.availability ? "#10B981" : "#EF4444", color: "white" }}
                      >
                        {vehicle.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded"
                        style={{ background: "rgba(0,0,0,0.70)", color: "#F59E0B" }}
                      >
                        {vehicle.type === "Safari Jeep" ? "4×4" : "CAR"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-base mb-1" style={{ color: "#292524" }}>{vehicle.name}</h4>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: "#A8A29E" }}>
                      {vehicle.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-3" style={{ color: "#6B7280" }}>
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[10px]" style={{ color: "#F59E0B" }} />
                        <span>Kataragama</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-[10px]" />
                        <span>{vehicle.capacity} persons</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-lg" style={{ color: "#D97706" }}>
                        LKR {vehicle.pricePerDay?.toLocaleString()}
                        <span className="text-xs font-normal ml-1" style={{ color: "#9CA3AF" }}>/day</span>
                      </span>
                      <button
                        onClick={() => navigate("/safari-vehicles", { state: { bookVehicleId: vehicle._id } })}
                        disabled={!vehicle.availability}
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition hover:opacity-90"
                        style={{
                          background: vehicle.availability ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "#E5E7EB",
                          color: vehicle.availability ? "#1C1917" : "#9CA3AF",
                          cursor: vehicle.availability ? "pointer" : "not-allowed"
                        }}
                      >
                        {vehicle.availability ? "Book Vehicle" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/safari-vehicles")}
                className="group inline-flex items-center gap-2 px-10 py-3.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#78350F", boxShadow: "0 4px 14px rgba(251,191,36,0.40)" }}
              >
                View All Vehicles
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Upcoming Events Calendar ────────────────────────────────────── */}
      <div className="py-20 px-4 relative overflow-hidden" style={{ background: "#F5EDD8" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, #D97706 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>
              Upcoming Events & Festivals
            </h2>
            <p className="text-lg" style={{ color: "#78716C" }}>
              Experience the vibrant culture and celebrations
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center py-8 text-gray-500">Loading events...</div>
          ) : Object.keys(eventsByDate).length === 0 ? (
            <div className="text-center py-8 text-gray-500">No upcoming events at the moment.</div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-100/50">
              {/* Calendar Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-amber-100/50 bg-gradient-to-r from-amber-50 to-white">
                <button
                  onClick={prevMonth}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"
                  style={{ color: "#D97706" }}
                >
                  <FaChevronLeft />
                </button>
                <h3 className="text-xl md:text-2xl font-semibold tracking-wide" style={{ color: "#292524" }}>
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={nextMonth}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"
                  style={{ color: "#D97706" }}
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-amber-50/40 border-b border-amber-100/50">
                {weekDays.map(day => (
                  <div key={day} className="py-3 text-center text-sm font-semibold uppercase tracking-wider" style={{ color: "#92400E" }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="p-3 border-r border-b border-amber-100/30" style={{ background: "#FFFBF5" }} />;
                  }
                  const eventsForDay = getEventsForDay(day);
                  const hasEvents = eventsForDay.length > 0;
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isTodayFlag = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        relative group p-3 md:p-4 border-r border-b border-amber-100/30 transition-all duration-200
                        ${!isCurrentMonth ? 'opacity-30' : 'hover:shadow-md hover:z-10'}
                        ${hasEvents ? 'cursor-pointer' : ''}
                      `}
                      style={{ background: isTodayFlag ? '#FFF7ED' : '#FFFBF5' }}
                      onMouseEnter={(e) => handleMouseEnter(e, day)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={`text-right mb-2 ${isTodayFlag ? 'font-bold' : ''}`}>
                        <span
                          className={`
                            inline-block w-8 h-8 leading-8 text-center rounded-full text-sm font-medium
                            ${isTodayFlag ? 'bg-amber-500 text-white shadow-md' : 'text-gray-700'}
                            ${!isCurrentMonth ? 'text-gray-400' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </span>
                      </div>

                      {hasEvents && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                            {eventsForDay.length}
                          </div>
                        </div>
                      )}

                      {hasEvents && (
                        <div className="absolute inset-0 bg-amber-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Packages ───────────────────────────────────────────────────── */}
      <div className="py-20 px-6 md:px-8" style={{ background: "linear-gradient(135deg, #92400E, #78350F)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Special Packages</h2>
            <p className="text-lg" style={{ color: "#FDE68A" }}>Save more with our curated combos</p>
          </div>

          {packagesState === "loading" && (
            <div className="flex justify-center items-center py-20">
              <div className="w-[50px] h-[50px] border-4 rounded-full border-t-amber-300 animate-spin" />
            </div>
          )}

          {packagesState === "error" && (
            <div className="text-center py-16">
              <p className="text-lg mb-6" style={{ color: "#FDE68A" }}>Could not load packages. Please try again.</p>
            </div>
          )}

          {packagesState === "success" && (
            <div className="grid md:grid-cols-3 gap-10">
              {packagesData.map((pkg, index) => {
                const isPopular = index === 0;
                return (
                  <div
                    key={pkg._id || index}
                    onClick={() => navigate(`/package/${pkg.packageId}`)}
                    className={`relative rounded-2xl p-9 cursor-pointer transition hover:-translate-y-1 ${isPopular ? "transform scale-105" : ""}`}
                    style={{ background: "#FFFBF5", boxShadow: isPopular ? "0 0 0 4px #FBBF24, 0 20px 60px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.2)" }}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl rounded-tr-2xl font-bold flex items-center gap-1 text-sm" style={{ background: "#FBBF24", color: "#78350F" }}>
                        <FaTag /> Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-4" style={{ color: "#292524" }}>{pkg.name}</h3>
                    <p className="mb-7" style={{ color: "#78716C" }}>
                      {Array.isArray(pkg.includes) ? pkg.includes.join(" + ") : pkg.includes}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold" style={{ color: "#D97706" }}>RS.{pkg.price}</span>
                      <button className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
                        Book Package
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Testimonials Carousel ── */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>What Our Customers Say</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Real experiences from Yala & Kataragama</p>
        </div>
        {loadingReviews ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : approvedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to share your experience!</div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
              >
                {approvedReviews.map((review, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div
                      className="rounded-xl p-8 border mx-auto max-w-2xl"
                      style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 24px rgba(217,119,6,0.08)" }}
                    >
                      <div className="flex gap-1 mb-4 justify-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} className="text-xl" style={{ color: "#FBBF24" }} />
                        ))}
                      </div>
                      <p className="mb-6 italic leading-relaxed text-center" style={{ color: "#57534E" }}>
                        "{review.comment}"
                      </p>
                      <p className="font-bold text-center" style={{ color: "#292524" }}>
                        - {review.name}
                      </p>
                      {review.section && review.section !== 'All' && (
                        <p className="text-sm text-center mt-2" style={{ color: "#D97706" }}>
                          {review.section}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {approvedReviews.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentReviewIndex(prev => (prev === 0 ? approvedReviews.length - 1 : prev - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full"
                  style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)" }}
                >
                  <FaChevronLeft className="text-2xl text-white" />
                </button>
                <button
                  onClick={() => setCurrentReviewIndex(prev => (prev === approvedReviews.length - 1 ? 0 : prev + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full"
                  style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)" }}
                >
                  <FaChevronRight className="text-2xl text-white" />
                </button>
              </>
            )}
            {approvedReviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {approvedReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReviewIndex(index)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: index === currentReviewIndex ? "2rem" : "0.75rem",
                      background: index === currentReviewIndex ? "#FBBF24" : "rgba(217,119,6,0.3)"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
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

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4" style={{ background: "#1C1917" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: "#78716C" }}>© 2026 Yala & Kataragama Travel Hub. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" className="transition hover:text-amber-400" style={{ color: "#78716C" }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Tooltip for calendar */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg p-3 border border-amber-200 max-w-xs"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          <div className="text-sm font-bold mb-1" style={{ color: "#D97706" }}>
            {format(hoveredDay, 'MMMM d, yyyy')}
          </div>
          {getEventsForDay(hoveredDay).map((event, i) => (
            <div key={event._id} className="mb-2 last:mb-0">
              <div className="font-semibold" style={{ color: "#292524" }}>{event.title}</div>
              <div className="text-xs text-gray-500">
                {event.startTime && event.endTime && `${event.startTime} – ${event.endTime}`}
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">{event.description}</div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </div>
  );
}