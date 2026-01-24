'use client';

import React, { useState } from 'react';

// Demo mode: Using local interface instead of deprecated API
interface PriceResult {
  region: string;
  base_price: number;
  supply: number;
  demand: number;
  final_price: number;
  reason: string;
  method: string;
  ai_used: boolean;
}

interface PriceCardProps {
  title?: string;
  onPriceCalculated?: (result: PriceResult) => void;
}

export default function PriceCard({ title = "Price Calculator", onPriceCalculated }: PriceCardProps) {
  const [supply, setSupply] = useState<number>(100);
  const [demand, setDemand] = useState<number>(150);
  const [basePrice, setBasePrice] = useState<number>(100);
  const [seasonFactor, setSeasonFactor] = useState<number>(1.0);

  const [result, setResult] = useState<PriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DEMO MODE: Calculate price locally with mock logic
  const calculatePriceLocally = () => {
    if (supply === 0) {
      return {
        region: 'Demo Region',
        base_price: basePrice,
        supply,
        demand,
        final_price: basePrice,
        reason: 'No supply available - using base price',
        method: 'Rule-based (Demo Mode)',
        ai_used: false,
      };
    }

    const ratio = demand / supply;
    let finalPrice = basePrice;
    let reason = '';

    if (ratio >= 1.3) {
      finalPrice = Math.round(basePrice * 1.15 * seasonFactor);
      reason = 'Critical shortage - demand far exceeds supply (+15%)';
    } else if (ratio >= 1.1) {
      finalPrice = Math.round(basePrice * 1.08 * seasonFactor);
      reason = 'Shortage - demand exceeds supply (+8%)';
    } else if (ratio <= 0.8) {
      finalPrice = Math.round(basePrice * 0.9 * seasonFactor);
      reason = 'Surplus - supply exceeds demand (-10%)';
    } else {
      finalPrice = Math.round(basePrice * seasonFactor);
      reason = 'Balanced - supply and demand in equilibrium (0%)';
    }

    return {
      region: 'Demo Region',
      base_price: basePrice,
      supply,
      demand,
      final_price: finalPrice,
      reason,
      method: 'Rule-based (Demo Mode)',
      ai_used: false,
    };
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 500));

      const res = calculatePriceLocally();

      setResult(res);
      if (onPriceCalculated) {
        onPriceCalculated(res);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Supply (units): {supply}
          </label>
          <input
            type="range"
            min="1"
            max="500"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value))}
            className="w-full"
          />
          <input
            type="number"
            min="1"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Demand (units): {demand}
          </label>
          <input
            type="range"
            min="0"
            max="500"
            value={demand}
            onChange={(e) => setDemand(Number(e.target.value))}
            className="w-full"
          />
          <input
            type="number"
            min="0"
            value={demand}
            onChange={(e) => setDemand(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Base Price: ${basePrice}
          </label>
          <input
            type="number"
            min="1"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Seasonal Factor: {seasonFactor.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={seasonFactor}
            onChange={(e) => setSeasonFactor(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Calculating...' : 'Calculate Fair Price'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Region: {result.region}</p>
            <p className="text-sm text-gray-600">Fair Price</p>
            <p className="text-3xl font-bold text-green-600">
              ${result.final_price}
            </p>
          </div>

          <div className="space-y-2 text-sm border-t border-green-200 pt-3">
            <p>
              <span className="font-medium">Base Price:</span> ${result.base_price}
            </p>
            <p>
              <span className="font-medium">Supply / Demand:</span> {result.supply} / {result.demand}
            </p>
            <p>
              <span className="font-medium">Reason:</span> {result.reason}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ✓ {result.method} | AI: {result.ai_used ? 'Yes' : 'No'} | Fully auditable
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
