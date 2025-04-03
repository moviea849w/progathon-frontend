import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const SosPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const userId = isAuthenticated ? user.sub : null;

  // State management
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    medicalHistory: "",
    emergencyContacts: [{ name: "", phone: "" }],
  });

  // Fetch user data on mount
  useEffect(() => {
    if (userId) {
      axios
        .get(`https://backend-6wuz.onrender.com/api/sos/${userId}`)
        .then((res) => {
          if (res.data) {
            setFormData({
              name: res.data.name || "",
              phone: res.data.phone || "",
              email: res.data.email || "",
              bloodGroup: res.data.bloodGroup || "",
              medicalHistory: res.data.medicalHistory || "",
              emergencyContacts: res.data.emergencyContacts || [{ name: "", phone: "" }],
            });
          }
        })
        .catch((err) => console.error("Error fetching SOS data:", err));
    }
  }, [userId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle emergency contact changes
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index][field] = value;
    setFormData((prev) => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  // Add new emergency contact
  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", phone: "" }],
    }));
  };

  // Remove emergency contact
  const removeContact = (index) => {
    if (formData.emergencyContacts.length > 1) {
      setFormData((prev) => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
      }));
    }
  };

  // Save form data
  const handleSave = async () => {
    if (!userId) {
      alert("Please log in to save your emergency information!");
      return;
    }

    try {
      const payload = { userId, ...formData };
      await axios.post("http://localhost:5000/api/sos", payload);
      alert("Emergency information saved successfully!");
    } catch (error) {
      console.error("Error saving SOS data:", error);
      alert("Failed to save emergency information.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-red-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Emergency SOS Information</h2>
          <p className="text-center text-sm mt-2">Store your critical information securely</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🩺</span> Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <textarea
                name="medicalHistory"
                placeholder="Medical History (e.g., Diabetes, Allergies)"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </section>

          {/* Emergency Contacts */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🚨</span> Emergency Contacts
            </h3>
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, "name", e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {formData.emergencyContacts.length > 1 && (
                  <button
                    onClick={() => removeContact(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addContact}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <span className="mr-2">➕</span> Add Another Contact
            </button>
          </section>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Save Emergency Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default SosPage;
