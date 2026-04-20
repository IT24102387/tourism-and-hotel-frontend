import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Expanded list of popular places with emojis
const POPULAR_PLACES = [
  { name: "Kataragama Devalaya", icon: "🛕", category: "Sacred Site" },
  { name: "Kiri Vehera Stupa", icon: "⛩️", category: "Sacred Site" },
  { name: "Kataragama Mosque", icon: "🕌", category: "Sacred Site" },
  { name: "Sithulpawwa Rock Temple", icon: "🪨", category: "Heritage" },
  { name: "Tissamaharama Temple", icon: "🛕", category: "Sacred Site" },
  { name: "Sella Kataragama", icon: "🛕", category: "Sacred Site" },
  { name: "Yala National Park", icon: "🐆", category: "Wildlife" },
  { name: "Yala Safari (Jeep Tour)", icon: "🚙", category: "Wildlife" },
  { name: "Bundala National Park", icon: "🦩", category: "Wildlife" },
  { name: "Lunugamvehera National Park", icon: "🐘", category: "Wildlife" },
  { name: "Tissa Lake", icon: "🌊", category: "Nature" },
  { name: "Manik Ganga River", icon: "🌿", category: "Nature" },
  { name: "Cinnamon Wild Yala", icon: "🏨", category: "Hotel" },
  { name: "Jetwing Yala", icon: "🏨", category: "Hotel" },
  { name: "Chena Huts", icon: "🏨", category: "Hotel" },
  { name: "Wild Coast Tented Lodge", icon: "🏨", category: "Hotel" },
  { name: "Kataragama Museum", icon: "🏛️", category: "Culture" },
  { name: "Tissamaharama Tank", icon: "💧", category: "Nature" },
];

export default function GoogleMapsPage() {
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState("");
  const [destinations, setDestinations] = useState([""]);
  const [activeInput, setActiveInput] = useState(null);

  const addDestination = () => {
    if (destinations.length < 5) {
      setDestinations([...destinations, ""]);
    }
  };

  const removeDestination = (index) => {
    const updated = destinations.filter((_, i) => i !== index);
    setDestinations(updated.length ? updated : [""]);
  };

  const updateDestination = (index, value) => {
    const updated = [...destinations];
    updated[index] = value;
    setDestinations(updated);
  };

  const handleExplore = () => {
    const validDests = destinations.filter((d) => d.trim());
    if (!startLocation.trim() || validDests.length === 0) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        startLocation + ", Sri Lanka"
      )}&destination=${encodeURIComponent(
        validDests[validDests.length - 1] + ", Sri Lanka"
      )}&waypoints=${validDests
        .slice(0, -1)
        .map((d) => encodeURIComponent(d + ", Sri Lanka"))
        .join("|")}`,
      "_blank"
    );
  };

  const isReady = startLocation.trim() && destinations.some((d) => d.trim());

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: "#FAF7F2" }}
    >
      {/* ── Hero Banner (matching Services.jsx) ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 260 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80')",
            filter: "brightness(0.45)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "#FBBF24" }}
          >
            WildHaven Resort &amp; Safari
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
            style={{ color: "#FFFFFF", fontFamily: "'Georgia', serif" }}
          >
            Plan Your{" "}
            <span style={{ color: "#FBBF24" }}>Kataragama Journey</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Enter your starting point and the sacred sites or attractions you wish to explore in the heart of Kataragama.
          </p>
        </div>
      </div>

      {/* Content area */}
      <div className="relative z-10 flex flex-col items-center justify-start px-4 pt-10 pb-10">

        {/* Main Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "32px",
            border: "1px solid #F5EACF",
            boxShadow: "0 12px 40px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.02)",
            padding: "2.5rem",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          {/* Starting Point */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#F59E0B",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "10px",
              }}
            >
              📍 Starting Point
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                onFocus={() => setActiveInput("start")}
                onBlur={() => setTimeout(() => setActiveInput(null), 150)}
                placeholder="e.g. Your Hotel, Kataragama Town…"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "16px",
                  border: activeInput === "start" ? "2px solid #F59E0B" : "1.5px solid #F5EACF",
                  background: "#FAF7F2",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "1rem",
                  color: "#292524",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  if (activeInput !== "start") {
                    e.currentTarget.style.borderColor = "#FBBF24";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(245,158,11,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeInput !== "start") {
                    e.currentTarget.style.borderColor = "#F5EACF";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              />
              {startLocation && (
                <button
                  onClick={() => setStartLocation("")}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#D6D3D1",
                    fontSize: "1.2rem",
                    padding: "2px",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div style={{ flex: 1, height: "1px", background: "#F5EACF" }} />
            <span style={{ color: "#F59E0B", fontSize: "1.2rem" }}>↓</span>
            <div style={{ flex: 1, height: "1px", background: "#F5EACF" }} />
          </div>

          {/* Destinations */}
          <div className="mb-4">
            <label
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#F59E0B",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "10px",
              }}
            >
              🏁 Destinations
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {destinations.map((dest, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#F59E0B",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      flexShrink: 0,
                      fontFamily: "'Inter', system-ui, sans-serif",
                    }}
                  >
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={dest}
                    onChange={(e) => updateDestination(index, e.target.value)}
                    onFocus={() => setActiveInput(`dest-${index}`)}
                    onBlur={() => setTimeout(() => setActiveInput(null), 150)}
                    placeholder={`Destination ${index + 1}…`}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "16px",
                      border: activeInput === `dest-${index}` ? "2px solid #F59E0B" : "1.5px solid #F5EACF",
                      background: "#FAF7F2",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: "0.95rem",
                      color: "#292524",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (activeInput !== `dest-${index}`) {
                        e.currentTarget.style.borderColor = "#FBBF24";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(245,158,11,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeInput !== `dest-${index}`) {
                        e.currentTarget.style.borderColor = "#F5EACF";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  />
                  {destinations.length > 1 && (
                    <button
                      onClick={() => removeDestination(index)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(245,158,11,0.1)",
                        border: "none",
                        cursor: "pointer",
                        color: "#F59E0B",
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.1)")}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {destinations.length < 5 && (
              <button
                onClick={addDestination}
                style={{
                  marginTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "24px",
                  border: "1.5px dashed #F5EACF",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#F59E0B",
                  fontSize: "0.9rem",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: "600",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FEF3C7";
                  e.currentTarget.style.borderColor = "#F59E0B";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#F5EACF";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>+</span> Add another stop
              </button>
            )}
          </div>
        </div>

        {/* Popular Places */}
        <div style={{ width: "100%", maxWidth: "800px", marginTop: "2rem" }}>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#78716C",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "12px",
              paddingLeft: "6px",
            }}
          >
            ✨ Popular in Kataragama &amp; Yala
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {POPULAR_PLACES.map((place) => (
              <button
                key={place.name}
                onClick={() => {
                  if (!startLocation) {
                    setStartLocation(place.name);
                  } else {
                    const emptyIdx = destinations.findIndex((d) => !d.trim());
                    if (emptyIdx !== -1) {
                      updateDestination(emptyIdx, place.name);
                    } else if (destinations.length < 5) {
                      setDestinations([...destinations, place.name]);
                    }
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "40px",
                  border: "1px solid #F5EACF",
                  background: "#FFFFFF",
                  cursor: "pointer",
                  color: "#292524",
                  fontSize: "0.9rem",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FEF3C7";
                  e.currentTarget.style.borderColor = "#F59E0B";
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(245,158,11,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#F5EACF";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{place.icon}</span>
                <span>{place.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ width: "100%", maxWidth: "800px", marginTop: "2rem" }}>
          <button
            onClick={handleExplore}
            disabled={!isReady}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "20px",
              border: "none",
              background: isReady
                ? "linear-gradient(135deg, #FBBF24, #F59E0B)"
                : "#FEF3C7",
              color: isReady ? "#292524" : "#A8A29E",
              fontSize: "1.1rem",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: "600",
              letterSpacing: "-0.01em",
              cursor: isReady ? "pointer" : "not-allowed",
              transition: "all 0.25s",
              boxShadow: isReady ? "0 8px 24px rgba(245,158,11,0.2)" : "none",
              transform: isReady ? "translateY(0)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              if (isReady) e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (isReady) e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>🗺️</span>
            Open Route in Google Maps
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.8rem",
              color: "#A8A29E",
            }}
          >
            Fills your start point and stops before opening Google Maps
          </p>
        </div>
      </div>
    </div>
  );
}