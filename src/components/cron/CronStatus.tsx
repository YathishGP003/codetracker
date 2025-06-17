
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { CronSettings } from '@/types/cronTypes';

interface CronStatusProps {
  settings: CronSettings;
  lastSync: string | null;
}

const CronStatus: React.FC<CronStatusProps> = ({ settings, lastSync }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`p-4 rounded-xl ${
      isDarkMode 
        ? 'bg-slate-800/30 border border-slate-700/30' 
        : 'bg-gray-100/50 border border-gray-200/30'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Status
        </span>
        <div className="flex items-center space-x-2">
          {settings.enabled ? (
            <>
              <Play size={14} className="text-green-500" />
              <span className="text-sm text-green-500">Active</span>
            </>
          ) : (
            <>
              <Pause size={14} className="text-gray-500" />
              <span className="text-sm text-gray-500">Inactive</span>
            </>
          )}
        </div>
      </div>
      
      {settings.enabled && (
        <p className={`text-xs ${
          isDarkMode ? 'text-slate-400' : 'text-gray-500'
        }`}>
          Next sync: {settings.frequency} at {settings.hour.toString().padStart(2, '0')}:{settings.minute.toString().padStart(2, '0')}
        </p>
      )}
      
      {lastSync && (
        <p className={`text-xs mt-1 ${
          isDarkMode ? 'text-slate-400' : 'text-gray-500'
        }`}>
          Last global sync: {new Date(lastSync).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default CronStatus;
