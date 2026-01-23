'use client';

import React from 'react';
import { Card, Badge, Metric, Alert } from '@/components/ui';
import { API_URL } from '@/lib/config';

interface User {
  name: string;
  role: string;
  location: string;
}

export default function LivestockFarmerDashboard() {
  const [user, setUser] = React.useState<User | null>(null);
  const [recentSales] = React.useState([
    { date: '2025-12-28', livestock: 'Sapi (Cattle)', units: 5, pricePerUnit: 8000000, total: 40000000 },
    { date: '2025-12-26', livestock: 'Ayam (Chicken)', units: 50, pricePerUnit: 50000, total: 2500000 },
    { date: '2025-12-24', livestock: 'Kambing (Goat)', units: 8, pricePerUnit: 1500000, total: 12000000 },
  ]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('ethani_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">🐄 Livestock Farming Dashboard</h1>
          <p className="text-slate-400">Manage your livestock sales with fair, transparent pricing</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 p-6">
            <Metric label="Total Livestock Sold" value="63" unit="units" />
          </Card>
          <Card className="bg-slate-800 p-6">
            <Metric label="Total Revenue" value="₱54.5M" />
          </Card>
          <Card className="bg-slate-800 p-6">
            <Metric label="Fair Deals" value="98%" unit="rate" />
          </Card>
          <Card className="bg-slate-800 p-6">
            <Metric label="Loyalty Points" value="2,450" />
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Livestock Categories */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Livestock Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded p-4 text-center">
                  <div className="text-3xl mb-2">🐄</div>
                  <p className="text-slate-300 font-medium">Cattle (Sapi)</p>
                  <p className="text-amber-500 font-bold">₱8.0M/unit</p>
                  <p className="text-slate-400 text-sm">Today's stable price</p>
                </div>
                <div className="bg-slate-700 rounded p-4 text-center">
                  <div className="text-3xl mb-2">🐔</div>
                  <p className="text-slate-300 font-medium">Chicken (Ayam)</p>
                  <p className="text-amber-500 font-bold">₱50K/unit</p>
                  <p className="text-slate-400 text-sm">Today's stable price</p>
                </div>
                <div className="bg-slate-700 rounded p-4 text-center">
                  <div className="text-3xl mb-2">🐐</div>
                  <p className="text-slate-300 font-medium">Goat (Kambing)</p>
                  <p className="text-amber-500 font-bold">₱1.5M/unit</p>
                  <p className="text-slate-400 text-sm">Today's stable price</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-slate-800 p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded transition">
                  📝 Report Livestock
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition">
                  📊 View Prices
                </button>
                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded transition">
                  🏆 Loyalty Program
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Sales */}
        <Card className="bg-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Recent Sales</h2>
          <div className="space-y-4">
            {recentSales.map((sale, i) => (
              <div key={i} className="bg-slate-700 rounded p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-slate-100 font-medium">{sale.livestock}</p>
                  <p className="text-slate-400 text-sm">{sale.date} · {sale.units} units</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">₱{(sale.total / 1000000).toFixed(1)}M</p>
                  <p className="text-slate-400 text-sm">₱{(sale.pricePerUnit / 1000).toFixed(0)}K/unit</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing Rules */}
        <div className="mt-8">
          <Card className="bg-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Fair Pricing Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-green-400 font-bold">✓ Critical Shortage (Ratio &gt; 1.30)</p>
                <p className="text-slate-300">Price increase: +15%</p>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-blue-400 font-bold">→ Shortage (Ratio &gt; 1.10)</p>
                <p className="text-slate-300">Price increase: +8%</p>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-amber-400 font-bold">◉ Balanced (0.80-1.10)</p>
                <p className="text-slate-300">Price: No change (0%)</p>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-red-400 font-bold">↓ Surplus (Ratio &lt; 0.80)</p>
                <p className="text-slate-300">Price decrease: -10%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
