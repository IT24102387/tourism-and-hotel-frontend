import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlaceDetails() {
  const { name } = useParams();
  const location = useLocation();

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const image = location.state?.image;

  useEffect(() => {
    async function fetchDescription() {
      try {
        const res = await axios.post("http://localhost:5000/api/describe", {
          place: name,
        });

        setDescription(res.data.description);
      } catch (err) {
        console.error(err);
        setDescription("Failed to load description.");
      } finally {
        setLoading(false);
      }
    }

    fetchDescription();
  }, [name]);

  return (
    <div className="min-h-screen p-8 bg-[#FFFBF5]">
      <h1 className="text-4xl font-bold mb-6">{name}</h1>

      {/* Image */}
      <img
        src={image || `https://source.unsplash.com/1200x500/?${name}`}
        alt={name}
        className="w-full h-[400px] object-cover rounded-xl mb-6"
      />

      {/* Description */}
      {loading ? (
        <p>Loading description...</p>
      ) : (
        <p className="text-lg text-gray-700">{description}</p>
      )}
    </div>
  );
}