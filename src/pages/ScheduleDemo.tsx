import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import { TopNavbar } from "../components/TopNavbar";
import DemoFormFields from "../components/DemoFormFields";
import DemoFeatures from "../components/DemoFeatures";

const ScheduleDemo = () => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo scheduled:", formData);
    alert("Demo scheduled successfully! We will contact you soon.");
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
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
        <TopNavbar />

        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              to="/"
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl mb-6 transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>

            <h1
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Schedule a Demo
            </h1>
            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              See CodeTracker Pro in action! Book a personalized demo to
              discover how our platform can transform your competitive
              programming education.
            </p>
          </div>

          {/* Demo Form */}
          <div className="max-w-2xl mx-auto">
            <div
              className={`rounded-3xl p-8 ${
                isDarkMode
                  ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
                  : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <DemoFormFields
                  formData={formData}
                  onInputChange={handleInputChange}
                  isDarkMode={isDarkMode}
                />

                <button
                  type="submit"
                  className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25"
                >
                  Schedule Demo
                </button>
              </form>
            </div>
          </div>

          <DemoFeatures isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleDemo;
