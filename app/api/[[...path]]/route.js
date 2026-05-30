import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const json = (data, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET(request, { params }) {
  const path = (params?.path || []).join('/');
  try {
    if (path === '' || path === 'health') {
      return json({ status: 'ok', service: 'atmosphere-api' });
    }
    
    if (path === 'reservations') {
      const { data: items, error } = await supabaseAdmin
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return json({ items: items || [] });
    }
    
    if (path === 'banquet-inquiries') {
      const { data: items, error } = await supabaseAdmin
        .from('banquet_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return json({ items: items || [] });
    }
    
    if (path === 'event-bookings') {
      const { data: items, error } = await supabaseAdmin
        .from('event_bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return json({ items: items || [] });
    }
    
    if (path === 'contact-messages') {
      const { data: items, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return json({ items: items || [] });
    }
    
    return json({ error: 'Not found', path }, 404);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function POST(request, { params }) {
  const path = (params?.path || []).join('/');
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    if (path === 'reservations') {
      const required = ['name', 'phone', 'date', 'time', 'guests'];
      for (const f of required) {
        if (!body[f]) return json({ error: `Missing field: ${f}` }, 400);
      }
      const doc = {
        id: uuidv4(),
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: body.email ? String(body.email).trim() : null,
        date: body.date,
        time: body.time,
        guests: Number(body.guests),
        occasion: body.occasion || null,
        dietary: body.dietary || null,
        special_requests: body.special_requests || null,
        status: 'confirmed',
        reference: `ATM-${Math.floor(100000 + Math.random() * 900000)}`,
        created_at: now,
      };
      const { error } = await supabaseAdmin
        .from('reservations')
        .insert([doc]);
      if (error) throw error;
      return json({ success: true, reservation: doc });
    }

    if (path === 'banquet-inquiries') {
      const required = ['name', 'phone', 'email', 'event_type'];
      for (const f of required) {
        if (!body[f]) return json({ error: `Missing field: ${f}` }, 400);
      }
      const doc = {
        id: uuidv4(),
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: String(body.email).trim(),
        event_type: body.event_type,
        event_date: body.event_date || null,
        guest_count: body.guest_count ? Number(body.guest_count) : null,
        budget_range: body.budget_range || null,
        special_requirements: body.special_requirements || null,
        source: body.source || null,
        status: 'new',
        created_at: now,
      };
      const { error } = await supabaseAdmin
        .from('banquet_inquiries')
        .insert([doc]);
      if (error) throw error;
      return json({ success: true, inquiry: doc });
    }

    if (path === 'event-bookings') {
      const required = ['name', 'phone', 'email', 'event_name'];
      for (const f of required) {
        if (!body[f]) return json({ error: `Missing field: ${f}` }, 400);
      }
      const doc = {
        id: uuidv4(),
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: String(body.email).trim(),
        event_name: body.event_name,
        event_date: body.event_date || null,
        guests: body.guests ? Number(body.guests) : null,
        special_requests: body.special_requests || null,
        status: 'pending',
        created_at: now,
      };
      const { error } = await supabaseAdmin
        .from('event_bookings')
        .insert([doc]);
      if (error) throw error;
      return json({ success: true, booking: doc });
    }

    if (path === 'contact-messages') {
      const required = ['name', 'email', 'subject', 'message'];
      for (const f of required) {
        if (!body[f]) return json({ error: `Missing field: ${f}` }, 400);
      }
      const doc = {
        id: uuidv4(),
        name: String(body.name).trim(),
        phone: body.phone ? String(body.phone).trim() : null,
        email: String(body.email).trim(),
        subject: body.subject,
        message: body.message,
        created_at: now,
      };
      const { error } = await supabaseAdmin
        .from('contact_messages')
        .insert([doc]);
      if (error) throw error;
      return json({ success: true, message: doc });
    }

    return json({ error: 'Not found', path }, 404);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
