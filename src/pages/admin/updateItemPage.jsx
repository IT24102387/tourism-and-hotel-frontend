import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import imageUpload from "../../utils/imageUpload";

const categories = [
  { value: "travel", label: "Travel Accessories", icon: "✈️" },
  { value: "camp", label: "Camping Equipment", icon: "⛺" },
  { value: "tools", label: "Outdoor Tools", icon: "🪓" },
  { value: "cook", label: "Cook Tools", icon: "🍽️" },
];

const categoryLabel = (value) =>
  categories.find((c) => c.value === value)?.label ?? value;

export default function UpdateItemPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [EquipmentKey, setEquipmentKey] = useState(location.state.key);
  const [EquipmentName, setEquipmentName] = useState(location.state.name);
  const [PricePerDay, setPricePerDay] = useState(location.state.dailyRentalprice);
  const [EquipmentCategory, setEquipmentCategory] = useState(location.state.category);
  const [EquipmentDescription, setEquipmentDescription] = useState(location.state.description);
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── NEW: availability toggle ──────────────────────────────────────────────
  const [isAvailable, setIsAvailable] = useState(
    location.state.availability !== undefined ? location.state.availability : true
  );
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatingImages = location.state.image;
    if (productImages.length > 0) {
      const promises = productImages.map((img) => imageUpload(img));
      updatingImages = await Promise.all(promises);
    }

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
      toast.error("You are not authorized to update items.");
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
          image: updatingImages,
          availability: isAvailable, // ← send to backend
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Update Equipment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Modify the details below to update this rental item. All fields marked with{" "}
            <span className="text-red-500">*</span> are required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Equipment Key */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Equipment Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={EquipmentKey}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
                  placeholder="e.g. TENT-001"
                />
                <p className="text-xs text-gray-400">Equipment key cannot be changed.</p>
              </div>

              {/* Equipment Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Equipment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={EquipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  required
                  placeholder="e.g. Alpine Tent"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                />
              </div>

              {/* Price Per Day */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price Per Day (Rs.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-500 text-sm font-medium">Rs.</span>
                  <input
                    type="number"
                    value={PricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  />
                </div>
              </div>

              {/* ── Availability Toggle ───────────────────────────────────── */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Availability Status
                </label>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors duration-200 cursor-pointer select-none
                    ${isAvailable
                      ? "border-green-300 bg-green-50"
                      : "border-red-200 bg-red-50"
                    }`}
                  onClick={() => setIsAvailable((prev) => !prev)}
                >
                  {/* Toggle pill */}
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0
                      ${isAvailable ? "bg-green-500" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300
                        ${isAvailable ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>

                  {/* Label + badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        isAvailable ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {isAvailable ? "Available for booking" : "Unavailable"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isAvailable ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Toggle to control whether customers can rent this item.
                </p>
              </div>
              {/* ─────────────────────────────────────────────────────────── */}

              {/* Category */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setEquipmentCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg border text-xs font-medium transition cursor-pointer
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
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={EquipmentDescription}
                  onChange={(e) => setEquipmentDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe the equipment — condition, features, included accessories..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images
                </label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <span className="text-blue-600 font-semibold text-sm">
                    {productImages.length > 0
                      ? `${productImages.length} file(s) selected`
                      : "Choose new files"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setProductImages(Array.from(e.target.files))}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Leave empty to keep existing images. Upload new files to replace them.
                </p>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-700">
                  All fields marked with <span className="text-red-500">*</span> are required.
                  Changes will be applied to the inventory immediately upon submission.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition duration-200 shadow-md text-white flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-900 hover:bg-indigo-800 active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Equipment"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/items")}
                disabled={isLoading}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="mt-10 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Equipment Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Equipment Key</h3>
                <p className="text-lg font-semibold text-gray-800">{EquipmentKey || "Not set"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Equipment Name</h3>
                <p className="text-lg font-semibold text-gray-800">{EquipmentName || "Not set"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price Per Day</h3>
                <p className="text-lg font-semibold text-blue-600">
                  {PricePerDay ? `Rs. ${parseFloat(PricePerDay).toFixed(2)}` : "Rs. 0.00"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-lg font-semibold text-gray-800">{categoryLabel(EquipmentCategory)}</p>
              </div>
              {/* ── Availability in preview ── */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full mt-1 ${
                    isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? "bg-green-500" : "bg-red-400"
                    }`}
                  />
                  {isAvailable ? "Available for booking" : "Unavailable"}
                </span>
              </div>
              {/* ─────────────────────────────── */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Images</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {productImages.length > 0
                    ? `${productImages.length} new file(s) selected`
                    : "Using existing images"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description Preview</h3>
                <p className="text-gray-700 line-clamp-3">{EquipmentDescription || "No description provided"}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}