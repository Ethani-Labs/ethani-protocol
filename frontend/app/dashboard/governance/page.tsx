'use client';

import Link from 'next/link';

export default function GovernancePage() {
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
          <p className="text-center text-sm text-amber-300">🎯 <strong>Demo Mode</strong> – Read-only view</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Governance Rules</h1>
          <p className="text-slate-400">System parameters and pricing rules</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Pricing Rules</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Critical Shortage Multiplier:</span>
                <span className="text-slate-100 font-medium">+15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shortage Multiplier:</span>
                <span className="text-slate-100 font-medium">+8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Surplus Multiplier:</span>
                <span className="text-slate-100 font-medium">-10%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
