
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  'https://lktxfhtvxygsigealzif.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdHhmaHR2eHlnc2lnZWFsemlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTcwNjQsImV4cCI6MjA2NTQ3MzA2NH0.z9cEDipmxYm_hTGaI3Al1A4MlCC2OKMSvRY4ARpIGtg'
);

serve(async (req) => {
  const startTime = new Date();
  console.log('Enhanced scheduled sync triggered at:', startTime.toISOString());

  try {
    // Get current sync settings
    const { data: syncSettings } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'cron_schedule')
      .single();

    const settings = syncSettings?.setting_value as any;
    
    if (!settings?.enabled) {
      console.log('Scheduled sync is disabled, skipping...');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Scheduled sync is disabled',
        timestamp: startTime.toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call the enhanced sync function
    const syncResponse = await supabase.functions.invoke('sync-codeforces-data', {
      body: { 
        syncAll: true, 
        includeContests: true,
        scheduledSync: true 
      }
    });

    if (syncResponse.error) {
      throw new Error(syncResponse.error.message);
    }

    const syncData = syncResponse.data;
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Update last global sync timestamp with detailed info
    await supabase
      .from('app_settings')
      .upsert({
        setting_key: 'last_global_sync',
        setting_value: { 
          timestamp: endTime.toISOString(),
          duration: duration,
          studentsProcessed: syncData.summary?.totalStudents || 0,
          successful: syncData.summary?.successful || 0,
          failed: syncData.summary?.failed || 0
        }
      });

    // Log comprehensive sync results
    await supabase
      .from('sync_logs')
      .insert({
        student_id: null,
        sync_type: 'scheduled',
        status: 'success',
        message: `Scheduled sync completed in ${duration}ms. Processed ${syncData.summary?.totalStudents || 0} students (${syncData.summary?.successful || 0} successful, ${syncData.summary?.failed || 0} failed)`,
        contests_fetched: syncData.results?.reduce((sum: number, r: any) => sum + (r.contestsFetched || 0), 0) || 0,
        problems_fetched: syncData.results?.reduce((sum: number, r: any) => sum + (r.problemsFetched || 0), 0) || 0
      });

    console.log(`Enhanced scheduled sync completed successfully in ${duration}ms`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Enhanced scheduled sync completed',
      timestamp: endTime.toISOString(),
      duration: duration,
      summary: syncData.summary || {},
      details: syncData.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    console.error('Error in enhanced scheduled sync:', error);
    
    // Log detailed error
    await supabase
      .from('sync_logs')
      .insert({
        student_id: null,
        sync_type: 'scheduled',
        status: 'error',
        message: `Scheduled sync failed after ${duration}ms: ${error.message}`,
        contests_fetched: 0,
        problems_fetched: 0
      });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      timestamp: endTime.toISOString(),
      duration: duration
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
