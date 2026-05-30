// Shared constants for the Atmosphere brand site.

export const BRAND = {
  name: 'Atmosphere',
  tagline: 'Where every meal becomes a memory',
  shortDesc:
    "Mysuru's finest multi-cuisine restobar & luxury banquet venue. North Indian • Continental • Chinese • Pasta • Desserts.",
  phone: '+91 91102 52593',
  phoneRaw: '+919110252593',
  whatsapp: 'https://wa.me/919110252593',
  email: 'reservations@atmospheremysore.com',
  address: 'BEML Layout 2nd Stage, Rajarajeshwari Nagar',
  city: 'Mysuru, Karnataka 570033',
  hours: [
    { day: 'Mon to Thu', time: '12:00 PM to 11:30 PM' },
    { day: 'Fri to Sun', time: '12:00 PM to 12:30 AM' },
  ],
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Luxe', href: '/luxe' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Offers', href: '/offers' },
  { label: 'Contact', href: '/contact' },
];

// 5 hero images supplied by the brand owner to dark moody restobar vibes.
export const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=90',
    alt: 'Dark restaurant interior with warm lighting',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90',
    alt: 'Candlelit dinner table setting',
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=90',
    alt: 'Moody bar and lounge ambience',
  },
  {
    src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1920&q=90',
    alt: 'Dark elegant dining room',
  },
  {
    src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=90',
    alt: 'Warm atmospheric restaurant at night',
  },
];

export const SIGNATURE_DISHES = [
  {
    name: 'Truffle Butter Risotto',
    cuisine: 'Continental',
    desc: 'Carnaroli rice, black truffle, aged parmesan, brown butter foam.',
    price: '₹ 740',
    img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=90',
  },
  {
    name: 'Lal Maas',
    cuisine: 'North Indian',
    desc: 'Slow-braised mutton, mathania chillies, ghee, smoked finish.',
    price: '₹ 680',
    img: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=900&q=90',
  },
  {
    name: 'Sichuan Black Pepper Prawns',
    cuisine: 'Chinese',
    desc: 'Tiger prawns, fermented black bean, scallion, Shaoxing wine.',
    price: '₹ 780',
    img: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=900&q=90',
  },
  {
    name: 'Smoked Old Fashioned',
    cuisine: 'Bar',
    desc: 'Bourbon, brown sugar, orange bitters, applewood smoke.',
    price: '₹ 540',
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=90',
  },
  {
    name: 'Burnt Basque Cheesecake',
    cuisine: 'Dessert',
    desc: 'Caramelised top, cloud-soft centre, sea salt, espresso shot.',
    price: '₹ 360',
    img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&q=90',
  },
];

export const SPACES = [
  {
    title: 'The Restobar',
    sub: '120 covers • Live music every Fri to Sat',
    desc: 'Open kitchen, copper bar, candle-lit booths. The everyday-soul of Atmosphere.',
    img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90',
    cta: 'Reserve a Table',
    action: 'reserve',
  },
  {
    title: 'Atmosphere Luxe',
    sub: 'Banquet hall • 80 to 350 guests',
    desc: 'Vaulted ceiling, programmable lights, stage and full AV, weddings & galas.',
    img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=90',
    cta: 'Plan an Event',
    action: 'luxe',
  },
  {
    title: 'Private Dining',
    sub: 'Intimate room • 10 to 24 guests',
    desc: 'A hidden chamber for milestone birthdays, anniversaries and chef tastings.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90',
    cta: 'Enquire Now',
    action: 'reserve',
  },
];

export const EXPERIENCES = [
  {
    day: 'Wednesday',
    title: 'Acoustic Sessions',
    note: 'Unplugged sets, slow service, candle hour.',
    time: '8:00 PM onwards',
  },
  {
    day: 'Friday',
    title: 'Live Band Night',
    note: 'In-house quartet across Bollywood, jazz & soul.',
    time: '9:00 PM onwards',
  },
  {
    day: 'Saturday',
    title: 'Resident DJ Set',
    note: 'Deep house, retro nu-disco, late-night bar menu.',
    time: '10:00 PM to 12:30 AM',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'The most cinematic dinner we have had in Mysuru. The smoked old fashioned alone is worth the drive from Bangalore.',
    name: 'Aanya R.',
    role: 'Foodie, Bangalore',
    rating: 5,
  },
  {
    quote:
      'We hosted 230 guests at Luxe for our reception. The team made it feel effortless, the lighting and the service were perfection.',
    name: 'Karthik & Meera',
    role: 'Wedding, March 2024',
    rating: 5,
  },
  {
    quote:
      'Lal maas, truffle risotto, and that burnt basque, a 4-hour table I did not want to leave. Atmosphere lives up to its name.',
    name: 'Rohan D.',
    role: 'Chef, Travel writer',
    rating: 5,
  },
  {
    quote:
      'The banquet hall is absolutely stunning. We hosted our wedding reception at Luxe By Atmosphere and every guest was blown away. The chandelier lighting, the food, the staff, perfection.',
    name: 'Divya & Suresh',
    role: 'Wedding Couple',
    rating: 5,
  },
  {
    quote:
      'Friday night live music sessions are a ritual for us now. The vibe, the food, the energy, nothing else like it in Mysore.',
    name: 'Karthik P.',
    role: 'Regular Guest',
    rating: 5,
  },
];

export const STATS = [
  { value: '12+', label: 'Years of hospitality' },
  { value: '1,175+', label: 'Five-star reviews' },
  { value: '5', label: 'Cuisines under one roof' },
  { value: '350', label: 'Max banquet capacity' },
];

export const MARQUEE_WORDS = [
  'Live Music',
  'Candlelit Nights',
  'Luxury Banquet',
  'Multi-Cuisine',
  'Crafted Cocktails',
  'Private Dining',
  'Wedding Receptions',
  'Chef Specials',
];


export const CUISINES = [
  {
    name: 'North Indian',
    note: 'Tandoor smoke, slow-cooked curries',
    img: 'https://images.unsplash.com/photo-1704984678074-74846832542a?w=900&q=90',
  },
  {
    name: 'Continental',
    note: 'Truffle, butter, char & cream',
    img: 'https://images.unsplash.com/photo-1704984678359-b8a4d2a70061?w=900&q=90',
  },
  {
    name: 'Chinese',
    note: 'Wok-fired, fermented, fiery',
    img: 'https://images.unsplash.com/photo-1598576887169-14a09393cb98?w=900&q=90',
  },
  {
    name: 'Pasta & Pizza',
    desc: 'Hand-rolled pasta, wood-fired pies',
    note: 'Hand-rolled pasta, wood-fired pies',
    img: 'https://images.unsplash.com/photo-1702466400648-ffbc2a291af2?w=900&q=90',
  },
  {
    name: 'Desserts & Bar',
    note: 'Smoked old fashioneds, basque cheesecake',
    img: 'https://images.pexels.com/photos/14748605/pexels-photo-14748605.jpeg?w=900&q=90',
  },
];

// Reels & Moments, vertical 9:16 video clips
export const REELS = [
  {
    title: 'Smoke & Spirits',
    sub: 'Bar craft',
    poster:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=90',
    video:
      'https://videos.pexels.com/video-files/3196274/3196274-hd_1080_1920_30fps.mp4',
  },
  {
    title: 'Tandoor in Motion',
    sub: 'Kitchen',
    poster:
      'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=900&q=90',
    video:
      'https://videos.pexels.com/video-files/4253325/4253325-uhd_1440_2560_25fps.mp4',
  },
  {
    title: 'Saturday Sessions',
    sub: 'Live music',
    poster:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=90',
    video:
      'https://videos.pexels.com/video-files/3209298/3209298-hd_1080_1920_25fps.mp4',
  },
  {
    title: 'Plated to Perfection',
    sub: 'Chef',
    poster:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=90',
    video:
      'https://videos.pexels.com/video-files/4254244/4254244-uhd_1440_2560_25fps.mp4',
  },
];

// Bank Offers, credit-card style offers
export const BANK_OFFERS = [
  {
    bank: 'HDFC Bank',
    domain: 'hdfcbank.com',
    title: '15% OFF',
    sub: 'on dining bills above ₹3,000',
    code: 'HDFC15',
    valid: 'Valid till 31 Dec 2025',
    gradient: 'linear-gradient(135deg, #c4560a 0%, #f56d0a 60%, #f7874d 100%)',
  },
  {
    bank: 'ICICI Bank',
    domain: 'icicibank.com',
    title: '20% OFF',
    sub: 'on weekend dinners (Fri to Sun)',
    code: 'ICICI20',
    valid: 'Valid till 30 Nov 2025',
    gradient: 'linear-gradient(135deg, #5a1a1a 0%, #b03030 60%, #e84a4a 100%)',
  },
  {
    bank: 'SBI Card',
    domain: 'sbicard.com',
    title: '10% CASHBACK',
    sub: 'minimum spend ₹2,500',
    code: 'SBI10',
    valid: 'Valid till 31 Jan 2026',
    gradient: 'linear-gradient(135deg, #0a2540 0%, #1e4a7a 60%, #3a78b8 100%)',
  },
  {
    bank: 'Axis Bank',
    domain: 'axisbank.com',
    title: 'BUY 1 GET 1',
    sub: 'on signature cocktails',
    code: 'AXISBOGO',
    valid: 'Valid Mon to Thu only',
    gradient: 'linear-gradient(135deg, #6a0d4b 0%, #a8226e 60%, #d83a8c 100%)',
  },
  {
    bank: 'Kotak Mahindra',
    domain: 'kotak.com',
    title: 'FREE DESSERT',
    sub: 'with any 2-course meal',
    code: 'KOTAKSWEET',
    valid: 'Valid till 31 Dec 2025',
    gradient: 'linear-gradient(135deg, #4a2c0f 0%, #8a5a2a 60%, #c9a882 100%)',
  },
  {
    bank: 'American Express',
    domain: 'americanexpress.com',
    title: 'PRIORITY SEATING',
    sub: '+ complimentary welcome drink',
    code: 'AMEXVIP',
    valid: 'AMEX Cards only',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 60%, #5a5a5a 100%)',
  },
];

// Live experience images for the "Live at Atmosphere" section
export const EXPERIENCE_IMAGES = [
  'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704731983_122201749286446255_7832553486323798210_n.jpg',
  'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_564651954_122177035604446255_8896991281199984757_n.jpg',
  'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_704507251_122201668016446255_657162141135626679_n.jpg',
];

// FULL MENU, 42 dishes across 10 categories. Curated for Atmosphere.
export const MENU_CATEGORIES = [
  { id: 'starters-veg', label: 'Starters · Veg', icon: 'Leaf' },
  { id: 'starters-nonveg', label: 'Starters · Non-Veg', icon: 'Flame' },
  { id: 'north-indian', label: 'North Indian Mains', icon: 'Soup' },
  { id: 'continental', label: 'Continental', icon: 'UtensilsCrossed' },
  { id: 'chinese', label: 'Chinese & Asian', icon: 'Wok' },
  { id: 'pasta-pizza', label: 'Pasta & Pizza', icon: 'Pizza' },
  { id: 'cocktails', label: 'Signature Cocktails', icon: 'Wine' },
  { id: 'mocktails', label: 'Mocktails', icon: 'GlassWater' },
  { id: 'desserts', label: 'Desserts', icon: 'Cake' },
  { id: 'spirits', label: 'Wines & Spirits', icon: 'GlassWine' },
];

export const MENU = [
  // ── Starters · Veg ───────────────────────────────────────────────
  {
    id: 'm01',
    cat: 'starters-veg',
    name: 'Tandoori Broccoli Malai',
    desc: 'Florets in cashew-yogurt marinade, charred over coal, kasundi mustard.',
    price: 380,
    veg: true,
    spicy: 1,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80',
  },
  {
    id: 'm02',
    cat: 'starters-veg',
    name: 'Burrata · Heirloom Tomato',
    desc: 'Creamy burrata, basil pesto, balsamic pearls, micro greens.',
    price: 520,
    veg: true,
    spicy: 0,
    tags: ['Chef Pick'],
    img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=900&q=80',
  },
  {
    id: 'm03',
    cat: 'starters-veg',
    name: 'Crispy Lotus Stem',
    desc: 'Wok-tossed in honey-chilli glaze, sesame, spring onion crown.',
    price: 360,
    veg: true,
    spicy: 2,
    tags: [],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80',
  },
  {
    id: 'm04',
    cat: 'starters-veg',
    name: 'Truffle Mushroom Croquettes',
    desc: 'Porcini & button mushroom, truffle oil, parmesan, smoked aioli.',
    price: 420,
    veg: true,
    spicy: 0,
    tags: ['New'],
    img: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=900&q=80',
  },

  // ── Starters · Non-Veg ───────────────────────────────────────────
  {
    id: 'm05',
    cat: 'starters-nonveg',
    name: 'Murgh Malai Tikka',
    desc: 'Cream-cheese marinated chicken, cardamom, mace, kasuri methi.',
    price: 480,
    veg: false,
    spicy: 1,
    tags: ['Bestseller'],
    img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=80',
  },
  {
    id: 'm06',
    cat: 'starters-nonveg',
    name: 'Galouti Kebab',
    desc: 'Lucknowi 70-spice mutton mince, melt-on-tongue, varqi paratha.',
    price: 560,
    veg: false,
    spicy: 2,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=900&q=80',
  },
  {
    id: 'm07',
    cat: 'starters-nonveg',
    name: 'Coorgi Pepper Pork',
    desc: 'Slow-cooked pork belly, Kodava spices, curry leaves, vinegar bite.',
    price: 580,
    veg: false,
    spicy: 3,
    tags: ['Regional'],
    img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=900&q=80',
  },
  {
    id: 'm08',
    cat: 'starters-nonveg',
    name: 'Tandoori Prawns',
    desc: 'Tiger prawns, ajwain marinade, charred lemon, mint-yogurt.',
    price: 720,
    veg: false,
    spicy: 1,
    tags: [],
    img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&q=80',
  },
  {
    id: 'm09',
    cat: 'starters-nonveg',
    name: 'Crispy Fish Amritsari',
    desc: 'Basa in carom & gram-flour batter, pickled onion, mint chutney.',
    price: 540,
    veg: false,
    spicy: 2,
    tags: [],
    img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=900&q=80',
  },

  // ── North Indian Mains ───────────────────────────────────────────
  {
    id: 'm10',
    cat: 'north-indian',
    name: 'Dal Atmosphere',
    desc: 'House black dal, 24-hour slow simmer, white butter & cream finish.',
    price: 420,
    veg: true,
    spicy: 1,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=900&q=80',
  },
  {
    id: 'm11',
    cat: 'north-indian',
    name: 'Paneer Lababdar',
    desc: 'Cottage cheese, tomato-cashew gravy, fenugreek, kashmiri chilli.',
    price: 460,
    veg: true,
    spicy: 1,
    tags: [],
    img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&q=80',
  },
  {
    id: 'm12',
    cat: 'north-indian',
    name: 'Subz Dum Biryani',
    desc: 'Aged basmati, garden vegetables, saffron, sealed clay-pot dum.',
    price: 480,
    veg: true,
    spicy: 2,
    tags: [],
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&q=80',
  },
  {
    id: 'm13',
    cat: 'north-indian',
    name: 'Butter Chicken',
    desc: 'Tandoor-smoked chicken, tomato-fenugreek velouté, white butter.',
    price: 520,
    veg: false,
    spicy: 1,
    tags: ['Bestseller'],
    img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=80',
  },
  {
    id: 'm14',
    cat: 'north-indian',
    name: 'Rogan Josh',
    desc: 'Kashmiri lamb, ratan jot, fennel, ginger, slow-braised 4 hours.',
    price: 620,
    veg: false,
    spicy: 2,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=900&q=80',
  },
  {
    id: 'm15',
    cat: 'north-indian',
    name: 'Hyderabadi Mutton Biryani',
    desc: 'Kacchi-style, hand-pounded spices, saffron, fried onions, raita.',
    price: 680,
    veg: false,
    spicy: 2,
    tags: ['Chef Pick'],
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&q=80',
  },

  // ── Continental ──────────────────────────────────────────────────
  {
    id: 'm16',
    cat: 'continental',
    name: 'Truffle Butter Risotto',
    desc: 'Carnaroli rice, black truffle, aged parmesan, brown butter foam.',
    price: 740,
    veg: true,
    spicy: 0,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80',
  },
  {
    id: 'm17',
    cat: 'continental',
    name: 'Pan-Seared Atlantic Salmon',
    desc: 'Crisp skin, lemon-caper butter, asparagus, herb oil.',
    price: 980,
    veg: false,
    spicy: 0,
    tags: ['Chef Pick'],
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80',
  },
  {
    id: 'm18',
    cat: 'continental',
    name: 'Grilled Tenderloin',
    desc: '8oz prime cut, red wine jus, pommes purée, charred shallots.',
    price: 1180,
    veg: false,
    spicy: 0,
    tags: [],
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80',
  },
  {
    id: 'm19',
    cat: 'continental',
    name: 'Wild Mushroom Stroganoff',
    desc: 'Cremini, porcini, shiitake, smoked paprika cream, pappardelle.',
    price: 620,
    veg: true,
    spicy: 0,
    tags: [],
    img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80',
  },

  // ── Chinese & Asian ──────────────────────────────────────────────
  {
    id: 'm20',
    cat: 'chinese',
    name: 'Sichuan Black Pepper Prawns',
    desc: 'Tiger prawns, fermented black bean, scallion, Shaoxing wine.',
    price: 780,
    veg: false,
    spicy: 3,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=900&q=80',
  },
  {
    id: 'm21',
    cat: 'chinese',
    name: 'Kung Pao Chicken',
    desc: 'Diced chicken, dried red chillies, roasted peanuts, dark vinegar.',
    price: 540,
    veg: false,
    spicy: 3,
    tags: [],
    img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=900&q=80',
  },
  {
    id: 'm22',
    cat: 'chinese',
    name: 'Mapo Tofu',
    desc: 'Silken tofu, Sichuan peppercorns, fermented chilli bean paste.',
    price: 460,
    veg: true,
    spicy: 3,
    tags: [],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80',
  },
  {
    id: 'm23',
    cat: 'chinese',
    name: 'Burnt Garlic Fried Rice',
    desc: 'Jasmine rice, charred garlic, scallions, sesame oil.',
    price: 360,
    veg: true,
    spicy: 1,
    tags: [],
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900&q=80',
  },
  {
    id: 'm24',
    cat: 'chinese',
    name: 'Hakka Pan-Fried Noodles',
    desc: 'Egg noodles, bean sprouts, exotic veg, chilli garlic sauce.',
    price: 380,
    veg: true,
    spicy: 2,
    tags: [],
    img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=900&q=80',
  },

  // ── Pasta & Pizza ────────────────────────────────────────────────
  {
    id: 'm25',
    cat: 'pasta-pizza',
    name: 'Spaghetti Aglio Olio',
    desc: 'Garlic confit, chilli flakes, parsley, parmesan, EVOO.',
    price: 480,
    veg: true,
    spicy: 1,
    tags: [],
    img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=900&q=80',
  },
  {
    id: 'm26',
    cat: 'pasta-pizza',
    name: 'Penne Arrabiata · Burrata',
    desc: 'San Marzano tomato, chilli, basil, pulled burrata centre.',
    price: 540,
    veg: true,
    spicy: 2,
    tags: ['New'],
    img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80',
  },
  {
    id: 'm27',
    cat: 'pasta-pizza',
    name: 'Margherita D.O.P.',
    desc: 'Wood-fired sourdough base, San Marzano, fior di latte, basil.',
    price: 560,
    veg: true,
    spicy: 0,
    tags: [],
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=80',
  },
  {
    id: 'm28',
    cat: 'pasta-pizza',
    name: 'Diavola · Spicy Salami',
    desc: 'Spicy pepperoni, mozzarella, chilli oil, oregano.',
    price: 640,
    veg: false,
    spicy: 2,
    tags: [],
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80',
  },

  // ── Signature Cocktails ──────────────────────────────────────────
  {
    id: 'm29',
    cat: 'cocktails',
    name: 'Smoked Old Fashioned',
    desc: 'Bourbon, brown sugar, orange bitters, applewood smoke.',
    price: 540,
    veg: true,
    spicy: 0,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80',
  },
  {
    id: 'm30',
    cat: 'cocktails',
    name: 'Lavender Gin Sour',
    desc: 'Botanical gin, lavender honey, lemon, aquafaba foam.',
    price: 520,
    veg: true,
    spicy: 0,
    tags: ['Chef Pick'],
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80',
  },
  {
    id: 'm31',
    cat: 'cocktails',
    name: 'Mysuru Negroni',
    desc: 'Gin, Campari, sweet vermouth, jaggery, orange peel.',
    price: 560,
    veg: true,
    spicy: 0,
    tags: ['House'],
    img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=900&q=80',
  },
  {
    id: 'm32',
    cat: 'cocktails',
    name: 'Espresso Martini',
    desc: 'Vodka, fresh espresso, kahlúa, cocoa rim.',
    price: 520,
    veg: true,
    spicy: 0,
    tags: [],
    img: 'https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=900&q=80',
  },
  {
    id: 'm33',
    cat: 'cocktails',
    name: 'Chilli Tamarind Margarita',
    desc: 'Tequila, tamarind, lime, chilli rim, mezcal float.',
    price: 540,
    veg: true,
    spicy: 2,
    tags: ['Spicy'],
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900&q=80',
  },

  // ── Mocktails ────────────────────────────────────────────────────
  {
    id: 'm34',
    cat: 'mocktails',
    name: 'Cucumber · Mint Cooler',
    desc: 'Cold-pressed cucumber, mint, lime, soda, sea salt.',
    price: 280,
    veg: true,
    spicy: 0,
    tags: [],
    img: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=900&q=80',
  },
  {
    id: 'm35',
    cat: 'mocktails',
    name: 'Virgin Smoked Mojito',
    desc: 'Lime, mint, applewood smoke, ginger ale top.',
    price: 320,
    veg: true,
    spicy: 0,
    tags: ['New'],
    img: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=900&q=80',
  },
  {
    id: 'm36',
    cat: 'mocktails',
    name: 'Berry Basil Smash',
    desc: 'Mixed berries, basil, lime, tonic, edible flowers.',
    price: 300,
    veg: true,
    spicy: 0,
    tags: [],
    img: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900&q=80',
  },

  // ── Desserts ─────────────────────────────────────────────────────
  {
    id: 'm37',
    cat: 'desserts',
    name: 'Burnt Basque Cheesecake',
    desc: 'Caramelised top, cloud-soft centre, sea salt, espresso shot.',
    price: 360,
    veg: true,
    spicy: 0,
    tags: ['Signature'],
    img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&q=80',
  },
  {
    id: 'm38',
    cat: 'desserts',
    name: 'Dark Chocolate Fondant',
    desc: 'Molten 70% Valrhona, vanilla ice cream, raspberry coulis.',
    price: 380,
    veg: true,
    spicy: 0,
    tags: ['Bestseller'],
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&q=80',
  },
  {
    id: 'm39',
    cat: 'desserts',
    name: 'Tiramisu Atmosphere',
    desc: 'Mascarpone, espresso-soaked savoiardi, cocoa, gold leaf.',
    price: 340,
    veg: true,
    spicy: 0,
    tags: [],
    img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80',
  },
  {
    id: 'm40',
    cat: 'desserts',
    name: 'Gulab Jamun Cheesecake',
    desc: 'Gulab jamun crumb, cardamom cream, rose syrup, pista shards.',
    price: 360,
    veg: true,
    spicy: 0,
    tags: ['House'],
    img: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=900&q=80',
  },

  // ── Wines & Spirits ──────────────────────────────────────────────
  {
    id: 'm41',
    cat: 'spirits',
    name: 'Sula Dindori Reserve Shiraz',
    desc: 'Nashik valley, plum & black pepper, oak-aged 12 months.',
    price: 480,
    veg: true,
    spicy: 0,
    tags: ['Glass'],
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
  },
  {
    id: 'm42',
    cat: 'spirits',
    name: 'Glenfiddich 12 · Single Malt',
    desc: 'Speyside, pear & oak, 30ml dram with branch water.',
    price: 720,
    veg: true,
    spicy: 0,
    tags: ['Premium'],
    img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=900&q=80',
  },
];

export const GALLERY_PREVIEW = [
  {
    src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_554769610_122174997980446255_8515930713371207270_n.jpg',
    alt: 'Candle-lit interior ambience',
    span: 'tall',
  },
  {
    src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_569358712_122178513500446255_5174338856897214695_n.jpg',
    alt: 'Warm group dining',
    span: 'wide',
  },
  {
    src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_572100515_122178922808446255_8361792981920876432_n.jpg',
    alt: 'Elegant table candle setup',
    span: 'normal',
  },
  {
    src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_629829495_122190395396446255_858127114710782275_n.jpg',
    alt: 'Exquisite cocktail',
    span: 'normal',
  },
  {
    src: 'https://ik.imagekit.io/wi9efnjb4/atmosphere%20/SaveClip.App_599949177_122185082636446255_1050253618896993597_n.jpg',
    alt: 'Atmosphere signature celebration',
    span: 'wide',
  },
];
