import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomByKey, updateRoom } from "../../utils/api";

export default function AdminEditRoom() {
    const { key } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getRoomByKey(key).then((res) => setForm(res.data))
            .catch(() => setError("Failed to load room"));
    }, [key]);

    function handleFacilityChange(facility) {
        setForm((prev) => ({
            ...prev,
            facilities: { ...prev.facilities, [facility]: !prev.facilities[facility] }
        }));
    }

    function handleSubmit() {
        setError("");
        setSubmitting(true);

        updateRoom(key, form).then(() => {
            navigate("/admin/rooms");
        }).catch((err) => {
            setError(err.response?.data?.message || "Failed to update room");
            setSubmitting(false);
        });
    }

    if (!form) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">← Back</button>
            <h1 className="text-3xl font-bold mb-6">Edit Room — {key}</h1>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Hotel Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2"
                        value={form.hotelName} onChange={(e) => setForm({ ...form, hotelName: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Room Type</label>
                        <select className="w-full border rounded px-3 py-2"
                            value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
                            {["Single","Double","Triple","Quad","Suite","Deluxe"].map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select className="w-full border rounded px-3 py-2"
                            value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            {["Available","Booked","Maintenance","Unavailable"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price per Night (LKR)</label>
                        <input type="number" className="w-full border rounded px-3 py-2"
                            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input type="number" className="w-full border rounded px-3 py-2"
                            value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea rows="3" className="w-full border rounded px-3 py-2"
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                {/* Facilities */}
                <div>
                    <label className="block text-sm font-medium mb-2">Facilities</label>
                    <div className="grid grid-cols-3 gap-3">
                        {form.facilities && Object.keys(form.facilities).map((f) => (
                            <label key={f} className="flex items-center gap-2 cursor-pointer border rounded px-3 py-2">
                                <input type="checkbox" checked={form.facilities[f]}
                                    onChange={() => handleFacilityChange(f)} />
                                <span className="text-sm capitalize">
                                    {f === "hotWater" ? "Hot Water" : f === "miniBar" ? "Mini Bar" : f.toUpperCase()}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="availability" checked={form.availability}
                        onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
                    <label htmlFor="availability" className="text-sm font-medium">Available</label>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button onClick={handleSubmit} disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {submitting ? "Updating..." : "Update Room"}
                </button>
            </div>
        </div>
    );
}