import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiSearch, FiX, FiPlus } from "react-icons/fi";
import { GiJeep } from "react-icons/gi";
import imageUpload from "../../utils/imageUpload";

const VEHICLE_TYPES = ["Mahindra Jeep", "Toyota Hilux","Nissan Patrol", "Land Rover Defender", ];
const STATUS_OPTIONS = ["Available", "On Trip", "Maintenance"];
const BLOCKED_KEYS = ["-", "+", "e", "E"];

function blockNegativeKeys(e) {
  if (BLOCKED_KEYS.includes(e.key)) e.preventDefault();
}

const emptyForm = {
  name: "",
  type: "Mahindra Jeep",
  registrationNumber: "",
  capacity: 8,
  pricePerDay: "",
  description: "",
  driverName: "",
  driverPhone: "",
  availability: true,
  status: "Available",
  images: "",
  features: {
    ac: false,
    openRoof: false,
    fourWheelDrive: false,
    wifi: false,
    firstAidKit: true,
    coolerBox: false,
  },
};

function validate(form) {
  if (!form.name.trim()) return "Vehicle name is required.";
  if (form.name.trim().length < 3) return "Vehicle name must be at least 3 characters.";

  if (!form.registrationNumber.trim()) return "Registration number is required.";
  if (!/^[A-Z]{2,3}-\d{4}$/i.test(form.registrationNumber.trim()))
    return "Registration number must be in the format ABC-1234.";

  const price = Number(form.pricePerDay);
  if (form.pricePerDay === "" || isNaN(price)) return "Price per day is required.";
  if (price <= 0) return "Price per day must be greater than zero.";
  if (price > 1000000) return "Price per day seems too high. Please double-check.";

  const cap = Number(form.capacity);
  if (!cap || cap < 1) return "Capacity must be at least 1.";
  if (cap > 8) return "Capacity cannot exceed 8 passengers.";

  if (form.driverName.trim() && form.driverName.trim().length < 3)
    return "Driver name must be at least 3 characters.";

  if (form.driverPhone.trim()) {
    if (!/^0\d{9}$/.test(form.driverPhone.trim()))
      return "Driver phone must start with 0 and be exactly 10 digits.";
  }

  return null;
}

function validateField(name, value) {
  switch (name) {
    case "name":
      if (!value.trim()) return "Vehicle name is required.";
      if (value.trim().length < 3) return "Must be at least 3 characters.";
      return "";
    case "registrationNumber":
      if (!value.trim()) return "Registration number is required.";
      if (!/^[A-Z]{2,3}-\d{4}$/i.test(value.trim())) return "Format must be ABC-1234.";
      return "";
    case "pricePerDay": {
      const p = Number(value);
      if (value === "" || isNaN(p)) return "Price per day is required.";
      if (p <= 0) return "Must be greater than zero.";
      if (p > 1000000) return "Seems too high. Please double-check.";
      return "";
    }
    case "capacity": {
      const c = Number(value);
      if (!c || c < 1) return "Must be at least 1.";
      if (c > 8) return "Cannot exceed 8 passengers.";
      return "";
    }
    case "driverName":
      if (value.trim() && value.trim().length < 3) return "Must be at least 3 characters.";
      return "";
    case "driverPhone":
      if (value.trim() && !/^0\d{9}$/.test(value.trim()))
        return "Must start with 0 and be exactly 10 digits.";
      return "";
    default:
      return "";
  }
}

const emptyErrors = {
  name: "", registrationNumber: "", pricePerDay: "",
  capacity: "", driverName: "", driverPhone: "",
};

function FormField({ label, note, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {note && <span className="text-gray-400 font-normal text-xs">({note})</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FeatureCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-indigo-600 rounded"
      />
      {label}
    </label>
  );
}

const STATUS_COLORS = {
  Available: "bg-green-100 text-green-700",
  "On Trip": "bg-yellow-100 text-yellow-700",
  Maintenance: "bg-red-100 text-red-700",
};

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/package-vehicles`;

export default function AdminPackageVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, vehicleId: null, name: "" });
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState(emptyErrors);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load package vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let f = vehicles;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      f = f.filter(
        (v) =>
          v.name.toLowerCase().includes(s) ||
          v.vehicleId?.toLowerCase().includes(s) ||
          v.registrationNumber?.toLowerCase().includes(s)
      );
    }
    if (typeFilter !== "All") f = f.filter((v) => v.type === typeFilter);
    if (statusFilter !== "All") f = f.filter((v) => v.status === statusFilter);
    setFiltered(f);
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter, vehicles]);

  const openAdd = () => {
    setEditingVehicle(null);
    setForm(emptyForm);
    setImageFile(null);
    setFieldErrors(emptyErrors);
    setShowModal(true);
  };

  const openEdit = (v) => {
    setEditingVehicle(v);
    setForm({
      name: v.name,
      type: v.type,
      registrationNumber: v.registrationNumber,
      capacity: 8,
      pricePerDay: v.pricePerDay,
      description: v.description || "",
      driverName: v.driverName || "",
      driverPhone: v.driverPhone || "",
      availability: v.availability ?? true,
      status: v.status || "Available",
      images: (v.images || []).join("\n"),
      features: {
        ac: v.features?.ac ?? false,
        openRoof: v.features?.openRoof ?? false,
        fourWheelDrive: v.features?.fourWheelDrive ?? false,
        wifi: v.features?.wifi ?? false,
        firstAidKit: v.features?.firstAidKit ?? true,
        coolerBox: v.features?.coolerBox ?? false,
      },
    });
    setImageFile(null);
    setFieldErrors(emptyErrors);
    setShowModal(true);
  };

  const setFeature = (key) =>
    setForm((f) => ({ ...f, features: { ...f.features, [key]: !f.features[key] } }));

  const touchField = (name, value) => {
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate(form);
    if (error) { toast.error(error); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      let imageUrls = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
      if (imageFile) {
        setUploading(true);
        try {
          const uploaded = await imageUpload(imageFile);
          imageUrls = [uploaded, ...imageUrls];
        } catch {
          toast.error("Image upload failed");
          return;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        name: form.name.trim(),
        type: form.type,
        registrationNumber: form.registrationNumber.trim(),
        capacity: Number(form.capacity),
        pricePerDay: Number(form.pricePerDay),
        description: form.description.trim(),
        driverName: form.driverName.trim(),
        driverPhone: form.driverPhone.trim(),
        availability: form.availability,
        status: form.status,
        features: form.features,
        ...(imageUrls.length > 0 && { images: imageUrls }),
      };

      if (editingVehicle) {
        await axios.put(
          `${API_BASE}/${editingVehicle.vehicleId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Package vehicle updated successfully");
      } else {
        await axios.post(API_BASE, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Package vehicle added successfully");
      }

      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const { vehicleId } = deleteModal;
    if (!vehicleId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((v) => v.vehicleId !== vehicleId));
      setDeleteModal({ isOpen: false, vehicleId: null, name: "" });
      toast.success("Package vehicle deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete package vehicle");
    }
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <GiJeep className="text-[#2F2D8F]" style={{ fontSize: 28 }} />
          <h1 className="text-3xl font-bold text-gray-800">Package Vehicles</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
          style={{ background: "linear-gradient(90deg, #FF9A3C 0%, #FF6B00 100%)" }}
        >
          <FiPlus size={18} />
          Add Vehicle
        </button>
      </div>

      {/* ── Summary badges ──────────────────────────────────── */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {[
          { label: "Total", value: vehicles.length, color: "text-[#2F2D8F]" },
          { label: "Available", value: vehicles.filter((v) => v.status === "Available").length, color: "text-green-600" },
          { label: "On Trip", value: vehicles.filter((v) => v.status === "On Trip").length, color: "text-yellow-500" },
          { label: "Maintenance", value: vehicles.filter((v) => v.status === "Maintenance").length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow px-6 py-3 flex flex-col items-center min-w-[90px]">
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-gray-500 mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID or registration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Types</option>
          {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-44 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Empty state ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <GiJeep className="mx-auto text-gray-300 mb-4" style={{ fontSize: 64 }} />
          <p className="text-gray-500 text-lg">No package vehicles found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {/* ── Table ───────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 900 }}>
                <thead
                  className="text-white"
                  style={{ background: "linear-gradient(90deg, #2F2D8F 0%, #1E2269 100%)" }}
                >
                  <tr>
                    {["Image", "Vehicle ID", "Name", "Type", "Reg. No.", "Capacity", "Price/Day", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-4 text-xs font-semibold uppercase tracking-wider ${h === "Actions" ? "text-center" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginated.map((v) => (
                    <tr key={v.vehicleId} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <img
                          src={v.images?.[0] || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                          alt={v.name}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm font-mono whitespace-nowrap">{v.vehicleId}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800 max-w-[160px]">
                        <div className="line-clamp-2">{v.name}</div>
                        {v.driverName && (
                          <div className="text-xs text-gray-400 font-normal mt-0.5">Driver: {v.driverName}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                          {v.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono whitespace-nowrap">{v.registrationNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{v.capacity} pax</td>
                      <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        Rs {v.pricePerDay?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_COLORS[v.status] || "bg-gray-100 text-gray-600"}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openEdit(v)}
                            className="text-blue-600 hover:text-blue-800 transition p-1"
                            title="Edit"
                          >
                            <FiEdit size={17} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, vehicleId: v.vehicleId, name: v.name })}
                            className="text-red-600 hover:text-red-800 transition p-1"
                            title="Delete"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Pagination ──────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white rounded-lg" style={{ background: "#2F2D8F" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div
              className="sticky top-0 z-10 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center"
              style={{ background: "linear-gradient(90deg, #2F2D8F 0%, #1E2269 100%)" }}
            >
              <h2 className="text-xl font-bold">
                {editingVehicle ? "Edit Package Vehicle" : "Add New Package Vehicle"}
              </h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-75 transition p-1">
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Vehicle ID (edit only, read-only) */}
              {editingVehicle && (
                <FormField label="Vehicle ID" note="auto-generated, cannot change">
                  <input
                    type="text"
                    value={editingVehicle.vehicleId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 font-mono cursor-not-allowed"
                  />
                </FormField>
              )}

              {/* Row 1: Name + Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Vehicle Name *" error={fieldErrors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); touchField("name", e.target.value); }}
                    onBlur={(e) => touchField("name", e.target.value)}
                    required
                    placeholder="e.g. Safari King"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
                  />
                </FormField>
                <FormField label="Vehicle Type *">
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
              </div>

              {/* Row 2: Reg No + Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Registration Number *" error={fieldErrors.registrationNumber}>
                  <input
                    type="text"
                    value={form.registrationNumber}
                    onChange={(e) => { setForm((f) => ({ ...f, registrationNumber: e.target.value })); touchField("registrationNumber", e.target.value); }}
                    onBlur={(e) => touchField("registrationNumber", e.target.value)}
                    required
                    placeholder="e.g. CAB-1234"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${fieldErrors.registrationNumber ? "border-red-400" : "border-gray-300"}`}
                  />
                </FormField>
                <FormField label="Capacity (passengers) *" note="max 8" error={fieldErrors.capacity}>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    step="1"
                    value={form.capacity}
                    onKeyDown={blockNegativeKeys}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (Number(val) >= 1 && Number(val) <= 8)) {
                        setForm((f) => ({ ...f, capacity: val }));
                        touchField("capacity", val);
                      }
                    }}
                    onBlur={(e) => touchField("capacity", e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${fieldErrors.capacity ? "border-red-400" : "border-gray-300"}`}
                  />
                </FormField>
              </div>

              {/* Row 3: Price + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Price Per Day (LKR) *" error={fieldErrors.pricePerDay}>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.pricePerDay}
                    onKeyDown={blockNegativeKeys}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || Number(val) >= 0) {
                        setForm((f) => ({ ...f, pricePerDay: val }));
                        touchField("pricePerDay", val);
                      }
                    }}
                    onBlur={(e) => touchField("pricePerDay", e.target.value)}
                    required
                    placeholder="e.g. 8500"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${fieldErrors.pricePerDay ? "border-red-400" : "border-gray-300"}`}
                  />
                </FormField>
                <FormField label="Status *">
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>

              {/* Row 4: Driver Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Driver Name" error={fieldErrors.driverName}>
                  <input
                    type="text"
                    value={form.driverName}
                    onChange={(e) => { setForm((f) => ({ ...f, driverName: e.target.value })); touchField("driverName", e.target.value); }}
                    onBlur={(e) => touchField("driverName", e.target.value)}
                    placeholder="e.g. Kamal Perera"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${fieldErrors.driverName ? "border-red-400" : "border-gray-300"}`}
                  />
                </FormField>
                <FormField label="Driver Phone" error={fieldErrors.driverPhone}>
                  <input
                    type="tel"
                    value={form.driverPhone}
                    onChange={(e) => { setForm((f) => ({ ...f, driverPhone: e.target.value })); touchField("driverPhone", e.target.value); }}
                    onBlur={(e) => touchField("driverPhone", e.target.value)}
                    placeholder="e.g. 0771234567"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${fieldErrors.driverPhone ? "border-red-400" : "border-gray-300"}`}
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Briefly describe this vehicle..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </FormField>

              {/* Features */}
              <FormField label="Features">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <FeatureCheckbox label="Air Conditioning" checked={form.features.ac} onChange={() => setFeature("ac")} />
                  <FeatureCheckbox label="Open Roof" checked={form.features.openRoof} onChange={() => setFeature("openRoof")} />
                  <FeatureCheckbox label="4-Wheel Drive" checked={form.features.fourWheelDrive} onChange={() => setFeature("fourWheelDrive")} />
                  <FeatureCheckbox label="Wi-Fi" checked={form.features.wifi} onChange={() => setFeature("wifi")} />
                  <FeatureCheckbox label="First Aid Kit" checked={form.features.firstAidKit} onChange={() => setFeature("firstAidKit")} />
                  <FeatureCheckbox label="Cooler Box" checked={form.features.coolerBox} onChange={() => setFeature("coolerBox")} />
                </div>
              </FormField>

              {/* Image */}
              <FormField label="Vehicle Image">
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="text-xs text-gray-400">Or paste image URL(s) below — one per line:</p>
                  <textarea
                    value={form.images}
                    onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                    rows={2}
                    placeholder="https://example.com/vehicle.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none text-sm font-mono"
                  />
                  {form.images.trim() && !imageFile && (
                    <img
                      src={form.images.split("\n")[0].trim()}
                      alt="preview"
                      className="h-24 w-auto rounded-lg border border-gray-200 object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>
              </FormField>

              {/* Availability toggle */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setForm((f) => ({ ...f, availability: !f.availability }))}
                  className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${form.availability ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.availability ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">Available for booking</span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-60 flex items-center gap-2"
                  style={{ background: "linear-gradient(90deg, #FF9A3C 0%, #FF6B00 100%)" }}
                >
                  {(submitting || uploading) && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ══════════════════════════════════════════════════════ */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Package Vehicle</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">{deleteModal.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, vehicleId: null, name: "" })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
