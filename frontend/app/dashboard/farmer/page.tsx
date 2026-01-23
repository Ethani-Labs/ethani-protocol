'use client';

import React from 'react';
import { Card, Badge, Metric, Alert } from '@/components/ui';
import { PriceDisplay, SupplyInput } from '@/components/price-components';
import { API_URL } from '@/lib/config';

interface PriceData {
  region: string;
  base_price: number;
  supply: number;
  demand: number;
  final_price: number;
  reason: string;
  method: string;
  ai_used: boolean;
}

export default function FarmerDashboard() {
  const [priceData, setPriceData] = React.useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [userName, setUserName] = React.useState('Farmer');
  const [userRegion, setUserRegion] = React.useState('Default Region');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('userName') || 'Farmer');
      setUserRegion(localStorage.getItem('userRegion') || 'Default Region');
    }
  }, []);

  const handlePriceSubmit = async (supply: number, demand: number) => {
    setIsLoading(true);
    setError('');
    setPriceData(null);
    
    try {
      if (!API_URL) {
        throw new Error('API configuration missing');
      }

      const response = await fetch(
        `${API_URL}/price?supply=${supply}&demand=${demand}&base_price=10000&region=${encodeURIComponent(userRegion || 'DefaultRegion')}`,
        { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data.final_price || typeof data.supply !== 'number' || typeof data.demand !== 'number') {
        throw new Error('Invalid price data received');
      }
      
      setPriceData(data);
    } catch (err) {
      console.error('Price fetch error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch price. Please check your connection.';
      setError(errorMessage);
      setPriceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Farmer Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, {userName}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <Metric label="Total Harvests" value="12" icon="🌾" />
        </Card>
        <Card>
          <Metric label="Last Month Revenue" value="₱45,200" icon="💰" />
        </Card>
        <Card>
          <Metric label="Loyalty Points" value="850" icon="⭐" trend="up" trendValue="+120 this month" />
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {/* Main Price Display */}
      {priceData ? (
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Current Market Price</h2>
          <PriceDisplay
            region={priceData.region || 'N/A'}
            basePrice={priceData.base_price || 0}
            supply={priceData.supply || 0}
            demand={priceData.demand || 0}
            finalPrice={priceData.final_price || 0}
            reason={priceData.reason || 'Calculating...'}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <Alert variant="info">
          ℹ️ Enter supply and demand to see the calculated fair price
        </Alert>
      )}

      {/* Supply Input Form */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Update Market Data</h2>
        <SupplyInput onSubmit={handlePriceSubmit} isLoading={isLoading} />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Recent Harvests</h2>
        <div className="space-y-3">
          <Card bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100">Rice (2 tons)</p>
                <p className="text-sm text-slate-400">Sold 3 days ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-400">₱20,000</p>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
          </Card>
          <Card bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100">Corn (1.5 tons)</p>
                <p className="text-sm text-slate-400">Sold 1 week ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-400">₱12,000</p>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Pricing Rules */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">How Prices Are Set</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="font-semibold text-slate-100 text-sm mb-1">Critical Shortage</p>
              <p className="text-xs text-slate-400">Ratio ≥ 1.30</p>
              <p className="text-amber-400 font-bold text-sm">+15%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-slate-100 text-sm mb-1">Shortage</p>
              <p className="text-xs text-slate-400">Ratio ≥ 1.10</p>
              <p className="text-amber-400 font-bold text-sm">+8%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <p className="font-semibold text-slate-100 text-sm mb-1">Balanced</p>
              <p className="text-xs text-slate-400">0.80 - 1.10</p>
              <p className="text-slate-400 font-bold text-sm">0%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">📉</div>
              <p className="font-semibold text-slate-100 text-sm mb-1">Surplus</p>
              <p className="text-xs text-slate-400">Ratio ≤ 0.80</p>
              <p className="text-green-400 font-bold text-sm">-10%</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
