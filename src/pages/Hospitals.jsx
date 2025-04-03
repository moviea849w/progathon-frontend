import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, Phone, Clock, Star, X } from 'lucide-react';
// import dotenv from 'dotenv';

// dotenv.config();

// Use the API key directly
const API_KEY = "AIzaSyBClX4lrY7S2FmXZdnwiCHlJqCvt889I-8";

const Hospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Got user location:", position.coords);
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Unable to get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userLocation) {
            fetchHospitals();
        }
    }, [userLocation]);

    const fetchHospitals = async () => {
        try {
            console.log("Fetching hospitals for location:", userLocation);
            const response = await axios.get('https://backend-6wuz.onrender.com/api/nearby-hospitals', {
                params: {
                    lat: userLocation.lat,
                    lng: userLocation.lng
                }
            });
            console.log("Received hospitals data:", response.data);
            if (response.data.results) {
                setHospitals(response.data.results);
            } else {
                setHospitals([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching hospitals:", error);
            setError(error.response?.data?.error || "Failed to fetch nearby hospitals. Please try again later.");
            setLoading(false);
        }
    };

    const handleHospitalClick = (hospital) => {
        setSelectedHospital(hospital);
        setShowMap(true);
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setSelectedHospital(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (hospitals.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    No hospitals found in your area. Please try again later or check your location settings.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Nearby Hospitals</h1>

                {showMap && selectedHospital && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-[80vh] relative">
                            <button
                                onClick={handleCloseMap}
                                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-600" />
                            </button>
                            <div className="absolute top-4 left-4 z-10">
                                <button
                                    onClick={handleCloseMap}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Close Map
                                </button>
                            </div>
                            <LoadScript googleMapsApiKey={API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={{
                                        lat: selectedHospital.geometry.location.lat,
                                        lng: selectedHospital.geometry.location.lng
                                    }}
                                    zoom={15}
                                >
                                    <Marker
                                        position={{
                                            lat: selectedHospital.geometry.location.lat,
                                            lng: selectedHospital.geometry.location.lng
                                        }}
                                    />
                                    {userLocation && (
                                        <Marker
                                            position={userLocation}
                                            icon={{
                                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hospitals.map((hospital) => (
                        <div
                            key={hospital.place_id}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleHospitalClick(hospital)}
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{hospital.name}</h2>

                                <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <p className="text-sm">{hospital.vicinity}</p>
                                </div>

                                {hospital.rating && (
                                    <div className="flex items-center text-yellow-500 mb-2">
                                        <Star className="h-5 w-5 mr-2" />
                                        <span className="text-sm">{hospital.rating} ({hospital.user_ratings_total} reviews)</span>
                                    </div>
                                )}

                                {hospital.opening_hours && (
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Clock className="h-5 w-5 mr-2" />
                                        <p className="text-sm">
                                            {hospital.opening_hours.open_now ? 'Open Now' : 'Closed'}
                                        </p>
                                    </div>
                                )}

                                {hospital.formatted_phone_number && (
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="h-5 w-5 mr-2" />
                                        <a
                                            href={`tel:${hospital.formatted_phone_number}`}
                                            className="text-sm hover:text-red-600"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {hospital.formatted_phone_number}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hospitals;
