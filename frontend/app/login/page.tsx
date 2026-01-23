'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button, Alert } from '@/components/ui';
import { API_URL } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    phone: '',
  });
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.phone.trim()) {
        throw new Error('Please enter your phone number');
      }

      if (!API_URL) {
        throw new Error('API configuration missing');
      }

      // Call backend login endpoint
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      const user = data.user;

      // Store user data in localStorage
      localStorage.setItem(
        'ethani_user',
        JSON.stringify({
          phone: user.phone,
          name: user.name,
          role: user.role,
          location: user.location,
          id: user.id,
        })
      );

      // Redirect to appropriate dashboard based on role
      const dashboardMap: Record<string, string> = {
        farmer: '/dashboard/farmer',
        livestock_farmer: '/dashboard/livestock-farmer',
        distributor: '/dashboard/distributor',
        buyer: '/dashboard/buyer',
        investor: '/dashboard/investor',
        circular_economy: '/dashboard/circular-economy',
        learner: '/dashboard/learner',
      };

      const dashboard = dashboardMap[user.role] || '/dashboard/farmer';
      router.push(dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to ETHANI</p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10+ digit phone number"
            required
          />

          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-400">
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-green-500 hover:text-green-400">
              Register
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-slate-800 rounded border border-slate-700 text-sm text-slate-300">
          <p className="font-medium text-slate-100 mb-2">💡 MVP Login</p>
          <ul className="space-y-1 text-xs">
            <li>✓ Enter your registered phone number</li>
            <li>✓ No password needed for MVP</li>
            <li>✓ We verify you own the phone number</li>
            <li>✓ Production: SMS OTP verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
