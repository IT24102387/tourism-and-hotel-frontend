import { useState } from 'react';

export default function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'resorts', name: 'Resorts' },
        { id: 'camping', name: 'Camping' },
        { id: 'equipment', name: 'Equipment' },
        { id: 'activities', name: 'Activities' }
    ];

    const galleryItems = [
        {
            id: 1,
            category: 'resorts',
            title: 'Lakeside Resort',
            description: 'Luxury cabins with panoramic lake views',
            image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80'
        },
        {
            id: 2,
            category: 'camping',
            title: 'Mountain Camping',
            description: 'Premium camping sites in the mountains',
            image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80'
        },
        {
            id: 3,
            category: 'equipment',
            title: 'Camping Tents',
            description: 'High-quality tents for 2-6 people',
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'
        },
        {
            id: 4,
            category: 'activities',
            title: 'Kayaking Adventures',
            description: 'Explore serene waters with our kayaks',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'
        },
        {
            id: 5,
            category: 'resorts',
            title: 'Forest Retreat',
            description: 'Cozy cabins nestled in pine forests',
            image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80'
        },
        {
            id: 6,
            category: 'equipment',
            title: 'Camping Gear',
            description: 'Complete camping equipment packages',
            image: 'https://images.unsplash.com/photo-1478827536114-da961b7f86c2?w=800&q=80'
        },
        {
            id: 7,
            category: 'camping',
            title: 'Riverside Camping',
            description: 'Peaceful spots along crystal-clear rivers',
            image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80'
        },
        {
            id: 8,
            category: 'activities',
            title: 'Hiking Trails',
            description: 'Guided hikes through scenic landscapes',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80'
        },
        {
            id: 9,
            category: 'equipment',
            title: 'Backpacks & Gear',
            description: 'Professional hiking and camping backpacks',
            image: 'backback.jpg'
        }
    ];

    const filteredItems = selectedCategory === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50">
            {/* Hero Section - Updated to match your screenshot */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-24 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Explore Our Gallery
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light">
                        Discover breathtaking resorts, camping experiences, and premium equipment rentals
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                                selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-emerald-50 shadow-md'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="relative overflow-hidden h-72">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Category Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="px-4 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Hover Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏕️</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No items found</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage.image}
                            alt={selectedImage.title}
                            className="w-full h-auto rounded-2xl shadow-2xl"
                        />
                        <div className="mt-6 text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                            <p className="text-emerald-300">{selectedImage.description}</p>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
}