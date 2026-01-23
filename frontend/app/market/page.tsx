'use client';

import React from 'react';
import { Card, Badge, Button, Input, Select } from '@/components/ui';

export default function MarketPage() {
  const [filters, setFilters] = React.useState({
    region: 'all',
    status: 'available',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Market</h1>
        <p className="text-slate-400 mt-1">Browse fair-priced food products</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search products..."
            className="col-span-full sm:col-span-1"
          />
          <Select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            options={[
              { value: 'all', label: 'All Regions' },
              { value: 'manila', label: 'Manila & Metro' },
              { value: 'batangas', label: 'Batangas' },
              { value: 'laguna', label: 'Laguna' },
              { value: 'cavite', label: 'Cavite' },
            ]}
          />
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: 'available', label: 'In Stock' },
              { value: 'all', label: 'All' },
            ]}
          />
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Product 1 */}
        <Card bordered>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold text-slate-100">🌾 Rice (Premium)</p>
                <p className="text-xs text-slate-400">Local Farmers Coop</p>
              </div>
              <Badge variant="success">Stock ✓</Badge>
            </div>

            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-2xl font-bold text-amber-400">₱45/kg</p>
              <p className="text-xs text-slate-400 mt-1">Fair market price</p>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-slate-400">Stock</p>
                  <p className="font-semibold text-slate-100">450 kg</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated</p>
                  <p className="font-semibold text-slate-100">2h ago</p>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full">
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>

        {/* Product 2 */}
        <Card bordered>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold text-slate-100">🌽 Corn (Fresh)</p>
                <p className="text-xs text-slate-400">Batangas Farm</p>
              </div>
              <Badge variant="success">Stock ✓</Badge>
            </div>

            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-2xl font-bold text-amber-400">₱28/kg</p>
              <p className="text-xs text-slate-400 mt-1">Fair market price</p>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-slate-400">Stock</p>
                  <p className="font-semibold text-slate-100">280 kg</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated</p>
                  <p className="font-semibold text-slate-100">1h ago</p>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full">
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>

        {/* Product 3 */}
        <Card bordered>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold text-slate-100">🍅 Tomatoes</p>
                <p className="text-xs text-slate-400">Metro Gardens</p>
              </div>
              <Badge variant="warning">Low Stock</Badge>
            </div>

            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-2xl font-bold text-amber-400">₱62/kg</p>
              <p className="text-xs text-slate-400 mt-1">Fair market price</p>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-slate-400">Stock</p>
                  <p className="font-semibold text-slate-100">45 kg</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated</p>
                  <p className="font-semibold text-slate-100">30m ago</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Notify Me
              </Button>
            </div>
          </div>
        </Card>

        {/* Product 4 */}
        <Card bordered>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold text-slate-100">🥔 Potatoes</p>
                <p className="text-xs text-slate-400">Laguna Farms</p>
              </div>
              <Badge variant="success">Stock ✓</Badge>
            </div>

            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-2xl font-bold text-amber-400">₱32/kg</p>
              <p className="text-xs text-slate-400 mt-1">Fair market price</p>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-slate-400">Stock</p>
                  <p className="font-semibold text-slate-100">520 kg</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated</p>
                  <p className="font-semibold text-slate-100">45m ago</p>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full">
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>

        {/* Product 5 */}
        <Card bordered>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold text-slate-100">🥬 Cabbage</p>
                <p className="text-xs text-slate-400">Northern Vegetable Farm</p>
              </div>
              <Badge variant="success">Stock ✓</Badge>
            </div>

            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-2xl font-bold text-amber-400">₱18/kg</p>
              <p className="text-xs text-slate-400 mt-1">Fair market price</p>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-slate-400">Stock</p>
                  <p className="font-semibold text-slate-100">890 kg</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated</p>
                  <p className="font-semibold text-slate-100">1h ago</p>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full">
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>

        {/* Product 6 */}
        <Card bordered>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold text-slate-100">🥕 Carrots</p>
                <p className="text-xs text-slate-400">Tagaytay Highland Farm</p>
              </div>
              <Badge variant="success">Stock ✓</Badge>
            </div>

            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-2xl font-bold text-amber-400">₱35/kg</p>
              <p className="text-xs text-slate-400 mt-1">Fair market price</p>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-slate-400">Stock</p>
                  <p className="font-semibold text-slate-100">340 kg</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated</p>
                  <p className="font-semibold text-slate-100">2h ago</p>
                </div>
              </div>
              <Button variant="primary" size="sm" className="w-full">
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
