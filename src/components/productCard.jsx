// Page wrapper example:
// <div className="min-h-screen bg-[#e8f8f5] px-12 py-10">
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
//     {items.map(item => <ProductCard key={item._id} item={item} />)}
//   </div>
// </div>

import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  return (
    <div className="group w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer mx-3 my-2">
      {/* Full-bleed Image Section */}
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        <img
          src={item.image?.[0] || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark gradient overlay at bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Category Badge - top right */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
            {item.category || "GEAR"}
          </span>
        </div>

        {/* Availability dot - top left */}
        {item.availability !== undefined && (
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-sm ${
                item.availability
                  ? "bg-white/90 text-emerald-600"
                  : "bg-white/90 text-rose-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.availability ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              {item.availability ? "In Stock" : "Out"}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 capitalize mb-1 line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {item.description}
        </p>

        {/* Bottom row: price + action */}
        <div className="flex items-center justify-between mt-auto">
          {/* Price */}
          <div>
            <span className="text-2xl font-black text-gray-900">
              {item.dailyRentalprice?.toLocaleString() || "0"}
            </span>
            <span className="text-sm font-semibold text-gray-400 ml-1">LKR / day</span>
          </div>

          {/* CTA */}
          {item.availability ? (

            <Link to={"/product/"+item.key} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-full shadow hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              Rent Now
            </Link>
          ) : (
            <span className="px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-bold rounded-full">
              Unavailable
            </span>
          )}
        </div>

        {/* Pickup location */}
        {item.pickupLocation && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
            <svg
              className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs text-gray-400 font-medium truncate">
              {item.pickupLocation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}