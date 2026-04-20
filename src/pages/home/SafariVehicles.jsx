// src/pages/home/safariVehicles.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaCar,
  FaPhone,
  FaUser,
  FaEnvelope,
  FaTimesCircle,
  FaCheckCircle,
  FaTag,
  FaShieldAlt,
  FaUndo,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function SafariVehicles() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
    passengers: 1,
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch vehicles from backend
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`);
      setVehicles(response.data);
      setFilteredVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Auto-open booking modal if navigated from home with a vehicle id
  useEffect(() => {
    const bookVehicleId = location.state?.bookVehicleId;
    if (bookVehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find((v) => v._id === bookVehicleId);
      if (vehicle) {
        handleBookNow(vehicle);
        // Clear state so back-navigation doesn't re-open modal
        window.history.replaceState({}, document.title);
      }
    }
  }, [vehicles, location.state]);

  // Search and filter
  useEffect(() => {
    let filtered = vehicles;
    
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeFilter !== "all") {
      filtered = filtered.filter(vehicle => 
        activeFilter === "safari" 
          ? vehicle.type === "Safari Jeep" 
          : vehicle.type === "Car"
      );
    }
    
    setFilteredVehicles(filtered);
  }, [searchTerm, vehicles, activeFilter]);

  const handleBookNow = (vehicle) => {
    if (!vehicle.availability) {
      toast.error("Sorry, this vehicle is currently unavailable for booking");
      return;
    }
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
  };

  const calculateTotalDays = () => {
    if (!bookingDetails.startDate || !bookingDetails.endDate) {
      return 0;
    }
    const startDate = new Date(bookingDetails.startDate);
    const endDate = new Date(bookingDetails.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateTotalPrice = () => {
    if (!selectedVehicle || !selectedVehicle.pricePerDay) {
      return 0;
    }
    const days = calculateTotalDays();
    return days * selectedVehicle.pricePerDay;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingDetails.startDate || !bookingDetails.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (!bookingDetails.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!bookingDetails.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!bookingDetails.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    const startDate = new Date(bookingDetails.startDate);
    const endDate = new Date(bookingDetails.endDate);
    
    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    const days = calculateTotalDays();
    const totalPrice = calculateTotalPrice();

    if (isNaN(totalPrice) || totalPrice <= 0) {
      toast.error("Invalid price calculation. Please check your dates.");
      return;
    }

    const bookingData = {
      vehicleId: selectedVehicle._id,
      vehicleName: selectedVehicle.name,
      regNo: selectedVehicle.registrationNumber,
      vehicleType: selectedVehicle.type,
      capacity: selectedVehicle.capacity,
      pricePerDay: selectedVehicle.pricePerDay,
      startDate: bookingDetails.startDate,
      endDate: bookingDetails.endDate,
      passengers: parseInt(bookingDetails.passengers),
      totalDays: days,
      totalPrice: totalPrice,
      customerName: bookingDetails.fullName.trim(),
      customerEmail: bookingDetails.email.trim().toLowerCase(),
      customerPhone: bookingDetails.phone.trim(),
      specialRequests: bookingDetails.specialRequests.trim() || "",
      status: "Pending"
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehicle-bookings`,
        bookingData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        const bookingId = response.data.booking._id;
        
        toast.success(`✓ Booking Confirmed!\n\nVehicle: ${selectedVehicle.name}\nDuration: ${days} day(s)\nTotal: LKR ${totalPrice.toLocaleString()}`);
        
        setShowBookingModal(false);
        setBookingDetails({
          startDate: "",
          endDate: "",
          passengers: 1,
          fullName: "",
          email: "",
          phone: "",
          specialRequests: "",
        });
        
        const localBookings = JSON.parse(localStorage.getItem("vehicleBookings") || "[]");
        localBookings.push(response.data.booking);
        localStorage.setItem("vehicleBookings", JSON.stringify(localBookings));
        
        setTimeout(() => {
          navigate(`/booking-details?id=${bookingId}`);
        }, 500);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage = error.response?.data?.message || "Failed to create booking. Please try again.";
      toast.error(errorMessage);
      
      if (errorMessage.includes("already booked")) {
        toast.error("This vehicle is already booked for the selected dates. Please choose different dates.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDriverInfo = (vehicle) => {
    if (vehicle.driverName && vehicle.driverName.trim()) {
      return (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaUser className="text-[10px]" />
            <span>Driver: {vehicle.driverName}</span>
          </div>
          {vehicle.driverContact && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <FaPhone className="text-[10px]" />
              <span>{vehicle.driverContact}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ background: "#F3F4F6" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F3F4F6" }}>

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 260 }}>
        {/* Background image — swap for your own */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80')",
            filter: "brightness(0.40)",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "#FBBF24" }}
          >
            WildHaven Resort &amp; Safari
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
            style={{ color: "#FFFFFF", fontFamily: "'Georgia', serif" }}
          >
            Our{" "}
            <span style={{ color: "#FBBF24" }}>Safari Vehicles</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Rugged jeeps and comfortable cars — built for the wild, driven by experts.
          </p>
        </div>
      </div>

      {/* ── Everything below is unchanged ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-700 text-sm" />
            <input
              type="text"
              placeholder="Search by name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full focus:outline-none transition text-sm"
              style={{
                background: "white",
                border: "2px solid #D97706",
                color: "#374151",
                outline: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
              onFocus={(e) => e.target.style.borderColor = "#B45309"}
              onBlur={(e) => e.target.style.borderColor = "#D97706"}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          {[
            { key: "all", label: "All vehicles" },
            { key: "safari", label: "Safari Jeeps" },
            { key: "car", label: "Cars" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className="text-sm transition pb-1"
              style={{
                color: activeFilter === key ? "#D97706" : "#6B7280",
                borderBottom: activeFilter === key ? "2px solid #D97706" : "none",
                fontWeight: activeFilter === key ? "500" : "normal",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No vehicles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                  vehicle.availability ? "hover:shadow-xl cursor-pointer" : "opacity-80"
                }`}
                style={{
                  background: "white",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #E5E7EB"
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={vehicle.image?.[0] || "/placeholder-vehicle.jpg"}
                    alt={vehicle.name}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-sm tracking-wide"
                      style={{ background: vehicle.availability ? "#10B981" : "#EF4444", color: "white" }}
                    >
                      {vehicle.availability ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-md tracking-wide shadow-md"
                      style={{
                        background: "rgba(0,0,0,0.75)",
                        color: "#F59E0B",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(245, 158, 11, 0.3)"
                      }}
                    >
                      {vehicle.type === "Safari Jeep" ? "4×4" : vehicle.type === "Car" ? "CAR" : vehicle.type.toUpperCase()}
                    </span>
                  </div>
                  {!vehicle.availability && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-lg font-medium mb-1" style={{ color: "#111827" }}>{vehicle.name}</h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: "#6B7280" }}>
                    {vehicle.description || "No description available"}
                  </p>
                  <div className="mb-2">
                    <span className="text-2xl font-bold" style={{ color: "#D97706" }}>
                      LKR {vehicle.pricePerDay?.toLocaleString() || "0"}
                    </span>
                    <span className="text-xs ml-1" style={{ color: "#9CA3AF" }}>/ day</span>
                  </div>
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
                  {getDriverInfo(vehicle)}
                  <button
                    onClick={() => handleBookNow(vehicle)}
                    disabled={!vehicle.availability}
                    className={`mt-3 w-full py-2.5 text-sm font-medium rounded-full transition ${
                      vehicle.availability ? "shadow-md hover:shadow-lg active:scale-[0.98]" : "cursor-not-allowed"
                    }`}
                    style={{
                      background: vehicle.availability ? "#D97706" : "#E5E7EB",
                      color: vehicle.availability ? "white" : "#9CA3AF",
                      border: "none"
                    }}
                  >
                    {vehicle.availability ? "Book Vehicle" : "Unavailable"}
                  </button>
                  {!vehicle.availability && (
                    <p className="text-xs text-center mt-2" style={{ color: "#EF4444" }}>
                      ⚠️ This vehicle is currently unavailable for booking
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white max-w-3xl w-full rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-t-3xl">
              <button 
                onClick={() => setShowBookingModal(false)} 
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl leading-none transition z-10"
              >
                ×
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FaCar className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Book Your Vehicle</h2>
                  <p className="text-yellow-100 text-sm">Complete the form to reserve your safari adventure</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Vehicle Summary */}
              <div className="mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5">
                  <img 
                    src={selectedVehicle.image?.[0] || "/placeholder-vehicle.jpg"} 
                    alt={selectedVehicle.name}
                    className="w-full md:w-32 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{selectedVehicle.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{selectedVehicle.registrationNumber}</p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Available
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FaUsers className="text-amber-500" />
                        {selectedVehicle.capacity} seats
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FaTag className="text-amber-500" />
                        {selectedVehicle.type}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-amber-500" />
                        Kataragama
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-amber-600">
                        LKR {selectedVehicle.pricePerDay?.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500"> / day</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        required
                        value={bookingDetails.fullName}
                        onChange={(e) => setBookingDetails({...bookingDetails, fullName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="email"
                        required
                        value={bookingDetails.email}
                        onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="tel"
                        required
                        value={bookingDetails.phone}
                        onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                        placeholder="0771234567"
                      />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-1 text-amber-500" /> Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDetails.startDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, startDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-1 text-amber-500" /> End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDetails.endDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, endDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      min={bookingDetails.startDate}
                    />
                  </div>

                  {/* Passengers */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUsers className="inline mr-1 text-amber-500" /> Number of Passengers <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="number"
                        required
                        min="1"
                        max={selectedVehicle.capacity}
                        value={bookingDetails.passengers}
                        onChange={(e) => setBookingDetails({...bookingDetails, passengers: parseInt(e.target.value) || 1})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Maximum {selectedVehicle.capacity} passengers</p>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    rows="3"
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                    placeholder="Any special requirements? (e.g., driver language, baby seat, photography assistance, etc.)"
                  />
                </div>

                {/* Price Summary */}
                {bookingDetails.startDate && bookingDetails.endDate && (
                  <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaMoneyBillWave className="text-amber-500" />
                      Booking Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="font-semibold text-gray-800">LKR {selectedVehicle.pricePerDay?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Days</span>
                        <span className="font-semibold text-gray-800">{calculateTotalDays()} day(s)</span>
                      </div>
                      <div className="border-t border-amber-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">Total Amount</span>
                          <span className="text-2xl font-bold text-amber-600">
                            LKR {calculateTotalPrice().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 mb-6 justify-center">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaShieldAlt className="text-green-500" />
                    <span>Secure Booking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaUndo className="text-blue-500" />
                    <span>Free Cancellation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaCheckCircle className="text-green-500" />
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaCreditCard className="text-amber-500" />
                    <span>No Booking Fees</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaTimesCircle className="text-gray-400" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-white" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out; }
      `}</style>
    </div>
  );
}