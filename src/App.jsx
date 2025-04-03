import React from 'react';
// import ModernEmergencyGuideLP from './components/landing-page';
import Home from './components/Landing-page';
import { Routes, Route } from "react-router-dom";
import FirstAidGuide from './pages/FirstAidGuide';
import ChatUI from './components/Chat/Chat-ui';
// import NearbyHospitals from './pages/Hospitals';
// import LandingPage from './components/Landing-page'; 
import SosPage from './pages/SosPage';
import UserProfile from './pages/Userprofile';
import Hospitals from './pages/Hospitals';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/first-aid" element={<FirstAidGuide />} />
      <Route path="/chat" element={<ChatUI />} />
      <Route path="/sos" element={<SosPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/hospitals" element={<Hospitals />} />
    </Routes>
  );
};

export default App;
