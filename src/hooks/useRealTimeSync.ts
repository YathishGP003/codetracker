
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logError } from '@/lib/utils';

interface SyncStatus {
  isActive: boolean;
  lastSync: string | null;
  nextSync: string | null;
  interval: number; // in minutes
}

interface SyncSettings {
  isActive: boolean;
  lastSync: string | null;
  nextSync: string | null;
  interval: number;
}

export const useRealTimeSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isActive: false,
    lastSync: null,
    nextSync: null,
    interval: 30 // Default 30 minutes
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch current sync status
  const fetchSyncStatus = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'realtime_sync')
        .single();

      if (data?.setting_value) {
        const settings = data.setting_value as SyncSettings;
        setSyncStatus({
          isActive: settings.isActive || false,
          lastSync: settings.lastSync || null,
          nextSync: settings.nextSync || null,
          interval: settings.interval || 30
        });
      }
    } catch (error) {
      logError('useRealTimeSync.fetchSyncStatus', error);
    }
  }, []);

  // Start real-time sync
  const startRealTimeSync = useCallback(async (intervalMinutes: number = 30) => {
    setIsLoading(true);
    
    try {
      const nextSync = new Date(Date.now() + intervalMinutes * 60 * 1000).toISOString();
      
      const newStatus = {
        isActive: true,
        lastSync: syncStatus.lastSync,
        nextSync,
        interval: intervalMinutes
      };

      await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'realtime_sync',
          setting_value: newStatus
        });

      setSyncStatus(newStatus);
      toast.success(`Real-time sync started (every ${intervalMinutes} minutes)`);
      
      // Trigger immediate sync
      performSync();
      
    } catch (error) {
      logError('useRealTimeSync.startRealTimeSync', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to start real-time sync: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [syncStatus.lastSync]);

  // Stop real-time sync
  const stopRealTimeSync = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const newStatus = {
        ...syncStatus,
        isActive: false,
        nextSync: null
      };

      await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'realtime_sync',
          setting_value: newStatus
        });

      setSyncStatus(newStatus);
      toast.success('Real-time sync stopped');
      
    } catch (error) {
      logError('useRealTimeSync.stopRealTimeSync', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to stop real-time sync: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [syncStatus]);

  // Perform sync
  const performSync = useCallback(async () => {
    try {
      
      const { data, error } = await supabase.functions.invoke('sync-codeforces-data', {
        body: { syncAll: true, includeContests: true }
      });

      if (error) throw error;

      const now = new Date().toISOString();
      const nextSync = new Date(Date.now() + syncStatus.interval * 60 * 1000).toISOString();
      
      const updatedStatus = {
        ...syncStatus,
        lastSync: now,
        nextSync: syncStatus.isActive ? nextSync : null
      };

      await supabase
        .from('app_settings')
        .upsert({
          setting_key: 'realtime_sync',
          setting_value: updatedStatus
        });

      setSyncStatus(updatedStatus);

      if (data.success) {
        const { summary } = data;
        toast.success(`Sync completed: ${summary.successful}/${summary.totalStudents} students updated`);
      }
      
    } catch (error) {
      logError('useRealTimeSync.performSync', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Sync failed: ${errorMessage}`);
    }
  }, [syncStatus]);

  // Set up polling interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (syncStatus.isActive && syncStatus.interval > 0) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const nextSyncTime = syncStatus.nextSync ? new Date(syncStatus.nextSync).getTime() : 0;
        
        if (nextSyncTime > 0 && now >= nextSyncTime) {
          performSync();
        }
      }, 60000); // Check every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [syncStatus.isActive, syncStatus.interval, syncStatus.nextSync, performSync]);

  // Load initial status
  useEffect(() => {
    fetchSyncStatus();
  }, [fetchSyncStatus]);

  return {
    syncStatus,
    isLoading,
    startRealTimeSync,
    stopRealTimeSync,
    performSync,
    fetchSyncStatus
  };
};
