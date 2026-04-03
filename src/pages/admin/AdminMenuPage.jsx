// src/pages/admin/AdminMenuPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit, FiTrash2, FiChevronRight, FiArrowLeft, FiSearch, FiFilter } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminMenuPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state;

  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${restaurantId}/menus`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMenus(response.data);
      setFilteredMenus(response.data);
    } catch (error) {
      toast.error("Failed to load menus");
    } finally {
      setLoading(false);
    }
  };

  // Apply search and filters
  useEffect(() => {
    let filtered = menus;
    
    if (searchTerm) {
      filtered = filtered.filter((m) =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((m) => 
        statusFilter === "active" ? m.isActive === true : m.isActive === false
      );
    }
    
    setFilteredMenus(filtered);
  }, [searchTerm, statusFilter, menus]);

  const handleDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/menus/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMenus((prev) => prev.filter((m) => m._id !== id));
      setDeleteModal({ isOpen: false, id: null });
      toast.success("Menu deleted successfully");
    } catch (error) {
      toast.error("Failed to delete menu");
    }
  };

  // Statistics
  const totalActive = menus.filter(m => m.isActive).length;
  const totalInactive = menus.filter(m => !m.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <button onClick={() => navigate("/admin/restaurant")} className="flex items-center gap-1 hover:text-blue-600 transition">
          <FiArrowLeft size={16} /> Restaurants
        </button>
        <span>/</span>
        <span className="text-gray-800 font-medium">{restaurant?.name || "Restaurant"}</span>
        <span>/</span>
        <span className="text-blue-600 font-medium">Menus</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-gray-500 mt-1">{restaurant?.name}</p>
        </div>
        <button
          onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/add`, { state: restaurant })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <CiCirclePlus size={20} /> Add Menu
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Menus</p>
          <p className="text-3xl font-bold text-gray-800">{menus.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Active Menus</p>
          <p className="text-3xl font-bold text-green-600">{totalActive}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Inactive Menus</p>
          <p className="text-3xl font-bold text-red-600">{totalInactive}</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by menu name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
        {filteredMenus.length !== menus.length && (
          <div className="mt-3 text-sm text-gray-500">
            Found {filteredMenus.length} menu(s) out of {menus.length}
          </div>
        )}
      </div>

      {filteredMenus.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No menus found.</p>
          <p className="text-gray-400 mt-2">Add menus like Breakfast, Lunch, Dinner.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Menu Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMenus.map((menu) => (
                  <tr key={menu._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{menu.name}</td>
                    <td className="px-6 py-4 text-gray-600">{menu.description || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${menu.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {menu.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menu._id}/fooditems`, { state: { restaurant, menu } })}
                          className="text-green-600 hover:text-green-800 border border-green-300 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          Food Items <FiChevronRight size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/edit`, { state: { restaurant, menu } })}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: menu._id })}
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
            {filteredMenus.map((menu) => (
              <div key={menu._id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{menu.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${menu.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {menu.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{menu.description || "—"}</p>
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menu._id}/fooditems`, { state: { restaurant, menu } })}
                    className="text-green-600 border border-green-300 px-2 py-1 rounded-lg text-xs font-medium"
                  >
                    Food Items
                  </button>
                  <button onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/edit`, { state: { restaurant, menu } })} className="text-blue-600 p-2">
                    <FiEdit size={20} />
                  </button>
                  <button onClick={() => setDeleteModal({ isOpen: true, id: menu._id })} className="text-red-600 p-2">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure? All food items in this menu will also be deleted.</p>
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