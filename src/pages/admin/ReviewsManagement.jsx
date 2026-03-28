import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTrash, FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/reviews/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Review approved');
      fetchReviews();
    } catch (error) {
      toast.error('Approval failed');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Deletion failed');
      console.error(error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'approved') return review.isApproved === true;
    if (filter === 'pending') return review.isApproved === false;
    return true;
  });

  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} size={16} />
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reviews Management</h1>
        <p className="text-gray-600">Manage and moderate customer reviews</p>
      </div>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          All Reviews ({reviews.length})
        </button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Pending ({reviews.filter(r => !r.isApproved).length})
        </button>
        <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Approved ({reviews.filter(r => r.isApproved).length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading reviews...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#2E2F8F] to-[#1E1F6B] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReviews.map(review => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover" src={review.profilePicture} alt={review.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{review.name}</div>
                        <div className="text-sm text-gray-500">{review.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{review.comment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{review.section || 'All'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(review.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!review.isApproved && (
                        <button onClick={() => handleApprove(review._id)} className="text-green-600 hover:text-green-900 bg-green-100 p-2 rounded-lg" title="Approve">
                          <FaCheck size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(review._id)} className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-lg" title="Delete">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReviews.length === 0 && <div className="text-center py-8 text-gray-500">No reviews found</div>}
        </div>
      )}

      {/* Pagination */}
      {filteredReviews.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredReviews.length)} of {filteredReviews.length} results
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50">Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i+1)} className={`px-3 py-1 border rounded-lg ${currentPage === i+1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}>{i+1}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsManagement;