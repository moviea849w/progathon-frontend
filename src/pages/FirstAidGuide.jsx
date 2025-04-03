import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import firstAidAnimation from "../assets/animations/animation1.json";
import { Search, AlertCircle, Heart, Clock, BookOpen, ChevronDown, ChevronUp, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FirstAidGuide = () => {
    const [guides, setGuides] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [expandedGuide, setExpandedGuide] = useState(null);
    const [bookmarkedGuides, setBookmarkedGuides] = useState([]);
    const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

    const categories = [
        { id: "all", name: "All Topics" },
        { id: "emergency", name: "Emergency Care" },
        { id: "wounds", name: "Wounds & Injuries" },
        { id: "medical", name: "Medical Conditions" },
        { id: "environmental", name: "Environmental" },
        { id: "pediatric", name: "Pediatric Care" }
    ];

    // Refs for animations
    const headerRef = useRef(null);
    const searchRef = useRef(null);
    const guidesRef = useRef(null);

    // Fetch data with error handling and loading state
    useEffect(() => {
        const fetchGuides = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://backend-6wuz.onrender.com/api/first-aid", {
                    timeout: 5000,
                });
                setGuides(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching guides:", err);
                setError("Failed to load first aid guides. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []);

    // GSAP Animations
    useEffect(() => {
        // Header animation
        gsap.from(headerRef.current, {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // Search bar animation
        gsap.from(searchRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out"
        });

        // Guides animation
        gsap.from(".guide-card", {
            scrollTrigger: {
                trigger: guidesRef.current,
                start: "top center",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    }, []);

    // Filter guides based on search and category
    const filteredGuides = guides.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(search.trim().toLowerCase());
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesBookmarked = !showBookmarkedOnly || bookmarkedGuides.includes(item._id);
        return matchesSearch && matchesCategory && matchesBookmarked;
    });

    const toggleBookmark = (guideId) => {
        setBookmarkedGuides(prev => 
            prev.includes(guideId) 
                ? prev.filter(id => id !== guideId)
                : [...prev, guideId]
        );
    };

    const toggleExpand = (guideId) => {
        setExpandedGuide(expandedGuide === guideId ? null : guideId);
    };

    const shareGuide = (guide) => {
        if (navigator.share) {
            navigator.share({
                title: guide.title,
                text: guide.description,
                url: window.location.href
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 p-6">
            {/* Page Header */}
            <header ref={headerRef} className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-red-600">
                    Emergency First Aid Guide
                </h1>
                <p className="mt-2 text-gray-600">Quick, reliable first aid information</p>
            </header>

            {/* Search and Filter Section */}
            <div ref={searchRef} className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search First Aid Guide (e.g., CPR, Burns)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-red-500 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent 
                                shadow-sm transition duration-200"
                            aria-label="Search first aid topics"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                                ${showBookmarkedOnly ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {showBookmarkedOnly ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                            {showBookmarkedOnly ? 'Show All' : 'Bookmarked'}
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${selectedCategory === category.id 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main ref={guidesRef} className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
                        {error}
                    </div>
                ) : search.trim() === "" && selectedCategory === "all" && !showBookmarkedOnly ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="w-64 h-64 md:w-80 md:h-80">
                            <Lottie
                                animationData={firstAidAnimation}
                                loop={true}
                                autoplay={true}
                            />
                        </div>
                        <p className="text-lg text-gray-600 mt-4 max-w-md text-center">
                            Search for a first aid topic to get step-by-step guidance instantly.
                        </p>
                    </div>
                ) : filteredGuides.length === 0 ? (
                    <div className="text-center text-gray-600 p-8">
                        <p>No guides found. Try a different search term or category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGuides.map((item) => (
                            <article
                                key={item._id}
                                className="guide-card bg-white rounded-xl shadow-md overflow-hidden
                                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => toggleBookmark(item._id)}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                        >
                                            {bookmarkedGuides.includes(item._id) ? (
                                                <BookmarkCheck className="text-red-500" size={20} />
                                            ) : (
                                                <Bookmark className="text-gray-600" size={20} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => shareGuide(item)}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                        >
                                            <Share2 className="text-gray-600" size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* Title and Category */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-semibold text-red-600">
                                            {item.title}
                                        </h2>
                                        <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Quick Info */}
                                    <div className="flex gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            <span>{item.duration || '5-10 min'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            <span>{item.severity || 'Moderate'}</span>
                                        </div>
                                    </div>

                                    {/* Steps Preview */}
                                    <div className="space-y-2">
                                        {item.steps.slice(0, expandedGuide === item._id ? undefined : 2).map((step, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center 
                                                    bg-red-500 text-white rounded-full mr-2 font-bold">
                                                    {index + 1}
                                                </span>
                                                <span className="text-sm text-gray-800">{step}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Expand/Collapse Button */}
                                    {item.steps.length > 2 && (
                                        <button
                                            onClick={() => toggleExpand(item._id)}
                                            className="mt-4 text-sm text-red-600 font-medium flex items-center gap-1"
                                        >
                                            {expandedGuide === item._id ? (
                                                <>
                                                    Show Less
                                                    <ChevronUp size={16} />
                                                </>
                                            ) : (
                                                <>
                                                    Show More
                                                    <ChevronDown size={16} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FirstAidGuide;
