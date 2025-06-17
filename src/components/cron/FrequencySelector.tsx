
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface FrequencySelectorProps {
  frequency: string;
  onFrequencyChange: (frequency: string) => void;
  disabled?: boolean;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ 
  frequency, 
  onFrequencyChange, 
  disabled 
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="space-y-2">
      <Label className={`text-sm font-medium ${
        isDarkMode ? 'text-slate-300' : 'text-gray-700'
      }`}>
        Sync Frequency
      </Label>
      <Select
        value={frequency}
        onValueChange={onFrequencyChange}
        disabled={disabled}
      >
        <SelectTrigger className={`${
          isDarkMode 
            ? 'bg-slate-800/50 border-slate-700/50 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hourly">Every Hour</SelectItem>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FrequencySelector;
