
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CronSettings } from '@/types/cronTypes';
import { generateCronExpression } from '@/utils/cronUtils';
import { logError } from '@/lib/utils';

interface CronSettingsData extends CronSettings {
  enabled: boolean;
  frequency: string;
  hour: number;
  minute: number;
}

interface LastSyncData {
  timestamp: string;
}

export const useCronSettings = () => {
  const [settings, setSettings] = useState<CronSettings>({
    enabled: false,
    frequency: 'daily',
    hour: 2,
    minute: 0
  });
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  const fetchCurrentSettings = async () => {
    try {
      const { data: cronData } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'cron_schedule')
        .single();

      const { data: syncData } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'last_global_sync')
        .single();

      if (cronData?.setting_value) {
        const cronSettings = cronData.setting_value as CronSettingsData;
        const lastSyncSettings = syncData?.setting_value as LastSyncData;
        
        setSettings({
          enabled: cronSettings.enabled || false,
          frequency: cronSettings.frequency || 'daily',
          hour: cronSettings.hour || 2,
          minute: cronSettings.minute || 0
        });
        
        setLastSync(lastSyncSettings?.timestamp || null);
      }
    } catch (error) {
      logError('useCronSettings.fetchCurrentSettings', error);
    }
  };

  const updateSettings = async (newSettings: CronSettings) => {
    setIsLoading(true);
    
    try {
      // Update local settings
      await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'cron_schedule',
          setting_value: newSettings as CronSettingsData
        });

      // Generate cron expression
      const cronExpression = generateCronExpression(newSettings);
      
      // Call the setup-cron-job function
      const { data, error } = await supabase.functions.invoke('setup-cron-job', {
        body: {
          cronExpression,
          enabled: newSettings.enabled
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        setSettings(newSettings);
      } else {
        toast.error(data.error || 'Failed to update cron job');
      }
    } catch (error) {
      logError('useCronSettings.updateSettings', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update schedule: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    lastSync,
    isLoading,
    updateSettings
  };
};
