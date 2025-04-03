import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const SosProfile = () => {
    const { user, isAuthenticated } = useAuth0();
    const [sosInfo, setSosInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            axios.get(`http://localhost:5000/api/sos/${user.sub}`)
                .then((res) => {
                    setSosInfo(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setSosInfo(null);
                    setLoading(false);
                });
        }
    }, [user, isAuthenticated]);

    if (!isAuthenticated) return <p>Please log in to view your SOS profile.</p>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="p-6 max-w-2xl w-full bg-white shadow-md rounded-lg border border-red-200">
                <h1 className="text-3xl font-bold text-red-600 text-center mb-6">Emergency SOS Profile</h1>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : sosInfo ? (
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded">
                                <p className="font-semibold text-gray-700">Name:</p>
                                <p className="text-gray-900">{sosInfo.name}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <p className="font-semibold text-gray-700">Phone:</p>
                                <p className="text-gray-900">{sosInfo.phone}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <p className="font-semibold text-gray-700">Email:</p>
                                <p className="text-gray-900">{sosInfo.email}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <p className="font-semibold text-gray-700">Blood Group:</p>
                                <p className="text-gray-900">{sosInfo.bloodGroup}</p>
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded">
                            <p className="font-semibold text-gray-700">Medical History:</p>
                            <p className="text-gray-900">{sosInfo.medicalHistory || "No medical history provided"}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded">
                            <h2 className="font-semibold text-gray-700 mb-2">Emergency Contacts:</h2>
                            {sosInfo.emergencyContacts && sosInfo.emergencyContacts.length > 0 ? (
                                <ul className="space-y-2">
                                    {sosInfo.emergencyContacts.map((contact, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            <span className="font-medium">{contact.name}</span>
                                            <span className="mx-2">-</span>
                                            <span>{contact.phone}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No emergency contacts added</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No emergency info found. Please add your details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SosProfile;
