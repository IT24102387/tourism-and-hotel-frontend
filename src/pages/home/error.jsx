import { Link } from "react-router-dom";

export default function ErrorNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#FAF7F2" }}>

      {/* ── Dot texture background ── */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #D97706 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Floating amber blobs ── */}
      <div className="absolute top-16 left-1/4 w-24 h-24 rounded-full opacity-20 animate-bounce"
        style={{ background: "#FBBF24" }} />
      <div className="absolute top-28 right-1/4 w-16 h-16 rounded-full opacity-20 animate-pulse"
        style={{ background: "#F59E0B" }} />
      <div className="absolute bottom-24 left-1/3 w-12 h-12 rounded-full opacity-15 animate-bounce"
        style={{ background: "#D97706", animationDelay: "0.5s" }} />
      <div className="absolute bottom-32 right-1/3 w-20 h-20 rounded-full opacity-10 animate-pulse"
        style={{ background: "#FBBF24", animationDelay: "1s" }} />

      {/* ── Corner decorations (matching home page style) ── */}
      {[
        "top-8 left-8 top left",
        "top-8 right-8 top right",
        "bottom-8 left-8 bottom left",
        "bottom-8 right-8 bottom right",
      ].map((cfg, i) => {
        const parts = cfg.split(" ");
        const pos = parts.slice(0, 2).join(" ");
        const dv = parts[2], dh = parts[3];
        return (
          <div key={i} className={`absolute ${pos} w-16 h-16 pointer-events-none opacity-30`}
            style={{
              background: `linear-gradient(#D97706,#D97706) ${dv} ${dh}/2px 28px no-repeat,
                           linear-gradient(#D97706,#D97706) ${dv} ${dh}/28px 2px no-repeat`,
            }}
          />
        );
      })}

      {/* ── Main card ── */}
      <div className="relative z-10 text-center max-w-lg mx-auto">

        {/* Warning icon */}
        <div className="mb-8 flex justify-center">
          <div
            className="p-6 rounded-full shadow-2xl"
            style={{
              background: "#FFFBF5",
              border: "2px solid #F5EACF",
              boxShadow: "0 8px 40px rgba(217,119,6,0.18)",
            }}
          >
            <svg className="w-20 h-20" style={{ color: "#F59E0B" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* 404 big text */}
        <h1 className="font-black mb-4 leading-none select-none"
          style={{
            fontSize: "clamp(6rem,20vw,10rem)",
            color: "#292524",
            letterSpacing: "-4px",
            textShadow: "0 4px 24px rgba(217,119,6,0.12)",
          }}
        >
          4<span style={{ color: "#FBBF24" }}>0</span>4
        </h1>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16" style={{ background: "linear-gradient(to right,transparent,#D97706)" }} />
          <div className="flex gap-1 items-center">
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D97706" }} />
            <div className="w-3 h-px" style={{ background: "#D97706" }} />
            <div className="w-2 h-2 rotate-45 border" style={{ borderColor: "#D97706" }} />
            <div className="w-3 h-px" style={{ background: "#D97706" }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D97706" }} />
          </div>
          <div className="h-px w-16" style={{ background: "linear-gradient(to left,transparent,#D97706)" }} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#292524" }}>
          Lost in the Wilderness
        </h2>

        {/* Subtext */}
        <p className="text-base md:text-lg mb-10 max-w-sm mx-auto leading-relaxed"
          style={{ color: "#78716C" }}>
          We can't find the page you're looking for. Let's get you back to the safari!
        </p>

        {/* CTA button — split slab design matching ProductOverview */}
        <Link
          to="/"
          className="inline-flex rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 group"
          style={{ boxShadow: "0 8px 32px rgba(251,191,36,0.35)" }}
        >
          {/* Icon slab */}
          <div
            className="flex items-center justify-center px-5 transition-all duration-300 group-hover:px-7"
            style={{ background: "#D97706" }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          {/* Label slab */}
          <div
            className="px-8 py-4 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
          >
            <span className="text-base font-black tracking-wide" style={{ color: "#1C1917" }}>
              Take Me Home
            </span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: "#92400E" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Small label below */}
        <p className="mt-6 text-xs tracking-widest font-semibold uppercase" style={{ color: "#A8A29E" }}>
          Yala & Kataragama Travel Hub
        </p>
      </div>

      {/* ── Bottom wave (warm amber tint) ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg className="w-full" style={{ height: "80px", color: "#F5EACF", opacity: 0.6 }}
          viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}