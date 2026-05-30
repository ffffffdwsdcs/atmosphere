import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_PHOTOS = [
  // Interiors
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=90', cat: 'interiors', span: 'wide', alt: 'Moody bar interior' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=90', cat: 'interiors', span: 'tall', alt: 'Candlelit table setting' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=90', cat: 'interiors', span: 'normal', alt: 'Restaurant bar' },
  { src: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=1600&q=90', cat: 'interiors', span: 'normal', alt: 'Lounge ambience' },
  { src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600&q=90', cat: 'interiors', span: 'wide', alt: 'Dining room' },
  // Food
  { src: 'https://images.pexels.com/photos/7491887/pexels-photo-7491887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1800', cat: 'food', span: 'tall', alt: 'Truffle risotto' },
  { src: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Slow-cooked mutton' },
  { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Smoked old fashioned' },
  { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Burnt basque cheesecake' },
  { src: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=1600&q=90', cat: 'food', span: 'wide', alt: 'Sichuan prawns' },
  { src: 'https://images.unsplash.com/photo-1586338211598-e2d64cf97e28?w=1600&q=90', cat: 'food', span: 'tall', alt: 'Cocktail with flame' },
  // Banquet
  { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&q=90', cat: 'banquet', span: 'wide', alt: 'Luxe banquet hall' },
  { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=90', cat: 'banquet', span: 'tall', alt: 'Wedding stage decor' },
  { src: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1600&q=90', cat: 'banquet', span: 'normal', alt: 'Wedding table setup' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=90', cat: 'banquet', span: 'normal', alt: 'Floral arch' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=90', cat: 'banquet', span: 'normal', alt: 'Reception aisle' },
  { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=90', cat: 'banquet', span: 'wide', alt: 'Wedding hall lighting' },
  // Live nights
  { src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704731983_122201749286446255_7832553486323798210_n.jpg', cat: 'live', span: 'tall', alt: 'Live music night' },
  { src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704507251_122201668016446255_657162141135626679_n.jpg', cat: 'live', span: 'normal', alt: 'DJ set' },
  { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=90', cat: 'live', span: 'normal', alt: 'Club crowd' },
  { src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg', cat: 'live', span: 'wide', alt: 'Acoustic set' },
  { src: 'https://images.pexels.com/photos/4997894/pexels-photo-4997894.jpeg?w=1600&q=90', cat: 'interiors', span: 'tall', alt: 'Candle interior' },
  { src: 'https://images.pexels.com/photos/6728529/pexels-photo-6728529.jpeg?w=1600&q=90', cat: 'food', span: 'normal', alt: 'Plated dinner' },
  { src: 'https://images.pexels.com/photos/8775053/pexels-photo-8775053.jpeg?w=1600&q=90', cat: 'food', span: 'wide', alt: 'Wine dining setup' },
  { src: 'https://images.pexels.com/photos/14748605/pexels-photo-14748605.jpeg?w=900&q=90', cat: 'food', span: 'normal', alt: 'Cocktail drink' },
];

const mapGalleryUnsplashToImageKit = (imgUrl) => {
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
    let items = await db.collection('gallery').find({}).toArray();

    // Auto-seed if empty
    if (items.length === 0) {
      const seeded = INITIAL_PHOTOS.map((item) => ({
        ...item,
        id: uuidv4(),
        alt: item.alt.replace(/[\u2013\u2014–—]/g, '-'),
        active: true,
        created_at: new Date().toISOString(),
      }));
      await db.collection('gallery').insertMany(seeded);
      items = await db.collection('gallery').find({}).toArray();
    } else {
      // Auto-update database entries that still use old Unsplash images
      for (const item of items) {
        if (item.src && (item.src.includes('1485579149621-3123dd979885') || item.src.includes('1493225457124-a3eb161ffa5f') || item.src.includes('1542628682-88321d2a4828'))) {
          const newUrl = mapGalleryUnsplashToImageKit(item.src);
          if (newUrl !== item.src) {
            await db.collection('gallery').updateOne({ id: item.id }, { $set: { src: newUrl } });
            item.src = newUrl;
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
    const { src, cat, span, alt } = body;

    if (!src || !cat) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanAlt = String(alt || '').trim().replace(/[\u2013\u2014–—]/g, '-');

    const newItem = {
      id: uuidv4(),
      src: String(src).trim(),
      cat: String(cat).trim(),
      span: String(span || 'normal').trim(),
      alt: cleanAlt,
      active: true,
      created_at: new Date().toISOString(),
    };

    const { db } = await connectToDatabase();
    await db.collection('gallery').insertOne(newItem);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, src, cat, span, alt, active } = body;

    if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });

    const { db } = await connectToDatabase();

    const updateDoc = {};
    if (src !== undefined) updateDoc.src = String(src).trim();
    if (cat !== undefined) updateDoc.cat = String(cat).trim();
    if (span !== undefined) updateDoc.span = String(span).trim();
    if (alt !== undefined) updateDoc.alt = String(alt).trim().replace(/[\u2013\u2014–—]/g, '-');
    if (active !== undefined) updateDoc.active = Boolean(active);

    const result = await db.collection('gallery').updateOne({ id }, { $set: updateDoc });

    if (result.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
    const result = await db.collection('gallery').deleteOne({ id });

    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
