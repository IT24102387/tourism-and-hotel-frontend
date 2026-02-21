import { Link } from "react-router-dom";

export default function ErrorNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated Container */}
        <div className="relative">
          {/* Floating Elements */}
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute top-10 right-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-40 animate-pulse"></div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-6">
              <div className="inline-block p-6 bg-white rounded-full shadow-xl">
                <svg
                  className="w-24 h-24 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 404 Text */}
            <h1 className="text-8xl md:text-9xl font-black text-gray-800 mb-4 tracking-tight">
              4<span className="text-orange-500">0</span>4
            </h1>

            {/* Message */}
            <h2 className="text-2xl md:text-4xl font-bold text-gray-700 mb-3">
              Uh-oh! Lost in Space
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-10 max-w-md mx-auto">
              We can't seem to find the page you're looking for. Let's get you back on track!
            </p>

            {/* Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Take Me Home
            </Link>

            {/* Decorative Wave */}
            <div className="mt-16">
              <svg className="w-full h-16 text-orange-200 opacity-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}