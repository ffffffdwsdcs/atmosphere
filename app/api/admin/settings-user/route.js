import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: settings } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .eq('id', 'admin_user')
      .maybeSingle();

    if (!settings) {
      return NextResponse.json({ username: 'atmosphere_admin' });
    }
    return NextResponse.json({ username: settings.username });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: settings } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .eq('id', 'admin_user')
      .maybeSingle();

    // Determine expected current password
    const expectedPassword = settings ? settings.password : 'Luxe@2025!';

    if (currentPassword !== expectedPassword) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }

    const updatedUser = {
      id: 'admin_user',
      username: username.trim(),
      password: newPassword ? newPassword.trim() : expectedPassword,
    };

    await supabaseAdmin
      .from('admin_settings')
      .upsert(updatedUser);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
