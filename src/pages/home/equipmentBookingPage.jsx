import { useState } from "react";
import { formatDate, loadCart } from "../../utils/cart";
import BookingItem from "../../components/bookingItem";

export default function BookingPage() {
  const [cart, setCart] = useState(loadCart());
  const today = formatDate(new Date());
  const tomorrow = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

  // State for start and end date
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  console.log(cart);

  function reloadCart() {
    setCart(loadCart());
  }

  // Function to calculate days difference
  function getDaysBetween(start, end) {
    const startD = new Date(start);
    const endD = new Date(end);
    const diffTime = endD - startD;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  const daysBetween = getDaysBetween(startDate, endDate);

  return (
    <div className="w-full h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Create Booking</h1>

      {/* Date Inputs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="mb-1 font-medium">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="endDate" className="mb-1 font-medium">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>
      </div>

      {/* Days Between */}
      <p className="mb-6 font-semibold">
        Total Days: <span>{daysBetween}</span>
      </p>

      {/* Cart Items */}
      <div className="w-full flex flex-col items-center gap-4">
        {cart.orderedItems.map((item) => (
          <BookingItem
            itemKey={item.key}
            key={item.key}
            qty={item.qty}
            refresh={reloadCart}
          />
        ))}
      </div>

      <div className="w-full flex justify-center mt-6"></div>
    </div>
  );
}