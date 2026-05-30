import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { logAdminAction } from '@/lib/logger';

const INITIAL_EVENTS = [
  {
    id: 'acoustic-sessions',
    name: 'Acoustic Sessions',
    day: 'Every Wednesday',
    time: '8:00 PM, 11:00 PM',
    price: 'No cover - Tasting menu ₹ 1,800',
    img: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg',
    blurb: "Unplugged sets by Mysuru's favourite singer-songwriters. Slow service, candle hour, a single-malt flight.",
    icon: 'Music',
  },
  {
    id: 'live-band-night',
    name: 'Live Band Night',
    day: 'Every Friday',
    time: '9:00 PM, 12:30 AM',
    price: 'Couple cover ₹ 1,000 fully redeemable',
    img: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704731983_122201749286446255_7832553486323798210_n.jpg',
    blurb: 'In-house quartet weaving Bollywood, jazz & soul. Crafted cocktails, late-night bar menu, no shortage of dancefloor.',
    icon: 'Music',
  },
  {
    id: 'resident-dj',
    name: 'Resident DJ Saturdays',
    day: 'Every Saturday',
    time: '10:00 PM, 12:30 AM',
    price: 'Couple cover ₹ 1,500 fully redeemable',
    img: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704507251_122201668016446255_657162141135626679_n.jpg',
    blurb: 'Deep house, retro nu-disco, and a special guest set the third weekend of every month.',
    icon: 'Music',
  },
  {
    id: 'chefs-table',
    name: 'Chef’s Table Tasting',
    day: 'Wed, Sun (by reservation)',
    time: '7:30 PM, 10:30 PM',
    price: '₹ 3,200 per guest - 7 courses',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90',
    blurb: 'Seven plates by Chef Aravind, from fire to ferment to dessert. Optional wine & cocktail pairing.',
    icon: 'ChefHat',
  },
  {
    id: 'whisky-flight',
    name: 'Whisky Flight Nights',
    day: 'First Thursday of the month',
    time: '8:00 PM onwards',
    price: 'Flight from ₹ 1,400',
    img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1400&q=90',
    blurb: 'Three-pour curated flight across Highland, Speyside & Islay. Hosted by our resident bar lead.',
    icon: 'Wine',
  },
  {
    id: 'sunday-brunch',
    name: 'Slow Sunday Brunch',
    day: 'Every Sunday',
    time: '12:00 PM, 4:00 PM',
    price: '₹ 1,650 - Bottomless mimosas + ₹ 600',
    img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&q=90',
    blurb: 'Live counters, eggs your way, biryani station, dessert tower and a jazz trio in the corner.',
    icon: 'ChefHat',
  },
];

const mapEventUnsplashToImageKit = (imgUrl) => {
  if (!imgUrl) return imgUrl;
  if (imgUrl.includes('1485579149621-3123dd979885')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg';
  }
  if (imgUrl.includes('1493225457124-a3eb161ffa5f')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704731983_122201749286446255_7832553486323798210_n.jpg';
  }
  if (imgUrl.includes('1542628682-88321d2a4828')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704507251_122201668016446255_657162141135626679_n.jpg';
  }
  return imgUrl;
};

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    let items = await db.collection('events').find({}).toArray();

    // Auto-seed if empty
    if (items.length === 0) {
      const seeded = INITIAL_EVENTS.map((item) => ({
        ...item,
        name: item.name.replace(/[\u2013\u2014–—]/g, '-'),
        blurb: item.blurb.replace(/[\u2013\u2014–—]/g, '-'),
        price: item.price.replace(/[\u2013\u2014–—]/g, '-'),
        active: true,
        created_at: new Date().toISOString(),
      }));
      await db.collection('events').insertMany(seeded);
      items = await db.collection('events').find({}).toArray();
    } else {
      // Auto-update database entries that still use old Unsplash images
      for (const item of items) {
        if (item.img && (item.img.includes('1485579149621-3123dd979885') || item.img.includes('1493225457124-a3eb161ffa5f') || item.img.includes('1542628682-88321d2a4828'))) {
          const newUrl = mapEventUnsplashToImageKit(item.img);
          if (newUrl !== item.img) {
            await db.collection('events').updateOne({ id: item.id }, { $set: { img: newUrl } });
            item.img = newUrl;
          }
        }
      }
    }

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, day, time, price, img, blurb, icon } = body;

    if (!name || !day || !time || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanName = String(name).trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanBlurb = String(blurb || '').trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanPrice = String(price).trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanDay = String(day).trim().replace(/[\u2013\u2014–—]/g, '-');
    const cleanTime = String(time).trim().replace(/[\u2013\u2014–—]/g, '-');

    const newItem = {
      id: uuidv4(),
      name: cleanName,
      day: cleanDay,
      time: cleanTime,
      price: cleanPrice,
      img: String(img || 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg').trim(),
      blurb: cleanBlurb,
      icon: String(icon || 'Calendar'),
      active: true,
      created_at: new Date().toISOString(),
    };

    const { db } = await connectToDatabase();
    await db.collection('events').insertOne(newItem);

    // LOG ACTION
    await logAdminAction('CREATE', `Created event: ${newItem.name} (${newItem.day})`);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, name, day, time, price, img, blurb, icon, active } = body;

    if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });

    const { db } = await connectToDatabase();

    const updateDoc = {};
    if (name !== undefined) updateDoc.name = String(name).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (day !== undefined) updateDoc.day = String(day).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (time !== undefined) updateDoc.time = String(time).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (price !== undefined) updateDoc.price = String(price).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (img !== undefined) updateDoc.img = String(img).trim();
    if (blurb !== undefined) updateDoc.blurb = String(blurb).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (icon !== undefined) updateDoc.icon = String(icon).trim();
    if (active !== undefined) updateDoc.active = Boolean(active);

    const result = await db.collection('events').updateOne({ id }, { $set: updateDoc });

    if (result.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    const eventName = name || 'Event ID ' + id;
    await logAdminAction('UPDATE', `Updated event: ${eventName} ${active !== undefined ? `(Active set to: ${active})` : ''}`);

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
    let eventName = id;
    try {
      const item = await db.collection('events').findOne({ id });
      if (item) eventName = item.name;
    } catch (_) {}

    const result = await db.collection('events').deleteOne({ id });

    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // LOG ACTION
    await logAdminAction('DELETE', `Deleted event: ${eventName}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
