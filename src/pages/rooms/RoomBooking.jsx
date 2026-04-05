import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getRoomByKey, bookRoom, createBooking } from "../../utils/api";

export default function RoomBooking() {
    const { key } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        checkInDate: location.state?.checkIn || "",
        checkOutDate: location.state?.checkOut || "",
        numberOfGuests: 1,
        paymentMethod: "bank_deposit"
    });

    useEffect(() => {
        getRoomByKey(key).then((res) => {
            setRoom(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [key]);

    // Calculate nights and total
    const nights = form.checkInDate && form.checkOutDate
        ? Math.ceil((new Date(form.checkOutDate) - new Date(form.checkInDate)) / (1000 * 60 * 60 * 24))
        : 0;
    const totalAmount = room ? nights * room.price : 0;

    function handleSubmit() {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        if (!form.checkInDate || !form.checkOutDate) {
            setError("Please select check-in and check-out dates");
            return;
        }
        if (nights <= 0) {
            setError("Check-out must be after check-in");
            return;
        }
        if (form.numberOfGuests > room.capacity) {
            setError(`Max ${room.capacity} guests allowed`);
            return;
        }

        setError("");
        setSubmitting(true);

        // Step 1: Book the room (locks dates as pending)
        bookRoom(key, {
            checkInDate: form.checkInDate,
            checkOutDate: form.checkOutDate,
            numberOfGuests: form.numberOfGuests
        }).then((roomRes) => {
            const bookingDetails = roomRes.data.bookingDetails;

            // Step 2: Create booking record
            return createBooking({
                bookingType: "room",
                itemId: room._id,
                itemDetails: {
                    name: `${room.hotelName} - Room ${room.roomNumber}`,
                    type: room.roomType,
                    price: room.price
                },
                startDate: form.checkInDate,
                endDate: form.checkOutDate,
                quantity: nights,
                totalAmount: totalAmount,
                paymentMethod: form.paymentMethod,
                customerDetails: bookingDetails.customerDetails
            });

        }).then((bookingRes) => {
            setSubmitting(false);
            // Go to payment page with booking info
            navigate("/payment", {
                state: {
                    booking: bookingRes.data.booking,
                    roomKey: key,
                    totalAmount,
                    paymentMethod: form.paymentMethod
                }
            });
        }).catch((err) => {
            setError(err.response?.data?.message || "Booking failed. Please try again.");
            setSubmitting(false);
        });
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!room) return <div className="text-center mt-10 text-red-500">Room not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">← Back</button>
            <h1 className="text-3xl font-bold mb-6">Book Room</h1>

            {/* Room Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold">{room.hotelName}</h2>
                <p className="text-gray-600">Room {room.roomNumber} — {room.roomType}</p>
                <p className="text-green-600 font-bold mt-1">LKR {room.price}/night</p>
                <p className="text-sm text-gray-500">Max capacity: {room.capacity} guests</p>
            </div>

            {/* Booking Form */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Check-In Date</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={form.checkInDate}
                            onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Check-Out Date</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={form.checkOutDate}
                            onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
                            min={form.checkInDate || new Date().toISOString().split("T")[0]}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Number of Guests</label>
                    <input
                        type="number"
                        min="1"
                        max={room.capacity}
                        className="w-full border rounded px-3 py-2"
                        value={form.numberOfGuests}
                        onChange={(e) => setForm({ ...form, numberOfGuests: parseInt(e.target.value) })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={form.paymentMethod}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    >
                        <option value="bank_deposit">Bank Deposit (Slip Upload)</option>
                        <option value="online">Online Payment</option>
                    </select>
                </div>

                {/* Cost Summary */}
                {nights > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Booking Summary</h3>
                        <div className="flex justify-between text-sm">
                            <span>LKR {room.price} × {nights} night{nights > 1 ? "s" : ""}</span>
                            <span>LKR {totalAmount}</span>
                        </div>
                        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                            <span>Total Amount</span>
                            <span className="text-green-600">LKR {totalAmount}</span>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "Processing..." : "Confirm Booking & Proceed to Payment"}
                </button>
            </div>
        </div>
    );
}