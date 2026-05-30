export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(150);

    if (error) throw error;
    return NextResponse.json({ success: true, items: logs || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
