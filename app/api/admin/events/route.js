import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { logAdminAction } from '@/lib/logger';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('event_bookings').find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { db } = await connectToDatabase();
    
    // Fetch details before update to log correctly
    let attendeeName = id;
    try {
      const booking = await db.collection('event_bookings').findOne({ id });
      if (booking) attendeeName = booking.name;
    } catch (_) {}

    const result = await db.collection('event_bookings').updateOne({ id }, { $set: { status } });

    if (result.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    await logAdminAction('STATUS_CHANGE', `Updated event booking status for ${attendeeName} to: ${status}`);

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

    const { db } = await connectToDatabase();
    
    // Fetch details before delete to log correctly
    let attendeeName = id;
    try {
      const booking = await db.collection('event_bookings').findOne({ id });
      if (booking) attendeeName = booking.name;
    } catch (_) {}

    const result = await db.collection('event_bookings').deleteOne({ id });

    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    await logAdminAction('DELETE', `Deleted event booking for ${attendeeName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
