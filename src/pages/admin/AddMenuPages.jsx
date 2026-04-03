import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const menuCategories = [
  { value: "Breakfast", icon: "🌅" },
  { value: "Lunch", icon: "☀️" },
  { value: "Dinner", icon: "🌙" },
  { value: "Desserts", icon: "🍮" },
  { value: "Beverages", icon: "🥤" },
  { value: "Special", icon: "⭐" },
];

export function AddMenuPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state;

  const [menuName, setMenuName] = useState("Breakfast");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menuName.trim()) { toast.error("Please select a menu name."); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("You are not authorized."); return; }

    setIsLoading(true);
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${restaurantId}/menus`,
        { restaurantId, name: menuName, description, isActive: true },
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success(result.data.message || "Menu added successfully!");
      navigate(`/admin/restaurant/${restaurantId}/menus`, { state: restaurant });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Add Menu</h1>
          <p className="text-gray-600">{restaurant?.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Menu Category <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {menuCategories.map((cat) => (
                  <button key={cat.value} type="button" onClick={() => setMenuName(cat.value)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg border text-sm font-medium transition cursor-pointer ${
                      menuName === cat.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                    }`}>
                    <span className="text-2xl">{cat.icon}</span>
                    <span>{cat.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="e.g. Served from 7:00 AM to 10:00 AM" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button type="submit" disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition text-white shadow-md ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                {isLoading ? "Adding Menu..." : "Add Menu"}
              </button>
              <button type="button" onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus`, { state: restaurant })}
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

export function UpdateMenuPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, menu } = location.state;

  const [menuName, setMenuName] = useState(menu.name);
  const [description, setDescription] = useState(menu.description || "");
  const [isActive, setIsActive] = useState(menu.isActive);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { toast.error("You are not authorized."); return; }

    setIsLoading(true);
    try {
      const result = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/menus/${menu._id}`,
        { name: menuName, description, isActive },
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success(result.data.message || "Menu updated successfully!");
      navigate(`/admin/restaurant/${restaurantId}/menus`, { state: restaurant });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Update Menu</h1>
          <p className="text-gray-600">{restaurant?.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Menu Category</label>
              <div className="grid grid-cols-3 gap-2">
                {menuCategories.map((cat) => (
                  <button key={cat.value} type="button" onClick={() => setMenuName(cat.value)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg border text-sm font-medium transition cursor-pointer ${
                      menuName === cat.value ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                    }`}>
                    <span className="text-2xl">{cat.icon}</span>
                    <span>{cat.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsActive(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition cursor-pointer ${isActive ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  ✅ Active
                </button>
                <button type="button" onClick={() => setIsActive(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition cursor-pointer ${!isActive ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  ❌ Inactive
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button type="submit" disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition shadow-md text-white flex items-center justify-center gap-2 ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-900 hover:bg-indigo-800"}`}>
                {isLoading ? "Updating..." : "Update Menu"}
              </button>
              <button type="button" onClick={() => navigate(`/admin/restaurant/${restaurantId}/menus`, { state: restaurant })}
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