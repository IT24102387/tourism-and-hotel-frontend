import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRooms, deleteRoom, updateRoomAvailability } from "../../utils/api";

export default function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    function fetchRooms() {
        getAllRooms().then((res) => {
            setRooms(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }

    function handleDelete(key) {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        deleteRoom(key).then(() => {
            setRooms((prev) => prev.filter((r) => r.key !== key));
        }).catch(() => alert("Failed to delete room"));
    }

    function handleToggleAvailability(room) {
        updateRoomAvailability(room.key, {
            availability: !room.availability,
            status: !room.availability ? "Available" : "Unavailable"
        }).then(() => {
            fetchRooms();
        }).catch(() => alert("Failed to update availability"));
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Rooms</h1>
                <button
                    onClick={() => navigate("/admin/rooms/add")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add New Room
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">Room Key</th>
                            <th className="text-left p-4">Hotel</th>
                            <th className="text-left p-4">Type</th>
                            <th className="text-left p-4">Price</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Availability</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room.key} className="border-t hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">{room.key}</td>
                                <td className="p-4">{room.hotelName}</td>
                                <td className="p-4">{room.roomType}</td>
                                <td className="p-4">LKR {room.price}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        room.status == "Available" ? "bg-green-100 text-green-700" :
                                        room.status == "Booked" ? "bg-blue-100 text-blue-700" :
                                        room.status == "Maintenance" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleToggleAvailability(room)}
                                        className={`px-3 py-1 rounded text-xs font-medium ${
                                            room.availability
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                        }`}
                                    >
                                        {room.availability ? "✅ Available" : "❌ Unavailable"}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/rooms/edit/${room.key}`)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.key)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}