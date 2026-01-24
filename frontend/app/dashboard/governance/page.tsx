'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';

// ============================================================================
// GOVERNANCE DATA STRUCTURE
// ============================================================================

interface GovernanceSection {
  id: string;
  icon: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  keyPoints: Array<{
    label: string;
    value: string;
    explanation: string;
  }>;
  helperText: string;
}

const GOVERNANCE_SECTIONS: GovernanceSection[] = [
  {
    id: 'pricing-rules',
    icon: '📊',
    title: 'Pricing Rules',
    shortDescription: 'Defines how prices react to shortages and surpluses',
    fullDescription:
      'These rules determine price adjustments based on supply-demand ratios. They ensure fair pricing while preventing extreme volatility.',
    keyPoints: [
      {
        label: 'Critical Shortage Multiplier',
        value: '+15%',
        explanation: 'Applied when supply drops below critical threshold',
      },
      {
        label: 'Shortage Multiplier',
        value: '+8%',
        explanation: 'Gradual price increase during limited supply',
      },
      {
        label: 'Balanced Market',
        value: '0%',
        explanation: 'No adjustment when supply-demand is equilibrium',
      },
      {
        label: 'Surplus Multiplier',
        value: '-10%',
        explanation: 'Price reduction when supply exceeds demand',
      },
    ],
    helperText:
      'These parameters prevent price spikes and protect consumers from sudden shortages while ensuring fair compensation for producers.',
  },
  {
    id: 'supply-demand',
    icon: '🌾',
    title: 'Supply & Demand Logic',
    shortDescription: 'Calculates supply-demand ratios and triggers adjustments',
    fullDescription:
      'The system monitors real-time supply and demand signals to calculate ratios that determine pricing tiers.',
    keyPoints: [
      {
        label: 'Supply Index Thresholds',
        value: 'Dynamic',
        explanation: 'Tracks available inventory across regions monthly',
      },
      {
        label: 'Demand Spike Detection',
        value: 'Real-time',
        explanation: 'Identifies sudden demand increases and alerts system',
      },
      {
        label: 'Seasonal Adjustments',
        value: 'Quarterly',
        explanation: 'Accounts for harvest seasons and regional variations',
      },
      {
        label: 'Farmer Input Weighting',
        value: '30%',
        explanation: 'Direct farmer data contribution to supply estimates',
      },
    ],
    helperText:
      'Supply-demand data comes from decentralized sources including farmers, traders, and market monitors. Seasonal adjustments prevent artificial scarcity.',
  },
  {
    id: 'regional-adjustments',
    icon: '🌍',
    title: 'Regional Adjustments',
    shortDescription: 'Applies region-specific economic factors to prices',
    fullDescription:
      'Different regions face unique challenges: climate, conflict, import dependency, and local production capacity. These adjustments ensure fair pricing globally.',
    keyPoints: [
      {
        label: 'Climate Risk Factor',
        value: '-5% to +10%',
        explanation: 'Adjusts for drought, flood, or weather disruption risk',
      },
      {
        label: 'Import Dependency Factor',
        value: 'Dynamic',
        explanation: 'Accounts for regions reliant on food imports',
      },
      {
        label: 'Conflict / Disruption Signal',
        value: '+5% to +20%',
        explanation: 'Reflects supply chain disruption in affected areas',
      },
      {
        label: 'Local Production Score',
        value: '0% to -15%',
        explanation: 'Discount for regions with strong domestic production',
      },
    ],
    helperText:
      'Regional factors prevent one global price from harming local producers or creating unrealistic expectations in different economic zones.',
  },
  {
    id: 'stability-safeguards',
    icon: '⚖️',
    title: 'Stability Safeguards',
    shortDescription: 'Hard limits and safety mechanisms to prevent abuse',
    fullDescription:
      'Even with rules, extreme market conditions could trigger oversized price movements. These safeguards enforce hard limits.',
    keyPoints: [
      {
        label: 'Max Daily Price Change',
        value: '±50%',
        explanation: 'Absolute ceiling on daily price movement per commodity',
      },
      {
        label: 'Emergency Freeze Logic',
        value: 'Threshold-based',
        explanation: 'Pauses updates if price volatility exceeds 100%',
      },
      {
        label: 'Anti-Manipulation Buffer',
        value: '10% variance band',
        explanation: 'Smooths suspicious spikes to prevent gaming the system',
      },
      {
        label: 'Oracle Confidence Score (Future)',
        value: 'Weighted',
        explanation: 'Future feature to weight reliable data sources higher',
      },
    ],
    helperText:
      'These safeguards ensure no single event (bad harvest, conflict) causes food prices to spike beyond the safety limits that would harm vulnerable populations.',
  },
  {
    id: 'protocol-parameters',
    icon: '🏛️',
    title: 'Protocol Parameters',
    shortDescription: 'Core system configuration and update intervals',
    fullDescription:
      'These parameters control how frequently the system updates prices and how smoothly it adapts to market changes.',
    keyPoints: [
      {
        label: 'Update Interval',
        value: '24 hours',
        explanation: 'Prices recalculate once daily to provide stability',
      },
      {
        label: 'Price Smoothing Window',
        value: '7 days',
        explanation: 'Uses 7-day average to smooth short-term noise',
      },
      {
        label: 'Volatility Tolerance',
        value: '±15%',
        explanation: 'Acceptable variance before triggering safeguards',
      },
      {
        label: 'Global vs Regional Weight',
        value: '70% / 30%',
        explanation: 'Balances global market signals with local factors',
      },
    ],
    helperText:
      'These parameters are tunable: faster updates for volatile regions, slower for stable markets. Adjustments require community governance.',
  },
  {
    id: 'future-dao',
    icon: '🗳️',
    title: 'Future DAO Actions',
    shortDescription: 'Governance functions coming post-launch',
    fullDescription:
      'ETHANI is designed for decentralized governance. These features will be enabled after community formation and are currently disabled in Demo Mode.',
    keyPoints: [
      {
        label: 'Parameter Voting',
        value: '🚧 Coming Soon',
        explanation: 'DAO votes on multipliers, thresholds, and intervals',
      },
      {
        label: 'Proposal System',
        value: '🚧 Coming Soon',
        explanation: 'Community can propose new pricing rules or adjustments',
      },
      {
        label: 'Delegation',
        value: '🚧 Planned',
        explanation: 'Token holders delegate voting to trusted delegates',
      },
      {
        label: 'Multi-sig Security',
        value: '🚧 Planned',
        explanation: 'Critical parameter changes require council approval',
      },
    ],
    helperText:
      'Decentralized governance ensures ETHANI remains fair and adaptable. No single entity controls pricing logic.',
  },
];

// ============================================================================
// MODAL COMPONENT
// ============================================================================

interface ModalProps {
  section: GovernanceSection;
  isOpen: boolean;
  onClose: () => void;
}

function GovernanceModal({ section, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{section.icon}</span>
            <h2 className="text-2xl font-bold text-slate-100">{section.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Description */}
          <p className="text-slate-300 text-base">{section.fullDescription}</p>

          {/* Key Points */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-100">Key Parameters</h3>
            <div className="space-y-3">
              {section.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 hover:border-green-500/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-slate-100">{point.label}</p>
                    <span className="text-lg font-bold text-green-400">{point.value}</span>
                  </div>
                  <p className="text-sm text-slate-400">{point.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Helper Text */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <span className="font-semibold">💡 </span>
              {section.helperText}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">🔒 Demo Mode – Governance voting disabled</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// GOVERNANCE PAGE
// ============================================================================

export default function GovernancePage() {
  const [selectedSection, setSelectedSection] = React.useState<GovernanceSection | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-100">🛡️ Governance Rules</h1>
          <Badge variant="warning">🔒 Demo Mode</Badge>
        </div>
        <p className="text-slate-400 mt-1">Explore ETHANI's rule-based price stabilization governance</p>
        <p className="text-xs text-slate-500 mt-2">
          📌 These rules define how ETHANI stabilizes food prices globally. In production, changes will be governed by DAO voting.
        </p>
      </div>

      {/* Overview Card */}
      <Card>
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-100">How Governance Works</h2>
          <p className="text-slate-300">
            ETHANI uses deterministic, rule-based logic to adjust food prices based on supply-demand conditions. Unlike traditional markets or AI-driven systems, every price adjustment is:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>Transparent:</strong> Published rules visible to all participants
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>Auditable:</strong> Smart contracts enforce logic immutably
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>Fair:</strong> Same rules apply globally, with regional adjustments for local conditions
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">✓</span>
              <span className="text-slate-300">
                <strong>Decentralized:</strong> Post-launch, DAO governance will control rule updates
              </span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Clickable Governance Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100">Governance Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOVERNANCE_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section)}
              className="text-left bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-green-500/40 hover:bg-slate-800/60 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{section.icon}</span>
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">→</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-green-400 transition-colors mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
                {section.shortDescription}
              </p>
              <p className="text-xs text-slate-600 mt-3 group-hover:text-slate-500">👉 View details</p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <Card>
        <p className="text-sm text-slate-400">
          <span className="font-semibold">📌 Production Governance:</span> The governance logic shown here reflects ETHANI's production design. DAO voting and on-chain updates will be enabled post-launch. Currently, this is a read-only demonstration for hackathon evaluation.
        </p>
      </Card>

      {/* Modal */}
      {selectedSection && (
        <GovernanceModal
          section={selectedSection}
          isOpen={!!selectedSection}
          onClose={() => setSelectedSection(null)}
        />
      )}
    </div>
  );
}
