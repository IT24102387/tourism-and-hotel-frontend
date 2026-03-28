import axios from "axios";
import { useState, useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";
import { MdOutlineBookmarks } from "react-icons/md";
import { MdOutlineBookmarkAdded, MdPendingActions, MdOutlineCancel } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";

const STATUS_STYLES = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Completed: "bg-blue-100 text-blue-700",
};

const STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"];

export default function AdminPackageBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  function fetchBookings() {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/package-bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  function handleStatusChange(bookingId, status) {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/package-bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setModalOpen(false);
        fetchBookings();
      })
      .catch((err) => console.error(err));
  }

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.bookingId?.toLowerCase().includes(q) ||
      b.userName?.toLowerCase().includes(q) ||
      b.userEmail?.toLowerCase().includes(q) ||
      b.packageName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const pendingCount   = bookings.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  const statCards = [
    {
      title: "Total Bookings",
      value: bookings.length,
      bg: "bg-blue-50/70",
      color: "text-blue-600",
      icon: <MdOutlineBookmarks className="w-6 h-6" />,
    },
    {
      title: "Pending",
      value: pendingCount,
      bg: "bg-yellow-50/70",
      color: "text-yellow-600",
      icon: <MdPendingActions className="w-6 h-6" />,
    },
    {
      title: "Confirmed",
      value: confirmedCount,
      bg: "bg-green-50/70",
      color: "text-green-600",
      icon: <MdOutlineBookmarkAdded className="w-6 h-6" />,
    },
    {
      title: "Cancelled",
      value: cancelledCount,
      bg: "bg-red-50/70",
      color: "text-red-500",
      icon: <MdOutlineCancel className="w-6 h-6" />,
    },
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      bg: "bg-emerald-50/70",
      color: "text-emerald-600",
      icon: <BsCurrencyDollar className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Package Booking Management</h1>
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
          {bookings.length} Total Bookings
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border border-gray-200 ${card.bg} p-5 shadow-sm hover:shadow transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white/80 ${card.color}`}>{card.icon}</div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by ID, customer, or package..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <MdOutlineBookmarks className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No package bookings found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider">Booking ID</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider">Package</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider">Tour Date</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wider">Guests</th>
                  <th className="px-5 py-4 text-right text-sm font-semibold uppercase tracking-wider">Total</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => { setActiveBooking(b); setModalOpen(true); }}
                  >
                    <td className="px-5 py-4 text-gray-700 font-mono text-sm">{b.bookingId}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800 text-sm">{b.userName}</p>
                      <p className="text-gray-400 text-xs">{b.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-700 text-sm">{b.packageName}</td>
                    <td className="px-5 py-4 text-gray-700 text-sm">
                      {new Date(b.tourDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-700 text-sm">{b.guests}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-800 text-sm">
                      Rs. {b.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filtered.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 cursor-pointer hover:bg-blue-50 transition"
                onClick={() => { setActiveBooking(b); setModalOpen(true); }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-gray-500 font-mono">#{b.bookingId}</span>
                    <p className="font-semibold text-gray-800 text-sm mt-0.5">{b.userName}</p>
                    <p className="text-gray-400 text-xs">{b.userEmail}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>
                    {b.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mt-2">
                  <p>Package: <span className="font-medium text-gray-800">{b.packageName}</span></p>
                  <p>Tour Date: <span className="font-medium">{new Date(b.tourDate).toLocaleDateString()}</span></p>
                  <p>Guests: <span className="font-medium">{b.guests}</span></p>
                  <p>Total: <span className="font-semibold text-gray-800">Rs. {b.totalPrice?.toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {modalOpen && activeBooking && (
        <div className="fixed inset-0 bg-[#00000075] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white px-6 py-4 rounded-t-xl flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold tracking-wide">Package Booking Details</h3>
              <button onClick={() => setModalOpen(false)} className="hover:text-gray-300 transition">
                <IoMdCloseCircleOutline size={26} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info Grid */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Booking Info</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Booking ID",   activeBooking.bookingId],
                    ["Package",      activeBooking.packageName],
                    ["Customer",     activeBooking.userName],
                    ["Email",        activeBooking.userEmail],
                    ["Phone",        activeBooking.userPhone || "—"],
                    ["Tour Date",    new Date(activeBooking.tourDate).toLocaleDateString()],
                    ["Guests",       activeBooking.guests],
                    ["Booked On",    new Date(activeBooking.createdAt).toLocaleDateString()],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">{label}</p>
                      <p className="text-gray-800 font-semibold mt-0.5 break-all">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pricing Breakdown</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Base / Person", `Rs. ${activeBooking.basePricePerPerson?.toFixed(2)}`],
                    ["Vehicle Cost",  `Rs. ${activeBooking.vehicleTotal?.toFixed(2)}`],
                    ["Add-on Cost",   `Rs. ${activeBooking.addOnTotal?.toFixed(2)}`],
                    ["Total Price",   `Rs. ${activeBooking.totalPrice?.toFixed(2)}`],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">{label}</p>
                      <p className="text-gray-800 font-semibold mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle */}
              {activeBooking.selectedVehicle?.vehicleName && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Selected Vehicle</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm grid grid-cols-2 gap-2">
                    <p className="text-gray-600">Name: <span className="font-semibold text-gray-800">{activeBooking.selectedVehicle.vehicleName}</span></p>
                    <p className="text-gray-600">Type: <span className="font-semibold text-gray-800">{activeBooking.selectedVehicle.vehicleType}</span></p>
                    <p className="text-gray-600">Price/Day: <span className="font-semibold text-gray-800">Rs. {activeBooking.selectedVehicle.vehiclePricePerDay?.toFixed(2)}</span></p>
                  </div>
                </div>
              )}

              {/* Activities */}
              {activeBooking.selectedActivities?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Selected Activities</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeBooking.selectedActivities.map((a) => (
                      <span key={a} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Add-ons</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeBooking.addOns || {}).map(([key, val]) => (
                    <span
                      key={key}
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${
                        val ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}: {val ? "Yes" : "No"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              {activeBooking.specialRequests && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Special Requests</h4>
                  <p className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">{activeBooking.specialRequests}</p>
                </div>
              )}

              {/* Current Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[activeBooking.status] || "bg-gray-100 text-gray-600"}`}>
                  {activeBooking.status}
                </span>
              </div>

              {/* Status Actions */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Update Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStatusChange(activeBooking.bookingId, "Confirmed")}
                    disabled={activeBooking.status === "Confirmed"}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold transition shadow-sm text-sm"
                  >
                    <FiCheckCircle size={15} /> Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeBooking.bookingId, "Completed")}
                    disabled={activeBooking.status === "Completed"}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold transition shadow-sm text-sm"
                  >
                    <FiCalendar size={15} /> Complete
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeBooking.bookingId, "Pending")}
                    disabled={activeBooking.status === "Pending"}
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold transition shadow-sm text-sm"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeBooking.bookingId, "Cancelled")}
                    disabled={activeBooking.status === "Cancelled"}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold transition shadow-sm text-sm"
                  >
                    <FiXCircle size={15} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
