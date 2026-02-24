import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomByKey } from "../../utils/api";

export default function RoomDetails() {
    const { key } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRoomByKey(key).then((res) => {
            setRoom(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [key]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!room) return <div className="text-center mt-10 text-red-500">Room not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">← Back</button>

            {room.images && room.images[0] && (
                <img src={room.images[0]} alt={room.hotelName} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}

            <h1 className="text-3xl font-bold">{room.hotelName}</h1>
            <p className="text-gray-600 mt-1">Room {room.roomNumber} — {room.roomType}</p>
            <p className="text-gray-500 mt-3">{room.description}</p>

            {/* Facilities */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Room Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className={`p-3 rounded border text-center ${room.facilities?.ac ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                        <p className="font-medium">AC</p>
                        <p className="text-sm">{room.facilities?.ac ? "✅ Available" : "❌ Not Available"}</p>
                    </div>
                    <div className={`p-3 rounded border text-center ${room.facilities?.wifi ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                        <p className="font-medium">WiFi</p>
                        <p className="text-sm">{room.facilities?.wifi ? "✅ Available" : "❌ Not Available"}</p>
                    </div>
                    <div className={`p-3 rounded border text-center ${room.facilities?.parking ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                        <p className="font-medium">Parking</p>
                        <p className="text-sm">{room.facilities?.parking ? "✅ Available" : "❌ Not Available"}</p>
                    </div>
                    <div className={`p-3 rounded border text-center ${room.facilities?.tv ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                        <p className="font-medium">TV</p>
                        <p className="text-sm">{room.facilities?.tv ? "✅ Available" : "❌ Not Available"}</p>
                    </div>
                    <div className={`p-3 rounded border text-center ${room.facilities?.hotWater ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                        <p className="font-medium">Hot Water</p>
                        <p className="text-sm">{room.facilities?.hotWater ? "✅ Available" : "❌ Not Available"}</p>
                    </div>
                    <div className={`p-3 rounded border text-center ${room.facilities?.miniBar ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                        <p className="font-medium">Mini Bar</p>
                        <p className="text-sm">{room.facilities?.miniBar ? "✅ Available" : "❌ Not Available"}</p>
                    </div>
                </div>
            </div>

            {/* Price & Book */}
            <div className="mt-8 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                    <p className="text-2xl font-bold text-green-600">LKR {room.price}/night</p>
                    <p className="text-sm text-gray-500">Max {room.capacity} guests</p>
                    <p className={`text-sm mt-1 font-medium ${room.availability ? "text-green-600" : "text-red-500"}`}>
                        {room.availability ? "✅ Available" : "❌ Not Available"}
                    </p>
                </div>
                {room.availability && (
                    <button
                        onClick={() => navigate(`/rooms/${room.key}/book`)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Book This Room
                    </button>
                )}
            </div>
        </div>
    );
}