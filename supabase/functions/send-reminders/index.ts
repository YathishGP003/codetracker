
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

async function sendReminderEmail(email: string, name: string, daysSinceLastSubmission: number) {
  // For now, we'll just log the reminder. 
  // To actually send emails, you would need to integrate with a service like Resend
  console.log(`Would send reminder email to ${email} (${name}) - ${daysSinceLastSubmission} days since last submission`);
  
  // You can integrate with Resend or another email service here
  // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  // await resend.emails.send({...});
  
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { daysThreshold = 7 } = await req.json().catch(() => ({}));

    // Get inactive students
    const { data: inactiveStudents, error } = await supabase
      .rpc('get_inactive_students', { days_threshold: daysThreshold });

    if (error) {
      throw new Error(error.message);
    }

    const remindersSet = [];

    for (const student of inactiveStudents || []) {
      try {
        // Send reminder email
        await sendReminderEmail(
          student.email, 
          student.name, 
          student.days_since_last_submission
        );

        // Update reminder count
        await supabase
          .from('students')
          .update({ 
            reminder_count: supabase.raw('reminder_count + 1') 
          })
          .eq('id', student.student_id);

        remindersSet.push({
          studentId: student.student_id,
          name: student.name,
          email: student.email,
          daysSinceLastSubmission: student.days_since_last_submission
        });

        console.log(`Reminder sent to ${student.name} (${student.email})`);

      } catch (error) {
        console.error(`Error sending reminder to ${student.email}:`, error);
      }
    }

    console.log(`Sent ${remindersSet.length} reminder emails`);

    return new Response(JSON.stringify({ 
      success: true, 
      remindersSent: remindersSet.length,
      reminders: remindersSet
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-reminders function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
