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
