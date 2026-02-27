import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaCartShopping } from "react-icons/fa6";

const services = [
  {
    to: "/services/resort-rooms",
    label: "Resort Room Manage",
    desc: "Luxury rooms & suites",
  },
  {
    to: "/services",
    label: "Adventure Gear Rental",
    desc: "Everything you need for camping and travel",
  },
  
  {
    to: "/services/restaurant",
    label: "Restaurant",
    desc: "Local & international cuisine",
  },
  {
    to: "/services/safari-vehicle",
    label: "Safari Vehicle Supply",
    desc: "4WD jeeps & guided tours",
  },
];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setServicesOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600&display=swap');

        .hdr { font-family: 'Outfit', sans-serif; }
        .hdr-logo-text { font-family: 'Cormorant Garamond', serif; }

        .hdr-nav-link {
          position: relative;
          font-weight: 500;
          font-size: 15px;
          color: #fff;
          text-decoration: none;
          padding: 6px 2px;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .hdr-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #d4a843;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .hdr-nav-link:hover { color: #d4a843; }
        .hdr-nav-link:hover::after { width: 100%; }

        .hdr-svc-btn {
          display: flex; align-items: center; gap: 5px;
          background: none; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-weight: 500; font-size: 15px;
          color: #fff; letter-spacing: 0.02em;
          padding: 6px 2px;
          position: relative;
          transition: color 0.2s;
        }
        .hdr-svc-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #d4a843;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .hdr-svc-btn:hover, .hdr-svc-btn.open { color: #d4a843; }
        .hdr-svc-btn:hover::after, .hdr-svc-btn.open::after { width: 100%; }

        .hdr-chevron {
          font-size: 10px;
          transition: transform 0.3s;
          display: inline-block;
        }
        .hdr-chevron.up { transform: rotate(180deg); }

        /* ── Clean Dropdown ── */
        .hdr-dropdown {
          position: absolute;
          top: calc(100% + 16px);
          left: 50%;
          transform: translateX(-50%) translateY(-6px);
          width: 240px;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .hdr-dropdown.open {
          opacity: 1;
          pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }

        /* Simple arrow pointer */
        .hdr-dropdown::before {
          content: '';
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 13px; height: 7px;
          background: #ffffff;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .hdr-dropdown-item {
          display: block;
          padding: 10px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .hdr-dropdown-item:hover {
          background: rgba(212,168,67,0.1);
        }
        .hdr-dropdown-item .item-label {
          font-weight: 600;
          font-size: 13.5px;
          color: #1a1a1a;
          line-height: 1.2;
        }
        .hdr-dropdown-item .item-desc {
          font-size: 11.5px;
          color: rgba(0,0,0,0.4);
          margin-top: 2px;
        }
        .hdr-dropdown-item:hover .item-label { color: #b8891e; }

        .hdr-divider {
          height: 1px;
          background: rgba(0,0,0,0.07);
          margin: 2px 8px;
        }

        .hdr-login-btn {
          padding: 8px 22px;
          border: 1.5px solid rgba(212,168,67,0.7);
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600; font-size: 14px;
          color: #d4a843;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.03em;
          display: inline-block;
        }
        .hdr-login-btn:hover {
          background: #d4a843;
          color: #0f130e;
          box-shadow: 0 4px 18px rgba(212,168,67,0.4);
        }

        .hdr-book-btn {
          padding: 8px 22px;
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600; font-size: 14px;
          color: #0f130e;
          background: #d4a843;
          border: none; cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(212,168,67,0.4);
          display: inline-block;
        }
        .hdr-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(212,168,67,0.55);
        }

        .hdr-mobile-link {
          display: block;
          padding: 13px 16px;
          border-radius: 10px;
          font-weight: 500; font-size: 16px;
          color: #f5f0e8;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: background 0.18s, color 0.18s;
        }
        .hdr-mobile-link:hover { background: rgba(212,168,67,0.1); color: #d4a843; }

        .hdr-mobile-svc-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px;
          background: none; border: none; border-bottom: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-weight: 500; font-size: 16px; color: #f5f0e8;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .hdr-mobile-svc-btn:hover { background: rgba(212,168,67,0.1); color: #d4a843; }

        .hdr-mobile-svc-item {
          display: block;
          padding: 10px 20px;
          text-decoration: none;
          color: rgba(245,240,232,0.75);
          font-size: 14px; font-weight: 500;
          border-radius: 8px;
          margin: 2px 6px;
          transition: background 0.15s, color 0.15s;
        }
        .hdr-mobile-svc-item:hover { background: rgba(212,168,67,0.1); color: #d4a843; }
        .hdr-mobile-svc-item .m-svc-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin-top: 1px;
        }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-animate-in { animation: fadeSlideDown 0.28s ease forwards; }
      `}</style>

      <header
        className="hdr w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(10,14,9,0.96)"
            : "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          boxShadow: scrolled ? "0 2px 30px rgba(0,0,0,0.45)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,168,67,0.12)" : "none",
        }}
      >
        {/* Gold accent line */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #6b4f0e, #d4a843, #f5c842, #d4a843, #6b4f0e)" }} />

        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between" style={{ height: "76px" }}>

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <div style={{
                width: "54px", height: "54px", borderRadius: "50%",
                border: "2.5px solid #d4a843",
                overflow: "hidden", flexShrink: 0,
                boxShadow: "0 0 0 4px rgba(212,168,67,0.15)",
              }}>
                <img src="/123.webp" alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="hidden md:block">
                <p className="hdr-logo-text" style={{ fontSize: "22px", color: "#f5f0e8", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
                  Wild<span style={{ color: "#d4a843" }}>Haven</span>
                </p>
                <p style={{ fontSize: "10px", color: "rgba(212,168,67,0.75)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "1px" }}>
                  Resort & Safari
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="hdr-nav-link">{l.label}</Link>
              ))}

              {/* Services dropdown */}
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  className={`hdr-svc-btn ${servicesOpen ? "open" : ""}`}
                  onClick={() => setServicesOpen((v) => !v)}
                >
                  Our Services
                  <span className={`hdr-chevron ${servicesOpen ? "up" : ""}`}>▾</span>
                </button>

                <div className={`hdr-dropdown ${servicesOpen ? "open" : ""}`} style={{ background: "#ffffff", color: "#1a1a1a" }}>
                  {services.map((s, i) => (
                    <div key={s.to}>
                      <Link
                        to={s.to}
                        className="hdr-dropdown-item"
                        onClick={() => setServicesOpen(false)}
                      >
                        <div className="item-label" style={{ color: "#1a1a1a", fontWeight: 600 }}>{s.label}</div>
                        <div className="item-desc" style={{ color: "#888888" }}>{s.desc}</div>
                      </Link>
                      {i < services.length - 1 && <div className="hdr-divider" />}
                    </div>
                  ))}
                </div>
              </div>
            </nav>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="hdr-login-btn absolute right-3">Login</Link>
              <Link to="/Roombooking" className="hdr-book-btn">Book Now</Link>
               <Link
                  to="/booking"
                  className="text-[25px] font-bold m-1">

                  <FaCartShopping/>  

                </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-lg"
              style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)" }}
              aria-label="Toggle menu"
            >
              <span style={{
                display: "block", width: "20px", height: "2px", background: "#d4a843", borderRadius: "2px",
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
              }} />
              <span style={{
                display: "block", width: "20px", height: "2px", background: "#d4a843", borderRadius: "2px",
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: "block", width: "20px", height: "2px", background: "#d4a843", borderRadius: "2px",
                transition: "transform 0.3s",
                transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
              }} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
          style={{ background: "rgba(8,12,7,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(212,168,67,0.12)" }}
        >
          {menuOpen && (
            <nav className="px-4 py-4 flex flex-col gap-1 hdr-animate-in">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="hdr-mobile-link" onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              ))}

              {/* Mobile Services accordion */}
              <div>
                <button className="hdr-mobile-svc-btn" onClick={() => setMobileServicesOpen((v) => !v)}>
                  <span>Our Services</span>
                  <span className={`hdr-chevron ${mobileServicesOpen ? "up" : ""}`} style={{ color: "#d4a843" }}>▾</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="py-2" style={{ background: "rgba(212,168,67,0.04)", borderRadius: "10px", margin: "4px 0" }}>
                    {services.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="hdr-mobile-svc-item"
                        onClick={() => { setMenuOpen(false); setMobileServicesOpen(false); }}
                      >
                        <div>{s.label}</div>
                        <div className="m-svc-desc">{s.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Login + Book */}
              <div className="flex gap-3 pt-3 pb-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="hdr-login-btn" style={{ flex: 1, textAlign: "center" }}>Login</Link>
                <Link to="/booking" onClick={() => setMenuOpen(false)} className="hdr-book-btn" style={{ flex: 1, textAlign: "center" }}>Book Now</Link>
                
               
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}