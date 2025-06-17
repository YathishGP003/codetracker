
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface CronToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

const CronToggle: React.FC<CronToggleProps> = ({ enabled, onToggle, disabled }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex items-center justify-between">
      <div>
        <Label className={`text-sm font-medium ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Automatic Sync
        </Label>
        <p className={`text-xs ${
          isDarkMode ? 'text-slate-400' : 'text-gray-500'
        }`}>
          Enable or disable scheduled data synchronization
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
};

export default CronToggle;
