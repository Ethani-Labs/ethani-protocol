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

interface SupplyReport {
  id: number;
  food_category: string;
  supply_units: number;
  timestamp: string;
}

export default function LivestockFarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [supplies, setSupplies] = useState<SupplyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    livestock_type: 'cattle',
    quantity: 100,
    weight_kg: 0,
  });

  useEffect(() => {
    // Get user from localStorage
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

  const handleReportProduction = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/supply-report?phone=${user.phone}&region=${user.location}&food_category=${formData.livestock_type}&supply_units=${formData.quantity}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setError('');
        setShowForm(false);
        setFormData({ livestock_type: 'cattle', quantity: 100, weight_kg: 0 });
        // Refresh data
        setSupplies([
          ...supplies,
          {
            id: supplies.length + 1,
            food_category: formData.livestock_type,
            supply_units: formData.quantity,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setError('Failed to report production');
      }
    } catch (err) {
      setError('Error reporting production');
    } finally {
      setIsLoading(false);
    }
  };

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
          🐄 Livestock Farm Dashboard
        </h1>
        <p className="text-slate-400">
          {user.name} • {user.location}
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Metric
            label="Total Reports"
            value={supplies.length}
            icon="📊"
          />
        </Card>
        <Card>
          <Metric
            label="Total Livestock"
            value={supplies.reduce((sum, s) => sum + s.supply_units, 0)}
            unit="animals"
            icon="🐄"
          />
        </Card>
        <Card>
          <Metric
            label="Loyalty Points"
            value={user.points}
            icon="⭐"
          />
        </Card>
        <Card>
          <Metric
            label="Member Since"
            value={new Date(user.created_at).toLocaleDateString()}
            icon="📅"
          />
        </Card>
      </div>

      {/* Production Report Form */}
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100">📋 Report Livestock Production</h2>
            <Badge variant={showForm ? 'success' : 'default'}>
              {showForm ? 'Open' : 'Closed'}
            </Badge>
          </div>

          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
            >
              Report Production
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div>
                <label className="text-sm text-slate-400">Livestock Type</label>
                <select
                  value={formData.livestock_type}
                  onChange={(e) =>
                    setFormData({ ...formData, livestock_type: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-green-600 focus:outline-none"
                >
                  <option value="cattle">Cattle (Sapi)</option>
                  <option value="chicken">Chicken (Ayam)</option>
                  <option value="goat">Goat (Kambing)</option>
                  <option value="duck">Duck (Bebek)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400">Quantity (animals)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-green-600 focus:outline-none"
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">Average Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, weight_kg: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-green-600 focus:outline-none"
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleReportProduction}
                  isLoading={isLoading}
                >
                  Submit Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Production Reports */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">📈 Recent Reports</h2>
        {supplies.length === 0 ? (
          <p className="text-slate-400">No production reports yet. Start reporting to earn points!</p>
        ) : (
          <div className="space-y-3">
            {supplies.map((supply) => (
              <div
                key={supply.id}
                className="p-3 bg-slate-900 border border-slate-700 rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-slate-100 font-medium capitalize">
                    {supply.food_category.replace('_', ' ')}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {new Date(supply.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="success">{supply.supply_units} animals</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pricing Reference */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">📊 Pricing Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-red-900/20 border border-red-700/50 rounded">
            <p className="text-red-400 font-medium">Critical Shortage</p>
            <p className="text-slate-400 text-sm">Ratio &gt; 1.30 → +15%</p>
          </div>
          <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded">
            <p className="text-amber-400 font-medium">Shortage</p>
            <p className="text-slate-400 text-sm">Ratio &gt; 1.10 → +8%</p>
          </div>
          <div className="p-3 bg-green-900/20 border border-green-700/50 rounded">
            <p className="text-green-400 font-medium">Balanced</p>
            <p className="text-slate-400 text-sm">0.80–1.10 → 0%</p>
          </div>
          <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded">
            <p className="text-blue-400 font-medium">Surplus</p>
            <p className="text-slate-400 text-sm">Ratio &lt; 0.80 → -10%</p>
          </div>
        </div>
      </Card>

      {/* Info Alert */}
      <Alert variant="info">
        Each production report earns you 10 loyalty points. These points represent your contribution to the ETHANI system.
      </Alert>
    </div>
  );
}
