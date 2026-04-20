import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import imageUpload from "../../utils/imageUpload";

const foodCategories = [
  { value: "Rice & Curry", icon: "🍛" },
  { value: "Seafood", icon: "🦐" },
  { value: "Grills", icon: "🍖" },
  { value: "Snacks", icon: "🥪" },
  { value: "Beverages", icon: "🥤" },
  { value: "Desserts", icon: "🍮" },
];

// ─────────────────────────────────────────────
// Admin Food Item List Page
// ─────────────────────────────────────────────
export function AdminFoodItemPage() {
  const { restaurantId, menuId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, menu } = location.state;

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => { fetchFoodItems(); }, []);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/menus/${menuId}/fooditems`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoodItems(response.data);
    } catch (error) {
      toast.error("Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/fooditems/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoodItems((prev) => prev.filter((f) => f._id !== id));
      setDeleteModal({ isOpen: false, id: null });
      toast.success("Food item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete food item");
    }
  };

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
        <button onClick={() => navigate("/admin/restaurant")} className="hover:text-blue-600">Restaurants</button>
        <span>/</span>
        <button onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus`, { state: restaurant })} className="hover:text-blue-600">
          {restaurant?.name}
        </button>
        <span>/</span>
        <span className="text-blue-600 font-medium">{menu?.name} Menu</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Food Items</h1>
          <p className="text-gray-500 mt-1">{restaurant?.name} — {menu?.name} Menu</p>
        </div>
        <button
          onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems/add`, { state: { restaurant, menu } })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md absolute bottom-8 right-9"
        >
          <CiCirclePlus size={20} /> Add Food Item
        </button>
      </div>

      {foodItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No food items found.</p>
          <p className="text-gray-400 mt-2">Add food items to this menu.</p>
        </div>
      ) : (
        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#2F2D8F] to-[#1E2269] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Food Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Price (Rs.)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Prep Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foodItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-gray-600">Rs. {item.price?.toLocaleString("en-LK")}</td>
                  <td className="px-6 py-4 text-gray-600">{item.preparationTime ? `${item.preparationTime} min` : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.availability ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems/edit`, { state: { restaurant, menu, foodItem: item } })}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, id: item._id })}
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
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {foodItems.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {item.availability ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <p>Category: {item.category}</p>
              <p>Price: Rs. {item.price?.toLocaleString("en-LK")}</p>
            </div>
            <div className="flex justify-end gap-4 pt-2 border-t border-gray-100">
              <button onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems/edit`, { state: { restaurant, menu, foodItem: item } })} className="text-blue-600 p-2">
                <FiEdit size={20} />
              </button>
              <button onClick={() => setDeleteModal({ isOpen: true, id: item._id })} className="text-red-600 p-2">
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this food item?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems/add`, { state: { restaurant, menu } })}
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-xl"
      >
        <CiCirclePlus size={32} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Add Food Item Page
// ─────────────────────────────────────────────
export function AddFoodItemPage() {
  const { restaurantId, menuId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, menu } = location.state;

  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("Rice & Curry");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [foodImages, setFoodImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName.trim() || !description.trim()) { toast.error("Please fill in all required fields."); return; }
    if (!price || parseFloat(price) <= 0) { toast.error("Please enter a valid price."); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("You are not authorized."); return; }

    setIsLoading(true);
    try {
      let imageUrls = [];
      if (foodImages.length > 0) {
        try {
          const promises = foodImages.map((img) => imageUpload(img));
          imageUrls = await Promise.all(promises);
        } catch (imgError) {
          console.log("Image upload failed, continuing:", imgError);
        }
      }

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/fooditems`,
        {
          restaurantId,
          menuId,
          name: foodName,
          category,
          price: parseFloat(price),
          description,
          preparationTime: preparationTime ? parseInt(preparationTime) : null,
          image: imageUrls,
          availability: true,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success(result.data.message || "Food item added successfully!");
      navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems`, { state: { restaurant, menu } });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Add Food Item</h1>
          <p className="text-gray-600">{restaurant?.name} — {menu?.name} Menu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Food Name <span className="text-red-500">*</span></label>
                <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Chicken Kottu" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price (Rs.) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 text-sm font-medium">Rs.</span>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Preparation Time (min)</label>
                <input type="number" value={preparationTime} onChange={(e) => setPreparationTime(e.target.value)} min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 15" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {foodCategories.map((cat) => (
                    <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        category === cat.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}>
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-center leading-tight">{cat.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Describe the food item — ingredients, spice level..." />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Food Images</label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <span className="text-blue-600 font-semibold text-sm">
                    {foodImages.length > 0 ? `${foodImages.length} file(s) selected` : "Choose files"}
                  </span>
                  <input type="file" multiple accept="image/*" onChange={(e) => setFoodImages(Array.from(e.target.files))} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button type="submit" disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition text-white shadow-md ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                {isLoading ? "Adding Food Item..." : "Add Food Item"}
              </button>
              <button type="button" onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems`, { state: { restaurant, menu } })}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Update Food Item Page
// ─────────────────────────────────────────────
export function UpdateFoodItemPage() {
  const { restaurantId, menuId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, menu, foodItem } = location.state;

  const [foodName, setFoodName] = useState(foodItem.name);
  const [category, setCategory] = useState(foodItem.category);
  const [price, setPrice] = useState(foodItem.price);
  const [description, setDescription] = useState(foodItem.description);
  const [preparationTime, setPreparationTime] = useState(foodItem.preparationTime || "");
  const [availability, setAvailability] = useState(foodItem.availability);
  const [foodImages, setFoodImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName.trim() || !description.trim()) { toast.error("Please fill in all required fields."); return; }
    if (!price || parseFloat(price) <= 0) { toast.error("Please enter a valid price."); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("You are not authorized."); return; }

    setIsLoading(true);
    try {
      let updatingImages = foodItem.image;
      if (foodImages.length > 0) {
        try {
          const promises = foodImages.map((img) => imageUpload(img));
          updatingImages = await Promise.all(promises);
        } catch (imgError) {
          console.log("Image upload failed, keeping existing:", imgError);
        }
      }

      const result = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/fooditems/${foodItem._id}`,
        {
          name: foodName,
          category,
          price: parseFloat(price),
          description,
          preparationTime: preparationTime ? parseInt(preparationTime) : null,
          availability,
          image: updatingImages,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success(result.data.message || "Food item updated successfully!");
      navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems`, { state: { restaurant, menu } });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Update Food Item</h1>
          <p className="text-gray-600">{restaurant?.name} — {menu?.name} Menu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Food Name <span className="text-red-500">*</span></label>
                <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price (Rs.) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 text-sm font-medium">Rs.</span>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Preparation Time (min)</label>
                <input type="number" value={preparationTime} onChange={(e) => setPreparationTime(e.target.value)} min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {foodCategories.map((cat) => (
                    <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        category === cat.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}>
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-center leading-tight">{cat.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setAvailability(true)}
                    className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition cursor-pointer ${availability ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    ✅ Available
                  </button>
                  <button type="button" onClick={() => setAvailability(false)}
                    className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition cursor-pointer ${!availability ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    ❌ Unavailable
                  </button>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Food Images</label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <span className="text-blue-600 font-semibold text-sm">
                    {foodImages.length > 0 ? `${foodImages.length} file(s) selected` : "Choose new files"}
                  </span>
                  <input type="file" multiple accept="image/*" onChange={(e) => setFoodImages(Array.from(e.target.files))} className="hidden" />
                </label>
                <p className="text-xs text-gray-500">Leave empty to keep existing images.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button type="submit" disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition shadow-md text-white flex items-center justify-center gap-2 ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-900 hover:bg-indigo-800"}`}>
                {isLoading ? "Updating..." : "Update Food Item"}
              </button>
              <button type="button" onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus/${menuId}/fooditems`, { state: { restaurant, menu } })}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}