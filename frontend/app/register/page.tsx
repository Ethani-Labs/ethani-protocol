'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button, Alert } from '@/components/ui';
import { API_URL } from '@/lib/config';

const ROLES = [
  { value: 'farmer', label: '🚜 Farmer (Petani Tanaman)' },
  { value: 'livestock_farmer', label: '🐄 Livestock Farmer (Peternak)' },
  { value: 'distributor', label: '🚚 Distributor / Transport' },
  { value: 'buyer', label: '🛒 Buyer (Restaurant / Factory / Shop)' },
  { value: 'investor', label: '💰 Investor / Supporter' },
  { value: 'circular_economy', label: '♻️ Waste Processor (Circular Economy)' },
  { value: 'learner', label: '📚 Learner / Community' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<'form' | 'role'>('form');
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    national_id: '',
    location: '',
    role: '',
  });
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }

    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Move to role selection
    setStep('role');
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.role) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    try {
      if (!API_URL) {
        throw new Error('API configuration missing');
      }

      // Call backend register endpoint
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          email: formData.email || null,
          national_id: formData.national_id || null,
          location: formData.location,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `Registration failed: ${response.status}`);
      }

      const data = await response.json();

      // Store user data in localStorage
      localStorage.setItem(
        'ethani_user',
        JSON.stringify({
          phone: data.user.phone,
          name: data.user.name,
          role: data.user.role,
          location: data.user.location,
          id: data.user.id,
        })
      );

      setSuccess(true);

      // Redirect to role-based dashboard
      setTimeout(() => {
        const dashboardMap: Record<string, string> = {
          farmer: '/dashboard/farmer',
          livestock_farmer: '/dashboard/livestock-farmer',
          distributor: '/dashboard/distributor',
          buyer: '/dashboard/buyer',
          investor: '/dashboard/investor',
          circular_economy: '/dashboard/circular-economy',
          learner: '/dashboard/learner',
        };

        const dashboard = dashboardMap[formData.role] || '/dashboard/farmer';
        router.push(dashboard);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">✅</div>
          <h2 className="text-2xl font-bold text-slate-100">Welcome to ETHANI!</h2>
          <p className="text-slate-400">Your account has been created successfully.</p>
          <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            {step === 'form' ? 'Create Account' : 'Choose Your Role'}
          </h1>
          <p className="text-slate-400">
            {step === 'form'
              ? 'Join ETHANI - Fair Food Prices for Everyone'
              : 'Select the role that best describes you'}
          </p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Step 1: Basic Info */}
        {step === 'form' && (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10+ digit phone number"
              required
            />

            <Input
              label="Email (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />

            <Input
              label="National ID / KTP (Optional)"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              placeholder="ID number (optional)"
            />

            <Input
              label="Location / Region"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Your city or region"
              required
            />

            <Button
              variant="primary"
              type="submit"
              className="w-full"
            >
              Next: Choose Role
            </Button>
          </form>
        )}

        {/* Step 2: Role Selection */}
        {step === 'role' && (
          <form onSubmit={handleSubmitRole} className="space-y-4">
            <div className="space-y-2">
              {ROLES.map((role) => (
                <label
                  key={role.value}
                  className="flex items-center p-4 border-2 rounded cursor-pointer transition"
                  style={{
                    borderColor: formData.role === role.value ? '#16a34a' : '#334155',
                    backgroundColor: formData.role === role.value ? '#0f172a' : '#1e293b',
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="text-slate-100">{role.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep('form')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-slate-400">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-green-500 hover:text-green-400">
              Login
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-slate-800 rounded border border-slate-700 text-sm text-slate-300">
          <p className="font-medium text-slate-100 mb-2">🔒 Your Privacy</p>
          <ul className="space-y-1 text-xs">
            <li>✓ Phone is used only for identification</li>
            <li>✓ Email and ID are optional</li>
            <li>✓ No passwords - just phone + role-based access</li>
            <li>✓ All data stored transparently</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
