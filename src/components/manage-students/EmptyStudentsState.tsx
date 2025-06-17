
import React from 'react';
import { Users } from 'lucide-react';
import { AddStudentDialog } from '@/components/AddStudentDialog';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface EmptyStudentsStateProps {
  searchTerm: string;
}

export const EmptyStudentsState = ({ searchTerm }: EmptyStudentsStateProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="text-center py-12">
      <Users className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'} mb-4`} />
      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'} mb-2`}>
        {searchTerm ? 'No students found' : 'No students yet'}
      </h3>
      <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mb-4`}>
        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first student.'}
      </p>
      {!searchTerm && <AddStudentDialog />}
    </div>
  );
};
