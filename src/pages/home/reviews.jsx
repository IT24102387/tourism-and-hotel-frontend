import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [section, setSection] = useState('All');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const sectionOptions = [
    'Camping Equipment Rental Service',
    'Rooms',
    'Vehicle',
    'Foods',
    'Packages',
    'Google Maps',
    'All'
  ];

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setUser(null); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      console.error('Invalid token', error);
      setUser(null);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    if (!comment.trim()) { toast.error('Please enter your review'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/reviews',
        { rating, comment, section },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted! It will appear after admin approval.');
      setRating(0);
      setComment('');
      setSection('All');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAF7F2" }}>
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}>
            <FaStar className="text-white text-4xl" />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#292524" }}>Share Your Experience</h2>
          <p className="mb-8 text-lg" style={{ color: "#78716C" }}>Please log in to write a review.</p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-200 hover:scale-105 hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Main page ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>

      {/* ── Form Section ── */}
      <div className="max-w-3xl mx-auto px-4 py-14">

        {/* User greeting card */}
        <div className="flex items-center gap-5 p-6 rounded-2xl mb-8 border"
          style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 4px 24px rgba(217,119,6,0.10)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#FBBF24,#D97706)" }}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-0.5" style={{ color: "#D97706" }}>Reviewing as</p>
            <p className="text-2xl font-bold" style={{ color: "#292524" }}>{user.firstName} {user.lastName}</p>
          </div>
          {/* Amber accent line */}
          <div className="ml-auto hidden md:block h-12 w-1 rounded-full" style={{ background: "linear-gradient(to bottom,#FBBF24,#F59E0B)" }} />
        </div>

        {/* ── Main Form Card ── */}
        <div className="rounded-3xl overflow-hidden border"
          style={{ background: "#FFFBF5", borderColor: "#F5EACF", boxShadow: "0 8px 40px rgba(146,64,14,0.12)" }}>

          {/* Card top accent bar */}
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right,#FBBF24,#F59E0B,#D97706)" }} />

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit}>

              {/* ── Rating + Section row ── */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">

                {/* Rating */}
                <div className="flex-1">
                  <label className="block font-bold text-lg mb-4" style={{ color: "#292524" }}>
                    Your Rating <span style={{ color: "#F59E0B" }}>*</span>
                  </label>

                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="focus:outline-none transform hover:scale-125 transition-transform duration-200"
                      >
                        <FaStar
                          size={38}
                          style={{ color: star <= (hover || rating) ? "#FBBF24" : "#E7E5E4", filter: star <= (hover || rating) ? "drop-shadow(0 2px 4px rgba(251,191,36,0.5))" : "none" }}
                          className="transition-all duration-150"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Rating label pill */}
                  {(hover || rating) > 0 && (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold"
                      style={{ background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#92400E" }}>
                      {ratingLabels[hover || rating]} — {hover || rating}/5 stars
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px self-stretch" style={{ background: "#F5EACF" }} />

                {/* Section Dropdown */}
                <div className="flex-1">
                  <label htmlFor="section" className="block font-bold text-lg mb-4" style={{ color: "#292524" }}>
                    Review Section <span style={{ color: "#F59E0B" }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="section"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      required
                      className="w-full px-5 py-3.5 rounded-xl appearance-none font-medium text-base focus:outline-none transition duration-200"
                      style={{
                        background: "#FAF7F2",
                        border: "2px solid #F5EACF",
                        color: "#292524",
                        boxShadow: "0 2px 8px rgba(217,119,6,0.06)",
                      }}
                      onFocus={e => e.target.style.borderColor = "#FBBF24"}
                      onBlur={e => e.target.style.borderColor = "#F5EACF"}
                    >
                      {sectionOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {/* Custom chevron */}
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5" style={{ color: "#D97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px mb-8" style={{ background: "linear-gradient(to right,transparent,#F5EACF,transparent)" }} />

              {/* ── Comment ── */}
              <div className="mb-8">
                <label htmlFor="comment" className="block font-bold text-lg mb-4" style={{ color: "#292524" }}>
                  Your Review <span style={{ color: "#F59E0B" }}>*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="comment"
                    rows="5"
                    className="w-full px-5 py-4 rounded-xl text-base font-medium placeholder-stone-400 resize-none focus:outline-none transition duration-200"
                    style={{
                      background: "#FAF7F2",
                      border: "2px solid #F5EACF",
                      color: "#292524",
                      boxShadow: "0 2px 8px rgba(217,119,6,0.06)",
                    }}
                    placeholder="Tell us about your experience at Yala & Kataragama..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#FBBF24"}
                    onBlur={e => e.target.style.borderColor = "#F5EACF"}
                    required
                  />
                  {/* Character count */}
                  <span className="absolute bottom-3 right-4 text-xs" style={{ color: "#A8A29E" }}>
                    {comment.length} chars
                  </span>
                </div>
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917", boxShadow: "0 8px 24px rgba(251,191,36,0.35)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" style={{ color: "#1C1917" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting your review...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaStar />
                    Submit Review
                  </span>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-sm mt-6" style={{ color: "#A8A29E" }}>
          Reviews are approved by our team before going live. Thank you for your patience.
        </p>
      </div>

      {/* ── Footer strip ── */}
      <div className="py-8 text-center" style={{ background: "#1C1917" }}>
        <p style={{ color: "#78716C" }}>© 2026 Yala & Kataragama Travel Hub. All rights reserved.</p>
      </div>
    </div>
  );
}