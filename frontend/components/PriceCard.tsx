'use client';

import React, { useState } from 'react';
import { calculatePrice, PriceResult } from '@/lib/api';

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

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await calculatePrice({
        supply,
        demand,
        base_price: basePrice,
        season_factor: seasonFactor,
      });

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
