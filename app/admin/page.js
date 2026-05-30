'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f0a05] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 border-2 border-gold border-t-transparent animate-spin rounded-full mx-auto" />
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-sans">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
