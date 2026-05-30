import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { BANK_OFFERS } from '@/lib/atmosphereData';
import { v4 as uuidv4 } from 'uuid';
import { logAdminAction } from '@/lib/logger';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    let items = await db.collection('bank_offers').find({}).toArray();

    // Auto-seed if empty
    if (items.length === 0) {
      const seeded = BANK_OFFERS.map((item) => ({
        ...item,
        id: uuidv4(),
        bank: item.bank.replace(/[\u2013\u2014–—]/g, '-'),
        title: item.title.replace(/[\u2013\u2014–—]/g, '-'),
        sub: item.sub.replace(/[\u2013\u2014–—]/g, '-'),
        code: item.code.replace(/[\u2013\u2014–—]/g, '-'),
        valid: item.valid.replace(/[\u2013\u2014–—]/g, '-'),
        active: true,
        created_at: new Date().toISOString(),
      }));
      await db.collection('bank_offers').insertMany(seeded);
      items = await db.collection('bank_offers').find({}).toArray();
    }

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { bank, domain, title, sub, code, valid, gradient } = body;

    if (!bank || !title || !sub || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanBank = String(bank).trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanTitle = String(title).trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanSub = String(sub).trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanCode = String(code).trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanValid = String(valid || 'Valid details').trim().replace(/[\u2013\u2014–—]/g, '-');

    const newItem = {
      id: uuidv4(),
      bank: cleanBank,
      domain: String(domain || 'bank.com').trim(),
      title: cleanTitle,
      sub: cleanSub,
      code: cleanCode,
      valid: cleanValid,
      gradient: String(gradient || 'linear-gradient(135deg, #c4560a 0%, #f56d0a 60%, #f7874d 100%)').trim(),
      active: true,
      created_at: new Date().toISOString(),
    };

    const { db } = await connectToDatabase();
    await db.collection('bank_offers').insertOne(newItem);

    // LOG ACTION
    await logAdminAction('CREATE', `Created bank offer: ${newItem.bank} (${newItem.title} - Code: ${newItem.code})`);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, bank, domain, title, sub, code, valid, gradient, active } = body;

    if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });

    const { db } = await connectToDatabase();

    const updateDoc = {};
    if (bank !== undefined) updateDoc.bank = String(bank).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (domain !== undefined) updateDoc.domain = String(domain).trim();
    if (title !== undefined) updateDoc.title = String(title).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (sub !== undefined) updateDoc.sub = String(sub).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (code !== undefined) updateDoc.code = String(code).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (valid !== undefined) updateDoc.valid = String(valid).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (gradient !== undefined) updateDoc.gradient = String(gradient).trim();
    if (active !== undefined) updateDoc.active = Boolean(active);

    const result = await db.collection('bank_offers').updateOne({ id }, { $set: updateDoc });

    if (result.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    const bankName = bank || 'Offer ID ' + id;
    await logAdminAction('UPDATE', `Updated bank offer: ${bankName} ${active !== undefined ? `(Active set to: ${active})` : ''}`);

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
    let bankName = id;
    try {
      const item = await db.collection('bank_offers').findOne({ id });
      if (item) bankName = `${item.bank} (${item.title})`;
    } catch (_) {}

    const result = await db.collection('bank_offers').deleteOne({ id });

    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    await logAdminAction('DELETE', `Deleted bank offer: ${bankName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
