export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Fetch counts
    const { count: totalReservations } = await supabaseAdmin
      .from('reservations')
      .select('*', { count: 'exact', head: true });

    const { count: pendingBanquets } = await supabaseAdmin
      .from('banquet_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    const { count: newMessages } = await supabaseAdmin
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });

    // We try to count menu items from menu_items collection, default to 42
    let totalMenuItems = 42;
    try {
      const { count: count } = await supabaseAdmin
        .from('menu_items')
        .select('*', { count: 'exact', head: true });
      if (count > 0) totalMenuItems = count;
    } catch (_) { }

    // 1b. Fetch Real-time Analytics from site_traffic table
    let liveUsers = 0;
    let dailyVisitors = 0;
    let weeklyVisitors = 0;
    let monthlyVisitors = 0;

    try {
      const nowMs = Date.now();
      const fiveMinAgo = new Date(nowMs - 5 * 60 * 1000).toISOString();
      const oneDayAgo = new Date(nowMs - 24 * 60 * 60 * 1000).toISOString();
      const oneWeekAgo = new Date(nowMs - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oneMonthAgo = new Date(nowMs - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Query active session IDs for each window
      const [
        { data: liveData },
        { data: dailyData },
        { data: weeklyData },
        { data: monthlyData }
      ] = await Promise.all([
        supabaseAdmin.from('site_traffic').select('session_id').gte('created_at', fiveMinAgo),
        supabaseAdmin.from('site_traffic').select('session_id').gte('created_at', oneDayAgo),
        supabaseAdmin.from('site_traffic').select('session_id').gte('created_at', oneWeekAgo),
        supabaseAdmin.from('site_traffic').select('session_id').gte('created_at', oneMonthAgo)
      ]);

      // Calculate distinct session IDs
      liveUsers = liveData ? new Set(liveData.map(d => d.session_id)).size : 0;
      dailyVisitors = dailyData ? new Set(dailyData.map(d => d.session_id)).size : 0;
      weeklyVisitors = weeklyData ? new Set(weeklyData.map(d => d.session_id)).size : 0;
      monthlyVisitors = monthlyData ? new Set(monthlyData.map(d => d.session_id)).size : 0;
    } catch (err) {
      console.error("[Dashboard API Traffic Query Error]:", err.message || err);
    }

    // 2. Fetch last 10 reservations
    const { data: recentReservations } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // 3. Generate recent activities feed from last submissions
    const { data: rawReservations } = await supabaseAdmin.from('reservations').select('*').order('created_at', { ascending: false }).limit(10);
    const { data: rawBanquets } = await supabaseAdmin.from('banquet_inquiries').select('*').order('created_at', { ascending: false }).limit(10);
    const { data: rawMessages } = await supabaseAdmin.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(10);

    const activities = [];
    if (rawReservations) {
      rawReservations.forEach((r) => {
        activities.push({
          type: 'reservation',
          description: `New reservation by ${r.name} for ${r.guests} guests`,
          createdAt: r.created_at,
        });
      });
    }
    if (rawBanquets) {
      rawBanquets.forEach((b) => {
        activities.push({
          type: 'banquet',
          description: `Banquet inquiry from ${b.name} (${b.event_type})`,
          createdAt: b.created_at,
        });
      });
    }
    if (rawMessages) {
      rawMessages.forEach((m) => {
        activities.push({
          type: 'message',
          description: `Message from ${m.name}: "${m.subject}"`,
          createdAt: m.created_at,
        });
      });
    }

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentActivities = activities.slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalReservations: totalReservations || 0,
        pendingBanquets: pendingBanquets || 0,
        newMessages: newMessages || 0,
        totalMenuItems,
        liveUsers,
        dailyVisitors,
        weeklyVisitors,
        monthlyVisitors,
      },
      recentReservations: recentReservations || [],
      recentActivities,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
