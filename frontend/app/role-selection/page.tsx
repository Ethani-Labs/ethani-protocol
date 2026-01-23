'use client';

import { useEffect, useState } from 'react';
import { Card, Badge, Button, Alert } from '@/components/ui';
import { useRouter } from 'next/navigation';

const ROLES = [
  {
    id: 'farmer',
    name: 'Plant Farmer',
    emoji: '🌾',
    description: 'Grow crops and get fair prices',
    icon: '🌾',
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'livestock_farmer',
    name: 'Livestock Farmer',
    emoji: '🐄',
    description: 'Raise cattle, chicken, or goats',
    icon: '🐄',
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 'distributor',
    name: 'Distributor/Transport',
    emoji: '🚚',
    description: 'Connect farms to buyers',
    icon: '🚚',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'buyer',
    name: 'Buyer',
    emoji: '🛒',
    description: 'Restaurant, factory, or shop',
    icon: '🛒',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'investor',
    name: 'Investor/Supporter',
    emoji: '💰',
    description: 'Support the ETHANI mission',
    icon: '💰',
    color: 'from-yellow-600 to-amber-600',
  },
  {
    id: 'circular_economy',
    name: 'Circular Economy',
    emoji: '♻️',
    description: 'Process waste & create value',
    icon: '♻️',
    color: 'from-teal-600 to-green-600',
  },
  {
    id: 'learner',
    name: 'Learner/Community',
    emoji: '🎓',
    description: 'Learn about food systems',
    icon: '🎓',
    color: 'from-indigo-600 to-blue-600',
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationData, setRegistrationData] = useState<any>(null);

  useEffect(() => {
    // Get registration data from session/localStorage
    const regData = sessionStorage.getItem('pending_registration');
    if (!regData) {
      // Redirect to register if no pending registration
      router.push('/register');
      return;
    }

    setRegistrationData(JSON.parse(regData));
  }, [router]);

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = async () => {
    if (!selectedRole || !registrationData) return;

    setIsLoading(true);
    setError('');

    try {
      // Register user with backend
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: registrationData.phone,
          name: registrationData.name,
          email: registrationData.email || null,
          national_id: registrationData.national_id || null,
          location: registrationData.location,
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }

      const result = await response.json();

      // Store user data locally
      localStorage.setItem('ethani_user', JSON.stringify(result.user));

      // Clear session data
      sessionStorage.removeItem('pending_registration');

      // Redirect to role-based dashboard
      const dashboardRoutes: { [key: string]: string } = {
        farmer: '/dashboard/farmer',
        livestock_farmer: '/dashboard/livestock',
        distributor: '/dashboard/distributor',
        buyer: '/dashboard/buyer',
        investor: '/dashboard/investor',
        circular_economy: '/dashboard/circular',
        learner: '/dashboard/learner',
      };

      router.push(dashboardRoutes[selectedRole] || '/dashboard/farmer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">
            Choose Your Role
          </h1>
          <p className="text-slate-400 text-lg">
            Welcome {registrationData.name}! Select your role to get started with ETHANI.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            📍 {registrationData.location}
          </p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => handleSelectRole(role.id)}
              className={`text-left transition-all ${
                selectedRole === role.id
                  ? 'ring-2 ring-green-500 scale-105'
                  : 'hover:scale-102'
              }`}
            >
              <Card
                className={`h-full cursor-pointer ${
                  selectedRole === role.id
                    ? 'bg-gradient-to-br ' + role.color + ' bg-opacity-20'
                    : 'hover:bg-slate-750'
                }`}
              >
                <div className="text-4xl mb-2">{role.emoji}</div>
                <h3 className="text-lg font-bold text-slate-100 mb-1">{role.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{role.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant={selectedRole === role.id ? 'success' : 'default'}>
                    {selectedRole === role.id ? '✓ Selected' : 'Select'}
                  </Badge>
                </div>
              </Card>
            </button>
          ))}
        </div>

        {/* Role Description */}
        {selectedRole && (
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 mb-8">
            <h2 className="text-lg font-bold text-slate-100 mb-2">About this role</h2>
            <div className="text-slate-300">
              {selectedRole === 'farmer' && (
                <div>
                  <p className="mb-2">🌾 Plant Farmer</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Report your harvest and get fair prices</li>
                    <li>Earn loyalty points for accurate supply reporting</li>
                    <li>See real-time pricing based on demand</li>
                    <li>Connect with distributors and buyers</li>
                  </ul>
                </div>
              )}
              {selectedRole === 'livestock_farmer' && (
                <div>
                  <p className="mb-2">🐄 Livestock Farmer</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Report cattle, chicken, goat, or duck production</li>
                    <li>Get fair prices with price stability guarantee</li>
                    <li>Earn points for reliable reporting</li>
                    <li>Direct market access to buyers</li>
                  </ul>
                </div>
              )}
              {selectedRole === 'distributor' && (
                <div>
                  <p className="mb-2">🚚 Distributor/Transport</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Accept delivery orders from farms to buyers</li>
                    <li>Earn points for reliable delivery</li>
                    <li>Track routes and efficiency metrics</li>
                    <li>Build reputation in the system</li>
                  </ul>
                </div>
              )}
              {selectedRole === 'buyer' && (
                <div>
                  <p className="mb-2">🛒 Buyer</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Browse fresh supply from verified farmers</li>
                    <li>Enjoy fair pricing and price stability</li>
                    <li>Place orders with real-time delivery tracking</li>
                    <li>Support sustainable food systems</li>
                  </ul>
                </div>
              )}
              {selectedRole === 'investor' && (
                <div>
                  <p className="mb-2">💰 Investor/Supporter</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Track impact across the ETHANI system</li>
                    <li>View detailed metrics on farmer support & sustainability</li>
                    <li>Support without speculation or trading</li>
                    <li>Transparent, rule-based system</li>
                  </ul>
                </div>
              )}
              {selectedRole === 'circular_economy' && (
                <div>
                  <p className="mb-2">♻️ Circular Economy Participant</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Process plastic, organic, or food waste</li>
                    <li>Earn energy credits for waste transformation</li>
                    <li>Maggot farming, composting, biogas, or fuel conversion</li>
                    <li>Help create sustainable cycles</li>
                  </ul>
                </div>
              )}
              {selectedRole === 'learner' && (
                <div>
                  <p className="mb-2">🎓 Learner/Community</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Free access to 6+ educational lessons</li>
                    <li>Explore public data and system metrics</li>
                    <li>Learn about food systems & sustainability</li>
                    <li>No commitment required</li>
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/register')}
            disabled={isLoading}
          >
            Back to Registration
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedRole || isLoading}
            isLoading={isLoading}
          >
            {selectedRole ? `Continue as ${ROLES.find(r => r.id === selectedRole)?.name}` : 'Select a role'}
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>💡 You can change your role anytime from your profile settings.</p>
          <p>All ETHANI services are designed with transparency and fairness at their core.</p>
        </div>
      </div>
    </div>
  );
}
