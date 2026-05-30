import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const mapLocalToImageKit = (videoUrl) => {
  if (!videoUrl) return videoUrl;
  if (!videoUrl.includes('/Reels videos/')) return videoUrl;
  const filename = videoUrl.split('/Reels videos/')[1];
  if (!filename) return videoUrl;

  if (filename.includes('New Year')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/%E2%9C%A8%20New%20Year.%20New%20Energy.%20Same%20Vibe_%20Just%20Louder!%20_Atmosphere%20is%20where%20the%20beats%20drop%20harder,%20the.mp4';
  }
  if (filename.includes('candlelight')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/An%20evening%20of%20candlelight,%20melodies,%20and%20memorable%20moments.%20_CandlelitDinner_FineDineExperience_.mp4';
  }
  if (filename.includes('pour')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Experience%20the%20art%20of%20the%20pour%20with%20our%20Limited%20Edition%20Summer%20Cocktails.%20_AtmosphereMysuru%20_Sum%20(1).mp4';
  }
  if (filename.includes('ambient mood')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/From%20the%20ambient%20mood%20to%20the%20full-throttle%20party_we%20know%20how%20to%20host%20an%20unforgettable%20night!%20_At.mp4';
  }
  if (filename.includes('Good drinks, better music') || filename.includes('best company')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20drinks,%20better%20music,%20and%20the%20best%20company.%20_%E2%9C%A8%20We_re%20bringing%20the%20energy%20all%20night%20long%20at%20(1).mp4';
  }
  if (filename.includes('great beats')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20food,%20great%20beats,%20and%20the%20perfect%20vibe%20for%20your%20evening.%20Whether%20youre%20here%20for%20the%20cockt.mp4';
  }
  if (filename.includes('Cooking up')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20food,%20great%20music,%20and%20the%20perfect%20vibe.%20%E2%9C%A8%20Cooking%20up%20an%20unforgettable%20night%20at%20Atmosphere%20.mp4';
  }
  if (filename.includes('Good music, better drinks')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20music,%20better%20drinks,%20and%20the%20perfect%20Atmosphere.%20Join%20us%20tonight.%20__Atmosphere%20_Unwind%20_E.mp4';
  }
  if (filename.includes('Nothing but good vibes')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Nothing%20but%20good%20vibes%20and%20heavy%20basslines.%20RAQ-L%20officially%20raised%20the%20bar%20for%20nightlife%20in%20Mys.mp4';
  }
  if (filename.includes('Live music and good vibes')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/The%20perfect%20Atmosphere%20for%20a%20night%20out.%20Live%20music%20and%20good%20vibes%20only._LiveMusicVenue%20_BandNigh.mp4';
  }
  if (filename.includes('THE VIBE IS UNMATCHED')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/THE%20VIBE%20IS%20UNMATCHED.%20THE%20DRINKS%20ARE%20ICONIC.%20When%20the%20sun%20goes%20down,%20the%20energy%20turns%20up.%20Exper.mp4';
  }
  if (filename.includes('Too much sun')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Too%20much%20sun%20Trade%20it%20for%20cocktails%20and%20chaos!%20_%20Whether%20you_re%20unwinding%20after%20a%20long%20day%20or%20g.mp4';
  }
  if (filename.includes('weekend destination')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Your%20weekend%20destination%20is%20right%20here!%20%E2%9C%A8%20Get%20into%20the%20Atmosphere%20with%20our%20perfect%20blend%20of%20chic.mp4';
  }
  if (filename.includes('Add this cafe') || filename.includes('yobekombucha')) {
    return 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Add%20this%20cafe%20to%20your%20Mysuru%20list.%20%E2%9D%A4%EF%B8%8FAnd%20do%20try%20@yobekombucha%20_vira%C5%82reels%20_mysuru%20_fyp%20_explore%20.mp4';
  }
  return videoUrl;
};

const LOCAL_REELS = [
  {
    title: "New Year. New Energy. Same Vibe... Just Louder!",
    sub: "@atmosphere_mysuru",
    poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/%E2%9C%A8%20New%20Year.%20New%20Energy.%20Same%20Vibe_%20Just%20Louder!%20_Atmosphere%20is%20where%20the%20beats%20drop%20harder,%20the.mp4"
  },
  {
    title: "An evening of candlelight, melodies, and memorable moments.",
    sub: "#CandlelitDinner #FineDine",
    poster: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/An%20evening%20of%20candlelight,%20melodies,%20and%20memorable%20moments.%20_CandlelitDinner_FineDineExperience_.mp4"
  },
  {
    title: "Experience the art of the pour with our Summer Cocktails.",
    sub: "Limited Edition Summer Drinks",
    poster: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Experience%20the%20art%20of%20the%20pour%20with%20our%20Limited%20Edition%20Summer%20Cocktails.%20_AtmosphereMysuru%20_Sum%20(1).mp4"
  },
  {
    title: "From the ambient mood to the full-throttle party.",
    sub: "Unforgettable Nights",
    poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/From%20the%20ambient%20mood%20to%20the%20full-throttle%20party_we%20know%20how%20to%20host%20an%20unforgettable%20night!%20_At.mp4"
  },
  {
    title: "Good drinks, better music, and the best company.",
    sub: "Party Energy All Night",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20drinks,%20better%20music,%20and%20the%20best%20company.%20_%E2%9C%A8%20We_re%20bringing%20the%20energy%20all%20night%20long%20at%20(1).mp4"
  },
  {
    title: "Good food, great beats, and the perfect vibe.",
    sub: "Cocktails & Food Pairing",
    poster: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20food,%20great%20beats,%20and%20the%20perfect%20vibe%20for%20your%20evening.%20Whether%20youre%20here%20for%20the%20cockt.mp4"
  },
  {
    title: "Good food, great music, and the perfect vibe.",
    sub: "Atmosphere Cooking",
    poster: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20food,%20great%20music,%20and%20the%20perfect%20vibe.%20%E2%9C%A8%20Cooking%20up%20an%20unforgettable%20night%20at%20Atmosphere%20.mp4"
  },
  {
    title: "Good music, better drinks, and the perfect Atmosphere.",
    sub: "Join Us Tonight",
    poster: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Good%20music,%20better%20drinks,%20and%20the%20perfect%20Atmosphere.%20Join%20us%20tonight.%20__Atmosphere%20_Unwind%20_E.mp4"
  },
  {
    title: "Nothing but good vibes and heavy basslines.",
    sub: "Mysuru Nightlife Raised",
    poster: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Nothing%20but%20good%20vibes%20and%20heavy%20basslines.%20RAQ-L%20officially%20raised%20the%20bar%20for%20nightlife%20in%20Mys.mp4"
  },
  {
    title: "The perfect Atmosphere for a night out.",
    sub: "Live music and good vibes",
    poster: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/The%20perfect%20Atmosphere%20for%20a%20night%20out.%20Live%20music%20and%20good%20vibes%20only._LiveMusicVenue%20_BandNigh.mp4"
  },
  {
    title: "THE VIBE IS UNMATCHED. THE DRINKS ARE ICONIC.",
    sub: "Unwind & Party",
    poster: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/THE%20VIBE%20IS%20UNMATCHED.%20THE%20DRINKS%20ARE%20ICONIC.%20When%20the%20sun%20goes%20down,%20the%20energy%20turns%20up.%20Exper.mp4"
  },
  {
    title: "Too much sun? Trade it for cocktails and chaos!",
    sub: "Summer Nights at Atmosphere",
    poster: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Too%20much%20sun%20Trade%20it%20for%20cocktails%20and%20chaos!%20_%20Whether%20you_re%20unwinding%20after%20a%20long%20day%20or%20g.mp4"
  },
  {
    title: "Your weekend destination is right here!",
    sub: "Perfect blend of chic & energetic",
    poster: "https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Your%20weekend%20destination%20is%20right%20here!%20%E2%9C%A8%20Get%20into%20the%20Atmosphere%20with%20our%20perfect%20blend%20of%20chic.mp4"
  },
  {
    title: "Add this cafe to your Mysuru list.",
    sub: "@atmosphere_mysuru",
    poster: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
    video: "https://ik.imagekit.io/wi9efnjb4/atmosphere%20/Add%20this%20cafe%20to%20your%20Mysuru%20list.%20%E2%9D%A4%EF%B8%8FAnd%20do%20try%20@yobekombucha%20_vira%C5%82reels%20_mysuru%20_fyp%20_explore%20.mp4"
  }
];

export async function GET() {
  try {
    // Attempt Supabase fetch
    const { data: items } = await supabaseAdmin
      .from('reels')
      .select('*')
      .order('created_at', { ascending: true });

    if (items && items.length > 0) {
      // Auto-update database entries that still use old local video paths
      const mappedItems = await Promise.all(items.map(async (item) => {
        if (item.video && item.video.includes('/Reels videos/')) {
          const newUrl = mapLocalToImageKit(item.video);
          if (newUrl !== item.video) {
            await supabaseAdmin
              .from('reels')
              .update({ video: newUrl })
              .eq('id', item.id);
            item.video = newUrl;
          }
        }
        return item;
      }));
      return NextResponse.json({ items: mappedItems });
    }
    
    // Fallback directly to local reels list
    return NextResponse.json({ items: LOCAL_REELS });
  } catch (err) {
    return NextResponse.json({ items: LOCAL_REELS });
  }
}
export const dynamic = 'force-dynamic';
