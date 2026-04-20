import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import imageUpload from "../../utils/imageUpload";

export default function AddRestaurantPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("You are not authorized."); return; }

    setIsLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        try {
          const promises = images.map((img) => imageUpload(img));
          imageUrls = await Promise.all(promises);
        } catch (imgError) {
          console.log("Image upload failed, continuing:", imgError);
        }
      }

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants`,
        { name, address, phone, description, openingHours, image: imageUrls, isActive: true },
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success(result.data.message || "Restaurant added successfully!");
      navigate("/admin/restaurant");
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Add Restaurant</h1>
          <p className="text-gray-600">Fill in the restaurant details. Fields marked with <span className="text-red-500">*</span> are required.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Restaurant Name <span className="text-red-500">*</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Kadira Restaurant" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 0771234567" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Kataragama Road, Kataragama" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                <input type="text" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 7:00 AM – 10:00 PM" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Describe the restaurant — cuisine type, ambiance, specialties..." />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Restaurant Images</label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <span className="text-blue-600 font-semibold text-sm">
                    {images.length > 0 ? `${images.length} file(s) selected` : "Choose files"}
                  </span>
                  <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="hidden" />
                </label>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">Fields marked with <span className="text-red-500">*</span> are required. After adding the restaurant, you can add Menus (Breakfast, Lunch, Dinner) and Food Items.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button type="submit" disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition text-white shadow-md ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Restaurant...
                  </span>
                ) : "Add Restaurant"}
              </button>
              <button type="button" onClick={() => navigate("/admin/restaurant")}
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