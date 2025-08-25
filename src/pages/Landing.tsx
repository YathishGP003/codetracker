import React from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navigation from "../components/landing/Navigation";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const Landing = () => {
  const { isDarkMode, setDarkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100"
      }`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <Navigation isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
        <HeroSection isDarkMode={isDarkMode} />
        <FeaturesSection isDarkMode={isDarkMode} />
        <TestimonialsSection isDarkMode={isDarkMode} />
        <CTASection />
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Landing;
