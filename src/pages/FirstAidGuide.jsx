import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import firstAidAnimation from "../assets/animations/animation1.json";

const FirstAidGuide = () => {
    const [guides, setGuides] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data with error handling and loading state
    useEffect(() => {
        const fetchGuides = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/api/first-aid", {
                    timeout: 5000, // Add timeout to prevent hanging
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

    // Debounced search filtering
    const filteredGuides = guides.filter((item) =>
        item.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
            {/* Page Header */}
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-red-600">
                    Emergency First Aid Guide
                </h1>
                <p className="mt-2 text-gray-600">Quick, reliable first aid information</p>
            </header>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search First Aid Guide (e.g., CPR, Burns)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-3 border-2 border-red-500 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent 
                        shadow-sm transition duration-200"
                    aria-label="Search first aid topics"
                />
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
                        {error}
                    </div>
                ) : search.trim() === "" ? (
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
                        <p>No guides found for "{search}". Try a different search term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGuides.map((item) => (
                            <article
                                key={item._id}
                                className="bg-white border-2 border-red-500 rounded-lg shadow-md p-5 
                                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image */}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-48 object-cover rounded-md border border-gray-200 mb-4"
                                    loading="lazy"
                                />

                                {/* Title */}
                                <h2 className="text-xl font-semibold text-red-600 mb-2">
                                    {item.title}
                                </h2>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {item.description}
                                </p>

                                {/* Steps */}
                                <ul className="space-y-2 text-sm text-gray-800">
                                    {item.steps.map((step, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center 
                                                bg-red-500 text-white rounded-full mr-2 font-bold">
                                                {index + 1}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FirstAidGuide;