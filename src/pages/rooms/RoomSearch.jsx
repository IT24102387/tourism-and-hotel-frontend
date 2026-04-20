import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchRooms } from "../../utils/api";

export default function RoomSearch() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        checkIn: "",
        checkOut: "",
        roomType: "",
        hotelName: "",
        facilities: []
    });
    const [rooms, setRooms] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleFacilityToggle(facility) {
        setFilters((prev) => {
            const exists = prev.facilities.includes(facility);
            return {
                ...prev,
                facilities: exists
                    ? prev.facilities.filter((f) => f !== facility)
                    : [...prev.facilities, facility]
            };
        });
    }

    function handleSearch() {
        if (!filters.checkIn || !filters.checkOut) {
            setError("Please select check-in and check-out dates");
            return;
        }
        if (new Date(filters.checkIn) >= new Date(filters.checkOut)) {
            setError("Check-out must be after check-in");
            return;
        }

        setError("");
        setLoading(true);

        const extraFilters = {};
        if (filters.roomType) extraFilters.roomType = filters.roomType;
        if (filters.hotelName) extraFilters.hotelName = filters.hotelName;
        if (filters.facilities.length > 0) extraFilters.facilities = filters.facilities.join(",");

        searchRooms(filters.checkIn, filters.checkOut, extraFilters).then((res) => {
            setRooms(res.data);
            setSearched(true);
            setLoading(false);
        }).catch(() => {
            setError("Search failed. Please try again.");
            setLoading(false);
        });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Search Rooms</h1>

            {/* Search Form */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Check-In Date</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={filters.checkIn}
                            onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Check-Out Date</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={filters.checkOut}
                            onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
                            min={filters.checkIn || new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Room Type</label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={filters.roomType}
                            onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                        >
                            <option value="">All Types</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Triple">Triple</option>
                            <option value="Quad">Quad</option>
                            <option value="Suite">Suite</option>
                            <option value="Deluxe">Deluxe</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hotel Name</label>
                        <input
                            type="text"
                            placeholder="Search hotel..."
                            className="w-full border rounded px-3 py-2"
                            value={filters.hotelName}
                            onChange={(e) => setFilters({ ...filters, hotelName: e.target.value })}
                        />
                    </div>
                </div>

                {/* Facilities Filter */}
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Facilities</label>
                    <div className="flex flex-wrap gap-3">
                        {["ac", "wifi", "parking", "tv", "hotWater", "miniBar"].map((f) => (
                            <label key={f} className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.facilities.includes(f)}
                                    onChange={() => handleFacilityToggle(f)}
                                />
                                <span className="text-sm capitalize">{f === "hotWater" ? "Hot Water" : f === "miniBar" ? "Mini Bar" : f.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Searching..." : "Search Rooms"}
                </button>
            </div>

            {/* Results */}
            {searched && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {rooms.length} room{rooms.length !== 1 ? "s" : ""} found
                    </h2>
                    {rooms.length == 0 ? (
                        <p className="text-gray-500">No rooms available for the selected dates.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.map((room) => (
                                <div key={room.key} className="border rounded-lg shadow p-4">
                                    <h2 className="text-xl font-semibold">{room.hotelName}</h2>
                                    <p className="text-gray-600">Room {room.roomNumber} — {room.roomType}</p>
                                    <p className="text-gray-500 text-sm mt-1">{room.description}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {room.facilities?.ac && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">AC</span>}
                                        {room.facilities?.wifi && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">WiFi</span>}
                                        {room.facilities?.parking && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">Parking</span>}
                                        {room.facilities?.tv && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">TV</span>}
                                        {room.facilities?.hotWater && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Hot Water</span>}
                                        {room.facilities?.miniBar && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Mini Bar</span>}
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div>
                                            <p className="text-lg font-bold text-green-600">LKR {room.price}/night</p>
                                            <p className="text-sm text-gray-500">Max {room.capacity} guests</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/rooms/${room.key}/book`, {
                                                state: { checkIn: filters.checkIn, checkOut: filters.checkOut }
                                            })}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}