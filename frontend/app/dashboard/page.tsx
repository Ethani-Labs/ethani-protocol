'use client';

// HACKATHON DEMO MODE: Full dashboard with mock data
// No authentication/role required for demo purposes

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

// DEMO MODE: Mock data for hackathon
const MOCK_DATA = {
  marketStatus: 'Stable',
  avgPriceIndex: 1234,
  activeRegions: 42,
  activeParticipants: 1547,
  recentPrices: [
    { region: 'Jakarta', product: 'Rice', price: '12,500', change: '+2%', status: 'up' },
    { region: 'Surabaya', product: 'Corn', price: '8,750', change: '-1%', status: 'down' },
    { region: 'Bandung', product: 'Soy', price: '15,200', change: '0%', status: 'stable' },
  ],
};

export default function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    // Demo mode: just toggle state
    setWalletConnected(!walletConnected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <span className="text-4xl">🌾</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">ETHANI</h1>
                <p className="text-xs text-slate-400">Food Price Stabilization</p>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Network Badge */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-300">Arbitrum Sepolia</span>
              </div>

              {/* Wallet Button */}
              <Button
                variant={walletConnected ? 'outline' : 'primary'}
                size="md"
                onClick={handleConnectWallet}
              >
                {walletConnected ? (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    0x02cE...778e
                  </span>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm text-amber-300">
            🎯 <strong>Demo Mode</strong> – Hackathon preview with mock data. Full integration coming soon.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h2>
          <p className="text-slate-400">Real-time market insights and system controls</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Market Status */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <span className="text-xs font-medium text-green-300">{MOCK_DATA.marketStatus}</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">Market Status</h3>
            <p className="text-2xl font-bold text-slate-100">Healthy</p>
          </div>

          {/* Price Index */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-xs text-blue-300">+5.2%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">Avg Price Index</h3>
            <p className="text-2xl font-bold text-slate-100">{MOCK_DATA.avgPriceIndex.toLocaleString()}</p>
          </div>

          {/* Active Regions */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <span className="text-2xl">🗺️</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">Active Regions</h3>
            <p className="text-2xl font-bold text-slate-100">{MOCK_DATA.activeRegions}</p>
          </div>

          {/* Participants */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <span className="text-xs text-orange-300">+12%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">Participants</h3>
            <p className="text-2xl font-bold text-slate-100">{MOCK_DATA.activeParticipants.toLocaleString()}</p>
          </div>
        </div>

        {/* Feature Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* View Prices */}
            <Link href="/dashboard/prices" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 hover:bg-slate-800/70 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <span className="text-3xl">📈</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">View Food Prices</h4>
                    <p className="text-sm text-slate-400">Real-time pricing across regions</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-green-400 transition-colors">→</span>
                </div>
              </div>
            </Link>

            {/* Submit Supply */}
            <Link href="/dashboard/supply" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <span className="text-3xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">Submit Supply Data</h4>
                    <p className="text-sm text-slate-400">Report available inventory</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-blue-400 transition-colors">→</span>
                </div>
              </div>
            </Link>

            {/* View Demand */}
            <Link href="/dashboard/demand" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <span className="text-3xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">View Demand Signals</h4>
                    <p className="text-sm text-slate-400">Market demand analytics</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-purple-400 transition-colors">→</span>
                </div>
              </div>
            </Link>

            {/* Circular Economy */}
            <Link href="/dashboard/circular-economy" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/70 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                    <span className="text-3xl">♻️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">Circular Economy</h4>
                    <p className="text-sm text-slate-400">Sustainability tracking</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-emerald-400 transition-colors">→</span>
                </div>
              </div>
            </Link>

            {/* Governance */}
            <Link href="/dashboard/governance" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 hover:bg-slate-800/70 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">Governance Rules</h4>
                    <p className="text-sm text-slate-400">System rules & parameters</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-amber-400 transition-colors">→</span>
                </div>
              </div>
            </Link>

            {/* Analytics */}
            <Link href="/dashboard/analytics" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 hover:bg-slate-800/70 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                    <span className="text-3xl">📉</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1">Market Analytics</h4>
                    <p className="text-sm text-slate-400">Trends & insights</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-pink-400 transition-colors">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Price Updates */}
        <div>
          <h3 className="text-xl font-bold text-slate-100 mb-4">Recent Price Updates</h3>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Price (IDR/kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {MOCK_DATA.recentPrices.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-100">{item.region}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-300">{item.product}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-100">{item.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            item.status === 'up'
                              ? 'text-green-400'
                              : item.status === 'down'
                              ? 'text-red-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-400">
            <p>© 2026 ETHANI – Fair Food Prices for Everyone</p>
            <p className="mt-1 text-xs text-slate-500">
              Built on Arbitrum • Smart Contracts Verified • Demo Mode Active
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
