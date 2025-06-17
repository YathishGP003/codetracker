
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className={`rounded-3xl p-12 text-center bg-gradient-to-r from-teal-500 to-blue-600 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are already using CodeTracker Pro to enhance their competitive programming courses.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-2xl bg-white text-teal-600 font-semibold flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg"
            >
              <span>Start Your Journey</span>
              <ArrowRight size={20} />
            </Link>
            
            <Link
              to="/schedule-demo"
              className="px-8 py-4 rounded-2xl border-2 border-white text-white font-semibold flex items-center space-x-3 transition-all duration-300 hover:bg-white hover:text-teal-600 text-lg"
            >
              <span>Schedule Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
