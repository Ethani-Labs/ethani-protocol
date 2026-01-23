'use client';

import React from 'react';
import { Card, Badge, Metric, Alert } from '@/components/ui';

export default function DistributorDashboard() {
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') || 'Distributor' : 'Distributor';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Distributor Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, {userName}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <Metric label="Active Deliveries" value="8" icon="🚚" />
        </Card>
        <Card>
          <Metric label="Deliveries This Month" value="124" icon="📦" />
        </Card>
        <Card>
          <Metric label="Avg. Route Efficiency" value="94%" icon="📈" />
        </Card>
        <Card>
          <Metric label="Bonus Earned" value="₱3,200" icon="💰" trend="up" trendValue="+₱800 this week" />
        </Card>
      </div>

      {/* Active Routes */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Active Delivery Routes</h2>
        <div className="space-y-3">
          <Card bordered>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-100">Route Manila-Rizal</p>
                <p className="text-sm text-slate-400">Rice & Corn shipment</p>
              </div>
              <Badge variant="success">In Transit</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-700">
              <div>
                <p className="text-xs text-slate-400">Distance</p>
                <p className="font-semibold text-slate-100">42 km</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className="font-semibold text-green-400">75% Complete</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Estimated</p>
                <p className="font-semibold text-slate-100">2h 15m</p>
              </div>
            </div>
          </Card>

          <Card bordered>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-100">Route Batangas-Metro</p>
                <p className="text-sm text-slate-400">Vegetable delivery</p>
              </div>
              <Badge variant="warning">Scheduled</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-700">
              <div>
                <p className="text-xs text-slate-400">Distance</p>
                <p className="font-semibold text-slate-100">68 km</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Departure</p>
                <p className="font-semibold text-amber-400">Tomorrow 6 AM</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Cargo</p>
                <p className="font-semibold text-slate-100">15 tons</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Completed Routes */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Recent Completed Routes</h2>
        <div className="space-y-2">
          <Card bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100">Route Pangasinan-Manila</p>
                <p className="text-sm text-slate-400">2 days ago</p>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
          </Card>
          <Card bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100">Route Cavite-Laguna</p>
                <p className="text-sm text-slate-400">5 days ago</p>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Bonus Information */}
      <Alert variant="info">
        <p className="font-semibold text-blue-200 mb-1">🎁 Route Efficiency Bonus</p>
        <p className="text-sm text-blue-100">You earned a bonus of ₱320 this week for maintaining 94% efficiency on your routes.</p>
      </Alert>
    </div>
  );
}
