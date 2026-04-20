// src/pages/admin/AdminRestaurantPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit, FiTrash2, FiSearch, FiChevronRight, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminRestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
    } catch (error) {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  // Apply search and filters
  useEffect(() => {
    let filtered = restaurants;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((r) =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => 
        statusFilter === "active" ? r.isActive === true : r.isActive === false
      );
    }
    
    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, restaurants]);

  const handleDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      setDeleteModal({ isOpen: false, id: null });
      toast.success("Restaurant deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete restaurant");
    }
  };

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const paginated = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const totalActive = restaurants.filter(r => r.isActive).length;
  const totalInactive = restaurants.filter(r => !r.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Management</h1>
          <p className="text-gray-500 mt-1">Manage all restaurants in the system</p>
        </div>
        <button
          onClick={() => navigate("/admin/restaurant/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <CiCirclePlus size={20} /> Add Restaurant
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Restaurants</p>
          <p className="text-3xl font-bold text-gray-800">{restaurants.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Active Restaurants</p>
          <p className="text-3xl font-bold text-green-600">{totalActive}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Inactive Restaurants</p>
          <p className="text-3xl font-bold text-red-600">{totalInactive}</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, address or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        
        {/* Filter Results Info */}
        {filteredRestaurants.length !== restaurants.length && (
          <div className="mt-3 text-sm text-gray-500">
            Found {filteredRestaurants.length} restaurant(s) out of {restaurants.length}
          </div>
        )}
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No restaurants found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Restaurant Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Opening Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map((restaurant) => (
                  <tr key={restaurant._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{restaurant.name}</td>
                    <td className="px-6 py-4 text-gray-600">{restaurant.address}</td>
                    <td className="px-6 py-4 text-gray-600">{restaurant.phone || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{restaurant.openingHours || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${restaurant.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {restaurant.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/restaurant/${restaurant._id}/menus`, { state: restaurant })}
                          className="text-green-600 hover:text-green-800 border border-green-300 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          Menus <FiChevronRight size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/restaurant/edit`, { state: restaurant })}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: restaurant._id })}
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {paginated.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${restaurant.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {restaurant.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{restaurant.address}</p>
                {restaurant.phone && <p className="text-sm text-gray-500 mb-2">📞 {restaurant.phone}</p>}
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/admin/restaurant/${restaurant._id}/menus`, { state: restaurant })}
                    className="text-green-600 border border-green-300 px-2 py-1 rounded-lg text-xs font-medium"
                  >
                    Menus
                  </button>
                  <button onClick={() => navigate(`/admin/restaurant/edit`, { state: restaurant })} className="text-blue-600 p-2">
                    <FiEdit size={20} />
                  </button>
                  <button onClick={() => setDeleteModal({ isOpen: true, id: restaurant._id })} className="text-red-600 p-2">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Previous</button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Next</button>
            </div>
          )}
        </>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure? All menus and food items of this restaurant will also be deleted.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}