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
        <div className="min-h-screen" style={{ background: "#FAF7F2" }}>

            {/* ── Category Filter ── */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-4">
                {/* Section heading */}
                <div className="text-center mb-10">
                    <p className="tracking-[0.35em] text-xs font-semibold mb-3" style={{ color: "#D97706" }}>
                        YALA & KATARAGAMA
                    </p>
                    {/* Ornamental divider */}
                    <div className="flex items-center justify-center gap-4 mb-5">
                        <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #D97706)" }} />
                        <div className="flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D97706" }} />
                            <div className="w-3 h-px" style={{ background: "#D97706" }} />
                            <div className="w-2 h-2 rotate-45 border" style={{ borderColor: "#D97706" }} />
                            <div className="w-3 h-px" style={{ background: "#D97706" }} />
                            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D97706" }} />
                        </div>
                        <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #D97706)" }} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#292524" }}>
                        Explore Our Gallery
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: "#78716C" }}>
                        Discover breathtaking resorts, camping experiences, and premium equipment rentals
                    </p>
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105"
                            style={
                                selectedCategory === category.id
                                    ? {
                                        background: "linear-gradient(135deg,#FBBF24,#F59E0B)",
                                        color: "#1C1917",
                                        boxShadow: "0 4px 16px rgba(251,191,36,0.40)",
                                        border: "2px solid transparent",
                                    }
                                    : {
                                        background: "#FFFBF5",
                                        color: "#78716C",
                                        border: "2px solid #F5EACF",
                                        boxShadow: "0 2px 8px rgba(217,119,6,0.08)",
                                    }
                            }
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* ── Gallery Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="group relative rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                            style={{
                                background: "#FFFBF5",
                                border: "1px solid #F5EACF",
                                boxShadow: "0 4px 24px rgba(146,64,14,0.10)",
                            }}
                            onClick={() => setSelectedImage(item)}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden h-64">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient overlay on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: "linear-gradient(to top, rgba(28,20,10,0.70) 0%, rgba(28,20,10,0.15) 60%, transparent 100%)" }}
                                />

                                {/* Category badge */}
                                <div className="absolute top-4 right-4">
                                    <span
                                        className="px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-widest shadow-lg"
                                        style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
                                    >
                                        {item.category}
                                    </span>
                                </div>

                                {/* Zoom icon on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="rounded-full p-4" style={{ background: "rgba(251,191,36,0.25)", backdropFilter: "blur(6px)" }}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-6">
                                <h3
                                    className="text-xl font-bold mb-2 transition-colors duration-200"
                                    style={{ color: "#292524" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#D97706"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#292524"}
                                >
                                    {item.title}
                                </h3>
                                <p className="leading-relaxed text-sm" style={{ color: "#78716C" }}>
                                    {item.description}
                                </p>
                                {/* Bottom amber accent line */}
                                <div
                                    className="mt-4 h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-500"
                                    style={{ background: "linear-gradient(to right,#FBBF24,#F59E0B)" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏕️</div>
                        <h3 className="text-2xl font-bold mb-2" style={{ color: "#292524" }}>No items found</h3>
                        <p style={{ color: "#78716C" }}>Try selecting a different category</p>
                    </div>
                )}
            </div>

            {/* ── Lightbox Modal ── */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-6"
                    style={{ background: "rgba(28,20,10,0.92)", backdropFilter: "blur(8px)" }}
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 transition-colors"
                            style={{ color: "#A8A29E" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#FBBF24"}
                            onMouseLeave={e => e.currentTarget.style.color = "#A8A29E"}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Amber top border */}
                        <div className="h-1 w-full rounded-t-2xl" style={{ background: "linear-gradient(to right,#FBBF24,#F59E0B,#D97706)" }} />

                        <img
                            src={selectedImage.image}
                            alt={selectedImage.title}
                            className="w-full h-auto rounded-b-2xl shadow-2xl"
                        />

                        {/* Caption */}
                        <div
                            className="mt-6 text-center px-4 py-5 rounded-2xl border"
                            style={{ background: "#FFFBF5", borderColor: "#F5EACF" }}
                        >
                            <span
                                className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)", color: "#1C1917" }}
                            >
                                {selectedImage.category}
                            </span>
                            <h3 className="text-2xl font-bold mb-1" style={{ color: "#292524" }}>
                                {selectedImage.title}
                            </h3>
                            <p style={{ color: "#78716C" }}>{selectedImage.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Footer strip ── */}
            <div className="py-8 text-center" style={{ background: "#1C1917" }}>
                <p style={{ color: "#78716C" }}>© 2026 Yala & Kataragama Travel Hub. All rights reserved.</p>
            </div>
        </div>
    );
}