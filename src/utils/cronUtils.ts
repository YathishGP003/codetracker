
import { CronSettings } from '@/types/cronTypes';

export const generateCronExpression = (settings: CronSettings): string => {
  const { hour, minute, frequency } = settings;
  
  switch (frequency) {
    case 'hourly':
      return `${minute} * * * *`;
    case 'daily':
      return `${minute} ${hour} * * *`;
    case 'weekly':
      return `${minute} ${hour} * * 0`; // Sunday
    default:
      return `${minute} ${hour} * * *`;
  }
};
