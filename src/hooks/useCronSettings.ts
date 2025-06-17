
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CronSettings } from '@/types/cronTypes';
import { generateCronExpression } from '@/utils/cronUtils';

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
        const cronSettings = cronData.setting_value as Record<string, any>;
        const lastSyncSettings = syncData?.setting_value as Record<string, any>;
        
        setSettings({
          enabled: cronSettings.enabled || false,
          frequency: cronSettings.frequency || 'daily',
          hour: cronSettings.hour || 2,
          minute: cronSettings.minute || 0
        });
        
        setLastSync(lastSyncSettings?.timestamp || null);
      }
    } catch (error) {
      console.error('Error fetching cron settings:', error);
    }
  };

  const updateSettings = async (newSettings: CronSettings) => {
    setIsLoading(true);
    
    try {
      // Update local settings - cast to Json type
      await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'cron_schedule',
          setting_value: newSettings as any // Cast to satisfy Json type constraint
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
    } catch (error: any) {
      console.error('Error updating cron settings:', error);
      toast.error(`Failed to update schedule: ${error.message}`);
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
