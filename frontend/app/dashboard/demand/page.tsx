'use client';

import Link from 'next/link';

export default function DemandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-100 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm text-amber-300">🎯 <strong>Demo Mode</strong> – Feature coming soon</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Demand Signals</h1>
          <p className="text-slate-400 mb-8">Market demand analytics and forecasting</p>
          <div className="max-w-md mx-auto bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <p className="text-slate-300">View aggregated demand signals from buyers and distributors across all regions.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
