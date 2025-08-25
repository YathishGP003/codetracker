import React from "react";
import { TrendingUp, BarChart3, Users, Award } from "lucide-react";

interface DemoFeaturesProps {
  isDarkMode: boolean;
}

const DemoFeatures: React.FC<DemoFeaturesProps> = ({ isDarkMode }) => {
  const features = [
    {
      icon: TrendingUp,
      title: "Student Progress Tracking",
      description:
        "Monitor every step of your students competitive programming journey",
      details:
        "Get real-time insights into student performance, rating changes, and problem-solving patterns. Track contest participation and celebrate achievements.",
      stats: "📊 10,000+ Active Students",
      bgColor: isDarkMode ? "bg-blue-900/20" : "bg-blue-50",
      borderColor: isDarkMode ? "border-blue-500/30" : "border-blue-200",
      iconBg: "bg-blue-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description:
        "Comprehensive analytics to understand student performance trends",
      details:
        "Interactive charts showing rating progression, problem difficulty analysis, and performance comparisons. Make data-driven decisions for better teaching.",
      stats: "📈 500+ Contest Reports",
      bgColor: isDarkMode ? "bg-green-900/20" : "bg-green-50",
      borderColor: isDarkMode ? "border-green-500/30" : "border-green-200",
      iconBg: "bg-green-500",
    },
    {
      icon: Users,
      title: "Student Management Hub",
      description:
        "Effortlessly manage hundreds of students in one centralized platform",
      details:
        "Add students, track their Codeforces handles, monitor activity levels, and organize them into groups. Perfect for large competitive programming courses.",
      stats: "👥 99.9% Reliability",
      bgColor: isDarkMode ? "bg-purple-900/20" : "bg-purple-50",
      borderColor: isDarkMode ? "border-purple-500/30" : "border-purple-200",
      iconBg: "bg-purple-500",
    },
    {
      icon: Award,
      title: "Smart Engagement Tools",
      description:
        "Keep students motivated with automated reminders and achievements",
      details:
        "Intelligent notification system that celebrates milestones, reminds inactive students, and keeps everyone engaged in their coding journey.",
      stats: "🚀 40% Higher Engagement",
      bgColor: isDarkMode ? "bg-orange-900/20" : "bg-orange-50",
      borderColor: isDarkMode ? "border-orange-500/30" : "border-orange-200",
      iconBg: "bg-orange-500",
    },
  ];

  return (
    <div className="mt-16 text-center">
      <h2
        className={`text-4xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        🎯 Experience These Powerful Features
      </h2>
      <p
        className={`text-xl mb-12 max-w-3xl mx-auto ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Transform your competitive programming classroom with tools designed by
        educators, for educators
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${feature.bgColor} ${feature.borderColor} border-2`}
          >
            <div
              className={`${feature.iconBg} p-4 rounded-xl w-fit mb-6 mx-auto shadow-lg`}
            >
              <feature.icon className="w-8 h-8 text-white" />
            </div>

            <h3
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {feature.title}
            </h3>

            <p
              className={`text-lg mb-4 font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {feature.description}
            </p>

            <p
              className={`text-base leading-relaxed mb-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {feature.details}
            </p>

            <div
              className={`inline-flex items-center px-6 py-3 rounded-full text-base font-bold ${
                isDarkMode
                  ? "bg-gray-800 text-yellow-400 border-2 border-yellow-400/50"
                  : "bg-white text-gray-800 border-2 border-gray-300 shadow-md"
              }`}
            >
              {feature.stats}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`mt-16 p-8 rounded-2xl max-w-4xl mx-auto ${
          isDarkMode
            ? "bg-gradient-to-r from-teal-900/30 to-blue-900/30 border-2 border-teal-500/30"
            : "bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200"
        }`}
      >
        <h4
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          🌟 Ready to Revolutionize Your Teaching?
        </h4>
        <p
          className={`text-lg mb-6 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Join thousands of educators worldwide who have transformed their
          competitive programming courses. Start tracking progress, analyzing
          performance, and inspiring your students today!
        </p>
        <div
          className={`text-base font-semibold ${
            isDarkMode ? "text-teal-400" : "text-teal-600"
          }`}
        >
          ✨ No setup required • 🚀 Instant results • 💯 Proven effective
        </div>
      </div>
    </div>
  );
};

export default DemoFeatures;
