// src/pages/home/restaurants.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaUtensils,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurantSearchTerm, setRestaurantSearchTerm] = useState("");
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [foodSearchTerm, setFoodSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [showAllMenus, setShowAllMenus] = useState(false);
  const [showAllFoodItems, setShowAllFoodItems] = useState(false);

  // Hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
  ];

  // Get unique categories from food items
  const getUniqueCategories = () => {
    const categories = [...new Set(foodItems.map(item => item.category))];
    return categories.filter(cat => cat);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Hero slideshow
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Filter restaurants
  useEffect(() => {
    let filtered = restaurants;
    if (restaurantSearchTerm) {
      filtered = filtered.filter(r =>
        r.name?.toLowerCase().includes(restaurantSearchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(restaurantSearchTerm.toLowerCase()) ||
        r.address?.toLowerCase().includes(restaurantSearchTerm.toLowerCase())
      );
    }
    setFilteredRestaurants(filtered);
  }, [restaurantSearchTerm, restaurants]);

  // Filter menus
  useEffect(() => {
    let filtered = menus;
    if (menuSearchTerm) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
        m.description?.toLowerCase().includes(menuSearchTerm.toLowerCase())
      );
    }
    setFilteredMenus(filtered);
  }, [menuSearchTerm, menus]);

  // Filter food items
  useEffect(() => {
    let filtered = foodItems;
    if (foodSearchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(foodSearchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(foodSearchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(item =>
        availabilityFilter === "available" ? item.availability === true : item.availability === false
      );
    }
    setFilteredFoodItems(filtered);
  }, [foodSearchTerm, categoryFilter, availabilityFilter, foodItems]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants`);
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async (restaurantId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${restaurantId}/menus`
      );
      setMenus(response.data);
      setFilteredMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      toast.error("Failed to load menus");
    }
  };

  const fetchFoodItems = async (menuId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/menus/${menuId}/fooditems`
      );
      setFoodItems(response.data);
      setFilteredFoodItems(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Failed to load food items");
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchMenus(restaurant._id);
    setSelectedMenu(null);
    setFoodItems([]);
    setFilteredFoodItems([]);
    setMenuSearchTerm("");
    setShowAllMenus(false);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    fetchFoodItems(menu._id);
    setCategoryFilter("all");
    setAvailabilityFilter("all");
    setFoodSearchTerm("");
    setShowAllFoodItems(false);
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setSelectedMenu(null);
    setFoodItems([]);
    setFilteredFoodItems([]);
    setRestaurantSearchTerm("");
    setShowAllRestaurants(false);
  };

  const handleBackToMenus = () => {
    setSelectedMenu(null);
    setFoodItems([]);
    setFilteredFoodItems([]);
    setMenuSearchTerm("");
    setShowAllMenus(false);
  };

  const nextImage = () => {
    setIsAutoplay(false);
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setIsAutoplay(false);
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={`text-sm ${i < Math.floor(rating || 4.5) ? "text-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    );
  };

  const getMenuIcon = (menuName) => {
    const icons = {
      Breakfast: "🌅",
      Lunch: "☀️",
      Dinner: "🌙",
      Desserts: "🍮",
      Beverages: "🥤",
      Special: "⭐",
    };
    return icons[menuName] || "🍽️";
  };

  // Get displayed restaurants based on showAll
  const displayedRestaurants = showAllRestaurants ? filteredRestaurants : filteredRestaurants.slice(0, 6);
  const hasMoreRestaurants = filteredRestaurants.length > 6;

  // Get displayed menus based on showAll
  const displayedMenus = showAllMenus ? filteredMenus : filteredMenus.slice(0, 6);
  const hasMoreMenus = filteredMenus.length > 6;

  // Get displayed food items based on showAll
  const displayedFoodItems = showAllFoodItems ? filteredFoodItems : filteredFoodItems.slice(0, 6);
  const hasMoreFoodItems = filteredFoodItems.length > 6;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ background: "#F3F4F6" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  // Restaurant Listing View
  if (!selectedRestaurant) {
    return (
      <div className="min-h-screen" style={{ background: "#F3F4F6" }}>
        {/* Hero Section */}
        <div className="relative h-[450px] overflow-hidden">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}

          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition">
            <FaChevronLeft className="text-xl" />
          </button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition">
            <FaChevronRight className="text-xl" />
          </button>

          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-wide">Restaurants</h1>
            <p className="text-lg max-w-2xl font-light">Discover authentic Sri Lankan cuisine and international dishes in Kataragama</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search and Filter Section */}
          <div className="mb-10">
            <div className="relative max-w-md mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600 text-sm" />
              <input
                type="text"
                placeholder="Search by name, cuisine or address..."
                value={restaurantSearchTerm}
                onChange={(e) => setRestaurantSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-yellow-300 rounded-full focus:outline-none focus:border-yellow-500 transition text-sm"
                style={{ background: "white" }}
              />
            </div>
            {restaurantSearchTerm && (
              <div className="text-center mt-2 text-sm text-gray-500">
                Found {filteredRestaurants.length} restaurant(s)
              </div>
            )}
          </div>

          {/* Restaurant Grid */}
          {displayedRestaurants.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No restaurants found</p>
              {restaurantSearchTerm && (
                <button
                  onClick={() => setRestaurantSearchTerm("")}
                  className="mt-2 text-yellow-600 hover:text-yellow-700"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedRestaurants.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    onClick={() => handleRestaurantClick(restaurant)}
                    className="group rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                    style={{ 
                      background: "white", 
                      boxShadow: "0 4px 24px rgba(217,119,6,0.08)",
                      border: "1px solid #F5EACF"
                    }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={restaurant.image?.[0] || "/placeholder-restaurant.jpg"}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {restaurant.isActive !== false && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Open</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold mb-1" style={{ color: "#292524" }}>{restaurant.name}</h3>
                        {renderStars()}
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "#78716C" }}>
                        <FaMapMarkerAlt className="text-amber-500" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-3" style={{ color: "#78716C" }}>
                        <FaClock className="text-amber-500" />
                        <span>{restaurant.openingHours || "7:00 AM - 10:00 PM"}</span>
                      </div>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: "#A8A29E" }}>
                        {restaurant.description}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "#F5EACF" }}>
                        <div className="flex items-center gap-1 text-sm" style={{ color: "#D97706" }}>
                          <FaUtensils />
                          <span>View Menu →</span>
                        </div>
                        {restaurant.phone && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: "#78716C" }}>
                            <FaPhone className="text-amber-500" />
                            <span>{restaurant.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              {hasMoreRestaurants && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setShowAllRestaurants(!showAllRestaurants)}
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full transition shadow-md"
                  >
                    {showAllRestaurants ? "Show Less" : `View All (${filteredRestaurants.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Menu Listing View
  if (!selectedMenu) {
    return (
      <div className="min-h-screen" style={{ background: "#F3F4F6" }}>
        {/* Restaurant Header */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={selectedRestaurant.image?.[0] || "/placeholder-restaurant.jpg"}
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button
            onClick={handleBackToRestaurants}
            className="absolute top-6 left-6 z-20 text-white px-4 py-2 rounded-lg flex items-center gap-2 bg-black/50 hover:bg-black/70 transition"
          >
            ← Back to Restaurants
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: "#FBBF24" }}>
              {selectedRestaurant.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#FDE68A" }}>
              <span className="flex items-center gap-1"><FaMapMarkerAlt /> {selectedRestaurant.address}</span>
              <span className="flex items-center gap-1"><FaClock /> {selectedRestaurant.openingHours || "7:00 AM - 10:00 PM"}</span>
              {selectedRestaurant.phone && (
                <span className="flex items-center gap-1"><FaPhone /> {selectedRestaurant.phone}</span>
              )}
            </div>
            <p className="mt-2 text-sm max-w-2xl text-yellow-100">{selectedRestaurant.description}</p>
          </div>
        </div>

        {/* Menus Section */}
        <div className="max-w-6xl mx-auto py-12 px-6">
          {/* Search Bar for Menus */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600 text-sm" />
              <input
                type="text"
                placeholder="Search menus..."
                value={menuSearchTerm}
                onChange={(e) => setMenuSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-yellow-300 rounded-full focus:outline-none focus:border-yellow-500 transition text-sm"
                style={{ background: "white" }}
              />
            </div>
            {menuSearchTerm && (
              <div className="text-center mt-2 text-sm text-gray-500">
                Found {filteredMenus.length} menu(s)
              </div>
            )}
          </div>

          {displayedMenus.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No menus found</p>
              {menuSearchTerm && (
                <button
                  onClick={() => setMenuSearchTerm("")}
                  className="mt-2 text-yellow-600 hover:text-yellow-700"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedMenus.filter(menu => menu.isActive !== false).map((menu) => (
                  <div
                    key={menu._id}
                    onClick={() => handleMenuClick(menu)}
                    className="group rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                    style={{ 
                      background: "white", 
                      boxShadow: "0 4px 24px rgba(217,119,6,0.08)",
                      border: "1px solid #F5EACF"
                    }}
                  >
                    <div className="text-5xl mb-4">
                      {getMenuIcon(menu.name)}
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: "#292524" }}>{menu.name}</h3>
                    <p className="text-sm mb-4" style={{ color: "#A8A29E" }}>{menu.description || "Delicious options available"}</p>
                    <div className="flex items-center gap-2 text-amber-600">
                      <FaUtensils />
                      <span>View Items →</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button for Menus */}
              {hasMoreMenus && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setShowAllMenus(!showAllMenus)}
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full transition shadow-md"
                  >
                    {showAllMenus ? "Show Less" : `View All (${filteredMenus.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Food Items View
  return (
    <div className="min-h-screen" style={{ background: "#F3F4F6" }}>
      {/* Header with Yellow Background */}
      <div className="bg-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={handleBackToMenus}
            className="mb-4 flex items-center gap-2 text-gray-700 hover:text-black transition-colors duration-200 group"
          >
            <FaChevronLeft className="text-sm group-hover:-translate-x-1 transition" />
            <span className="font-medium">Back to Menus</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                {selectedMenu.name}
              </h1>
              <p className="text-gray-800 text-lg font-medium">{selectedRestaurant.name}</p>
              {selectedMenu.description && (
                <p className="text-gray-700 text-sm mt-1">{selectedMenu.description}</p>
              )}
            </div>
            {selectedRestaurant.openingHours && (
              <div className="flex items-center gap-2 text-gray-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-300 shadow-sm">
                <FaClock className="text-gray-600" />
                <span className="text-sm font-medium">{selectedRestaurant.openingHours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Food Items Section */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search food items..."
                value={foodSearchTerm}
                onChange={(e) => setFoodSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(foodSearchTerm || categoryFilter !== "all" || availabilityFilter !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-sm text-gray-500">Active filters:</span>
              {foodSearchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Search: {foodSearchTerm}
                  <FaTimes className="cursor-pointer text-xs" onClick={() => setFoodSearchTerm("")} />
                </span>
              )}
              {categoryFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Category: {categoryFilter}
                  <FaTimes className="cursor-pointer text-xs" onClick={() => setCategoryFilter("all")} />
                </span>
              )}
              {availabilityFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  Status: {availabilityFilter === "available" ? "Available" : "Unavailable"}
                  <FaTimes className="cursor-pointer text-xs" onClick={() => setAvailabilityFilter("all")} />
                </span>
              )}
              <button
                onClick={() => {
                  setFoodSearchTerm("");
                  setCategoryFilter("all");
                  setAvailabilityFilter("all");
                }}
                className="text-xs text-yellow-600 hover:text-yellow-700"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          {(foodSearchTerm || categoryFilter !== "all" || availabilityFilter !== "all") && (
            <div className="text-center mt-3 text-sm text-gray-500">
              Found {filteredFoodItems.length} food item(s)
            </div>
          )}
        </div>

        {/* Food Items Grid */}
        {displayedFoodItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">No food items found</p>
            <button
              onClick={() => {
                setFoodSearchTerm("");
                setCategoryFilter("all");
                setAvailabilityFilter("all");
              }}
              className="mt-2 text-yellow-600 hover:text-yellow-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Group by Category */}
            {(() => {
              const categories = [...new Set(displayedFoodItems.map(item => item.category))];
              return categories.map(category => (
                <div key={category} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                    <span className="text-sm text-gray-400">
                      {displayedFoodItems.filter(item => item.category === category).length} items
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedFoodItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <div
                          key={item._id}
                          className="group rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                          style={{ 
                            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                            border: "1px solid #F0F0F0"
                          }}
                        >
                          {/* Image Section */}
                          <div className="relative h-52 overflow-hidden bg-gray-100">
                            <img
                              src={item.image?.[0] || "/placeholder-food.jpg"}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {item.preparationTime && (
                              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                                <FaClock className="text-amber-400 text-[10px]" />
                                <span>{item.preparationTime} min</span>
                              </div>
                            )}
                            {!item.availability && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">Unavailable</span>
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="p-5">
                            <div className="flex justify-between items-start gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800 leading-tight">
                                {item.name}
                              </h3>
                              <div className="flex items-baseline gap-0.5 bg-amber-50 px-3 py-1.5 rounded-lg">
                                <span className="text-xs text-amber-600 font-medium">Rs.</span>
                                <span className="text-xl font-bold text-amber-600">
                                  {item.price?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                <FaTag className="text-amber-500 text-[10px]" />
                                {item.category}
                              </span>
                              {item.spicyLevel && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                                  🌶️ {item.spicyLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ));
            })()}

            {/* View All Button for Food Items */}
            {hasMoreFoodItems && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAllFoodItems(!showAllFoodItems)}
                  className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full transition shadow-md"
                >
                  {showAllFoodItems ? "Show Less" : `View All (${filteredFoodItems.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}