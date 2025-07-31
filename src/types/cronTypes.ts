export interface CronSettings {
  enabled: boolean;
  frequency: string;
  hour: number;
  minute: number;
  [key: string]: any; 
}

export interface LastSyncData {
  timestamp: string | null;
  [key: string]: any; 
}
