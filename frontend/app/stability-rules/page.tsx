'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// ETHANI Pricing Rules - Clear Documentation & Education
const STABILITY_RULES_DATA = {
  overview: {
    title: 'Overview',
    icon: '📘',
    content: `
    ETHANI's pricing system is deterministic, rule-based, and fully transparent.
    
    Every price adjustment follows simple mathematical rules that respond to supply-demand imbalances.
    No artificial intelligence, no randomness, no hidden algorithms - just clear rules anyone can audit.
    `,
    examples: [
      { supply: 100, demand: 150, ratio: 1.5, tier: 'Critical Shortage', adjustment: '+15%' },
      { supply: 100, demand: 120, ratio: 1.2, tier: 'Shortage', adjustment: '+8%' },
      { supply: 100, demand: 100, ratio: 1.0, tier: 'Balanced', adjustment: '0%' },
      { supply: 100, demand: 70, ratio: 0.7, tier: 'Surplus', adjustment: '-10%' },
    ]
  },
  'pricing-tiers': {
    title: 'Pricing Tiers',
    icon: '📊',
    content: `
    ETHANI uses 4 pricing tiers based on supply-demand ratio.
    Each tier has a specific price adjustment percentage.
    `,
    tiers: [
      {
        number: 1,
        name: 'Critical Shortage',
        condition: 'Ratio > 1.30',
        adjustment: '+15%',
        color: 'bg-red-500',
        description: 'Demand far exceeds supply - highest price pressure'
      },
      {
        number: 2,
        name: 'Shortage',
        condition: '1.10 < Ratio ≤ 1.30',
        adjustment: '+8%',
        color: 'bg-amber-500',
        description: 'Demand exceeds supply - moderate price increase'
      },
      {
        number: 3,
        name: 'Balanced',
        condition: '0.80 ≤ Ratio ≤ 1.10',
        adjustment: '0%',
        color: 'bg-green-500',
        description: 'Supply and demand in equilibrium - no adjustment'
      },
      {
        number: 4,
        name: 'Surplus',
        condition: 'Ratio < 0.80',
        adjustment: '-10%',
        color: 'bg-blue-500',
        description: 'Supply exceeds demand - price decrease'
      },
    ]
  },
  'safety-limits': {
    title: 'Safety Limits',
    icon: '🔐',
    content: `
    ETHANI enforces hard limits on price movements to protect markets from extreme volatility.
    Even in severe shortages, prices cannot increase by more than 50%.
    Even in massive surpluses, prices cannot decrease by more than 30%.
    `,
    limits: [
      { direction: 'Maximum Increase', limit: '+50%', reason: 'Prevents price gouging during shortages' },
      { direction: 'Maximum Decrease', limit: '-30%', reason: 'Prevents dumping and market collapse' },
    ]
  },
  'algorithm-flow': {
    title: 'Algorithm Flow',
    icon: '⚙️',
    content: `
    Here's how ETHANI calculates prices step-by-step:
    
    1. Calculate Ratio = Demand / Supply
    2. Look up Pricing Tier based on ratio
    3. Get Base Adjustment from tier (0%, ±8%, ±15%)
    4. Apply Hard Limits (cap at ±50% and -30%)
    5. Calculate Final Price = Base Price × (1 + Adjustment%)
    6. Return: Final Price, Tier, Adjustment %, Explanation
    `,
    steps: [
      { number: 1, description: 'Input: supply, demand, base_price' },
      { number: 2, description: 'Calculate supply-demand ratio' },
      { number: 3, description: 'Match ratio to pricing tier' },
      { number: 4, description: 'Get adjustment percentage' },
      { number: 5, description: 'Apply hard safety limits' },
      { number: 6, description: 'Calculate and return final price' },
    ]
  },
  'regional-impact': {
    title: 'Regional Impact',
    icon: '🌍',
    content: `
    ETHANI's rules apply consistently across all regions.
    Same supply-demand conditions produce same price adjustments everywhere.
    
    This ensures price stability for staple foods globally while allowing regional variations based on local supply-demand dynamics.
    `,
    regions: [
      { region: 'Southeast Asia', status: 'Active', markets: 'Indonesia, Thailand, Philippines, Vietnam' },
      { region: 'South Asia', status: 'Active', markets: 'India, Pakistan, Bangladesh' },
      { region: 'Africa', status: 'Active', markets: 'Nigeria, Kenya, South Africa' },
      { region: 'Middle East', status: 'Active', markets: 'Saudi Arabia, UAE, Egypt' },
      { region: 'Europe', status: 'Active', markets: 'Germany, France, Spain, Italy' },
      { region: 'Americas', status: 'Active', markets: 'USA, Canada, Brazil, Argentina' },
    ]
  },
  'why-matters': {
    title: 'Why It Matters',
    icon: '❓',
    content: `
    Food price stability is critical for vulnerable populations.
    
    When prices spike unexpectedly, poor families can't afford to eat.
    When prices collapse, farmers can't cover their costs and abandon farming.
    
    ETHANI's deterministic, rule-based approach ensures:
    • Predictability - Farmers and buyers know the rules in advance
    • Fairness - Same rules apply to everyone, everywhere
    • Transparency - All calculations are auditable
    • Stability - Prices move smoothly, not erratically
    `,
    benefits: [
      { title: 'For Farmers', description: 'Predictable pricing encourages investment and production' },
      { title: 'For Consumers', description: 'Stable prices ensure affordable access to food' },
      { title: 'For Markets', description: 'Reduced volatility means efficient trading and investment' },
      { title: 'For Society', description: 'Food security reduces conflict and migration pressures' },
    ]
  }
};

export default function StabilityRulesPage() {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Handle hash navigation on mount
    const hash = window.location.hash.slice(1);
    if (hash && hash in STABILITY_RULES_DATA) {
      setSelectedSection(hash);
    }
  }, []);

  const currentSection = STABILITY_RULES_DATA[selectedSection as keyof typeof STABILITY_RULES_DATA];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-100 transition-colors">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-300">Stability System</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">⚖️ Stability Rules</h1>
          <p className="text-slate-400">Rule-based price stabilization system — deterministic, transparent, auditable</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Section Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Sections</h3>
              <div className="space-y-2">
                {Object.entries(STABILITY_RULES_DATA).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSection(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      selectedSection === key
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
                    }`}
                  >
                    <span className="text-lg mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentSection && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">
                    {currentSection.icon} {currentSection.title}
                  </h2>
                  <div className="text-slate-400 whitespace-pre-line text-sm leading-relaxed">
                    {currentSection.content}
                  </div>
                </div>

                {/* Examples (for Overview) */}
                {selectedSection === 'overview' && 'examples' in currentSection && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Examples</h3>
                    <div className="space-y-3">
                      {currentSection.examples.map((ex, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Supply:</span>
                              <div className="font-bold text-slate-100">{ex.supply} units</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Demand:</span>
                              <div className="font-bold text-slate-100">{ex.demand} units</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Ratio:</span>
                              <div className="font-bold text-slate-100">{ex.ratio}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Adjustment:</span>
                              <div className="font-bold text-green-300">{ex.adjustment}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-slate-400">
                            Tier: <span className="text-amber-300 font-medium">{ex.tier}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tiers (for Pricing Tiers) */}
                {selectedSection === 'pricing-tiers' && 'tiers' in currentSection && (
                  <div className="space-y-3">
                    {currentSection.tiers.map((tier, idx) => (
                      <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${tier.color} flex items-center justify-center flex-shrink-0 text-white font-bold`}>
                            {tier.number}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-100">{tier.name}</h4>
                            <p className="text-sm text-slate-400 mb-2">{tier.description}</p>
                            <div className="flex gap-4 text-sm">
                              <div>
                                <span className="text-slate-500">Condition:</span>
                                <div className="font-mono text-slate-100">{tier.condition}</div>
                              </div>
                              <div>
                                <span className="text-slate-500">Adjustment:</span>
                                <div className="font-bold text-slate-100">{tier.adjustment}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Safety Limits */}
                {selectedSection === 'safety-limits' && 'limits' in currentSection && (
                  <div className="space-y-3">
                    {currentSection.limits.map((limit, idx) => (
                      <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-slate-100">{limit.direction}</h4>
                          <span className="text-2xl font-bold text-blue-400">{limit.limit}</span>
                        </div>
                        <p className="text-sm text-slate-400">{limit.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Algorithm Steps */}
                {selectedSection === 'algorithm-flow' && 'steps' in currentSection && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Step-by-Step Flow</h3>
                    <div className="space-y-3">
                      {currentSection.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 font-bold text-green-300">
                            {step.number}
                          </div>
                          <div className="flex-1 py-1">
                            <p className="text-slate-100 font-medium">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regional Impact */}
                {selectedSection === 'regional-impact' && 'regions' in currentSection && (
                  <div className="space-y-3">
                    {currentSection.regions.map((r, idx) => (
                      <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <h4 className="font-bold text-slate-100 mb-1">{r.region}</h4>
                        <p className="text-sm text-slate-400 mb-2">{r.markets}</p>
                        <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Why It Matters */}
                {selectedSection === 'why-matters' && 'benefits' in currentSection && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSection.benefits.map((benefit, idx) => (
                      <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h4 className="font-bold text-slate-100 mb-2">{benefit.title}</h4>
                        <p className="text-sm text-slate-400">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm">
            All ETHANI pricing calculations are deterministic, auditable, and blockchain-verified.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            No artificial intelligence. No randomness. Just clear, rule-based logic.
          </p>
        </div>
      </main>
    </div>
  );
}
