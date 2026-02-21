import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
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
  const navigate=useNavigate()

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchItems();
  }, []);

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

  // Filter items based on search and category
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

      // Remove from local state – filter by key (since we stored key)
      setItems((prev) => prev.filter((item) => item.key !== itemKey));
      setDeleteModal({ isOpen: false, key: null });
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      const message = error.response?.data?.message || "Failed to delete item";
      toast.error(message);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
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
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <Link
          to="/admin/items/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <CiCirclePlus size={20} />
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No products found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Key</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Price (Daily)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedItems.map((product) => (
                  <tr key={product.key} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-700">{product.key}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                    <td className="px-6 py-4">Rs {product.dailyRentalprice}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.availability ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                        onClick={()=>{
                          navigate(`/admin/items/edit`,{state:product})
                        }} className="text-blue-600 hover:text-blue-800 transition"
                        >
                            <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, key: product.key })} // store key, not _id
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
            {paginatedItems.map((product) => (
              <div key={product.key} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-gray-500">Key: {product.key}</span>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p>Price: Rs {product.dailyRentalprice}</p>
                  <p>Category: {product.category}</p>
                </div>
                <div className="flex justify-end gap-4 pt-2 border-t border-gray-100">
                  <Link
                    to={`/admin/items/edit/${product.key}`}
                    className="text-blue-600 hover:text-blue-800 transition p-2"
                  >
                    <FiEdit size={20} />
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, key: product.key })} // store key
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, key: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete} // ✅ no arguments – reads from state
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating add button */}
      <Link
        to="/admin/items/add"
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition"
      >
        <CiCirclePlus size={32} />
      </Link>
    </div>
  );
}