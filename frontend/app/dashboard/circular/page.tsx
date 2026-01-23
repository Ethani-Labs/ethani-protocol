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

interface WasteReport {
  id: number;
  waste_type: string;
  quantity_kg: number;
  processing_method: string;
  energy_credits: number;
  timestamp: string;
}

export default function CircularEconomyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [wasteReports, setWasteReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    waste_type: 'plastic',
    quantity_kg: 0,
    processing_method: 'recycled',
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

  const handleReportWaste = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/waste-report?phone=${user.phone}&waste_type=${formData.waste_type}&quantity_kg=${formData.quantity_kg}&processing_method=${formData.processing_method}`,
        { method: 'POST' }
      );

      if (response.ok) {
        const data = await response.json();
        setError('');
        setShowForm(false);

        const newReport: WasteReport = {
          id: wasteReports.length + 1,
          waste_type: formData.waste_type,
          quantity_kg: formData.quantity_kg,
          processing_method: formData.processing_method,
          energy_credits: data.energy_credits,
          timestamp: new Date().toISOString(),
        };

        setWasteReports([newReport, ...wasteReports]);
        setFormData({ waste_type: 'plastic', quantity_kg: 0, processing_method: 'recycled' });
      } else {
        setError('Failed to report waste');
      }
    } catch (err) {
      setError('Error reporting waste');
    } finally {
      setIsLoading(false);
    }
  };

  const totalWaste = wasteReports.reduce((sum, r) => sum + r.quantity_kg, 0);
  const totalCredits = wasteReports.reduce((sum, r) => sum + r.energy_credits, 0);

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
          ♻️ Circular Economy Dashboard
        </h1>
        <p className="text-slate-400">
          {user.name} • {user.location} • Waste Processing & Transformation
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Metric
            label="Total Waste Processed"
            value={totalWaste.toFixed(1)}
            unit="kg"
            icon="📦"
          />
        </Card>
        <Card>
          <Metric
            label="Energy Credits Earned"
            value={totalCredits.toFixed(1)}
            icon="⚡"
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
            label="Impact Score"
            value={Math.round((totalWaste / 100) * 100)}
            unit="/100"
            icon="📈"
          />
        </Card>
      </div>

      {/* Waste Report Form */}
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100">📊 Log Waste Processing</h2>
            <Badge variant={showForm ? 'success' : 'default'}>
              {showForm ? 'Open' : 'Closed'}
            </Badge>
          </div>

          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
            >
              Log Waste Processing
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div>
                <label className="text-sm text-slate-400">Waste Type</label>
                <select
                  value={formData.waste_type}
                  onChange={(e) =>
                    setFormData({ ...formData, waste_type: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-green-600 focus:outline-none"
                >
                  <option value="plastic">Plastic Waste</option>
                  <option value="organic">Organic Waste</option>
                  <option value="agricultural">Agricultural Waste</option>
                  <option value="food_scraps">Food Scraps</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400">Quantity (kg)</label>
                <input
                  type="number"
                  value={formData.quantity_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity_kg: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-green-600 focus:outline-none"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">Processing Method</label>
                <select
                  value={formData.processing_method}
                  onChange={(e) =>
                    setFormData({ ...formData, processing_method: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 focus:border-green-600 focus:outline-none"
                >
                  <option value="recycled">Recycled</option>
                  <option value="composted">Composted</option>
                  <option value="maggot_farming">Maggot Farming</option>
                  <option value="biogas">Biogas Production</option>
                  <option value="fuel_conversion">Fuel Conversion</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleReportWaste}
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

      {/* Recent Reports */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">📝 Recent Processing</h2>
        {wasteReports.length === 0 ? (
          <p className="text-slate-400">No waste reports yet. Start processing to earn energy credits!</p>
        ) : (
          <div className="space-y-3">
            {wasteReports.map((report) => (
              <div
                key={report.id}
                className="p-3 bg-slate-900 border border-slate-700 rounded"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-slate-100 font-medium capitalize">
                      {report.waste_type.replace('_', ' ')}
                    </p>
                    <p className="text-slate-400 text-sm capitalize">
                      Method: {report.processing_method.replace('_', ' ')}
                    </p>
                  </div>
                  <Badge variant="success">
                    {report.energy_credits.toFixed(1)} credits
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  {report.quantity_kg} kg • {new Date(report.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Energy Credits Info */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/30">
        <h2 className="text-lg font-bold text-slate-100 mb-3">⚡ Energy Credit System</h2>
        <div className="space-y-2 text-slate-300">
          <p>Energy credits represent the energy potential from your waste processing:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Plastic:</strong> 0.3 credits/kg (recycled → pellets)</li>
            <li><strong>Organic:</strong> 0.6 credits/kg (composted → soil)</li>
            <li><strong>Food Scraps:</strong> 0.8 credits/kg (maggot farming → protein)</li>
            <li><strong>Agricultural:</strong> 0.5 credits/kg (biogas/fuel)</li>
          </ul>
          <p className="mt-3 text-sm">Credits can be used to purchase feedstock or donated to local farmers.</p>
        </div>
      </Card>

      {/* Info Alert */}
      <Alert variant="info">
        You earn 20 loyalty points for each waste processing report. Your efforts help create a sustainable food system!
      </Alert>
    </div>
  );
}
