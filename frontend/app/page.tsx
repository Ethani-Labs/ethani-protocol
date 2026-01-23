'use client';

// HACKATHON DEMO MODE: Direct redirect to dashboard
// Production flow (landing → register → role → dashboard) will be restored later

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately to dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Loading ETHANI Dashboard...</h1>
        <p className="text-slate-400">Demo Mode</p>
      </div>
    </div>
  );
}

/*
// ORIGINAL LANDING PAGE CODE (KEPT FOR PRODUCTION RESTORE)
// Uncomment this section and remove redirect logic above to restore

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-4xl">🌾</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">ETHANI</h1>
            <p className="text-xs text-slate-400">Stable Prices for Everyone</p>
          </div>
        </Link>
        <nav className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-slate-100 font-medium transition-colors"
          >
            Login
          </Link>
          <Link href="/register">
            <Button variant="primary" size="md">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        ... (full hero section content)
      </main>

      <footer className="border-t border-slate-700 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-400">
          <p>© 2026 ETHANI. Built for fair food prices everywhere.</p>
        </div>
      </footer>
    </div>
  );
}

END OF ORIGINAL LANDING PAGE CODE
*/
