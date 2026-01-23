'use client';

import { useEffect, useState } from 'react';
import { Card, Badge, Button, Alert } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  phone: string;
  name: string;
  location: string;
  role: string;
  created_at: string;
}

interface Lesson {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
}

export default function LearnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'lessons' | 'data' | 'tools'>('lessons');

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Food Supply & Demand Basics',
      category: 'Economics',
      description: 'Understand how supply and demand affect food prices',
      duration: '15 mins',
    },
    {
      id: 2,
      title: 'How ETHANI Pricing Works',
      category: 'System',
      description: 'Learn the rule-based pricing formula protecting farmers and consumers',
      duration: '20 mins',
    },
    {
      id: 3,
      title: 'Circular Economy Intro',
      category: 'Sustainability',
      description: 'Transform waste into resources: plastic, organic, food scraps',
      duration: '18 mins',
    },
    {
      id: 4,
      title: 'Maggot Farming for Protein',
      category: 'Technology',
      description: 'High-protein feed production from food waste',
      duration: '22 mins',
    },
    {
      id: 5,
      title: 'Blockchain for Transparency',
      category: 'Technology',
      description: 'How blockchain records ensure food system transparency',
      duration: '25 mins',
    },
    {
      id: 6,
      title: 'Building Resilient Food Systems',
      category: 'Strategy',
      description: 'Community approaches to food security and price stability',
      duration: '30 mins',
    },
  ];

  const publicData = [
    { label: 'Active Farmers', value: '487', region: 'Across 12 regions' },
    { label: 'Avg Price Stability', value: '94%', region: 'System-wide' },
    { label: 'Waste Processed', value: '15.4 tonnes', region: 'This month' },
    { label: 'Food Categories', value: '8', region: 'Rice, chicken, vegetables...' },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('ethani_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch (err) {
      setError('Session invalid');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8">
        <Alert variant="error">User not found. Please login again.</Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
          🎓 Learning Center
        </h1>
        <p className="text-slate-400">
          {user.name} • Learn about food systems, sustainability, and ETHANI
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Welcome */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30">
        <h2 className="text-lg font-bold text-slate-100 mb-2">Welcome to ETHANI Learning</h2>
        <p className="text-slate-300 mb-3">
          Learn how we're building a fair, transparent food system. This learning center is open to everyone—farmers,
          students, policymakers, and curious minds.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">No registration required</Badge>
          <Badge variant="info">Completely free</Badge>
          <Badge variant="success">6+ lessons available</Badge>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'lessons'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          📚 Lessons
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'data'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          📊 Public Data
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'tools'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          🛠️ Tools
        </button>
      </div>

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">📚 Available Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <div className="mb-2 flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-100 font-bold">{lesson.title}</h3>
                    <p className="text-slate-400 text-sm">{lesson.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                  <Badge variant="default">{lesson.category}</Badge>
                  <span className="text-slate-400 text-sm">⏱️ {lesson.duration}</span>
                </div>
                <Button variant="primary" className="w-full mt-3">
                  Start Lesson
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Public Data Tab */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">📊 System Data (Public)</h2>
          <p className="text-slate-400">All ETHANI data is publicly accessible. Here are key metrics:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicData.map((item, idx) => (
              <Card key={idx}>
                <p className="text-slate-400 text-sm">{item.label}</p>
                <p className="text-3xl font-bold text-green-500 mt-1">{item.value}</p>
                <p className="text-slate-400 text-sm mt-2">{item.region}</p>
              </Card>
            ))}
          </div>

          <Card>
            <h3 className="text-lg font-bold text-slate-100 mb-3">Available Datasets</h3>
            <div className="space-y-2">
              <div className="p-2 bg-slate-900 border border-slate-700 rounded flex justify-between items-center">
                <span className="text-slate-300">Regional base prices</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-700 rounded flex justify-between items-center">
                <span className="text-slate-300">Supply-demand ratios (7 days)</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-700 rounded flex justify-between items-center">
                <span className="text-slate-300">Price adjustment history</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-700 rounded flex justify-between items-center">
                <span className="text-slate-300">Waste processing metrics</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-700 rounded flex justify-between items-center">
                <span className="text-slate-300">Farmer participation by region</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">🛠️ Helpful Tools</h2>

          <Card>
            <h3 className="text-lg font-bold text-slate-100 mb-3">Price Calculator</h3>
            <p className="text-slate-400 mb-4">
              Try the supply-demand pricing formula yourself. See how different supply and demand scenarios affect prices.
            </p>
            <Button variant="primary">Open Calculator</Button>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-slate-100 mb-3">Regional Dashboard</h3>
            <p className="text-slate-400 mb-4">
              Explore live data from different regions. See real prices, active farmers, and circular economy participation.
            </p>
            <Button variant="primary">Explore Regions</Button>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-slate-100 mb-3">Blockchain Explorer</h3>
            <p className="text-slate-400 mb-4">
              View smart contracts and transaction records on Mantle Testnet. All pricing logic is public and auditable.
            </p>
            <Button variant="primary">View Contracts</Button>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-slate-100 mb-3">Glossary</h3>
            <p className="text-slate-400 mb-4">
              Clear explanations of key terms: supply-demand ratio, price tier, circular economy, energy credits, and more.
            </p>
            <Button variant="primary">View Glossary</Button>
          </Card>
        </div>
      )}

      {/* FAQ */}
      <Card>
        <h2 className="text-xl font-bold text-slate-100 mb-4">❓ Frequently Asked Questions</h2>
        <div className="space-y-3">
          <div>
            <p className="text-slate-100 font-medium">Is ETHANI a crypto trading platform?</p>
            <p className="text-slate-400 text-sm">
              No. ETHANI is a food price stabilization system. We use blockchain for transparency, not speculation.
            </p>
          </div>
          <div>
            <p className="text-slate-100 font-medium">Do I need a wallet to use ETHANI?</p>
            <p className="text-slate-400 text-sm">
              No. For MVP, you just need a phone number. Wallets are optional for investors.
            </p>
          </div>
          <div>
            <p className="text-slate-100 font-medium">How are prices calculated?</p>
            <p className="text-slate-400 text-sm">
              Prices use a simple rule-based formula based on supply-demand ratio. No AI. No black boxes. Fully auditable.
            </p>
          </div>
          <div>
            <p className="text-slate-100 font-medium">Can I make money with ETHANI?</p>
            <p className="text-slate-400 text-sm">
              Farmers get fair prices, distributors earn through reliable delivery, waste processors earn energy credits. It's a reward system, not speculation.
            </p>
          </div>
        </div>
      </Card>

      {/* Community */}
      <Alert variant="info">
        Join our learning community! Share questions, stories, and ideas about building a fair food system.
      </Alert>
    </div>
  );
}
