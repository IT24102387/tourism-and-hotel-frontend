import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const categories = [
  { value: "travel", label: "Travel Accessories", icon: "✈️" },
  { value: "camp", label: "Camping Equipment", icon: "⛺" },
  { value: "tools", label: "Outdoor Tools", icon: "🪓" },
];

export default function UpdateItemPage() {
    const location=useLocation();
    console.log(location)

  const [EquipmentKey, setEquipmentKey] = useState(location.state.key);
  const [EquipmentName, setEquipmentName] = useState(location.state.name);
  const [PricePerDay, setPricePerDay] = useState(location.state.dailyRentalprice);
  const [EquipmentCategory, setEquipmentCategory] = useState(location.state.category);
  const [EquipmentDescription, setEquipmentDescription] = useState(location.state.description);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  

  async function handleAddItem() {
    if (!EquipmentKey.trim() || !EquipmentName.trim() || !EquipmentDescription.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!PricePerDay || parseFloat(PricePerDay) <= 0) {
      toast.error("Please enter a valid price per day.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authorized to add items.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${EquipmentKey}`,
        {
          key: EquipmentKey,
          name: EquipmentName,
          dailyRentalprice: parseFloat(PricePerDay),
          category: EquipmentCategory,
          description: EquipmentDescription,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success(result.data.message);
      navigate("/admin/items");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Update Equipment</h1>
        </div>

        <div className="space-y-5">

          {/* Equipment Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Key <span className="text-red-400">*</span>
            </label>
            <input
              disabled
              type="text"
              placeholder="e.g. TENT-001"
              value={EquipmentKey}
              onChange={(e) => setEquipmentKey(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Equipment Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Alpine Tent"
              value={EquipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Price Per Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Day <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rs.</span>
              <input
                type="number"
                placeholder="0.00"
                value={PricePerDay}
                min="0"
                step="0.01"
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-7 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setEquipmentCategory(cat.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg border text-xs font-medium transition cursor-pointer
                    ${EquipmentCategory === cat.value
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              placeholder="Describe the equipment — condition, features, included accessories..."
              value={EquipmentDescription}
              rows={4}
              onChange={(e) => setEquipmentDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => navigate("/admin/items")}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              disabled={isLoading}
              className="flex-[2] py-2.5 rounded-lg bg-indigo-900 hover:bg-indigo-800 active:scale-95 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Adding...
                </>
              ) : (
                "Update Equipment"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}