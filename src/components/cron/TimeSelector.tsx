
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface TimeSelectorProps {
  hour: number;
  minute: number;
  onTimeChange: (field: 'hour' | 'minute', value: string) => void;
  disabled?: boolean;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  hour, 
  minute, 
  onTimeChange, 
  disabled 
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className={`text-sm font-medium ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Hour (24h format)
        </Label>
        <Select
          value={hour.toString()}
          onValueChange={(value) => onTimeChange('hour', value)}
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
            {Array.from({ length: 24 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {i.toString().padStart(2, '0')}:00
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className={`text-sm font-medium ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Minute
        </Label>
        <Select
          value={minute.toString()}
          onValueChange={(value) => onTimeChange('minute', value)}
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
            {Array.from({ length: 60 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                :{i.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeSelector;
