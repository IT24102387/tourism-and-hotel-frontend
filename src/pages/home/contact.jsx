import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <div className="w-full min-h-screen" style={{ fontFamily: "'Nunito', sans-serif", background: "#FAFAF8" }}>

      {/* ── Google Fonts ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@400;700&display=swap');

        .input-field {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #E7DDD0;
          background: #FAFAF8;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          color: #292524;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field::placeholder { color: #A8A29E; }
        .input-field:focus {
          border-color: #D97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.12);
          background: #fff;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 16px;
          background: #fff;
          border: 1.5px solid #F3EDE0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .contact-info-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(217,119,6,0.10);
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #FBBF24, #F59E0B);
          color: #1C1917;
          font-size: 15px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(251,191,36,0.35);
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(251,191,36,0.45);
        }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(28,25,23,0.25);
          border-top-color: #1C1917;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease-out forwards; }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════
          HERO BANNER
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full flex flex-col justify-center items-center text-center text-white overflow-hidden"
        style={{ height: 420, backgroundImage: "url('result_0.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Dark + warm gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(28,20,10,0.80) 0%, rgba(92,40,10,0.55) 60%, rgba(28,20,10,0.70) 100%)" }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(251,191,36,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 px-6 fade-up">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "#FBBF24" }} />
            <span className="text-xs font-bold tracking-[0.35em] uppercase" style={{ color: "#FCD34D" }}>
              Yala &amp; Kataragama Travel Hub
            </span>
            <div className="h-px w-12" style={{ background: "#FBBF24" }} />
          </div>

          <h1
            className="font-black mb-4 leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              letterSpacing: "-1px",
            }}
          >
            Contact Us
          </h1>

          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.82)" }}>
            Have a question or ready to plan your trip? We're here to help you
            every step of the way.
          </p>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 48 }}>
          <svg viewBox="0 0 1200 48" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M0,48 L0,24 Q300,0 600,24 Q900,48 1200,24 L1200,48 Z" fill="#FAFAF8" />
          </svg>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">

        {/* ── Section heading ──────────────────────────────────────── */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "#D97706" }}>
            We'd love to hear from you
          </p>
          <h2
            className="font-bold mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              color: "#1C1917",
              letterSpacing: "-0.5px",
            }}
          >
            Get in Touch
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            Whether you're booking a safari, asking about equipment, or planning your itinerary —
            our team is ready.
          </p>
          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #D97706)" }} />
            <div className="w-2 h-2 rotate-45" style={{ background: "#D97706" }} />
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #D97706)" }} />
          </div>
        </div>

        {/* ── Two-column grid ──────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* ── LEFT — Contact info + map ───────────────────────── */}
          <div className="space-y-5">

            {/* Info cards */}
            {[
              {
                icon: FaPhoneAlt,
                color: "#16A34A",
                bg: "#F0FDF4",
                label: "Phone",
                value: "+94 77 964 3177",
                sub: "Mon – Sat, 8 AM to 6 PM",
              },
              {
                icon: FaWhatsapp,
                color: "#16A34A",
                bg: "#F0FDF4",
                label: "WhatsApp",
                value: "+94 77 964 3177",
                sub: "Quick replies within the hour",
              },
              {
                icon: FaEnvelope,
                color: "#D97706",
                bg: "#FEF3C7",
                label: "Email",
                value: "contact@yalakataragama.lk",
                sub: "We reply within 24 hours",
              },
              {
                icon: FaMapMarkerAlt,
                color: "#DC2626",
                bg: "#FEF2F2",
                label: "Location",
                value: "Yala & Kataragama, Sri Lanka",
                sub: "Near Yala National Park entrance",
              },
              {
                icon: FaClock,
                color: "#7C3AED",
                bg: "#F5F3FF",
                label: "Opening Hours",
                value: "Daily 7:00 AM – 8:00 PM",
                sub: "Safari departures at 5:30 AM & 3:00 PM",
              },
            ].map((item, i) => (
              <div key={i} className="contact-info-item">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: item.bg }}
                >
                  <item.icon style={{ color: item.color, fontSize: 18 }} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wide uppercase mb-0.5" style={{ color: "#A8A29E" }}>
                    {item.label}
                  </p>
                  <p className="font-bold text-sm" style={{ color: "#1C1917" }}>{item.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#78716C" }}>{item.sub}</p>
                </div>
              </div>
            ))}

            {/* Google Map */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{ height: 240, border: "1.5px solid #F3EDE0", boxShadow: "0 4px 20px rgba(217,119,6,0.08)" }}
            >
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4572.203136118376!2d80.6166358927918!3d5.9649557093461025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwNTcnNTIuMyJOIDgwwrAzNycxMS4wIkU!5e1!3m2!1sen!2slk!4v1769154774538!5m2!1sen!2slk"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ── RIGHT — Contact form ─────────────────────────────── */}
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: "#fff",
              border: "1.5px solid #F3EDE0",
              boxShadow: "0 8px 40px rgba(217,119,6,0.08)",
            }}
          >
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center text-center py-12 fade-up">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "#FEF3C7" }}
                >
                  <FaCheckCircle style={{ color: "#D97706", fontSize: 36 }} />
                </div>
                <h3
                  className="font-bold text-2xl mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#1C1917" }}
                >
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-8 text-sm font-bold flex items-center gap-2 transition hover:gap-3"
                  style={{ color: "#D97706", background: "none", border: "none", cursor: "pointer" }}
                >
                  Send another message <FaArrowRight style={{ fontSize: 11 }} />
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <div className="mb-7">
                  <h3
                    className="font-bold text-xl mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#1C1917" }}
                  >
                    Send Us a Message
                  </h3>
                  <p className="text-sm" style={{ color: "#78716C" }}>
                    Fill in the details below and we'll be in touch shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: "#78716C" }}>
                        Full Name <span style={{ color: "#D97706" }}>*</span>
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="John Silva"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: "#78716C" }}>
                        Email Address <span style={{ color: "#D97706" }}>*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "#78716C" }}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                      style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A8A29E'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", backgroundSize: 20, paddingRight: 40 }}
                    >
                      <option value="">Select a topic…</option>
                      <option value="room">Room Booking</option>
                      <option value="safari">Safari & Tours</option>
                      <option value="equipment">Equipment Rental</option>
                      <option value="vehicle">Vehicle Hire</option>
                      <option value="food">Restaurant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "#78716C" }}>
                      Message <span style={{ color: "#D97706" }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your plans, dates, group size, or any questions…"
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field"
                      style={{ resize: "vertical", minHeight: 130 }}
                    />
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? (
                      <><div className="spinner" /> Sending…</>
                    ) : (
                      <>Send Message <FaArrowRight style={{ fontSize: 12 }} /></>
                    )}
                  </button>

                  <p className="text-center text-xs" style={{ color: "#A8A29E" }}>
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer className="py-10 px-6 text-center" style={{ background: "#1C1917" }}>
        <p style={{ color: "#78716C", fontSize: 13 }}>
          © 2026 Yala &amp; Kataragama Travel Hub. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-3">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm transition hover:text-amber-400"
              style={{ color: "#78716C", textDecoration: "none" }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}