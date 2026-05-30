import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logAdminAction } from '@/lib/logger';

export async function GET() {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('contact_messages')
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
    const { id, read } = await request.json();
    if (!id || read === undefined) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Fetch details before update to log correctly
    let senderName = id;
    try {
      const { data: msg } = await supabaseAdmin.from('contact_messages').select('name').eq('id', id).maybeSingle();
      if (msg) senderName = msg.name;
    } catch (_) {}

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .update({ read: Boolean(read) })
      .eq('id', id);

    if (error) throw error;

    // LOG ACTION
    await logAdminAction('STATUS_CHANGE', `Marked contact message from ${senderName} as: ${read ? 'READ' : 'UNREAD'}`);

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
    let senderName = id;
    try {
      const { data: msg } = await supabaseAdmin.from('contact_messages').select('name').eq('id', id).maybeSingle();
      if (msg) senderName = msg.name;
    } catch (_) {}

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // LOG ACTION
    await logAdminAction('DELETE', `Deleted contact message from ${senderName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
