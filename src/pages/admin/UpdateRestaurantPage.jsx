import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import imageUpload from "../../utils/imageUpload";

export default function UpdateRestaurantPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state;

  const [name, setName] = useState(restaurant.name);
  const [address, setAddress] = useState(restaurant.address);
  const [phone, setPhone] = useState(restaurant.phone || "");
  const [description, setDescription] = useState(restaurant.description);
  const [openingHours, setOpeningHours] = useState(restaurant.openingHours || "");
  const [isActive, setIsActive] = useState(restaurant.isActive);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      let updatingImages = restaurant.image;
      if (images.length > 0) {
        try {
          const promises = images.map((img) => imageUpload(img));
          updatingImages = await Promise.all(promises);
        } catch (imgError) {
          console.log("Image upload failed, keeping existing:", imgError);
        }
      }

      const result = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${restaurant._id}`,
        { name, address, phone, description, openingHours, isActive, image: updatingImages },
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success(result.data.message || "Restaurant updated successfully!");
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Update Restaurant</h1>
          <p className="text-gray-600">Modify the details below. Fields marked with <span className="text-red-500">*</span> are required.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Restaurant Name <span className="text-red-500">*</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                <input type="text" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
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

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Restaurant Images</label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <span className="text-blue-600 font-semibold text-sm">
                    {images.length > 0 ? `${images.length} file(s) selected` : "Choose new files"}
                  </span>
                  <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="hidden" />
                </label>
                <p className="text-xs text-gray-500">Leave empty to keep existing images.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button type="submit" disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition shadow-md text-white flex items-center justify-center gap-2 ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-900 hover:bg-indigo-800"}`}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </>
                ) : "Update Restaurant"}
              </button>
              <button type="button" onClick={() => navigate("/admin/restaurant")} disabled={isLoading}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}