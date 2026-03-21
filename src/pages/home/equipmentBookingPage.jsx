import { useState, useEffect } from "react";
import { formatDate, loadCart } from "../../utils/cart";
import BookingItem from "../../components/bookingItem";
import toast from "react-hot-toast";
import axios from "axios";

export default function BookingPage() {
  const [cart, setCart] = useState(loadCart());
  const today = formatDate(new Date());
  const tomorrow = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [total, setTotal] = useState(0);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  function getDaysBetween(start, end) {
    const diffTime = new Date(end) - new Date(start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  const daysBetween = getDaysBetween(startDate, endDate);

  function reloadCart() {
    setCart(loadCart());
    calculateTotal();
  }

  function calculateTotal() {
    const cartInfo = loadCart();
    cartInfo.startingDate = startDate;
    cartInfo.endingDate = endDate;
    cartInfo.days = daysBetween;
    setLoadingQuote(true);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`, cartInfo)
      .then((res) => setTotal(res.data.total || 0))
      .catch((err) => console.error(err))
      .finally(() => setLoadingQuote(false));
  }

  useEffect(() => {
    calculateTotal();
  }, [startDate, endDate]);

  function handleBookingCreation() {
    const cartData = loadCart();
    cartData.startingDate = startDate;
    cartData.endingDate = endDate;
    cartData.days = daysBetween;

    const token = localStorage.getItem("token");
    setBookingLoading(true);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, cartData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("cart");
        toast.success("Booking created successfully!");
        setCart(loadCart());
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to create booking.");
      })
      .finally(() => setBookingLoading(false));
  }

  const isEmpty = cart.orderedItems.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10 md:py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
            Create Your Booking
          </h1>
          <p className="mt-2 text-gray-600 text-base">
            Choose your rental dates and review the items
          </p>
        </div>

        {/* Rental Period */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-5">
            Rental Period
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-amber-50/60 border border-amber-200 rounded-xl 
                           text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 
                           outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-amber-50/60 border border-amber-200 rounded-xl 
                           text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 
                           outline-none transition-all duration-200"
              />
            </div>
          </div>

          {daysBetween > 0 && (
            <div className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 
                            bg-gradient-to-r from-amber-300 to-amber-400 text-amber-900 
                            font-semibold rounded-full shadow-sm text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {daysBetween} {daysBetween === 1 ? "day" : "days"} rental
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-4 flex items-baseline gap-2">
            Selected Items
            <span className="text-gray-500 font-medium normal-case">
              ({cart.orderedItems.length})
            </span>
          </h2>

          {isEmpty ? (
            <div className="bg-white rounded-2xl border border-amber-100/70 p-12 text-center shadow-sm">
              <p className="text-gray-500 text-lg font-medium">
                Your cart is empty
              </p>
              <p className="text-gray-400 mt-2">
                Add some items to continue
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.orderedItems.map((item) => (
                <BookingItem
                  key={item.key}
                  itemKey={item.key}
                  qty={item.qty}
                  refresh={reloadCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {!isEmpty && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-8">
            <div className="flex justify-between items-center text-gray-600 mb-4">
              <span className="font-medium">Rental Duration</span>
              <span>
                {daysBetween} {daysBetween === 1 ? "day" : "days"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-amber-100">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <div className="text-right">
                <span
                  className={`text-3xl font-black text-amber-600 transition-opacity duration-300 ${
                    loadingQuote ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {total.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-gray-500 ml-1.5">LKR</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── LIGHTER SUBMIT BUTTON ──────────────────────────────────────── */}
        <button
          onClick={handleBookingCreation}
          disabled={isEmpty || bookingLoading || daysBetween === 0}
          className={`
            w-full py-4 rounded-xl font-bold text-base tracking-wide
            transition-all duration-200 shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
            hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
            bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200
            text-amber-900 hover:brightness-105
            border border-amber-300/70
          `}
        >
          {bookingLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Creating Booking...
            </span>
          ) : (
            "Confirm & Create Booking"
          )}
        </button>

        {daysBetween === 0 && !isEmpty && (
          <p className="text-center text-red-600 text-sm mt-4 font-medium">
            Please select a valid rental period (start → end)
          </p>
        )}

      </div>
    </div>
  );
}