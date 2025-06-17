
import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Student } from '../types/Student';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sample data - replace with actual data fetching
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phoneNumber: '+1 (555) 123-4567',
      codeforcesHandle: 'alice_codes',
      currentRating: 1547,
      maxRating: 1623,
      lastUpdated: '2 hours ago',
      isActive: true,
      reminderCount: 0,
      emailEnabled: true,
      lastSubmissionDate: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phoneNumber: '+1 (555) 987-6543',
      codeforcesHandle: 'bobsmith_cf',
      currentRating: 1289,
      maxRating: 1345,
      lastUpdated: '5 hours ago',
      isActive: false,
      reminderCount: 2,
      emailEnabled: true,
      lastSubmissionDate: '2024-01-10T14:20:00Z'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phoneNumber: '+1 (555) 456-7890',
      codeforcesHandle: 'carol_d',
      currentRating: 1756,
      maxRating: 1823,
      lastUpdated: '1 hour ago',
      isActive: true,
      reminderCount: 0,
      emailEnabled: false,
      lastSubmissionDate: '2024-01-16T09:15:00Z'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phoneNumber: '+1 (555) 234-5678',
      codeforcesHandle: 'david_w',
      currentRating: 1456,
      maxRating: 1502,
      lastUpdated: '3 days ago',
      isActive: false,
      reminderCount: 5,
      emailEnabled: true,
      lastSubmissionDate: '2024-01-05T16:45:00Z'
    }
  ]);

  const filteredAndSortedStudents = students
    .filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.codeforcesHandle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = sortBy === 'name' ? a.name : a.currentRating;
      const bValue = sortBy === 'name' ? b.name : b.currentRating;
      
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? (aValue as string).localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue as string);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

  const getRatingColor = (rating: number) => {
    if (rating >= 1600) return 'text-purple-400';
    if (rating >= 1400) return 'text-blue-400';
    if (rating >= 1200) return 'text-green-400';
    return 'text-gray-400';
  };

  const handleSort = (field: 'name' | 'rating') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b bg-slate-950/80 border-slate-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">CT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                  CodeTracker Pro
                </h1>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/signin" className="text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Students
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover talented competitive programmers and their achievements on various platforms
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or handle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSort('name')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                  sortBy === 'name'
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>Name</span>
                <ArrowUpDown size={16} />
              </button>
              
              <button
                onClick={() => handleSort('rating')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                  sortBy === 'rating'
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>Rating</span>
                <ArrowUpDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedStudents.map((student) => (
            <div
              key={student.id}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:border-teal-500/30"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-white ${
                  student.isActive 
                    ? 'bg-gradient-to-br from-green-500 to-teal-500' 
                    : 'bg-gradient-to-br from-gray-500 to-slate-500'
                }`}>
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                      {student.codeforcesHandle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Platform</span>
                  <span className="text-white font-medium">Codeforces</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Current Rating</span>
                  <span className={`font-bold text-lg ${getRatingColor(student.currentRating)}`}>
                    {student.currentRating}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Max Rating</span>
                  <span className={`font-bold ${getRatingColor(student.maxRating)}`}>
                    {student.maxRating}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800/50">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    student.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
