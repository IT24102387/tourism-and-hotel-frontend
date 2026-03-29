// src/pages/home/bookingDetails.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaCar,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaTag,
  FaCreditCard,
  FaShieldAlt,
  FaUndo,
  FaClock,
  FaIdCard,
  FaMoneyBillWave,
  FaPrint,
  FaShare,
  FaWhatsapp,
  FaEnvelope as FaEmail,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get booking ID from URL query params
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("id");

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID found");
      setLoading(false);
      return;
    }
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehicle-bookings/${bookingId}`
      );
      
      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        setError(response.data.message || "Failed to fetch booking details");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      setError(error.response?.data?.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Redirecting to payment gateway...");
      setIsProcessing(false);
    }, 1500);
  };

  // Soft Cancel - Just update status
  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehicle-bookings/${bookingId}/cancel`
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully!");
        setBooking({ ...booking, status: "Cancelled" });
        setShowCancelModal(false);
        
        setTimeout(() => {
          fetchBookingDetails();
        }, 1000);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const errorMessage = error.response?.data?.message || "Failed to cancel booking.";
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  // Hard Delete - Permanently remove from database
  const handleHardDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehicle-bookings/${bookingId}/permanent`
      );

      if (response.data.success) {
        toast.success("Booking permanently deleted from database!");
        setShowDeleteModal(false);
        
        // Navigate back to vehicles page after 2 seconds
        setTimeout(() => {
          navigate("/safari-vehicles");
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete booking.";
      toast.error(errorMessage);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: "#F59E0B", icon: FaClock, text: "Pending", bg: "#FEF3C7" },
      Confirmed: { color: "#10B981", icon: FaCheckCircle, text: "Confirmed", bg: "#D1FAE5" },
      Cancelled: { color: "#EF4444", icon: FaTimesCircle, text: "Cancelled", bg: "#FEE2E2" },
      Completed: { color: "#3B82F6", icon: FaCheckCircle, text: "Completed", bg: "#DBEAFE" },
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;
    
    return (
      <span
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
        style={{ background: config.bg, color: config.color }}
      >
        <Icon className="text-sm" />
        {config.text}
      </span>
    );
  };

  const canCancelBooking = () => {
    if (!booking) return false;
    return booking.status === "Pending" || booking.status === "Confirmed";
  };

  const canDeletePermanently = () => {
    if (!booking) return false;
    // Allow deletion for cancelled bookings or any booking (for admin)
    return booking.status === "Cancelled" || booking.status === "Pending";
  };

  const shareViaWhatsApp = () => {
    const message = `Booking ${booking.status === "Cancelled" ? "Cancellation" : "Confirmation"}!\n\nBooking ID: ${booking._id}\nVehicle: ${booking.vehicleName}\nDates: ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}\nTotal: LKR ${booking.totalPrice?.toLocaleString()}\nStatus: ${booking.status}\n\nView your booking: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Booking ${booking.status === "Cancelled" ? "Cancellation" : "Confirmation"} - ${booking.vehicleName}`;
    const body = `Dear ${booking.customerName},\n\nYour booking has been ${booking.status.toLowerCase()}.\n\nBooking Details:\nBooking ID: ${booking._id}\nVehicle: ${booking.vehicleName}\nDates: ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}\nTotal Amount: LKR ${booking.totalPrice?.toLocaleString()}\nStatus: ${booking.status}\n\nThank you for choosing us!\n\nView your booking: ${window.location.href}`;
    window.location.href = `mailto:${booking.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ background: "#F3F4F6" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ background: "#F3F4F6" }}>
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="text-red-500 text-7xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "Unable to load booking details"}</p>
          <button
            onClick={() => navigate("/safari-vehicles")}
            className="px-8 py-3 text-white font-semibold rounded-full transition hover:opacity-90"
            style={{ background: "#D97706" }}
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F3F4F6" }}>
      <div className="min-h-screen py-8 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              booking.status === "Cancelled" ? "bg-red-100" : "bg-green-100"
            }`}>
              {booking.status === "Cancelled" ? (
                <FaTimesCircle className="text-5xl text-red-500" />
              ) : (
                <FaCheckCircle className="text-5xl text-green-500" />
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {booking.status === "Cancelled" ? "Booking Cancelled" : "Booking Confirmed!"}
            </h1>
            <p className="text-gray-500 text-lg">
              {booking.status === "Cancelled" 
                ? "Your booking has been cancelled" 
                : "Your vehicle has been successfully booked"}
            </p>
          </div>

          {/* Main Booking Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Booking Status Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FaIdCard className="text-yellow-600" />
                    <span className="text-sm font-medium">Booking ID</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-gray-800">{booking._id}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FaClock className="text-yellow-600" />
                    <span className="text-sm font-medium">Booking Status</span>
                  </div>
                  <div className="mt-1">{getStatusBadge(booking.status)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <FaCalendarAlt className="text-yellow-600" />
                    <span className="text-sm font-medium">Booking Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{formatDate(booking.bookingDate)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Warning for cancelled booking */}
              {booking.status === "Cancelled" && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-500 text-xl mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700">This booking has been cancelled</p>
                    <p className="text-sm text-red-600 mt-1">
                      You can permanently delete this booking from the database using the "Permanently Delete" button below.
                    </p>
                  </div>
                </div>
              )}

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Vehicle Section */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaCar className="text-yellow-600" />
                      Vehicle Details
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={booking.vehicleId?.image?.[0] || "/placeholder-vehicle.jpg"}
                        alt={booking.vehicleName}
                        className="w-full md:w-48 h-36 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{booking.vehicleName}</h3>
                        <p className="text-sm text-gray-500 mb-3 font-mono">{booking.regNo}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                            <FaTag className="text-yellow-600" />
                            {booking.vehicleType}
                          </span>
                          <span className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                            <FaUsers className="text-yellow-600" />
                            {booking.capacity} seats
                          </span>
                          <span className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                            <FaMapMarkerAlt className="text-yellow-600" />
                            Kataragama
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaCalendarAlt className="text-yellow-600" />
                      Booking Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl" style={{ background: "#FEF3C7" }}>
                        <span className="text-sm text-gray-500">Start Date</span>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{formatDate(booking.startDate)}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "#FEF3C7" }}>
                        <span className="text-sm text-gray-500">End Date</span>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{formatDate(booking.endDate)}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "#FEF3C7" }}>
                        <span className="text-sm text-gray-500">Duration</span>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{booking.totalDays} day(s)</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "#FEF3C7" }}>
                        <span className="text-sm text-gray-500">Passengers</span>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{booking.passengers} person(s)</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaUser className="text-yellow-600" />
                      Customer Information
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <FaUser className="text-yellow-600 text-lg" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-semibold text-gray-800">{booking.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <FaEnvelope className="text-yellow-600 text-lg" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold text-gray-800">{booking.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <FaPhone className="text-yellow-600 text-lg" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-semibold text-gray-800">{booking.customerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-3">Special Requests</h2>
                      <p className="text-gray-600 p-4 rounded-xl bg-gray-50 italic">
                        "{booking.specialRequests}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Price Summary */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaMoneyBillWave className="text-yellow-600" />
                      Price Summary
                    </h2>
                    <div className="space-y-3 p-6 rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="text-lg font-semibold text-gray-800">
                          LKR {booking.pricePerDay?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Number of Days</span>
                        <span className="text-lg font-semibold text-gray-800">
                          {booking.totalDays} day(s)
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-800">Total Amount</span>
                          <span className="text-3xl font-bold" style={{ color: "#D97706" }}>
                            LKR {booking.totalPrice?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Why Book With Us?</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "#FEF3C7" }}>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <FaCreditCard className="text-yellow-600 text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Secure Booking</p>
                          <p className="text-sm text-gray-500">Your payment is secure</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "#FEF3C7" }}>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <FaUndo className="text-yellow-600 text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Free Cancellation</p>
                          <p className="text-sm text-gray-500">Up to 24 hours before</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "#FEF3C7" }}>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <FaShieldAlt className="text-yellow-600 text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Top Rated Service</p>
                          <p className="text-sm text-gray-500">Quality assured vehicles</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {/* Proceed to Payment - Only for non-cancelled bookings */}
                    {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                      <button
                        onClick={handleProceedToPayment}
                        disabled={isProcessing}
                        className="w-full py-4 text-white font-bold rounded-full transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                        style={{ background: "#D97706" }}
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaCreditCard className="text-xl" />
                            Proceed to Payment
                          </>
                        )}
                      </button>
                    )}

                    {/* Cancel Booking Button - Soft delete */}
                    {canCancelBooking() && (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="w-full py-4 border-2 border-red-300 text-red-600 font-bold rounded-full hover:bg-red-50 transition flex items-center justify-center gap-3 text-lg"
                      >
                        <FaTimesCircle className="text-xl" />
                        Cancel Booking
                      </button>
                    )}

                    {/* Permanently Delete Button - Hard delete (only for cancelled or pending bookings) */}
                    {canDeletePermanently() && (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full py-4 border-2 border-red-500 text-red-700 font-bold rounded-full hover:bg-red-50 transition flex items-center justify-center gap-3 text-lg"
                      >
                        <FaTrashAlt className="text-xl" />
                        Permanently Delete Booking
                      </button>
                    )}

                    <button
                      onClick={() => navigate("/safari-vehicles")}
                      className="w-full py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition flex items-center justify-center gap-3 text-lg"
                    >
                      <FaCar />
                      Book Another Vehicle
                    </button>
                  </div>

                  {/* Share Options */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center mb-3">Share your booking</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => window.print()}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                        title="Print"
                      >
                        <FaPrint className="text-gray-600 text-xl" />
                      </button>
                      <button
                        onClick={shareViaWhatsApp}
                        className="p-3 rounded-full bg-green-100 hover:bg-green-200 transition"
                        title="Share via WhatsApp"
                      >
                        <FaWhatsapp className="text-green-600 text-xl" />
                      </button>
                      <button
                        onClick={shareViaEmail}
                        className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                        title="Share via Email"
                      >
                        <FaEmail className="text-blue-600 text-xl" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Booking link copied to clipboard!");
                        }}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                        title="Copy Link"
                      >
                        <FaShare className="text-gray-600 text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              A confirmation email has been sent to your email address. 
              Please keep your Booking ID for future reference.
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal (Soft Delete) */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cancel Booking?</h2>
                <p className="text-gray-500">
                  Are you sure you want to cancel this booking? This action can be undone.
                </p>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-2"><strong>Vehicle:</strong> {booking.vehicleName}</p>
                <p className="text-sm text-gray-600 mb-2"><strong>Dates:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                <p className="text-sm text-gray-600"><strong>Total Amount:</strong> LKR {booking.totalPrice?.toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal (Hard Delete) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <FaTrashAlt className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Permanently Delete?</h2>
                <p className="text-gray-500">
                  This action cannot be undone. This booking will be permanently removed from the database.
                </p>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-red-50">
                <p className="text-sm text-red-600 font-semibold mb-2">⚠️ Warning:</p>
                <p className="text-sm text-red-600">
                  This will permanently delete all records of this booking. You will not be able to recover this data.
                </p>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-2"><strong>Booking ID:</strong> {booking._id}</p>
                <p className="text-sm text-gray-600 mb-2"><strong>Vehicle:</strong> {booking.vehicleName}</p>
                <p className="text-sm text-gray-600"><strong>Customer:</strong> {booking.customerName}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleHardDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Yes, Permanently Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}