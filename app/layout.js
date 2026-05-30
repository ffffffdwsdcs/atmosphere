import './globals.css';
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import LenisProvider from '@/components/atmosphere/LenisProvider';
import CustomCursor from '@/components/atmosphere/CustomCursor';
import Preloader from '@/components/atmosphere/Preloader';
import ScrollProgress from '@/components/atmosphere/ScrollProgress';
import Navbar from '@/components/atmosphere/Navbar';
import Footer from '@/components/atmosphere/Footer';
import { ReservationProvider } from '@/components/atmosphere/ReservationContext';
import ScrollToTop from '@/components/atmosphere/ScrollToTop';

// Initialize the local Albertus Nova font family matrix natively via Next.js
const albertusNova = localFont({
  src: [
    {
      path: '../public/fonts/AlbertusNovaThin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/AlbertusNovaLight.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/AlbertusNova.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/AlbertusNova-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/AlbertusNovaBlack.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-albertus-local', // Matches your tailwind variable binding
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-google',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal'],
  variable: '--font-dm-sans-google',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-playfair-google',
  display: 'swap',
});

export const metadata = {
  title: 'Atmosphere Mysuru, Multi-Cuisine Restobar & Luxury Banquet',
  description:
    "Mysuru's finest multi-cuisine restobar and luxury banquet venue. North Indian, Continental, Chinese, Pasta & Desserts. Live music, candle-lit nights, banquet hall and grand event spaces.",
  icons: {
    icon: '/images/logo/favicon-96x96.png',
    shortcut: '/images/logo/favicon-96x96.png',
    apple: '/images/logo/favicon-96x96.png',
  },
  keywords: [
    'Atmosphere Mysore',
    'Restaurant Mysore',
    'Banquet Hall Mysore',
    'Luxe Mysore',
    'Restobar Mysore',
    'BEML Layout Restaurant',
  ],
  openGraph: {
    title: 'Atmosphere Mysuru, Where every meal becomes a memory',
    description: "Mysuru's finest multi-cuisine restobar & luxury banquet venue.",
    type: 'website',
    locale: 'en_IN',
  },
};

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Atmosphere',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'BEML Layout 2nd Stage, Rajarajeshwari Nagar',
    addressLocality: 'Mysuru',
    addressRegion: 'Karnataka',
    postalCode: '570033',
    addressCountry: 'IN',
  },
  telephone: '+919110252593',
  servesCuisine: ['North Indian', 'Continental', 'Chinese', 'Pasta', 'Desserts'],
  priceRange: '₹₹',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.4',
    reviewCount: '1175',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${albertusNova.variable} ${cormorant.variable} ${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      <body className="bg-espresso text-ivory font-sans antialiased">
        <Providers>
          <ReservationProvider>
            <Preloader />
            <LenisProvider />
            <CustomCursor />
            <ScrollProgress />
            <ScrollToTop />
            <Navbar />
            <main className="relative overflow-x-clip w-full">{children}</main>
            <Footer />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#1a1008',
                  color: '#fdf6f0',
                  border: '1px solid rgba(201,168,130,0.35)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  letterSpacing: '0.02em',
                  borderRadius: '2px',
                },
                success: { iconTheme: { primary: '#f56d0a', secondary: '#fdf6f0' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fdf6f0' } },
              }}
            />
          </ReservationProvider>
        </Providers>
      </body>
    </html>
  );
}