import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { HERO_IMAGES, MARQUEE_WORDS, STATS, BRAND } from '@/lib/atmosphereData';

export async function GET() {
  try {
    const { data: configRow } = await supabaseAdmin
      .from('content_config')
      .select('*')
      .eq('key', 'site_config')
      .maybeSingle();

    let config = configRow ? configRow.value : null;

    // Seed default configuration if empty
    if (!config) {
      // Dash protection on seed text
      const cleanBrand = {
        ...BRAND,
        shortDesc: BRAND.shortDesc.replace(/[\u2013\u2014–—]/g, '-'),
        address: BRAND.address.replace(/[\u2013\u2014–—]/g, '-'),
        city: BRAND.city.replace(/[\u2013\u2014–—]/g, '-'),
        hours: BRAND.hours.map(h => ({
          day: h.day.replace(/[\u2013\u2014–—]/g, '-'),
          time: h.time.replace(/[\u2013\u2014–—]/g, '-'),
        }))
      };

      const cleanStats = STATS.map(s => ({
        value: s.value.replace(/[\u2013\u2014–—]/g, '-'),
        label: s.label.replace(/[\u2013\u2014–—]/g, '-'),
      }));

      const cleanMarquee = MARQUEE_WORDS.map(w => w.replace(/[\u2013\u2014–—]/g, '-'));

      const cleanHero = HERO_IMAGES.map(img => ({
        src: img.src,
        alt: img.alt.replace(/[\u2013\u2014–—]/g, '-'),
      }));

      config = {
        id: 'site_config',
        hero_images: cleanHero,
        marquee_words: cleanMarquee,
        stats: cleanStats,
        brand: cleanBrand,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabaseAdmin
        .from('content_config')
        .insert([{ key: 'site_config', value: config }]);
    }

    return NextResponse.json({ config });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { hero_images, marquee_words, stats, brand } = body;

    const { data: configRow } = await supabaseAdmin
      .from('content_config')
      .select('*')
      .eq('key', 'site_config')
      .maybeSingle();

    let currentConfig = configRow ? configRow.value : {};

    const updateDoc = {};

    if (hero_images !== undefined) {
      updateDoc.hero_images = hero_images.map(img => ({
        src: img.src,
        alt: String(img.alt || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
      }));
    }

    if (marquee_words !== undefined) {
      updateDoc.marquee_words = marquee_words.map(w => String(w).trim().replace(/[\u2013\u2014–—]/g, '-'));
    }

    if (stats !== undefined) {
      updateDoc.stats = stats.map(s => ({
        value: String(s.value).trim().replace(/[\u2013\u2014–—]/g, '-'),
        label: String(s.label).trim().replace(/[\u2013\u2014–—]/g, '-'),
      }));
    }

    if (brand !== undefined) {
      updateDoc.brand = {
        name: String(brand.name || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        shortDesc: String(brand.shortDesc || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        phone: String(brand.phone || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        phoneRaw: String(brand.phoneRaw || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        email: String(brand.email || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        address: String(brand.address || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        city: String(brand.city || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        hours: Array.isArray(brand.hours) ? brand.hours.map(h => ({
          day: String(h.day || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
          time: String(h.time || '').trim().replace(/[\u2013\u2014–—]/g, '-'),
        })) : []
      };
    }

    const updatedConfig = {
      ...currentConfig,
      ...updateDoc,
      updated_at: new Date().toISOString()
    };

    await supabaseAdmin
      .from('content_config')
      .upsert({ key: 'site_config', value: updatedConfig });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
