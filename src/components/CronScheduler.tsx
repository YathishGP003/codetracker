
import React from 'react';
import { Clock, Settings2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useCronSettings } from '@/hooks/useCronSettings';
import CronToggle from './cron/CronToggle';
import FrequencySelector from './cron/FrequencySelector';
import TimeSelector from './cron/TimeSelector';
import CronStatus from './cron/CronStatus';

const CronScheduler = () => {
  const { isDarkMode } = useDarkMode();
  const { settings, lastSync, isLoading, updateSettings } = useCronSettings();

  const handleToggleEnabled = (enabled: boolean) => {
    updateSettings({ ...settings, enabled });
  };

  const handleFrequencyChange = (frequency: string) => {
    updateSettings({ ...settings, frequency });
  };

  const handleTimeChange = (field: 'hour' | 'minute', value: string) => {
    updateSettings({ ...settings, [field]: parseInt(value) });
  };

  return (
    <Card className={`relative overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-900/70 border-slate-800/50 shadow-2xl' 
        : 'bg-white/90 border-gray-200/50 shadow-xl'
    } backdrop-blur-xl transition-all duration-300 hover:shadow-2xl`}>
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className={`flex items-center space-x-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold">Automated Sync Scheduler</span>
            <div className={`flex items-center space-x-2 mt-1 ${
              settings.enabled ? 'text-green-500' : 'text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                settings.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs font-medium">
                {settings.enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardTitle>
        <CardDescription className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
          Configure when Codeforces data should be automatically synced for all students
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        <div className={`p-4 rounded-xl ${
          isDarkMode 
            ? 'bg-slate-800/40 border border-slate-700/30' 
            : 'bg-gray-50/80 border border-gray-200/50'
        }`}>
          <CronToggle
            enabled={settings.enabled}
            onToggle={handleToggleEnabled}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4">
          <FrequencySelector
            frequency={settings.frequency}
            onFrequencyChange={handleFrequencyChange}
            disabled={!settings.enabled || isLoading}
          />

          {settings.frequency !== 'hourly' && (
            <TimeSelector
              hour={settings.hour}
              minute={settings.minute}
              onTimeChange={handleTimeChange}
              disabled={!settings.enabled || isLoading}
            />
          )}
        </div>

        <CronStatus settings={settings} lastSync={lastSync} />
      </CardContent>
    </Card>
  );
};

export default CronScheduler;
