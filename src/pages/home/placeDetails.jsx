import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL;

export default function PlaceDetails() {
  const { name } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [placeData, setPlaceData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlaceDetails() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${BASE}/api/places/explore`, {
          params: { place: decodeURIComponent(name) },
        });

        setPlaceData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load place details");
      } finally {
        setLoading(false);
      }
    }

    fetchPlaceDetails();
  }, [name]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFFBF5" }}
      >
        <p className="text-lg font-medium text-amber-700">
          Loading place details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFFBF5" }}
      >
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: "#FFFBF5" }}>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden mb-10 shadow-xl">
          <img
            src={placeData?.mainImage || location.state?.placeImage}
            alt={placeData?.name || decodeURIComponent(name)}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-4">
              {placeData?.name || decodeURIComponent(name)}
            </h1>

            <p className="text-lg md:text-xl text-amber-200 max-w-2xl">
              Discover the beauty and adventure of this amazing destination
            </p>
          </div>
        </div>

        {/* Description */}
        <div
          className="rounded-2xl p-8 mb-10 shadow-md"
          style={{ background: "#FFFFFF" }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: "#292524" }}
          >
            About This Place
          </h2>

          <p
            className="text-lg leading-8"
            style={{ color: "#57534E" }}
          >
            {placeData?.description}
          </p>

          {placeData?.address && (
            <p className="mt-4 text-sm text-stone-500">
              <span className="font-semibold">Address:</span> {placeData.address}
            </p>
          )}
        </div>

        {/* Gallery */}
        {placeData?.gallery?.length > 0 && (
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ color: "#292524" }}
            >
              More Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {placeData.gallery.slice(0,8).map((img, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "#FFFFFF" }}
                >
                  <img
                    src={img}
                    alt={`${placeData?.name || "Place"} ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}