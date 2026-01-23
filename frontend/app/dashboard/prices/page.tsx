'use client';

// HACKATHON DEMO MODE: Placeholder page

import Link from 'next/link';
import { Button } from '@/components/ui';

const MOCK_PRICES = [
  { id: 1, region: 'Jakarta', product: 'Rice', price: 12500, unit: 'IDR/kg', trend: 'up', change: '+2.3%' },
  { id: 2, region: 'Jakarta', product: 'Corn', price: 8750, unit: 'IDR/kg', trend: 'down', change: '-1.5%' },
  { id: 3, region: 'Surabaya', product: 'Rice', price: 11800, unit: 'IDR/kg', trend: 'stable', change: '0%' },
  { id: 4, region: 'Surabaya', product: 'Soy', price: 15200, unit: 'IDR/kg', trend: 'up', change: '+4.1%' },
  { id: 5, region: 'Bandung', product: 'Rice', price: 12200, unit: 'IDR/kg', trend: 'up', change: '+1.8%' },
  { id: 6, region: 'Bandung', product: 'Wheat', price: 9500, unit: 'IDR/kg', trend: 'down', change: '-0.5%' },
];

export default function PricesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-100 transition-colors">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-300">Arbitrum Sepolia</span>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm text-amber-300">
            🎯 <strong>Demo Mode</strong> – Mock data shown below. Real blockchain integration coming soon.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Food Prices</h1>
          <p className="text-slate-400">Real-time pricing across all regions</p>
        </div>

        {/* Prices Grid */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Region</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">24h Change</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {MOCK_PRICES.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">{item.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-100">
                      {item.price.toLocaleString()} <span className="text-slate-500">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          item.trend === 'up' ? 'text-green-400' : item.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                        }`}
                      >
                        {item.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.trend === 'up'
                            ? 'bg-green-500/20 text-green-300'
                            : item.trend === 'down'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-slate-500/20 text-slate-300'
                        }`}
                      >
                        {item.trend === 'up' ? '📈 Rising' : item.trend === 'down' ? '📉 Falling' : '➡️ Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
