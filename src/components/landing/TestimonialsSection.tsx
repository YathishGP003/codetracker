
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialsSectionProps {
  isDarkMode: boolean;
}

const TestimonialsSection = ({ isDarkMode }: TestimonialsSectionProps) => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Programming Instructor',
      avatar: 'SC',
      content: 'This platform has revolutionized how I track my students\' progress. The automated insights save me hours every week.',
      rating: 5
    },
    {
      name: 'David Kumar',
      role: 'Competitive Programming Coach',
      avatar: 'DK',
      content: 'The contest analysis and problem-solving heatmaps help me identify exactly where each student needs improvement.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'CS Department Head',
      avatar: 'ER',
      content: 'Finally, a tool that makes competitive programming education scalable and data-driven.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Loved by
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            {' '}Educators Worldwide
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`p-8 rounded-3xl transition-all duration-500 hover:scale-105 ${
              isDarkMode 
                ? 'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50' 
                : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
            }`}
          >
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <p className={`text-lg mb-6 leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {testimonial.avatar}
              </div>
              <div>
                <div className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {testimonial.name}
                </div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  {testimonial.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
