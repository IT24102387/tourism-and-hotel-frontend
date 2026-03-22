import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiSearch, FiX, FiPlus } from "react-icons/fi";
import { LuPackageSearch } from "react-icons/lu";
import imageUpload from "../../utils/imageUpload";

const CATEGORIES = ["Safari", "Wildlife", "Pilgrimage", "Adventure", "Cultural", "Nature", "Combined"];

const emptyForm = {
  packageId: "",
  name: "",
  category: "Safari",
  description: "",
  highlights: "",
  duration: { days: 1, nights: 0 },
  price: "",
  maxGroupSize: 8,
  includes: "",
  excludes: "",
  meetingPoint: "Kataragama Town Center",
  availability: true,
  customizationEnabled: true,
  images: "",
};

const BLOCKED_KEYS = ["-", "+", "e", "E"];
function blockNegativeKeys(e) {
  if (BLOCKED_KEYS.includes(e.key)) e.preventDefault();
}

function validate(form) {
  if (!form.packageId.trim()) return "Package ID is required.";
  if (!form.name.trim()) return "Package name is required.";
  if (!form.description.trim()) return "Description is required.";
  const price = Number(form.price);
  if (form.price === "" || isNaN(price)) return "Price is required.";
  if (price < 0) return "Price cannot be negative.";
  if (price === 0) return "Price must be greater than zero.";
  const days = Number(form.duration.days);
  if (!days || days < 1) return "Duration must be at least 1 day.";
  const nights = Number(form.duration.nights);
  if (isNaN(nights) || nights < 0) return "Nights cannot be negative.";
  return null;
}

function FormField({ label, note, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {note && <span className="text-gray-400 font-normal">({note})</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange, color = "bg-green-500" }) {
  return (
    <div
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${value ? color : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          value ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </div>
  );
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, packageId: null });
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let f = packages;
    if (searchTerm) {
      f = f.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.packageId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "All") {
      f = f.filter((p) => p.category === categoryFilter);
    }
    setFiltered(f);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, packages]);

  const openAdd = () => {
    setEditingPackage(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (pkg) => {
    setEditingPackage(pkg);
    setForm({
      packageId: pkg.packageId,
      name: pkg.name,
      category: pkg.category,
      description: pkg.description,
      highlights: (pkg.highlights || []).join("\n"),
      duration: {
        days: pkg.duration?.days ?? 1,
        nights: pkg.duration?.nights ?? 0,
      },
      price: pkg.price,
      maxGroupSize: 8,
      includes: (pkg.includes || []).join("\n"),
      excludes: (pkg.excludes || []).join("\n"),
      meetingPoint: pkg.meetingPoint || "Kataragama Town Center",
      availability: pkg.availability ?? true,
      customizationEnabled: pkg.customizationEnabled ?? true,
      images: (pkg.images || []).join("\n"),
    });
    setImageFile(null);
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate(form);
    if (error) {
      toast.error(error);
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // Handle image upload if a file was selected
      let imageUrls = form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      if (imageFile) {
        setUploading(true);
        try {
          const uploaded = await imageUpload(imageFile);
          imageUrls = [uploaded, ...imageUrls];
        } catch {
          toast.error("Image upload failed");
          setSubmitting(false);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        packageId: form.packageId,
        name: form.name,
        category: form.category,
        description: form.description,
        highlights: form.highlights
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        duration: {
          days: Number(form.duration.days),
          nights: Number(form.duration.nights),
        },
        price: Number(form.price),
        maxGroupSize: Number(form.maxGroupSize),
        includes: form.includes
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        excludes: form.excludes
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        meetingPoint: form.meetingPoint,
        availability: form.availability,
        customizationEnabled: form.customizationEnabled,
        ...(imageUrls.length > 0 && { images: imageUrls }),
      };

      if (editingPackage) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/packages/${editingPackage.packageId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Package updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/packages`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Package added successfully");
      }

      setShowModal(false);
      fetchPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const { packageId } = deleteModal;
    if (!packageId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/packages/${packageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages((prev) => prev.filter((p) => p.packageId !== packageId));
      setDeleteModal({ isOpen: false, packageId: null });
      toast.success("Package deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete package");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <LuPackageSearch className="text-[#2F2D8F]" style={{ fontSize: 32 }} />
          <h1 className="text-3xl font-bold text-gray-800">Tour Packages</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
          style={{ background: "linear-gradient(90deg, #FF9A3C 0%, #FF6B00 100%)" }}
        >
          <FiPlus size={18} />
          Add Package
        </button>
      </div>

      {/* ── Summary badges ──────────────────────────────────── */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {[
          { label: "Total", value: packages.length, color: "text-[#2F2D8F]" },
          {
            label: "Available",
            value: packages.filter((p) => p.availability).length,
            color: "text-green-600",
          },
          {
            label: "Unavailable",
            value: packages.filter((p) => !p.availability).length,
            color: "text-red-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl shadow px-6 py-3 flex flex-col items-center min-w-[90px]"
          >
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
            placeholder="Search by name or package ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="w-full md:w-52">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <LuPackageSearch
            className="mx-auto text-gray-300 mb-4"
            style={{ fontSize: 64 }}
          />
          <p className="text-gray-500 text-lg">No packages found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {/* ── Table ───────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 860 }}>
                <thead
                  className="text-white"
                  style={{
                    background: "linear-gradient(90deg, #2F2D8F 0%, #1E2269 100%)",
                  }}
                >
                  <tr>
                    {[
                      "Image",
                      "Package ID",
                      "Name",
                      "Category",
                      "Price",
                      "Duration",
                      "Group",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-4 text-xs font-semibold uppercase tracking-wider ${
                          h === "Actions" ? "text-center" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginated.map((pkg) => (
                    <tr
                      key={pkg.packageId}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={
                            pkg.images?.[0] ||
                            "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
                          }
                          alt={pkg.name}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm font-mono">
                        {pkg.packageId}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 max-w-[180px]">
                        <span className="line-clamp-2">{pkg.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                          {pkg.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        Rs {pkg.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {pkg.duration?.days}D / {pkg.duration?.nights}N
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {pkg.maxGroupSize} pax
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            pkg.availability
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pkg.availability ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openEdit(pkg)}
                            className="text-blue-600 hover:text-blue-800 transition p-1"
                            title="Edit"
                          >
                            <FiEdit size={17} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                packageId: pkg.packageId,
                              })
                            }
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
              style={{
                background: "linear-gradient(90deg, #2F2D8F 0%, #1E2269 100%)",
              }}
            >
              <h2 className="text-xl font-bold">
                {editingPackage ? "Edit Package" : "Add New Package"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="hover:opacity-75 transition p-1"
              >
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Row 1: ID + Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Package ID *"
                  note={editingPackage ? "Cannot be changed" : ""}
                >
                  <input
                    type="text"
                    value={form.packageId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, packageId: e.target.value }))
                    }
                    disabled={!!editingPackage}
                    required
                    placeholder="e.g. PKG-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </FormField>
                <FormField label="Package Name *">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    placeholder="e.g. Yala Safari Adventure"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </FormField>
              </div>

              {/* Row 2: Category + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Category *">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Price (LKR) *">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.price}
                    onKeyDown={blockNegativeKeys}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || Number(val) >= 0)
                        setForm((f) => ({ ...f, price: val }));
                    }}
                    required
                    placeholder="e.g. 15000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </FormField>
              </div>

              {/* Row 3: Days + Nights + Group Size */}
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Days *">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.duration.days}
                    onKeyDown={blockNegativeKeys}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || Number(val) >= 1)
                        setForm((f) => ({
                          ...f,
                          duration: { ...f.duration, days: val },
                        }));
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </FormField>
                <FormField label="Nights *">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.duration.nights}
                    onKeyDown={blockNegativeKeys}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || Number(val) >= 0)
                        setForm((f) => ({
                          ...f,
                          duration: { ...f.duration, nights: val },
                        }));
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </FormField>
                <FormField label="Max Group Size" note="fixed at 8">
                  <input
                    type="number"
                    value={8}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField label="Description *">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  required
                  rows={3}
                  placeholder="Describe the tour package..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </FormField>

              {/* Meeting Point */}
              <FormField label="Meeting Point">
                <input
                  type="text"
                  value={form.meetingPoint}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, meetingPoint: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </FormField>

              {/* Highlights */}
              <FormField label="Highlights" note="one per line">
                <textarea
                  value={form.highlights}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, highlights: e.target.value }))
                  }
                  rows={3}
                  placeholder={"Visit Yala National Park\nSpot leopards\nSunset at the beach"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                />
              </FormField>

              {/* Includes / Excludes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Includes" note="one per line">
                  <textarea
                    value={form.includes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, includes: e.target.value }))
                    }
                    rows={4}
                    placeholder={"Meals\nTransport\nGuide"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                  />
                </FormField>
                <FormField label="Excludes" note="one per line">
                  <textarea
                    value={form.excludes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, excludes: e.target.value }))
                    }
                    rows={4}
                    placeholder={"Personal expenses\nAlcohol\nTips"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                  />
                </FormField>
              </div>

              {/* Image */}
              <FormField label="Package Image">
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="text-xs text-gray-400">
                    Or paste image URL(s) below — one per line:
                  </p>
                  <textarea
                    value={form.images}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, images: e.target.value }))
                    }
                    rows={2}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none text-sm font-mono"
                  />
                  {/* Preview first image */}
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

              {/* Toggles */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <Toggle
                    value={form.availability}
                    onChange={() =>
                      setForm((f) => ({ ...f, availability: !f.availability }))
                    }
                    color="bg-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Available for booking
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <Toggle
                    value={form.customizationEnabled}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        customizationEnabled: !f.customizationEnabled,
                      }))
                    }
                    color="bg-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Customization enabled
                  </span>
                </label>
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
                  style={{
                    background: "linear-gradient(90deg, #FF9A3C 0%, #FF6B00 100%)",
                  }}
                >
                  {(submitting || uploading) && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingPackage ? "Update Package" : "Add Package"}
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Delete Package
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">{deleteModal.packageId}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, packageId: null })
                }
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
