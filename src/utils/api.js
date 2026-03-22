import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function getProducts() {
  return axios.get(`${BASE_URL}/api/products`);
}

export function getPackages() {
  return axios.get(`${BASE_URL}/api/packages`);
}

export function getPackageById(packageId) {
  return axios.get(`${BASE_URL}/api/packages/${packageId}`);
}

export function getVehicles() {
  return axios.get(`${BASE_URL}/api/vehicles`);
}

export function getAddons() {
  return axios.get(`${BASE_URL}/api/addons`);
}

export function createCustomBooking(payload) {
  const token = localStorage.getItem("token");
  return axios.post(`${BASE_URL}/api/custom-bookings`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
