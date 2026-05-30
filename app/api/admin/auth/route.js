import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const { data: settings } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .eq('id', 'admin_user')
      .maybeSingle();

    const expectedUsername = settings ? settings.username : 'atmosphere_admin';
    const expectedPassword = settings ? settings.password : 'Luxe@2025!';

    if (username === expectedUsername && password === expectedPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
