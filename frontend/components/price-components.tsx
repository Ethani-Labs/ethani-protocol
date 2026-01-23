'use client';

import React from 'react';
import { Card, Metric, Alert } from './ui';

interface PriceDisplayProps {
  region: string;
  basePrice: number;
  supply: number;
  demand: number;
  finalPrice: number;
  reason: string;
  isLoading?: boolean;
}

export function PriceDisplay({
  region,
  basePrice,
  supply,
  demand,
  finalPrice,
  reason,
  isLoading = false,
}: PriceDisplayProps) {
  const ratio = demand / supply;
  const priceChange = finalPrice - basePrice;
  const changePercent = ((priceChange / basePrice) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Main Price Card */}
      <Card bordered>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Region</p>
            <p className="text-2xl font-bold text-slate-100">{region}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Base Price</p>
              <p className="text-xl font-bold text-slate-100">₱{basePrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Stable Price</p>
              <p className="text-xl font-bold text-amber-400">₱{finalPrice.toLocaleString()}</p>
            </div>
          </div>

          {priceChange !== 0 && (
            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-1">Price Adjustment</p>
              <p
                className={`text-lg font-semibold ${
                  priceChange > 0 ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {priceChange > 0 ? '+' : ''}{changePercent}% ({priceChange > 0 ? '+' : ''}₱
                {Math.abs(priceChange).toLocaleString()})
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Supply/Demand Info */}
      <Card bordered>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Market Status</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Supply</p>
                <p className="text-lg font-bold text-slate-100">{supply}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Demand</p>
                <p className="text-lg font-bold text-slate-100">{demand}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Ratio</p>
                <p className="text-lg font-bold text-slate-100">{ratio.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Reason */}
      <Alert variant="info">
        <p className="text-sm">
          <span className="font-semibold">Reason:</span> {reason}
        </p>
      </Alert>
    </div>
  );
}

interface SupplyInputProps {
  onSubmit: (supply: number, demand: number) => Promise<void>;
  isLoading?: boolean;
}

export function SupplyInput({ onSubmit, isLoading = false }: SupplyInputProps) {
  const [supply, setSupply] = React.useState('100');
  const [demand, setDemand] = React.useState('120');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const s = parseFloat(supply);
    const d = parseFloat(demand);

    if (isNaN(s) || isNaN(d) || s <= 0 || d <= 0) {
      setError('Please enter valid positive numbers');
      return;
    }

    try {
      await onSubmit(s, d);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
    }
  };

  return (
    <Card bordered>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Update Market Data</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Supply (units)</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              min="1"
              step="1"
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Demand (units)</label>
            <input
              type="number"
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              min="1"
              step="1"
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '⏳ Calculating...' : 'Calculate Price'}
        </button>
      </form>
    </Card>
  );
}
