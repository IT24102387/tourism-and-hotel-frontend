import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/* ── Room Card — same style as ProductCard ──────────────────── */
function RoomCard({ room, checkIn, checkOut }) {
  const navigate = useNavigate();
  const isAvailable = room.availability && room.status !== "Maintenance";

  function handleBook(e) {
    e.stopPropagation();
    navigate(`/rooms/${room.key}`, {
      state: { checkIn, checkOut },
    });
  }

  return (
    <div
      className="group w-full max-w-sm rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer mx-3 my-2"
      style={{ background: "#FFFBF5", boxShadow: "0 4px 24px rgba(217,119,6,0.10)" }}
      onClick={handleBook}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        <img
          src={room.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"}
          alt={room.roomType}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Room type badge — top right */}
        <div className="absolute top-4 right-4">
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
            style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
          >
            {room.roomType}
          </span>
        </div>

        {/* Availability dot — top left */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-sm"
            style={{
              background: "rgba(255,251,245,0.92)",
              color: isAvailable ? "#D97706" : "#DC2626",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: isAvailable ? "#F59E0B" : "#EF4444" }}
            />
            {isAvailable ? "Available" : room.status === "Maintenance" ? "Maintenance" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 flex flex-col flex-grow" style={{ background: "#FFFBF5" }}>
        <h3 className="text-xl font-bold capitalize mb-1 line-clamp-1" style={{ color: "#292524" }}>
          {room.roomType} — Room {room.roomNumber}
        </h3>
        <p className="text-sm line-clamp-2 mb-4" style={{ color: "#A8A29E" }}>
          {room.description || `Capacity: ${room.capacity} guests · ${room.hotelName}`}
        </p>

        {/* Facilities pills */}
        {room.facilities && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.entries(room.facilities)
              .filter(([, v]) => v)
              .slice(0, 4)
              .map(([k]) => (
                <span
                  key={k}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                  style={{ background: "#F5EDD8", color: "#D97706" }}
                >
                  {k === "ac" ? "AC" : k === "wifi" ? "WiFi" : k === "tv" ? "TV" : k === "hotWater" ? "Hot Water" : k === "miniBar" ? "Mini Bar" : k === "parking" ? "Parking" : k}
                </span>
              ))}
          </div>
        )}

        {/* Price + Book */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-black" style={{ color: "#D97706" }}>
              {(room.price || 0).toLocaleString()}
            </span>
            <span className="text-sm font-semibold ml-1" style={{ color: "#A8A29E" }}>LKR / night</span>
          </div>

          {isAvailable ? (
            <button
              onClick={handleBook}
              className="px-5 py-2.5 text-sm font-bold rounded-full shadow transition-all duration-200 transform hover:scale-105 hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
            >
              Book Now
            </button>
          ) : (
            <span
              className="px-5 py-2.5 text-sm font-bold rounded-full"
              style={{ background: "#F5EDD8", color: "#A8A29E" }}
            >
              Unavailable
            </span>
          )}
        </div>

        {/* Hotel name footer */}
        <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: "1px solid #F5EACF" }}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F59E0B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-xs font-medium truncate" style={{ color: "#A8A29E" }}>
            {room.hotelName}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function ResortRooms() {
  const [state, setState]   = useState("loading");
  const [hotels, setHotels] = useState([]);
  const [rooms,  setRooms]  = useState([]);
  const [activeHotel, setActiveHotel] = useState("all");
  const [activeType,  setActiveType]  = useState("all");

  // date state for passing to booking
  const today    = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [checkIn,  setCheckIn]  = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  // availability search
  const [searching,    setSearching]    = useState(false);
  const [searchDone,   setSearchDone]   = useState(false);
  const [searchResults,setSearchResults]= useState([]);

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE}/api/hotels`),
      axios.get(`${BASE}/api/rooms`),
    ])
      .then(([hRes, rRes]) => {
        setHotels(hRes.data);
        setRooms(rRes.data);
        setState("success");
      })
      .catch(() => setState("error"));
  }, []);

  async function handleSearch() {
    if (!checkIn || !checkOut) return;
    setSearching(true);
    setSearchDone(false);
    try {
      const params = new URLSearchParams({ checkIn, checkOut });
      if (activeHotel !== "all") params.append("hotelName", activeHotel);
      if (activeType  !== "all") params.append("roomType",  activeType);
      const res = await axios.get(`${BASE}/api/rooms/search?${params}`);
      setSearchResults(res.data);
      setSearchDone(true);
    } catch {
      setSearchResults([]);
      setSearchDone(true);
    }
    setSearching(false);
  }

  function clearSearch() {
    setSearchDone(false);
    setSearchResults([]);
    setCheckIn(today);
    setCheckOut(tomorrow);
  }

  // filtered rooms for default (non-search) view
  const filtered = rooms.filter(r => {
    const hotelMatch = activeHotel === "all" || r.hotelName === activeHotel;
    const typeMatch  = activeType  === "all" || r.roomType  === activeType;
    return hotelMatch && typeMatch;
  });

  const roomTypes = [...new Set(rooms.map(r => r.roomType))];

  return (
    <>
      <Header />
      <div className="w-full min-h-full" style={{ background: "#FAF7F2", paddingTop: "76px" }}>

      {/* ── Page header banner ── */}
      <div className="pt-[90px] pb-8 px-6 text-center" style={{ background: "linear-gradient(135deg,#FEF3C7,#FDE8C8)" }}>
        <p className="text-xs font-bold uppercase tracking-[0.3em] mb-2" style={{ color: "#D97706" }}>RESORT & SAFARI</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#292524" }}>Resort Rooms</h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "#78716C" }}>
          Browse all rooms across our hotels — check availability and book instantly
        </p>

        {/* Date picker + Search */}
        <div className="flex flex-wrap items-end justify-center gap-3 mt-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#92400E" }}>Check-In</label>
            <input
              type="date" value={checkIn} min={today}
              onChange={e => { setCheckIn(e.target.value); setSearchDone(false); }}
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "#FEF3C7", border: "1.5px solid #FCD34D", color: "#292524", colorScheme: "light" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#92400E" }}>Check-Out</label>
            <input
              type="date" value={checkOut} min={checkIn}
              onChange={e => { setCheckOut(e.target.value); setSearchDone(false); }}
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "#FEF3C7", border: "1.5px solid #FCD34D", color: "#292524", colorScheme: "light" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest opacity-0">btn</label>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: searching ? "#E8D9B8" : "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917", cursor: searching ? "not-allowed" : "pointer" }}
            >
              {searching
                ? <><span className="w-4 h-4 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" /> Searching…</>
                : <>🔍 Check Availability</>
              }
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest opacity-0">nights</label>
            <span className="px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(217,119,6,0.1)", color: "#D97706", border: "1px solid rgba(217,119,6,0.2)" }}>
              📅 {nights} night{nights !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Search result summary */}
        {searchDone && (
          <div className="flex items-center justify-center gap-3 mt-4">
            {searchResults.length === 0
              ? <span className="text-sm font-semibold" style={{ color: "#DC2626" }}>😔 No rooms available for these dates</span>
              : <span className="text-sm font-semibold" style={{ color: "#059669" }}>✅ {searchResults.length} room{searchResults.length !== 1 ? "s" : ""} available</span>
            }
            <button onClick={clearSearch}
              className="text-xs font-bold px-3 py-1 rounded-full border transition hover:bg-amber-50"
              style={{ color: "#D97706", borderColor: "#D97706" }}>
              Clear ×
            </button>
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      {state === "success" && (
        <div className="px-6 py-5 flex flex-wrap items-center gap-3 justify-center border-b" style={{ borderColor: "#F5EACF", background: "#FFFBF5" }}>
          {/* Hotel filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-widest mr-1" style={{ color: "#92400E" }}>Hotel:</span>
            {["all", ...hotels.map(h => h.name)].map(h => (
              <button key={h} onClick={() => setActiveHotel(h)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: activeHotel === h ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "#F5EDD8",
                  color: activeHotel === h ? "#1C1917" : "#92400E",
                }}>
                {h === "all" ? "All Hotels" : h}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 mx-1" style={{ background: "#F5EACF" }} />

          {/* Room type filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-widest mr-1" style={{ color: "#92400E" }}>Type:</span>
            {["all", ...roomTypes].map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: activeType === t ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : "#F5EDD8",
                  color: activeType === t ? "#1C1917" : "#92400E",
                }}>
                {t === "all" ? "All Types" : t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="w-full flex flex-wrap justify-center px-6 py-8">

        {/* Loading */}
        {state === "loading" && (
          <div className="w-full flex justify-center items-center py-32">
            <div className="w-[50px] h-[50px] border-4 rounded-full border-t-amber-500 animate-spin" />
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="w-full text-center py-20">
            <div className="text-5xl mb-4">😔</div>
            <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>Failed to load rooms</p>
            <p style={{ color: "#78716C" }}>Please check your connection and try again.</p>
          </div>
        )}

        {/* Searching spinner */}
        {searching && (
          <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 rounded-full border-t-amber-500 animate-spin" />
            <p className="text-sm font-semibold" style={{ color: "#78716C" }}>Checking availability for {checkIn} → {checkOut}…</p>
          </div>
        )}

        {/* Search results */}
        {searchDone && !searching && (
          <div className="w-full max-w-7xl">
            {searchResults.length === 0 ? (
              <div className="w-full text-center py-20 rounded-2xl border" style={{ background: "#FFFBF5", borderColor: "#F5EACF" }}>
                <div className="text-5xl mb-4">🛏</div>
                <p className="text-xl font-bold mb-2" style={{ color: "#292524" }}>No rooms available</p>
                <p className="mb-6" style={{ color: "#78716C" }}>No rooms match your selected dates. Try different dates or adjust filters.</p>
                <button onClick={clearSearch}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
                  Clear & Browse All
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold mb-6 px-3" style={{ color: "#78716C" }}>
                  ✅ <span style={{ color: "#059669" }}>{searchResults.length} room{searchResults.length !== 1 ? "s" : ""} available</span>
                  {" "}for {checkIn} → {checkOut} · {nights} night{nights !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap justify-start">
                  {searchResults.map(room => (
                    <RoomCard key={room._id} room={room} checkIn={checkIn} checkOut={checkOut} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Hotels grouped view */}
        {state === "success" && !searchDone && !searching && activeHotel === "all" && activeType === "all" && (
          <div className="w-full max-w-7xl">
            {hotels.map(hotel => {
              const hotelRooms = rooms.filter(r => r.hotelName === hotel.name);
              if (hotelRooms.length === 0) return null;
              return (
                <div key={hotel.hotelId} className="mb-14">
                  {/* Hotel header */}
                  <div className="flex items-center gap-4 mb-6 px-3">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden border-2" style={{ borderColor: "#FCD34D" }}>
                      <img
                        src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"}
                        alt={hotel.name} className="w-full h-full object-cover"
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"; }}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: "#292524" }}>{hotel.name}</h2>
                      <p className="text-sm flex items-center gap-1" style={{ color: "#A8A29E" }}>
                        <svg className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {hotel.location} ·
                        <span style={{ color: "#FBBF24" }}>{"★".repeat(hotel.starRating || 3)}</span>
                        · {hotelRooms.length} room{hotelRooms.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="ml-auto hidden md:flex flex-wrap gap-1.5">
                      {Object.entries(hotel.amenities || {})
                        .filter(([, v]) => v)
                        .slice(0, 4)
                        .map(([k]) => (
                          <span key={k} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                            style={{ background: "#F5EDD8", color: "#D97706" }}>
                            {k === "pool" ? "Pool" : k === "spa" ? "Spa" : k === "gym" ? "Gym" : k === "restaurant" ? "Restaurant" : k === "bar" ? "Bar" : k === "beachAccess" ? "Beach" : k}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Rooms grid */}
                  <div className="flex flex-wrap justify-start">
                    {hotelRooms.map(room => (
                      <RoomCard key={room._id} room={room} checkIn={checkIn} checkOut={checkOut} />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mt-8 h-px" style={{ background: "linear-gradient(to right,transparent,#F5EACF,transparent)" }} />
                </div>
              );
            })}

            {hotels.length === 0 && (
              <div className="w-full text-center py-20">
                <div className="text-5xl mb-4">🏨</div>
                <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>No hotels added yet</p>
                <p style={{ color: "#78716C" }}>Hotels will appear here once added from the admin dashboard.</p>
              </div>
            )}
          </div>
        )}

        {/* Filtered view */}
        {state === "success" && !searchDone && !searching && (activeHotel !== "all" || activeType !== "all") && (
          <div className="w-full max-w-7xl">
            {filtered.length === 0 ? (
              <div className="w-full text-center py-20">
                <div className="text-5xl mb-4">🛏</div>
                <p className="text-lg font-semibold mb-2" style={{ color: "#292524" }}>No rooms found</p>
                <p className="mb-6" style={{ color: "#78716C" }}>Try adjusting your filters.</p>
                <button
                  onClick={() => { setActiveHotel("all"); setActiveType("all"); }}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold mb-6 px-3" style={{ color: "#78716C" }}>
                  Showing <span style={{ color: "#D97706" }}>{filtered.length} room{filtered.length !== 1 ? "s" : ""}</span>
                  {activeHotel !== "all" ? ` in ${activeHotel}` : ""}
                  {activeType  !== "all" ? ` · ${activeType}` : ""}
                </p>
                <div className="flex flex-wrap justify-start">
                  {filtered.map(room => (
                    <RoomCard key={room._id} room={room} checkIn={checkIn} checkOut={checkOut} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}