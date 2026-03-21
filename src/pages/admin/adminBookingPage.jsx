import axios from "axios";
import { useState, useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FiCheckCircle, FiXCircle, FiPackage } from "react-icons/fi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activOrder, setActiveOrder] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (loading) {
      const token = localStorage.getItem("token");
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [loading]);

  function handleOrdersStatusChange(orderId, status) {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setModalOpened(false);
        setLoading(true);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  const statusBadge = (status) => {
    const map = {
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
      Pending: "bg-yellow-100 text-yellow-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FiPackage className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Days</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => { setActiveOrder(order); setModalOpened(true); }}
                  >
                    <td className="px-6 py-4 text-gray-700 font-mono text-sm">{order.orderId}</td>
                    <td className="px-6 py-4 text-gray-700">{order.email}</td>
                    <td className="px-6 py-4 text-gray-700">{order.days}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(order.startingDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(order.endingDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">Rs. {order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 cursor-pointer hover:bg-blue-50 transition"
                onClick={() => { setActiveOrder(order); setModalOpened(true); }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-gray-500 font-mono">#{order.orderId}</span>
                    <p className="font-semibold text-gray-800 text-sm mt-0.5">{order.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Days: <span className="font-medium">{order.days}</span></p>
                  <p>Start: <span className="font-medium">{new Date(order.startingDate).toLocaleDateString()}</span></p>
                  <p>End: <span className="font-medium">{new Date(order.endingDate).toLocaleDateString()}</span></p>
                  <p>Total: <span className="font-semibold text-gray-800">Rs. {order.totalAmount.toFixed(2)}</span></p>
                  <p>Ordered: <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span></p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      {modalOpened && activOrder && (
        <div className="fixed inset-0 bg-[#00000075] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg font-bold tracking-wide">Order Details</h3>
              <button onClick={() => setModalOpened(false)} className="hover:text-gray-300 transition">
                <IoMdCloseCircleOutline size={26} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Order ID", activOrder.orderId],
                  ["Email", activOrder.email],
                  ["Days", activOrder.days],
                  ["Total Amount", `Rs. ${activOrder.totalAmount.toFixed(2)}`],
                  ["Start Date", new Date(activOrder.startingDate).toLocaleDateString()],
                  ["End Date", new Date(activOrder.endingDate).toLocaleDateString()],
                  ["Order Date", new Date(activOrder.orderDate).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">{label}</p>
                    <p className="text-gray-800 font-semibold mt-0.5 break-all">{value}</p>
                  </div>
                ))}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${statusBadge(activOrder.status)}`}>
                    {activOrder.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleOrdersStatusChange(activOrder.orderId, "Approved")}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold transition shadow-sm"
                >
                  <FiCheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => handleOrdersStatusChange(activOrder.orderId, "Rejected")}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold transition shadow-sm"
                >
                  <FiXCircle size={16} /> Reject
                </button>
              </div>

              {/* Ordered Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Ordered Items</h4>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">Item</th>
                        <th className="px-4 py-2 text-left font-semibold">Product</th>
                        <th className="px-4 py-2 text-center font-semibold">Qty</th>
                        <th className="px-4 py-2 text-right font-semibold">Per Day</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activOrder.orderedItems.map((item) => (
                        <tr key={item.product.key} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800">{item.product.name}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-700 font-semibold">
                            Rs. {item.product.dailyRentalprice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}