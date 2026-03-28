import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: { venue: '', address: '', coordinates: { lat: '', lng: '' } },
    category: 'festival',
    image: '',
    organizer: '',
    contactInfo: { email: '', phone: '' },
    ticketPrice: 0,
    capacity: '',
    status: 'upcoming'
  });

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.events || response.data); // handle both {events: [...]} and direct array
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Open modal for adding
  const handleAddClick = () => {
    setEditMode(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: { venue: '', address: '', coordinates: { lat: '', lng: '' } },
      category: 'festival',
      image: '',
      organizer: '',
      contactInfo: { email: '', phone: '' },
      ticketPrice: 0,
      capacity: '',
      status: 'upcoming'
    });
    setModalOpen(true);
  };

  // Open modal for editing
  const handleEditClick = (event) => {
    setEditMode(true);
    setCurrentEvent(event);
    // Convert date to YYYY-MM-DD for input
    const eventDate = new Date(event.date).toISOString().split('T')[0];
    setFormData({
      ...event,
      date: eventDate,
      location: event.location || { venue: '', address: '', coordinates: { lat: '', lng: '' } },
      contactInfo: event.contactInfo || { email: '', phone: '' },
      ticketPrice: event.ticketPrice || 0,
      capacity: event.capacity || ''
    });
    setModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested fields (location.venue, location.address, contactInfo.email, etc.)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle nested coordinates
  const handleCoordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          [name]: value
        }
      }
    }));
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editMode
        ? `http://localhost:5000/api/events/${currentEvent._id}`
        : 'http://localhost:5000/api/events';
      const method = editMode ? 'put' : 'post';

      // Prepare data – convert empty strings to null if needed
      const payload = {
        ...formData,
        ticketPrice: Number(formData.ticketPrice) || 0,
        capacity: formData.capacity ? Number(formData.capacity) : undefined
      };

      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(editMode ? 'Event updated' : 'Event created');
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error(editMode ? 'Update failed' : 'Creation failed');
      console.error(error);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Delete failed');
      console.error(error);
    }
  };

  // Helper to format time range
  const formatTimeRange = (start, end) => {
    if (!start && !end) return '—';
    return `${start || '?'} - ${end || '?'}`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Calendar Management</h1>
          <p className="text-gray-600">Create, edit, and delete events</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-[#2E2F8F] to-[#1E1F6B] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <FaPlus /> Add Event
        </button>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#2E2F8F] to-[#1E1F6B] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{event.title}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{event.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeRange(event.startTime, event.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location?.venue || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                      event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded-lg"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-lg"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div className="text-center py-8 text-gray-500">No events found. Click "Add Event" to create one.</div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">{editMode ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Time range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Location (venue) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    name="location.venue"
                    value={formData.location.venue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="festival">Festival</option>
                    <option value="cultural">Cultural</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Organizer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Ticket Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Coordinates (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    name="lat"
                    value={formData.location.coordinates.lat}
                    onChange={handleCoordChange}
                    placeholder="e.g., 6.9271"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="lng"
                    value={formData.location.coordinates.lng}
                    onChange={handleCoordChange}
                    placeholder="e.g., 79.8612"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#2E2F8F] to-[#1E1F6B] text-white rounded-md hover:opacity-90"
                >
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventManagement;