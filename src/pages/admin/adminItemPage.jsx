import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit, FiTrash2, FiSearch, FiPackage, FiCheckCircle, FiXCircle, FiTag } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminItemPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, key: null });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
      setFilteredItems(response.data);
      const uniqueCategories = ["All", ...new Set(response.data.map((item) => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = items;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.key?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "All") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, items]);

  const handleDelete = async () => {
    const itemKey = deleteModal.key;
    if (!itemKey) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${itemKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.key !== itemKey));
      setDeleteModal({ isOpen: false, key: null });
      toast.success("Item deleted successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete item";
      toast.error(message);
    }
  };

  // Stats
  const totalItems = items.length;
  const availableCount = items.filter((i) => i.availability).length;
  const unavailableCount = items.filter((i) => !i.availability).length;
  const totalStock = items.reduce((sum, i) => sum + (i.stockCount ?? 0), 0);
  const uniqueCategoryCount = new Set(items.map((i) => i.category)).size;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
      

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage rental equipment, stock, and availability</p>
      </div>

      {/* ── BANNER ── */}
      <div className="flex rounded-3xl mb-5 h-41 shadow-2xl overflow-hidden bg-slate-900">

        {/* Stat side */}
        <div className="flex flex-col justify-center px-6 shrink-0 w-60 bg-gradient-to-b from-[#2F2D8F] via-[#2A2A74] to-[#1E1C6E] text-white">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-orange-300 mb-2">
            Total Equipment
          </p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold leading-none">{totalItems}</span>
            <span className="text-2xl font-semibold text-slate-200">Items</span>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-200">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <FiPackage size={16} className="text-white" />
            </div>
            <span>{uniqueCategoryCount} categories</span>
          </div>
          <p className="mt-6 text-xs text-slate-300 leading-relaxed max-w-[160px]">
            
          </p>
        </div>

        {/* Image side */}
        <div className="relative flex-1 overflow-hidden">
          <img
            src="https://img1.wsimg.com/isteam/getty/2190552397/:/rs=w:1920"
            alt="Camping equipment"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(15,23,42,0.45), rgba(15,23,42,0.08))",
            }}
          />
          <div className="absolute bottom-5 left-5 rounded-3xl bg-white/90 px-4 py-3 shadow-lg max-w-xs">
            <p className="text-sm font-semibold text-slate-900">Manage inventory with ease</p>
            <p className="text-xs text-slate-500 mt-1">Keep your most important gear visible and ready.</p>
          </div>
        </div>

      </div>
 

      {/* ── FILTERS ── */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition"
            onFocus={(e) => (e.target.style.borderColor = "#2F2D8F")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition"
            onFocus={(e) => (e.target.style.borderColor = "#2F2D8F")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#eeeeff" }}
          >
            <FiPackage size={24} style={{ color: "#2F2D8F" }} />
          </div>
          <p className="text-gray-500 text-lg">No products found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {/* ── DESKTOP TABLE ── */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead style={{ background: "linear-gradient(to right, #2F2D8F, #1E2269)" }}>
                <tr>
                  {["Key", "Name", "Price (Daily)", "Category", "Stock", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white ${h === "Actions" ? "text-center" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedItems.map((product) => (
                  <tr key={product.key} className="hover:bg-indigo-50/40 transition">
                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{product.key}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-gray-700">Rs {product.dailyRentalprice}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-md text-xs font-medium"
                        style={{ background: "#eeeeff", color: "#2F2D8F" }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        (product.stockCount ?? 0) > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {product.stockCount ?? 0} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.availability ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/items/edit`, { state: product })}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition"
                        >
                          <FiEdit size={17} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, key: product.key })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                        >
                          <FiTrash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARD VIEW ── */}
          <div className="md:hidden space-y-4">
            {paginatedItems.map((product) => (
              <div key={product.key} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-gray-400 font-mono">#{product.key}</span>
                    <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {product.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3 space-y-1">
                  <p>Price: <span className="font-medium text-gray-800">Rs {product.dailyRentalprice}</span></p>
                  <p>
                    Category:{" "}
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: "#eeeeff", color: "#2F2D8F" }}
                    >
                      {product.category}
                    </span>
                  </p>
                  <p>
                    Stock:{" "}
                    <span className={`font-semibold ${(product.stockCount ?? 0) > 0 ? "text-blue-600" : "text-orange-600"}`}>
                      {product.stockCount ?? 0} units
                    </span>
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/admin/items/edit`, { state: product })}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, key: product.key })}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition text-sm"
              >
                Previous
              </button>
              <span
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ background: "linear-gradient(to right, #2F2D8F, #1E2269)" }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <FiTrash2 size={18} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, key: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING ADD BUTTON ── */}
      <Link
        to="/admin/items/add"
        className="fixed bottom-6 right-6 text-white shadow-xl transition hover:opacity-90 flex items-center gap-2 rounded-full p-4 md:rounded-xl md:px-5 md:py-3"
        style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
      >
        <CiCirclePlus size={22} />
        <span className="hidden md:inline font-semibold text-sm">Add New Equipment</span>
      </Link>

    </div>
  );
}