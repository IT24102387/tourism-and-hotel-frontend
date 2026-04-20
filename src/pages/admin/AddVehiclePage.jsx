import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import imageUpload from "../../utils/imageUpload";

const vehicleTypes = [
  { value: "Safari Jeep", label: "Safari Jeep", icon: "🚙" },
  { value: "Van", label: "Van", icon: "🚐" },
  { value: "Car", label: "Car", icon: "🚗" },
  { value: "Bus", label: "Bus", icon: "🚌" },
];

export default function AddVehiclePage() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("Safari Jeep");
  const [capacity, setCapacity] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [description, setDescription] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [vehicleImages, setVehicleImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Step 1: Form submitted");

    if (!registrationNumber.trim() || !vehicleName.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!pricePerDay || parseFloat(pricePerDay) <= 0) {
      toast.error("Please enter a valid price per day.");
      return;
    }
    if (!capacity || parseInt(capacity) <= 0) {
      toast.error("Please enter a valid capacity.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authorized to add vehicles.");
      return;
    }

    console.log("Step 2: Token found:", token);

    setIsLoading(true);
    try {
      let imageUrls = [];
      if (vehicleImages.length > 0) {
        try {
          const promises = vehicleImages.map((img) => imageUpload(img));
          imageUrls = await Promise.all(promises);
          console.log("Step 3: Images uploaded:", imageUrls);
        } catch (imgError) {
          console.log("Step 3: Image upload failed, continuing:", imgError);
        }
      }

      const payload = {
        registrationNumber,
        name: vehicleName,
        type: vehicleType,
        capacity: parseInt(capacity),
        pricePerDay: parseFloat(pricePerDay),
        description,
        driverName,
        driverContact,
        image: imageUrls,
        availability: true,
      };

      console.log("Step 4: Sending payload:", payload);

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehicles`,
        payload,
        { headers: { Authorization: "Bearer " + token } }
      );

      console.log("Step 5: Success:", result.data);
      toast.success(result.data.message || "Vehicle added successfully!");
      navigate("/admin/transport");
    } catch (err) {
      console.log("Step 4 ERROR:", err);
      console.log("Error response:", err?.response?.data);
      toast.error(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRegistrationNumber("");
    setVehicleName("");
    setVehicleType("Safari Jeep");
    setCapacity("");
    setPricePerDay("");
    setDescription("");
    setDriverName("");
    setDriverContact("");
    setVehicleImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Add Vehicle</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in the vehicle details below. All fields marked with{" "}
            <span className="text-red-500">*</span> are required.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Registration Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  placeholder="e.g. KA-1234"
                />
              </div>

              {/* Vehicle Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  placeholder="e.g. Toyota Land Cruiser"
                />
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {vehicleTypes.map((vt) => (
                    <button
                      key={vt.value}
                      type="button"
                      onClick={() => setVehicleType(vt.value)}
                      className={`flex items-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition cursor-pointer
                        ${vehicleType === vt.value
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <span>{vt.icon}</span>
                      <span>{vt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Capacity (Persons) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  placeholder="e.g. 6"
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
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Driver Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  placeholder="e.g. Kamal Perera"
                />
              </div>

              {/* Driver Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Driver Contact</label>
                <input
                  type="text"
                  value={driverContact}
                  onChange={(e) => setDriverContact(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
                  placeholder="e.g. 0771234567"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none resize-none"
                  placeholder="Describe the vehicle — features, amenities, safari route coverage..."
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Vehicle Images</label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <span className="text-blue-600 font-semibold text-sm">
                    {vehicleImages.length > 0
                      ? `${vehicleImages.length} file(s) selected`
                      : "Choose files"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setVehicleImages(Array.from(e.target.files))}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">Upload one or more vehicle images.</p>
              </div>

            </div>

            {/* Info banner */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-700">
                  All fields marked with <span className="text-red-500">*</span> are required.
                  The vehicle will be added to the fleet immediately upon submission.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition duration-200 text-white shadow-md ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Vehicle...
                  </span>
                ) : (
                  "Add Vehicle"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition duration-200"
              >
                Clear All
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="mt-10 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Vehicle Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
                <p className="text-lg font-semibold text-gray-800">{registrationNumber || "Not set"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vehicle Name</h3>
                <p className="text-lg font-semibold text-gray-800">{vehicleName || "Not set"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price Per Day</h3>
                <p className="text-lg font-semibold text-blue-600">
                  {pricePerDay ? `Rs. ${parseFloat(pricePerDay).toFixed(2)}` : "Rs. 0.00"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="text-lg font-semibold text-gray-800">{vehicleType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {capacity ? `${capacity} persons` : "Not set"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Images Selected</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {vehicleImages.length > 0 ? `${vehicleImages.length} file(s)` : "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}