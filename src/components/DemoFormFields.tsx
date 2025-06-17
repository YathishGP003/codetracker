
import React from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

interface DemoFormFieldsProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isDarkMode: boolean;
}

const DemoFormFields: React.FC<DemoFormFieldsProps> = ({ formData, onInputChange, isDarkMode }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Full Name *
          </label>
          <div className="relative">
            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Email Address *
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Enter your email"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Phone Number
          </label>
          <div className="relative">
            <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Organization
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={onInputChange}
            className={`w-full px-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="Your school/company"
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={onInputChange}
          className={`w-full px-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-700 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <option value="">Select your role</option>
          <option value="teacher">Teacher/Instructor</option>
          <option value="student">Student</option>
          <option value="admin">Administrator</option>
          <option value="parent">Parent</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Preferred Date
          </label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={onInputChange}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Preferred Time
          </label>
          <div className="relative">
            <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={onInputChange}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="">Select time</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 8 PM)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Additional Message
        </label>
        <div className="relative">
          <MessageSquare className={`absolute left-3 top-4 w-5 h-5 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-400'
          }`} />
          <textarea
            name="message"
            value={formData.message}
            onChange={onInputChange}
            rows={4}
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="Tell us about your specific needs or questions..."
          />
        </div>
      </div>
    </>
  );
};

export default DemoFormFields;
