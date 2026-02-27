import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import imageUpload from "../../utils/imageUpload";

const categories = [
  { value: "travel", label: "Travel Accessories", icon: "✈️" },
  { value: "camp", label: "Camping Equipment", icon: "⛺" },
  { value: "tools", label: "Outdoor Tools", icon: "🪓" },
  { value: "cook", label: "Cook Tools", icon: "🍽️" },
];

export default function AddItemPage() {
  // State declarations
  const [EquipmentKey, setEquipmentKey] = useState("");
  const [EquipmentName, setEquipmentName] = useState("");
  const [PricePerDay, setPricePerDay] = useState("");
  const [EquipmentCategory, setEquipmentCategory] = useState("camp");
  const [EquipmentDescription, setEquipmentDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const promises = productImages.map((img) => imageUpload(img));

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
      const imageUrls = await Promise.all(promises);

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        {
          key: EquipmentKey,
          name: EquipmentName,
          dailyRentalprice: parseFloat(PricePerDay),
          category: EquipmentCategory,
          description: EquipmentDescription,
          image: imageUrls,
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

  // Form reset handler
  const handleReset = () => {
    setEquipmentKey("");
    setEquipmentName("");
    setPricePerDay("");
    setEquipmentCategory("camp");
    setEquipmentDescription("");
    setProductImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Add Equipment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in the equipment details below. All fields are required for a complete rental listing.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Grid for responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Equipment Key */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Equipment Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={EquipmentKey}
                  onChange={(e) => setEquipmentKey(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  placeholder="e.g. TENT-001"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  placeholder="e.g. Alpine Tent"
                />
              </div>

              {/* Price Per Day */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price Per Day (Rs.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 text-sm font-medium">Rs.</span>
                  <input
                    type="number"
                    value={PricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Equipment Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Equipment Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setEquipmentCategory(cat.value)}
                      className={`flex items-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition cursor-pointer
                        ${EquipmentCategory === cat.value
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="leading-tight">{cat.label}</span>
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
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none resize-none"
                  placeholder="Describe the equipment — condition, features, included accessories..."
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
                      : "Choose files"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setProductImages(Array.from(e.target.files))}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">Upload one or more product images.</p>
              </div>

            </div>

            {/* Button Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition duration-200 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]"
                } text-white shadow-md`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Equipment...
                  </span>
                ) : (
                  "Add Equipment"
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:transform active:scale-[0.98] transition duration-200"
              >
                Clear All
              </button>
            </div>

            {/* Form Submission Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-700">
                  All fields marked with <span className="text-red-500">*</span> are required.
                  The equipment will be added to your inventory immediately upon submission.
                </p>
              </div>
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
                <p className="text-lg font-semibold text-gray-800">
                  {categories.find((c) => c.value === EquipmentCategory)?.label || "Not set"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Images Selected</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {productImages.length > 0 ? `${productImages.length} file(s)` : "None"}
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