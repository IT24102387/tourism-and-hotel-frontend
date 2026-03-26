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
} from "react-icons/fa";

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

const foodItems = [
  { name: "Rice & Curry", description: "Authentic Sri Lankan spread", price: "$10", image: "🍛" },
  { name: "Kottu Roti", description: "Chopped roti with vegetables/meat", price: "$7", image: "🥘" },
  { name: "Hoppers (Appa)", description: "Crispy bowl-shaped pancakes", price: "$5", image: "🥞" },
  { name: "Fresh Seafood Platter", description: "Grilled fish, prawns, squid", price: "$18", image: "🦐" },
];

const events = [
  {
    name: "Kataragama Esala Festival",
    date: "July - August 2026",
    description: "A vibrant religious festival with processions and ceremonies.",
    image: "https://images.unsplash.com/photo-1622115831922-ccd9a2c4b445?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    name: "Yala Wildlife Photography Workshop",
    date: "September 15-20, 2026",
    description: "Capture the wilderness with expert guides.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    name: "Traditional Dance Performance",
    date: "Every Saturday at Kataragama Temple",
    description: "Experience Kandyan and low-country dance.",
    image: "https://images.unsplash.com/photo-1622115831922-ccd9a2c4b445?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
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
  const navigate = useNavigate();

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
            { icon: FaCar, title: "Vehicle Hire", desc: "Safari jeeps, cars, and bikes with or without driver.", grad: "linear-gradient(135deg,#D97706,#92400E)", route: "/vehicle-hire" },
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
                    onClick={() => navigate(`/place/${place.name}`)}
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

      {/* ── Food ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Taste Sri Lanka</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Authentic dishes from our restaurant</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {foodItems.map((item, index) => (
            <div key={index} className="rounded-xl p-7 hover:shadow-2xl transition border" style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 20px rgba(217,119,6,0.08)" }}>
              <div className="text-6xl mb-5 text-center">{item.image}</div>
              <h4 className="font-bold text-lg mb-2" style={{ color: "#292524" }}>{item.name}</h4>
              <p className="text-sm mb-4" style={{ color: "#A8A29E" }}>{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl" style={{ color: "#D97706" }}>{item.price}</span>
                <button onClick={() => navigate("/restaurant-food")} className="px-4 py-2 rounded-lg text-sm font-semibold transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Events & Festivals ─────────────────────────────────────────── */}
      <div className="py-20 px-6 md:px-8" style={{ background: "#F5EDD8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>Upcoming Events & Festivals</h2>
            <p className="text-lg" style={{ color: "#78716C" }}>Experience the vibrant culture and celebrations</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {events.map((event, index) => (
              <div key={index} className="rounded-xl overflow-hidden hover:shadow-2xl transition border" style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 20px rgba(146,64,14,0.10)" }}>
                <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                <div className="p-7">
                  <div className="flex items-center gap-2 mb-3" style={{ color: "#D97706" }}>
                    <FaCalendarAlt />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3" style={{ color: "#292524" }}>{event.name}</h3>
                  <p style={{ color: "#78716C" }}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
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
                      <span className="text-3xl font-bold" style={{ color: "#D97706" }}>${pkg.price}</span>
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

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#292524" }}>What Our Customers Say</h2>
          <p className="text-lg" style={{ color: "#78716C" }}>Real experiences from Yala & Kataragama</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-xl p-9 border" style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 24px rgba(217,119,6,0.08)" }}>
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-xl" style={{ color: "#FBBF24" }} />
                ))}
              </div>
              <p className="mb-6 italic leading-relaxed" style={{ color: "#57534E" }}>"{testimonial.text}"</p>
              <p className="font-bold" style={{ color: "#292524" }}>- {testimonial.name}</p>
            </div>
          ))}
        </div>
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