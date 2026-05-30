import { supabaseAdmin } from './supabase';
import { cookies } from 'next/headers';

/**
 * Log an admin action to database.
 * Logs are attributed to the logged-in admin user.
 * 
 * @param {string} action E.g., 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE'
 * @param {string} details Description of the specific action
 */
export async function logAdminAction(action, details) {
  try {
    // Attempt to identify username from session settings
    let username = 'atmosphere_admin';
    try {
      const { data: settings } = await supabaseAdmin
        .from('admin_settings')
        .select('username')
        .eq('id', 'admin_user')
        .maybeSingle();

      if (settings?.username) {
        username = settings.username;
      }
    } catch (err) {
      // Fallback to default
    }

    const logEntry = {
      user: username,
      action: action.toUpperCase(),
      details: details,
      created_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('admin_activity_logs')
      .insert([logEntry]);

    if (error) {
      throw new Error(`Supabase Insert Error: ${error.message}`);
    }
  } catch (error) {
    console.error('[logAdminAction Error]:', error.message || error);
  }
}
