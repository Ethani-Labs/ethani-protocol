'use client';

import { useEffect, useState } from 'react';
import { Card, Badge, Button, Metric, Alert } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  phone: string;
  name: string;
  location: string;
  role: string;
  points: number;
  created_at: string;
}

interface ImpactData {
  farmers_supported: number;
  regions_active: number;
  total_volume_processed: number;
  price_stability_score: number;
  carbon_offset_tons: number;
}

export default function InvestorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock impact data
  const [impact] = useState<ImpactData>({
    farmers_supported: 487,
    regions_active: 12,
    total_volume_processed: 15420,
    price_stability_score: 94,
    carbon_offset_tons: 312,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('ethani_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch (err) {
      setError('Session invalid');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8">
        <Alert variant="error">User not found. Please login again.</Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
          💰 Investor Impact Dashboard
        </h1>
        <p className="text-slate-400">
          {user.name} • Track your support of the ETHANI system
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Mission Statement */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-700/30">
        <h2 className="text-lg font-bold text-slate-100 mb-2">🎯 Our Mission</h2>
        <p className="text-slate-300">
          Supporting farmers, stabilizing food prices, and building a circular food economy.
          Your investment helps rural communities thrive and consumers access fair prices.
        </p>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <Metric
            label="Farmers Supported"
            value={impact.farmers_supported}
            icon="👨‍🌾"
          />
        </Card>
        <Card>
          <Metric
            label="Active Regions"
            value={impact.regions_active}
            icon="🗺️"
          />
        </Card>
        <Card>
          <Metric
            label="Volume Processed"
            value={(impact.total_volume_processed / 1000).toFixed(1)}
            unit="tonnes"
            icon="📦"
          />
        </Card>
        <Card>
          <Metric
            label="Price Stability"
            value={impact.price_stability_score}
            unit="/100"
            icon="📊"
          />
        </Card>
        <Card>
          <Metric
            label="Carbon Offset"
            value={impact.carbon_offset_tons}
            unit="tonnes"
            icon="🌱"
          />
        </Card>
        <Card>
          <Metric
            label="Member Points"
            value={user.points}
            icon="⭐"
          />
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">📈 System Health</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">Price Stability</span>
              <span className="text-slate-300 font-medium">{impact.price_stability_score}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${impact.price_stability_score}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">Farmer Coverage</span>
              <span className="text-slate-300 font-medium">72%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '72%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">Circular Economy Participation</span>
              <span className="text-slate-300 font-medium">54%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full"
                style={{ width: '54%' }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Regional Impact */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">🗺️ Regional Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Central Java', farmers: 128, active: true },
            { name: 'East Java', farmers: 95, active: true },
            { name: 'West Java', farmers: 112, active: true },
            { name: 'Sumatra', farmers: 78, active: true },
            { name: 'Kalimantan', farmers: 51, active: false },
            { name: 'Sulawesi', farmers: 23, active: false },
          ].map((region) => (
            <div
              key={region.name}
              className="p-3 bg-slate-900 border border-slate-700 rounded flex justify-between items-center"
            >
              <div>
                <p className="text-slate-100 font-medium">{region.name}</p>
                <p className="text-slate-400 text-sm">{region.farmers} farmers</p>
              </div>
              <Badge variant={region.active ? 'success' : 'default'}>
                {region.active ? 'Active' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Impact Stories */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">📰 Impact Stories</h2>
        <div className="space-y-3">
          <div className="p-3 bg-slate-900 border border-slate-700 rounded">
            <p className="text-slate-100 font-medium">🌾 Bumah's Rice Farm Stabilized</p>
            <p className="text-slate-400 text-sm">
              Central Java farmer Bumah reports 28% more stable income this season thanks to ETHANI pricing.
            </p>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-700 rounded">
            <p className="text-slate-100 font-medium">♻️ Plastic Recycling Hub Launched</p>
            <p className="text-slate-400 text-sm">
              New waste processing facility in Surabaya now processes 2 tonnes/day of plastic waste.
            </p>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-700 rounded">
            <p className="text-slate-100 font-medium">🐔 Livestock Network Growing</p>
            <p className="text-slate-400 text-sm">
              Chicken suppliers in West Java report 15% price premium through ETHANI fair pricing.
            </p>
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">🎓 How Your Support Works</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="text-2xl">1️⃣</div>
            <div>
              <p className="text-slate-100 font-medium">Funding Transparency</p>
              <p className="text-slate-400 text-sm">Your investment directly supports farmer networks and waste processing infrastructure.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">2️⃣</div>
            <div>
              <p className="text-slate-100 font-medium">Rule-Based System</p>
              <p className="text-slate-400 text-sm">No AI speculation. All pricing follows transparent, auditable supply-demand rules.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">3️⃣</div>
            <div>
              <p className="text-slate-100 font-medium">Impact Tracking</p>
              <p className="text-slate-400 text-sm">Blockchain records every transaction for complete transparency.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">4️⃣</div>
            <div>
              <p className="text-slate-100 font-medium">Circular Economy</p>
              <p className="text-slate-400 text-sm">Your support extends to waste processing and environmental sustainability.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Alert variant="success">
        Thank you for supporting fair food prices and sustainable agriculture. Check back regularly for updated impact metrics.
      </Alert>
    </div>
  );
}
