'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
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

      {/* Main Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Problem Statement */}
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl font-bold text-slate-100">
              Fair Food Prices
              <br />
              <span className="text-green-400">for Everyone</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              A transparent, rule-based system that stabilizes food prices fairly. Built for farmers, distributors, and buyers.
            </p>
          </div>

          {/* Why ETHANI */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Transparent Rules</h3>
              <p className="text-sm text-slate-400">
                Every price is calculated using simple, auditable rules. No hidden algorithms.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Blockchain Verified</h3>
              <p className="text-sm text-slate-400">
                All prices recorded on blockchain for permanent transparency and auditability.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Fair to All</h3>
              <p className="text-sm text-slate-400">
                Protects farmers from low prices and buyers from price spikes during shortages.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 my-12">
            <h3 className="text-2xl font-bold text-slate-100 mb-6">How It Works</h3>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Report Supply & Demand</p>
                  <p className="text-sm text-slate-400">Input current market conditions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-100">System Calculates Fair Price</p>
                  <p className="text-sm text-slate-400">Using transparent, rule-based formulas</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Price is Recorded & Applied</p>
                  <p className="text-sm text-slate-400">On blockchain, immediately available</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Already have an account? Login
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-400">
          <p>© 2026 ETHANI. Built for fair food prices everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
