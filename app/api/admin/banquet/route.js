import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logAdminAction } from '@/lib/logger';

export async function GET() {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('banquet_inquiries')
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
    let customerName = id;
    try {
      const { data: inquiry } = await supabaseAdmin.from('banquet_inquiries').select('name').eq('id', id).maybeSingle();
      if (inquiry) customerName = inquiry.name;
    } catch (_) {}

    const { error } = await supabaseAdmin
      .from('banquet_inquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    // LOG ACTION
    await logAdminAction('STATUS_CHANGE', `Updated banquet inquiry status for ${customerName} to: ${status}`);

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
    let customerName = id;
    try {
      const { data: inquiry } = await supabaseAdmin.from('banquet_inquiries').select('name').eq('id', id).maybeSingle();
      if (inquiry) customerName = inquiry.name;
    } catch (_) {}

    const { error } = await supabaseAdmin
      .from('banquet_inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // LOG ACTION
    await logAdminAction('DELETE', `Deleted banquet inquiry from ${customerName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
