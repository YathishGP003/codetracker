export interface CronSettings {
  enabled: boolean;
  frequency: string;
  hour: number;
  minute: number;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface LastSyncData {
  timestamp: string | null;
  [key: string]: any; // Add index signature for Json compatibility
}
