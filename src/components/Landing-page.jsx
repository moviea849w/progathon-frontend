// Home.jsx
import { useState, useRef, useEffect } from "react";
import {
  Heart,
  AlertCircle,
  MapPin,
  Wifi,
  Mic,
  MessageSquare,
  Bell,
  ArrowRight,
  Phone,
  Clock,
  CheckCircle2,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Edit
} from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";


import SosButton from "./SosButton";

import ChatPopup from "./Chat/Popup"; // Adjust path as needed
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Refs for animation elements
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Hero section animations
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    .from(".hero-subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")
    .from(".hero-buttons", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")
    .from(".hero-image", {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8");

    // Features section animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });

    // Stats section animations
    gsap.from(".stat-item", {
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)"
    });

    // How it works section animations
    gsap.from(".how-it-works-item", {
      scrollTrigger: {
        trigger: howItWorksRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });

    // CTA section animations
    gsap.from(".cta-content", {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".cta-image", {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      x: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    // Cleanup function
    return () => {
      heroTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setProfileDropdownOpen(false);
  };

  const handleUpdateInfoClick = () => {
    navigate('/sos');
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setProfileDropdownOpen(false);
  };

  const handleHospitalsClick = () => {
    navigate('/hospitals');
    setMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <ChatPopup />
      <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
       
        <header className="sticky top-0 z-50 w-full border-b bg-white">
          <div className="container mx-auto px-4 flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">MedAI</span>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 items-center ">
              <a href="#features" className="text-sm font-medium hover:text-red-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-red-600 transition-colors">
                How It Works
              </a>
              <Link to="/first-aid" className="text-sm font-medium hover:text-red-600 transition-colors">
                Guide
              </Link>
              <Link to="/hospitals" className="mx-4">Nearby Hospitals</Link>
              <SosButton />


              {!isAuthenticated ? (
                <button onClick={() => loginWithRedirect()} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                  Login
                </button>
              ) : (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </button>
                      <button
                        onClick={handleUpdateInfoClick}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Edit className="h-4 w-4" />
                        Update Information
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t fixed inset-x-0 bottom-0 top-16 overflow-y-auto">
              <div className="px-4 py-4">
                {/* Main Navigation Links */}
                <div className="space-y-2 mb-4">
                  <a href="#features" className="block text-sm font-medium hover:text-red-600 transition-colors py-2">
                    Features
                  </a>
                  <a href="#how-it-works" className="block text-sm font-medium hover:text-red-600 transition-colors py-2">
                    How It Works
                  </a>
                  <Link to="/first-aid" className="block text-sm font-medium hover:text-red-600 transition-colors py-2">
                    Guide
                  </Link>
                  <Link to="/hospitals" className="block text-sm font-medium hover:text-red-600 transition-colors py-2">
                    Nearby Hospitals
                  </Link>
                </div>

                {/* SOS Button Section */}
                <div className="py-4 border-y border-gray-100 my-4">
                  <SosButton />
                </div>

                {/* Authentication Section */}
                <div className="space-y-4">
                  {!isAuthenticated ? (
                    <button 
                      onClick={() => loginWithRedirect()} 
                      className="w-full px-4 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                    >
                      Login
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
                          {user?.picture ? (
                            <img
                              src={user.picture}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">View Profile</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/sos"
                          className="flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Edit className="h-4 w-4" />
                          Update Information
                        </Link>
                        <button
                          onClick={() => {
                            logout({ logoutParams: { returnTo: window.location.origin } });
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors py-2 w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 md:py-32 bg-gradient-to-b from-red-50 to-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="hero-title inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                Emergency Response Online
              </div>
              <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight">
                Instant Medical Guidance Web Platform
              </h1>
              <p className="hero-subtitle text-lg text-gray-600 max-w-xl">
                Access AI-powered emergency assistance, real-time first-aid instructions, and hospital locator
                directly from your browser - no installation needed.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button className="px-6 py-3 rounded-md border border-red-600 text-red-600 hover:bg-red-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hero-image flex-1 relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-800">
                  <img
                    src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Medical emergency interface"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Emergency Alert</p>
                      <p className="text-xs text-gray-500">Access help instantly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Stats */}
        <section ref={statsRef} className="py-12 bg-red-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="stat-item">
                <p className="text-4xl font-bold">Instant</p>
                <p className="text-sm opacity-80">Access to Emergency Tools</p>
              </div>
              <div className="stat-item">
                <p className="text-4xl font-bold">24/7</p>
                <p className="text-sm opacity-80">AI Assistance Available</p>
              </div>
              <div className="stat-item">
                <p className="text-4xl font-bold">100%</p>
                <p className="text-sm opacity-80">Web-Based Solution</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Critical Features When You Need Them</h2>
              <p className="text-gray-600">
                Our web-based platform delivers instant emergency medical assistance right in your browser,
                accessible from any device.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Emergency Alert System</h3>
                <p className="text-gray-600">
                  Instantly notify emergency contacts with your location and situation through our web interface.
                </p>
              </div>

              <div className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Medical Chat</h3>
                <p className="text-gray-600">
                  Get real-time, personalized first-aid guidance from our AI directly in your browser.
                </p>
              </div>

              <div className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Voice Assistance</h3>
                <p className="text-gray-600">
                  Use voice commands for hands-free operation during emergencies via web audio support.
                </p>
              </div>

              <div className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Wifi className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Web-Optimized Access</h3>
                <p className="text-gray-600">
                  Fast-loading interface ensures immediate access to critical tools from any internet-connected device.
                </p>
              </div>

              <div className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hospital Finder</h3>
                <p className="text-gray-600">
                  Locate nearby medical facilities with real-time directions using web-based mapping.
                </p>
              </div>

              <div className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Health Profile</h3>
                <p className="text-gray-600">
                  Securely store and share your medical information with responders through our web platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section ref={howItWorksRef} id="how-it-works" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How MedAI Web Works</h2>
              <p className="text-gray-600">
                Access our intuitive platform instantly through your browser for rapid emergency response.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="how-it-works-item flex flex-col items-center text-center">
                <img
                  src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg"
                  alt="Emergency situation"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold mb-2">Report Emergency</h3>
                <p className="text-gray-600">
                  Quickly input your emergency details via text or voice in our web interface.
                </p>
              </div>

              <div className="how-it-works-item flex flex-col items-center text-center">
                <img
                  src="https://images.pexels.com/photos/6627354/pexels-photo-6627354.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Medical guidance"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold mb-2">Receive Guidance</h3>
                <p className="text-gray-600">
                  Get instant AI-powered first-aid instructions tailored to your situation.
                </p>
              </div>

              <div className="how-it-works-item flex flex-col items-center text-center">
                <img
                  src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg"
                  alt="Emergency help"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold mb-2">Get Help</h3>
                <p className="text-gray-600">
                  Connect with emergency services and locate hospitals directly from the web platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started CTA */}
        <section ref={ctaRef} id="get-started" className="py-20 bg-red-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="cta-content max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Any Emergency</h2>
                <p className="text-lg opacity-90 mb-8">
                  Access MedAI instantly through your browser and be prepared for medical emergencies anytime,
                  anywhere - no downloads required.
                </p>
                <button className="px-6 py-3 rounded-md bg-white text-red-600 hover:bg-gray-100 transition-colors flex items-center">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
              <div className="cta-image relative">
                <img
                  src="https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Medical technology"
                  className="w-64 h-64 rounded-full object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span className="text-xl font-bold">MedAI</span>
                </div>
                <p className="text-gray-400">
                  Web-based emergency medical response and first-aid guidance platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} MedAI. All rights reserved.</p>
              <p className="mt-2 text-sm">
                Not a substitute for professional medical advice. Consult healthcare providers for medical concerns.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}