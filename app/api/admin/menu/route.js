import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { MENU } from '@/lib/atmosphereData';
import { v4 as uuidv4 } from 'uuid';
import { logAdminAction } from '@/lib/logger';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    let items = await db.collection('menu_items').find({}).toArray();

    // Auto-seed if empty
    if (items.length === 0) {
      const seeded = MENU.map((item) => ({
        ...item,
        name: item.name.replace(/[\u2013\u2014–—]/g, '-'),
        desc: item.desc.replace(/[\u2013\u2014–—]/g, '-'),
        active: true,
        created_at: new Date().toISOString(),
      }));
      await db.collection('menu_items').insertMany(seeded);
      items = await db.collection('menu_items').find({}).toArray();
    }

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, desc, price, cat, veg, spicy, tags, img } = body;

    if (!name || price === undefined || !cat) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = {
      id: uuidv4(),
      name: String(name).trim(),
      desc: String(desc || '').trim(),
      price: Number(price),
      cat: String(cat),
      veg: Boolean(veg),
      spicy: Number(spicy || 0),
      tags: Array.isArray(tags) ? tags : [],
      img: String(img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80').trim(),
      active: true,
      created_at: new Date().toISOString(),
    };

    const { db } = await connectToDatabase();
    await db.collection('menu_items').insertOne(newItem);

    // LOG ACTION
    await logAdminAction('CREATE', `Added menu item: ${newItem.name} (Price: ₹${newItem.price})`);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, name, desc, price, cat, veg, spicy, tags, img, active } = body;

    if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });

    const { db } = await connectToDatabase();

    const updateDoc = {};
    if (name !== undefined) updateDoc.name = String(name).trim();
    if (desc !== undefined) updateDoc.desc = String(desc || '').trim();
    if (price !== undefined) updateDoc.price = Number(price);
    if (cat !== undefined) updateDoc.cat = String(cat);
    if (veg !== undefined) updateDoc.veg = Boolean(veg);
    if (spicy !== undefined) updateDoc.spicy = Number(spicy);
    if (tags !== undefined) updateDoc.tags = Array.isArray(tags) ? tags : [];
    if (img !== undefined) updateDoc.img = String(img).trim();
    if (active !== undefined) updateDoc.active = Boolean(active);

    const result = await db.collection('menu_items').updateOne({ id }, { $set: updateDoc });

    if (result.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    const itemName = name || 'Menu Item ID ' + id;
    await logAdminAction('UPDATE', `Updated menu item: ${itemName} ${active !== undefined ? `(Active set to: ${active})` : ''}`);

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
    let itemName = id;
    try {
      const item = await db.collection('menu_items').findOne({ id });
      if (item) itemName = item.name;
    } catch (_) {}

    const result = await db.collection('menu_items').deleteOne({ id });

    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    await logAdminAction('DELETE', `Deleted menu item: ${itemName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
