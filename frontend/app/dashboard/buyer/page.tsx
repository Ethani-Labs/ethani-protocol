'use client';

import React from 'react';
import { Card, Badge, Metric, Button, Alert } from '@/components/ui';

export default function BuyerDashboard() {
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') || 'Buyer' : 'Buyer';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Buyer Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, {userName}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <Metric label="Active Orders" value="5" icon="🛒" />
        </Card>
        <Card>
          <Metric label="Total Spent" value="₱125,400" icon="💳" />
        </Card>
        <Card>
          <Metric label="Savings vs Market" value="₱8,200" icon="💚" trend="up" trendValue="Fair pricing" />
        </Card>
        <Card>
          <Metric label="Trusted Farmers" value="28" icon="⭐" />
        </Card>
      </div>

      {/* Available Products */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Available Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card bordered>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-100">Rice (Premium)</p>
                  <p className="text-xs text-slate-400">From: Local Farmers Coop</p>
                </div>
                <Badge variant="success">Stock ✓</Badge>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Price per kg:</span>
                  <span className="font-bold text-amber-400">₱45</span>
                </div>
                <div className="text-xs text-slate-400 mb-3">Last updated: 2h ago</div>
                <Button variant="primary" size="sm" className="w-full">
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>

          <Card bordered>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-100">Corn (Fresh)</p>
                  <p className="text-xs text-slate-400">From: Batangas Farm</p>
                </div>
                <Badge variant="success">Stock ✓</Badge>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Price per kg:</span>
                  <span className="font-bold text-amber-400">₱28</span>
                </div>
                <div className="text-xs text-slate-400 mb-3">Last updated: 1h ago</div>
                <Button variant="primary" size="sm" className="w-full">
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>

          <Card bordered>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-100">Tomatoes</p>
                  <p className="text-xs text-slate-400">From: Metro Gardens</p>
                </div>
                <Badge variant="warning">Low Stock</Badge>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Price per kg:</span>
                  <span className="font-bold text-amber-400">₱62</span>
                </div>
                <div className="text-xs text-slate-400 mb-3">Last updated: 30m ago</div>
                <Button variant="secondary" size="sm" className="w-full">
                  Notify Me
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Current Orders */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Current Orders</h2>
        <div className="space-y-3">
          <Card bordered>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-100">Order #1024</p>
                <p className="text-sm text-slate-400">Rice (50 kg) + Corn (30 kg)</p>
              </div>
              <Badge variant="success">Delivered</Badge>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
              <span className="text-slate-300">Total:</span>
              <span className="font-bold text-green-400">₱3,240</span>
            </div>
          </Card>

          <Card bordered>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-100">Order #1023</p>
                <p className="text-sm text-slate-400">Mixed Vegetables (25 kg)</p>
              </div>
              <Badge variant="warning">In Transit</Badge>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
              <span className="text-slate-300">Total:</span>
              <span className="font-bold text-green-400">₱1,680</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Fair Pricing Information */}
      <Alert variant="success">
        <p className="font-semibold text-green-200 mb-1">✅ Fair Prices Guaranteed</p>
        <p className="text-sm text-green-100">All prices on ETHANI are calculated transparently using rule-based formulas. You're protected from price spikes and guaranteed fair market rates.</p>
      </Alert>
    </div>
  );
}
