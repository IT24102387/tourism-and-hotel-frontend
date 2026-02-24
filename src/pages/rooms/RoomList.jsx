import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRooms } from "../../utils/api";

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllRooms().then((res) => {
            setRooms(res.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-center mt-10">Loading rooms...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.key} className="border rounded-lg shadow p-4">
                        {room.images && room.images[0] && (
                            <img
                                src={room.images[0]}
                                alt={room.hotelName}
                                className="w-full h-48 object-cover rounded mb-3"
                            />
                        )}
                        <h2 className="text-xl font-semibold">{room.hotelName}</h2>
                        <p className="text-gray-600">Room {room.roomNumber} — {room.roomType}</p>
                        <p className="text-gray-500 text-sm mt-1">{room.description}</p>

                        {/* Facilities */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {room.facilities?.ac && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">AC</span>}
                            {room.facilities?.wifi && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">WiFi</span>}
                            {room.facilities?.parking && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">Parking</span>}
                            {room.facilities?.tv && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">TV</span>}
                            {room.facilities?.hotWater && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Hot Water</span>}
                            {room.facilities?.miniBar && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Mini Bar</span>}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <p className="text-lg font-bold text-green-600">LKR {room.price}/night</p>
                            <button
                                onClick={() => navigate(`/rooms/${room.key}`)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}