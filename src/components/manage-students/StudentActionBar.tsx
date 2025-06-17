
import React from 'react';
import { Search, Download, Upload, Users } from 'lucide-react';
import { AddStudentDialog } from '@/components/AddStudentDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface StudentActionBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSyncAll: () => void;
  onExportCSV: () => void;
  isSyncing: boolean;
}

export const StudentActionBar = ({
  searchTerm,
  setSearchTerm,
  onSyncAll,
  onExportCSV,
  isSyncing
}: StudentActionBarProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`rounded-2xl p-6 mb-8 ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <AddStudentDialog />
          
          <Button
            onClick={onSyncAll}
            disabled={isSyncing}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            <Users size={16} className="mr-2" />
            {isSyncing ? 'Syncing All...' : 'Sync All'}
          </Button>
          
          <Button variant="outline" onClick={onExportCSV}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          
          <Button variant="outline">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};
