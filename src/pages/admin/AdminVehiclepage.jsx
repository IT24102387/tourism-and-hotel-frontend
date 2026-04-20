import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminVehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [types, setTypes] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(response.data);
      setFilteredVehicles(response.data);
      const uniqueTypes = ["All", ...new Set(response.data.map((v) => v.type))];
      setTypes(uniqueTypes);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = vehicles;
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter !== "All") {
      filtered = filtered.filter((v) => v.type === typeFilter);
    }
    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [searchTerm, typeFilter, vehicles]);

  const handleDelete = async () => {
    const vehicleId = deleteModal.id;
    if (!vehicleId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
      setDeleteModal({ isOpen: false, id: null });
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Vehicle Management</h1>
        <Link
          to="/admin/transport/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md absolute bottom-8 right-9"
        >
          <CiCirclePlus size={20} />
          Add New Vehicle
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No vehicles found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Reg. No.</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Price/Day (Rs.)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-700">{vehicle.registrationNumber}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{vehicle.name}</td>
                    <td className="px-6 py-4 text-gray-600">{vehicle.type}</td>
                    <td className="px-6 py-4 text-gray-600">{vehicle.capacity} persons</td>
                    <td className="px-6 py-4 text-gray-600">Rs. {vehicle.pricePerDay?.toLocaleString("en-LK")}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          vehicle.availability
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {vehicle.availability ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => navigate(`/admin/transport/edit`, { state: vehicle })}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: vehicle._id })}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-4">
            {paginatedVehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-gray-500">Reg: {vehicle.registrationNumber}</span>
                    <h3 className="font-bold text-lg">{vehicle.name}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      vehicle.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vehicle.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p>Type: {vehicle.type}</p>
                  <p>Capacity: {vehicle.capacity} persons</p>
                  <p>Price/Day: Rs. {vehicle.pricePerDay?.toLocaleString("en-LK")}</p>
                </div>
                <div className="flex justify-end gap-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/admin/transport/edit`, { state: vehicle })}
                    className="text-blue-600 hover:text-blue-800 transition p-2"
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: vehicle._id })}
                    className="text-red-600 hover:text-red-800 transition p-2"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating add button (mobile) */}
      <Link
        to="/admin/transport/add"
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition"
      >
        <CiCirclePlus size={32} />
      </Link>
    </div>
  );
}