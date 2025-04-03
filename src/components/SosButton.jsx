import { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const SOSButton = () => {
    const { isAuthenticated, user } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSOS = async () => {
        if (!isAuthenticated || !user) {
            setMessage("Please log in to use the SOS feature.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post('https://backend-6wuz.onrender.com/api/sos/alert', {
                userId: user.sub
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error("Error triggering SOS:", error);
            setMessage("Failed to send SOS alert. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sos-container">
            <button
                onClick={handleSOS}
                disabled={loading}
                className="sos-button"
            >
                🚨 {loading ? "Sending..." : "Trigger SOS"}
            </button>
            {message && <p className="sos-message">{message}</p>}
        </div>
    );
};

export default SOSButton;
