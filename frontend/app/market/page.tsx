'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input, Select } from '@/components/ui';

// Product Detail Panel Component
function ProductDetailPanel({
  product,
  isOpen,
  onClose,
}: {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Right-side Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-stability-slate border-l border-stability-border overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-stability-slate/95 border-b border-stability-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{product.emoji}</span>
            <h2 className="text-lg font-bold text-stability-text">{product.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stability-border rounded-lg transition-colors">
            <span className="text-2xl text-stability-text-muted hover:text-stability-text">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Region Info */}
          <div className="space-y-2">
            <p className="text-xs uppercase font-bold text-stability-text-muted">Region</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs font-semibold bg-stability-green/20 text-stability-green border border-stability-green/30">
                {product.region}
              </span>
              <span className="text-sm text-stability-text-muted">{product.country}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <p className="text-xs uppercase font-bold text-stability-text-muted">Price</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-stability-green">${product.priceUSD}/kg</p>
              <p className="text-sm text-stability-text-muted">≈ {product.localPrice} ({product.currency})</p>
            </div>
          </div>

          {/* Supply Status */}
          <div className="space-y-2">
            <p className="text-xs uppercase font-bold text-stability-text-muted">Supply Status</p>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${product.supplyBadgeColor}`}>
                {product.supplyStatus}
              </span>
              <span className="text-sm text-stability-text-muted">{product.stock} kg available</span>
            </div>
          </div>

          {/* Market Signal */}
          <div className="space-y-2">
            <p className="text-xs uppercase font-bold text-stability-text-muted">Market Signal</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{product.marketSignalEmoji}</span>
              <span className="text-sm text-stability-text">{product.marketSignal}</span>
            </div>
          </div>

          {/* Last Update */}
          <div className="space-y-2">
            <p className="text-xs uppercase font-bold text-stability-text-muted">Last Update</p>
            <p className="text-sm text-stability-text">{product.lastUpdated}</p>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-lg bg-stability-green/10 border border-stability-green/30 space-y-2">
            <p className="text-xs uppercase font-bold text-stability-green">How it Works</p>
            <p className="text-sm text-stability-green/90">
              This price is calculated using ETHANI's rule-based stabilization algorithm. It reflects fair market value
              based on real supply and demand signals.
            </p>
          </div>

          {/* Footer Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg bg-stability-green/20 text-stability-green hover:bg-stability-green/30 transition-colors font-semibold border border-stability-green/30"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

// Market Context Cards Component
function MarketContextHeader({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {[
        { icon: '🌍', label: 'Active Regions', value: stats.regions, color: 'stability-green' },
        { icon: '🧺', label: 'Commodities', value: stats.commodities, color: 'stability-gold' },
        { icon: '⚠️', label: 'Pressure Areas', value: stats.pressure, color: 'stability-red' },
        { icon: '📊', label: 'Volatility Index', value: stats.volatility, color: 'stability-green' },
      ].map((stat, idx) => (
        <Card key={idx} className="p-4 bg-stability-slate border border-stability-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase text-stability-text-muted font-bold">{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 text-${stat.color}`}>{stat.value}</p>
            </div>
            <span className="text-2xl">{stat.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function MarketPage() {
  const [filters, setFilters] = useState({
    region: 'all',
    country: 'all',
    signal: 'all',
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [marketStats, setMarketStats] = useState({
    regions: 6,
    commodities: 12,
    pressure: 2,
    volatility: 'Low',
  });

  // Auto-refresh market stats every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStats((prev) => ({
        ...prev,
        pressure: Math.random() > 0.7 ? 2 : 1,
        volatility: Math.random() > 0.6 ? 'Medium' : 'Low',
      }));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const products = [
    {
      id: 1,
      emoji: '🌾',
      name: 'Rice (Premium)',
      source: 'Local Farmers Coop',
      region: 'Southeast Asia',
      country: '🇵🇭 Philippines',
      priceUSD: 0.79,
      localPrice: '₱44.5',
      currency: 'PHP',
      stock: 450,
      lastUpdated: '12s ago',
      marketSignal: 'Balanced',
      marketSignalEmoji: '🟢',
      supplyStatus: 'In Stock',
      supplyBadgeColor: 'bg-stability-green/20 text-stability-green',
    },
    {
      id: 2,
      emoji: '🌽',
      name: 'Corn (Fresh)',
      source: 'Batangas Farm',
      region: 'Southeast Asia',
      country: '🇵🇭 Philippines',
      priceUSD: 0.49,
      localPrice: '₱27.6',
      currency: 'PHP',
      stock: 280,
      lastUpdated: '8s ago',
      marketSignal: 'Balanced',
      marketSignalEmoji: '🟢',
      supplyStatus: 'In Stock',
      supplyBadgeColor: 'bg-stability-green/20 text-stability-green',
    },
    {
      id: 3,
      emoji: '🍅',
      name: 'Tomatoes',
      source: 'Metro Gardens',
      region: 'Southeast Asia',
      country: '🇵🇭 Philippines',
      priceUSD: 1.09,
      localPrice: '₱61.5',
      currency: 'PHP',
      stock: 45,
      lastUpdated: '5s ago',
      marketSignal: 'Shortage',
      marketSignalEmoji: '🟠',
      supplyStatus: 'Low Stock',
      supplyBadgeColor: 'bg-stability-red/20 text-stability-red',
    },
    {
      id: 4,
      emoji: '🥔',
      name: 'Potatoes',
      source: 'Laguna Farms',
      region: 'Southeast Asia',
      country: '🇵🇭 Philippines',
      priceUSD: 0.56,
      localPrice: '₱31.6',
      currency: 'PHP',
      stock: 520,
      lastUpdated: '15s ago',
      marketSignal: 'Balanced',
      marketSignalEmoji: '🟢',
      supplyStatus: 'In Stock',
      supplyBadgeColor: 'bg-stability-green/20 text-stability-green',
    },
    {
      id: 5,
      emoji: '🥬',
      name: 'Cabbage',
      source: 'Northern Vegetable Farm',
      region: 'Southeast Asia',
      country: '🇵🇭 Philippines',
      priceUSD: 0.32,
      localPrice: '₱18.1',
      currency: 'PHP',
      stock: 890,
      lastUpdated: '22s ago',
      marketSignal: 'Balanced',
      marketSignalEmoji: '🟢',
      supplyStatus: 'In Stock',
      supplyBadgeColor: 'bg-stability-green/20 text-stability-green',
    },
    {
      id: 6,
      emoji: '🥕',
      name: 'Carrots',
      source: 'Tagaytay Highland Farm',
      region: 'Southeast Asia',
      country: '🇵🇭 Philippines',
      priceUSD: 0.61,
      localPrice: '₱34.4',
      currency: 'PHP',
      stock: 340,
      lastUpdated: '18s ago',
      marketSignal: 'Balanced',
      marketSignalEmoji: '🟢',
      supplyStatus: 'In Stock',
      supplyBadgeColor: 'bg-stability-green/20 text-stability-green',
    },
  ];

  const filteredProducts = products.filter((product) => {
    if (filters.region !== 'all' && product.region !== filters.region) return false;
    if (filters.signal !== 'all' && product.marketSignal !== filters.signal) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-stability-text">🌍 Global Food Market</h1>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-stability-green/20 border border-stability-green/30">
            <span className="flex h-2 w-2 rounded-full bg-stability-green animate-pulse"></span>
            <span className="text-xs font-semibold text-stability-green">Live Market Signal</span>
          </div>
        </div>
        <p className="text-stability-text-muted">Fair price signals across regions – powered by ETHANI stabilization</p>
      </div>

      {/* Market Context Header */}
      <MarketContextHeader stats={marketStats} />

      {/* Filters */}
      <Card className="bg-stability-slate border border-stability-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search products..."
            className="col-span-full sm:col-span-1 md:col-span-1 bg-stability-navy border-stability-border text-stability-text placeholder-stability-text-muted"
          />
          <Select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            options={[
              { value: 'all', label: 'All Regions' },
              { value: 'Southeast Asia', label: 'Southeast Asia' },
              { value: 'South Asia', label: 'South Asia' },
              { value: 'East Asia', label: 'East Asia' },
            ]}
          />
          <Select
            name="signal"
            value={filters.signal}
            onChange={handleFilterChange}
            options={[
              { value: 'all', label: 'All Signals' },
              { value: 'Balanced', label: '🟢 Balanced' },
              { value: 'Shortage', label: '🟠 Shortage' },
              { value: 'Surplus', label: '🔵 Surplus' },
            ]}
          />
          <div className="text-right flex items-center justify-end text-xs text-stability-text-muted">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="cursor-pointer group"
          >
            <Card
              bordered
              className="space-y-3 h-full bg-stability-slate border-stability-border hover:border-stability-green/50 hover:shadow-lg hover:shadow-stability-green/10 transition-all duration-200 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl font-bold text-stability-text flex items-center gap-2">
                    <span>{product.emoji}</span>
                    {product.name}
                  </p>
                  <p className="text-xs text-stability-text-muted mt-1">{product.source}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-xs font-semibold px-2 py-1 rounded bg-stability-green/20 text-stability-green border border-stability-green/30 w-fit ml-auto">
                    {product.region}
                  </div>
                  <span className="text-xl">{product.marketSignalEmoji}</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-stability-navy rounded-lg p-3 border border-stability-border">
                <p className="text-2xl font-bold text-stability-green">${product.priceUSD}/kg</p>
                <p className="text-xs text-stability-text-muted mt-1">≈ {product.localPrice} local equivalent</p>
              </div>

              {/* Supply Status */}
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-xs font-semibold ${product.supplyBadgeColor}`}>
                  {product.supplyStatus}
                </div>
                <span className="text-xs text-stability-text-muted">{product.stock} kg</span>
              </div>

              {/* Footer */}
              <div className="border-t border-stability-border pt-3">
                <p className="text-xs text-stability-text-muted mb-3">Updated {product.lastUpdated}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" className="w-full text-xs bg-stability-border hover:bg-stability-border/80 text-stability-text">
                    View Logic
                  </Button>
                  <Button variant="primary" size="sm" className="w-full text-xs bg-stability-green hover:bg-stability-green/80 text-stability-navy">
                    Add Cart
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Product Detail Panel */}
      <ProductDetailPanel product={selectedProduct} isOpen={isPanelOpen} onClose={handleClosePanel} />

      {/* Footer Note */}
      <Card className="bg-stability-slate border border-stability-border">
        <p className="text-xs text-stability-text-muted leading-relaxed">
          <strong className="text-stability-text">Demo Note:</strong> This market view demonstrates how ETHANI visualizes fair price signals across
          global regions. In production, prices are derived from verified global data sources and decentralized oracle
          aggregation. All product information is mock data for demonstration purposes.
        </p>
      </Card>
    </div>
  );
}
