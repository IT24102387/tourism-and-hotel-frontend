import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Get token from localStorage
function getToken() {
    return localStorage.getItem("token");
}

// Auth header
function authHeader() {
    return { Authorization: `Bearer ${getToken()}` };
}

/* ========== ROOM APIs ========== */

export function getAllRooms() {
    return axios.get(`${BASE_URL}/rooms`);
}

export function getRoomByKey(key) {
    return axios.get(`${BASE_URL}/rooms/${key}`);
}

export function searchRooms(checkIn, checkOut, filters = {}) {
    const params = { checkIn, checkOut, ...filters };
    return axios.get(`${BASE_URL}/rooms/search`, { params });
}

export function getRoomsByHotel(hotelName) {
    return axios.get(`${BASE_URL}/rooms/hotel/${hotelName}`);
}

export function bookRoom(key, bookingData) {
    return axios.post(`${BASE_URL}/rooms/${key}/book`, bookingData, {
        headers: authHeader()
    });
}

export function addRoom(roomData) {
    return axios.post(`${BASE_URL}/rooms`, roomData, {
        headers: authHeader()
    });
}

export function updateRoom(key, roomData) {
    return axios.put(`${BASE_URL}/rooms/${key}`, roomData, {
        headers: authHeader()
    });
}

export function updateRoomAvailability(key, data) {
    return axios.patch(`${BASE_URL}/rooms/${key}/availability`, data, {
        headers: authHeader()
    });
}

export function deleteRoom(key) {
    return axios.delete(`${BASE_URL}/rooms/${key}`, {
        headers: authHeader()
    });
}

export function confirmRoomBooking(data) {
    return axios.post(`${BASE_URL}/rooms/confirm-booking`, data, {
        headers: authHeader()
    });
}

export function cancelRoomBooking(data) {
    return axios.post(`${BASE_URL}/rooms/cancel-booking`, data, {
        headers: authHeader()
    });
}

/* ========== BOOKING APIs ========== */

export function createBooking(bookingData) {
    return axios.post(`${BASE_URL}/bookings`, bookingData, {
        headers: authHeader()
    });
}

export function getMyBookings() {
    return axios.get(`${BASE_URL}/bookings/user/my-bookings`, {
        headers: authHeader()
    });
}

export function cancelBooking(bookingId) {
    return axios.put(`${BASE_URL}/bookings/${bookingId}/cancel`, {}, {
        headers: authHeader()
    });
}

export function getAllBookings() {
    return axios.get(`${BASE_URL}/bookings/admin/all-bookings`, {
        headers: authHeader()
    });
}

export function verifyPayment(bookingId) {
    return axios.put(`${BASE_URL}/bookings/admin/${bookingId}/verify`, {}, {
        headers: authHeader()
    });
}

export function updatePayment(data) {
    return axios.put(`${BASE_URL}/bookings/payment/update`, data, {
        headers: authHeader()
    });
}