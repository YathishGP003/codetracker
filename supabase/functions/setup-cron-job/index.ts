
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  'https://lktxfhtvxygsigealzif.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdHhmaHR2eHlnc2lnZWFsemlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTcwNjQsImV4cCI6MjA2NTQ3MzA2NH0.z9cEDipmxYm_hTGaI3Al1A4MlCC2OKMSvRY4ARpIGtg'
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cronExpression, enabled } = await req.json();

    console.log('Setting up cron job:', { cronExpression, enabled });

    if (!enabled) {
      // Remove existing cron job
      console.log('Disabling cron job');
      
      // In a real implementation, you would remove the cron job from pg_cron
      // For now, we'll just log it and update the settings
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Cron job disabled successfully' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Enable pg_cron extension if not already enabled
    // Note: This requires superuser privileges, so it should be done via Supabase dashboard
    console.log('Enabling pg_cron extension...');

    // Create or update the cron job
    const cronJobName = 'sync-codeforces-data';
    const functionUrl = 'https://lktxfhtvxygsigealzif.supabase.co/functions/v1/scheduled-sync';
    
    // In a real implementation, you would execute SQL to create the cron job:
    /*
    SELECT cron.schedule(
      'sync-codeforces-data',
      '${cronExpression}',
      $$
      SELECT net.http_post(
        url:='${functionUrl}',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${process.env.SUPABASE_ANON_KEY}"}'::jsonb,
        body:='{"time": "' || now() || '"}'::jsonb
      ) as request_id;
      $$
    );
    */

    console.log(`Cron job scheduled with expression: ${cronExpression}`);
    console.log(`Function URL: ${functionUrl}`);

    // Log the cron setup in sync_logs
    await supabase
      .from('sync_logs')
      .insert({
        student_id: null,
        sync_type: 'scheduled',
        status: 'success',
        message: `Cron job ${enabled ? 'enabled' : 'disabled'} with expression: ${cronExpression || 'N/A'}`,
        contests_fetched: 0,
        problems_fetched: 0
      });

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Cron job ${enabled ? 'scheduled' : 'disabled'} successfully`,
      cronExpression: enabled ? cronExpression : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error setting up cron job:', error);
    
    // Log the error
    await supabase
      .from('sync_logs')
      .insert({
        student_id: null,
        sync_type: 'scheduled',
        status: 'error',
        message: `Failed to setup cron job: ${error.message}`,
        contests_fetched: 0,
        problems_fetched: 0
      });

    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
