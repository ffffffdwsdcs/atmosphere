import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logAdminAction } from '@/lib/logger';

export async function GET() {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ items: items || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Fetch details before update to log correctly
    let guestName = id;
    try {
      const { data: resv } = await supabaseAdmin.from('reservations').select('name').eq('id', id).maybeSingle();
      if (resv) guestName = resv.name;
    } catch (_) {}

    const { error } = await supabaseAdmin
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    // LOG ACTION
    await logAdminAction('STATUS_CHANGE', `Updated reservation for ${guestName} to: ${status}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Fetch details before delete to log correctly
    let guestName = id;
    try {
      const { data: resv } = await supabaseAdmin.from('reservations').select('name').eq('id', id).maybeSingle();
      if (resv) guestName = resv.name;
    } catch (_) {}

    const { error } = await supabaseAdmin
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // LOG ACTION
    await logAdminAction('DELETE', `Deleted reservation for ${guestName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
