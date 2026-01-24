# ETHANI Frontend

**Demo-Friendly Visualization Layer for Arbitrum-Native Price Calculation**

---

## Executive Summary

The ETHANI frontend is a **transparent visualization interface** that:

✅ **Does NOT compute prices** — All logic runs on Arbitrum (Stylus + Solidity)  
✅ **No authentication required** — Completely open access for demos  
✅ **No wallet connection needed** — View calculations without blockchain interaction  
✅ **Deterministic simulation** — Shows results based on Arbitrum contract rules  
✅ **Educational & transparent** — Explains every pricing decision  
✅ **Demo-mode interface** — Mock inputs, no real financial data  

**Network Target:** Arbitrum Sepolia (testnet, current) → Arbitrum One (mainnet, Q2 2026)

---

## Overview

### What the Frontend Does

```
┌─────────────────────────────────────┐
│  USER INTERFACE (Next.js/React)     │
│  • Input sliders for supply/demand  │
│  • Display calculated prices        │
│  • Show pricing tier & reasoning    │
│  • Educational explanations         │
│  • Interactive demos                │
└──────────────┬──────────────────────┘
               │ HTTP API calls
┌──────────────▼──────────────────────┐
│  BACKEND (FastAPI)                  │
│  • Input validation                 │
│  • Fallback chain coordination      │
│  • Audit logging                    │
└──────────────┬──────────────────────┘
               │ ethers.js calls
┌──────────────▼──────────────────────┐
│  ARBITRUM SMART CONTRACTS           │
│  • Stylus (WASM) - Primary          │
│  • Solidity (EVM) - Fallback        │
│  • Deterministic pricing rules      │
└─────────────────────────────────────┘
```

**Key Point:** Frontend is the **presentation layer** — all business logic runs on Arbitrum.

### What the Frontend Does NOT Do

❌ Compute prices (Arbitrum does)  
❌ Use AI/ML (rules-based only)  
❌ Access real market data (simulation mode)  
❌ Execute blockchain transactions (view-only)  
❌ Store sensitive data  
❌ Require authentication  

---

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

**Requirements:**
- Node.js 18+
- npm 9+

### 2. Configure Backend & Arbitrum

Create `.env.local`:

```bash
# Backend API (where FastAPI is running)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Arbitrum Network Info (for UI display only, no transactions)
NEXT_PUBLIC_ARBITRUM_NETWORK=sepolia
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=421614
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Contract Addresses (for UI reference/explorer links)
NEXT_PUBLIC_STYLUS_CONTRACT=0xf174bC196b4e0886aeA7e48D91661798B376F57C
NEXT_PUBLIC_SOLIDITY_CONTRACT=0xc92fd01c122821Eb2C911d16468B20b07E25abC0
```

### 3. Start Development Server

```bash
npm run dev
```

**Frontend available at:** http://localhost:3000  
**Backend must be running at:** http://localhost:8000

### 4. View the App

Open: http://localhost:3000

- No wallet connection needed
- No authentication required
- Interact with price calculator immediately

---

## Key Concept: Demo Mode

ETHANI frontend operates in **demo mode**:

```
┌────────────────────────────────────────┐
│         DEMO MODE BEHAVIOR             │
├────────────────────────────────────────┤
│ ✅ User can input any supply value    │
│ ✅ User can input any demand value    │
│ ✅ Backend calculates fair price      │
│ ✅ Price is deterministic (same every │
│    time for same inputs)              │
│ ✅ No real market data used           │
│ ✅ No actual transactions             │
│ ✅ Purely educational simulation      │
│                                        │
│ Production Version (2027+):            │
│ • Real supply-demand data inputs      │
│ • Verified oracle feeds               │
│ • Region-specific pricing             │
│ • On-chain record of calculations     │
│ • Arbitrum Orbit regional chains      │
└────────────────────────────────────────┘
```

**Message to judges/users:**
> "ETHANI demonstrates a deterministic pricing simulation based on real-world supply-demand rules. The frontend shows how transparent, rule-based pricing can work. In production, data inputs would be sourced from verified contributors and oracles, while pricing logic remains fully deterministic and on-chain."

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (main demo)
│   ├── globals.css           # Global styles
│   └── [...other pages...]
│
├── components/
│   ├── PriceCalculator.tsx   # Main price input/output
│   ├── RuleExplainer.tsx     # Pricing rules education
│   ├── TierVisualizer.tsx    # Visual tier indicator
│   ├── Header.tsx            # Navigation header
│   └── [...other components]
│
├── lib/
│   ├── api.ts                # Backend API client
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
│
├── public/                   # Static assets
│
├── .env.local                # Configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
└── tailwind.config.ts        # Tailwind config
```

---

## Core Components

### 1. PriceCalculator.tsx

Main interactive component for price calculation demo.

**Features:**
- Sliders for supply (0-1000 units)
- Sliders for demand (0-1000 units)
- Input for base price
- Real-time calculation via backend
- Display of calculated price & reasoning
- Visual tier indicator (shortage/balanced/surplus)

**No Wallet Connection Required:**
```tsx
'use client';

import { useState } from 'react';
import { calculatePrice } from '@/lib/api';

export default function PriceCalculator() {
  const [supply, setSupply] = useState(100);
  const [demand, setDemand] = useState(150);
  const [basePrice, setBasePrice] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      // Call backend API
      // Backend calls Arbitrum contracts
      // Returns deterministic result
      const response = await calculatePrice({
        supply,
        demand,
        base_price: basePrice
      });
      setResult(response);
    } catch (error) {
      console.error('Calculation failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-6">
        Fair Food Price Calculator
      </h1>
      
      {/* Demo Mode Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Demo Mode:</strong> This is a deterministic pricing simulation. 
          Try different supply/demand values to see how the algorithm responds.
        </p>
      </div>

      {/* Supply Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Supply: <strong>{supply} units</strong>
        </label>
        <input
          type="range"
          min="1"
          max="1000"
          value={supply}
          onChange={(e) => setSupply(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Demand Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Demand: <strong>{demand} units</strong>
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          value={demand}
          onChange={(e) => setDemand(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Base Price Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Base Price: <strong>${basePrice}</strong>
        </label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          min="1"
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Calculating on Arbitrum...' : 'Calculate Fair Price'}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-8 p-6 bg-green-50 border border-green-300 rounded">
          <h2 className="text-2xl font-bold mb-4">Fair Price Result</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Supply-Demand Ratio</p>
              <p className="text-2xl font-bold">{result.ratio.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Price Tier</p>
              <p className="text-2xl font-bold">{result.tier}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded border mb-6">
            <p className="text-gray-600 text-sm mb-2">Calculated Price</p>
            <p className="text-4xl font-bold text-green-600">${result.price}</p>
            <p className="text-sm text-gray-500 mt-2">
              {result.multiplier > 1 ? '↑' : result.multiplier < 1 ? '↓' : '→'}
              {' '}{Math.abs((result.multiplier - 1) * 100).toFixed(0)}% adjustment
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Why?</strong> {result.reason}
            </p>
          </div>

          {/* Contract Info */}
          <div className="mt-6 text-xs text-gray-500 border-t pt-4">
            <p>Calculated via: {result.calculation_source === 'stylus' ? '⚡ Stylus (WASM)' : '✅ Solidity (EVM)'}</p>
            <p>Network: Arbitrum {process.env.NEXT_PUBLIC_ARBITRUM_NETWORK}</p>
            <p>Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. RuleExplainer.tsx

Educational component explaining the four pricing tiers.

**Features:**
- Visual explanation of each tier
- Real-world examples
- Supply-demand ratio thresholds
- Hard limit explanations

```tsx
'use client';

export default function RuleExplainer() {
  const rules = [
    {
      tier: "Critical Shortage",
      ratio: "> 1.30",
      adjustment: "+15%",
      icon: "🚨",
      explanation: "Demand far exceeds supply. Price increases to encourage production and reduce consumption.",
      example: "Supply: 100, Demand: 150 → Ratio: 1.5 → +15% increase"
    },
    {
      tier: "Shortage",
      ratio: "> 1.10",
      adjustment: "+8%",
      icon: "⚠️",
      explanation: "Demand moderately exceeds supply. Slight price increase to balance the market.",
      example: "Supply: 100, Demand: 120 → Ratio: 1.2 → +8% increase"
    },
    {
      tier: "Balanced",
      ratio: "0.80–1.10",
      adjustment: "0%",
      icon: "✅",
      explanation: "Supply and demand are roughly equal. Price stays stable.",
      example: "Supply: 100, Demand: 100 → Ratio: 1.0 → No change"
    },
    {
      tier: "Surplus",
      ratio: "< 0.80",
      adjustment: "-10%",
      icon: "📦",
      explanation: "Supply exceeds demand. Price decreases to encourage consumption.",
      example: "Supply: 200, Demand: 100 → Ratio: 0.5 → -10% decrease"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">How Deterministic Pricing Works</h2>
      <p className="text-gray-600">
        ETHANI uses transparent, rule-based pricing executed on Arbitrum smart contracts. 
        No AI. No speculation. Just clear, auditable logic.
      </p>

      {/* Pricing Tiers */}
      <div className="space-y-4">
        {rules.map((rule, idx) => (
          <div key={idx} className="border-l-4 border-green-600 p-4 bg-green-50 rounded">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{rule.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{rule.tier}</h3>
                <p className="text-sm text-gray-600 mb-2">Ratio: {rule.ratio}</p>
                <p className="text-xl font-bold text-green-600 mb-2">{rule.adjustment}</p>
                <p className="text-gray-700 mb-2">{rule.explanation}</p>
                <p className="text-sm text-gray-500 italic">📊 {rule.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hard Limits */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded p-6">
        <h3 className="font-bold text-lg mb-3">🛡️ Hard Limits (Safeguards)</h3>
        <p className="text-gray-700 mb-4">
          Even in extreme supply-demand situations, prices are capped to protect both 
          farmers and consumers:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border border-yellow-200">
            <p className="text-sm text-gray-600">Maximum Increase</p>
            <p className="text-2xl font-bold text-green-600">+50%</p>
            <p className="text-xs text-gray-500 mt-1">Protects consumers from excessive prices</p>
          </div>
          <div className="bg-white p-4 rounded border border-yellow-200">
            <p className="text-sm text-gray-600">Maximum Decrease</p>
            <p className="text-2xl font-bold text-blue-600">-30%</p>
            <p className="text-xs text-gray-500 mt-1">Protects farmers from losing money</p>
          </div>
        </div>
      </div>

      {/* Transparency Notice */}
      <div className="bg-purple-50 border-2 border-purple-300 rounded p-6">
        <h3 className="font-bold text-lg mb-2">🔍 Fully Transparent & Auditable</h3>
        <ul className="space-y-2 text-gray-700">
          <li>✅ All pricing logic runs on Arbitrum smart contracts</li>
          <li>✅ Same calculation in Stylus (WASM) and Solidity (EVM) fallback</li>
          <li>✅ Every price is auditable and reproducible</li>
          <li>✅ Deterministic: same inputs always produce same output</li>
          <li>✅ Open source (MIT licensed)</li>
        </ul>
      </div>
    </div>
  );
}
```

### 3. TierVisualizer.tsx

Visual indicator of current pricing tier based on supply-demand ratio.

```tsx
'use client';

import { useMemo } from 'react';

interface TierVisualizerProps {
  supply: number;
  demand: number;
}

export default function TierVisualizer({ supply, demand }: TierVisualizerProps) {
  const ratio = useMemo(() => demand / supply, [supply, demand]);

  const getTierInfo = (r: number) => {
    if (r > 1.3) {
      return {
        name: "Critical Shortage",
        multiplier: 1.15,
        color: "bg-red-500",
        icon: "🚨",
        description: "Demand far exceeds supply"
      };
    }
    if (r > 1.1) {
      return {
        name: "Shortage",
        multiplier: 1.08,
        color: "bg-orange-500",
        icon: "⚠️",
        description: "Demand exceeds supply"
      };
    }
    if (r >= 0.8) {
      return {
        name: "Balanced",
        multiplier: 1.0,
        color: "bg-green-500",
        icon: "✅",
        description: "Supply equals demand"
      };
    }
    return {
      name: "Surplus",
      multiplier: 0.9,
      color: "bg-blue-500",
      icon: "📦",
      description: "Supply exceeds demand"
    };
  };

  const tier = getTierInfo(ratio);

  return (
    <div className={`${tier.color} text-white rounded-lg p-6`}>
      <p className="text-4xl mb-2">{tier.icon}</p>
      <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
      <p className="text-sm mb-4">{tier.description}</p>
      <p className="text-3xl font-bold">
        {tier.multiplier > 1 ? '+' : tier.multiplier < 1 ? '-' : ''}
        {Math.abs((tier.multiplier - 1) * 100).toFixed(0)}%
      </p>
      <p className="text-xs mt-2 opacity-80">Ratio: {ratio.toFixed(2)}</p>
    </div>
  );
}
```

---

## Backend Integration

### API Client (`lib/api.ts`)

All API calls are read-only (no transactions):

```typescript
// lib/api.ts
import { PriceRequest, PriceResult } from './types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function calculatePrice(params: PriceRequest): Promise<PriceResult> {
  const query = new URLSearchParams({
    supply: String(params.supply),
    demand: String(params.demand),
    base_price: String(params.base_price)
  });

  const response = await fetch(
    `${API_URL}/price?${query}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    throw new Error(`Backend error: ${response.statusText}`);
  }

  return response.json();
}

export async function getPricingRules() {
  const response = await fetch(`${API_URL}/rules`);
  if (!response.ok) {
    throw new Error('Failed to fetch pricing rules');
  }
  return response.json();
}

export async function getSupplyDemandRatio(supply: number, demand: number) {
  const response = await fetch(
    `${API_URL}/ratio?supply=${supply}&demand=${demand}`
  );
  if (!response.ok) {
    throw new Error('Failed to calculate ratio');
  }
  return response.json();
}
```

### Types (`lib/types.ts`)

```typescript
// lib/types.ts
export interface PriceRequest {
  supply: number;
  demand: number;
  base_price: number;
}

export interface PriceResult {
  price: number;
  ratio: number;
  tier: 'critical_shortage' | 'shortage' | 'balanced' | 'surplus';
  multiplier: number;
  reason: string;
  base_price: number;
  hard_limit_applied: boolean;
  calculation_source: 'stylus' | 'solidity' | 'local';
  contract_address?: string;
  arbitrum_network: 'sepolia' | 'one';
  timestamp: string;
  ai_used: false;
}
```

---

## Environment Configuration

### Development (.env.local)

```bash
# Backend API endpoint
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Arbitrum Network (for UI reference, no transactions)
NEXT_PUBLIC_ARBITRUM_NETWORK=sepolia
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=421614
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Contract Addresses (for explorer links only)
NEXT_PUBLIC_STYLUS_CONTRACT=0xf174bC196b4e0886aeA7e48D91661798B376F57C
NEXT_PUBLIC_SOLIDITY_CONTRACT=0xc92fd01c122821Eb2C911d16468B20b07E25abC0

# Feature Flags
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SHOW_CONTRACT_INFO=true
```

### Production (Arbitrum One mainnet)

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.ethani.farm
NEXT_PUBLIC_ARBITRUM_NETWORK=one
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=42161
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_STYLUS_CONTRACT=0x[mainnet-stylus-address]
NEXT_PUBLIC_SOLIDITY_CONTRACT=0x[mainnet-solidity-address]
NEXT_PUBLIC_DEMO_MODE=false
```

---

## Building for Production

### Build

```bash
npm run build
```

Optimizes for production with code splitting and minification.

### Deployment

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

- Zero-config deployment
- Automatic deployments on git push
- Global CDN
- Free tier available

#### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

ENV NEXT_PUBLIC_BACKEND_URL=http://backend:8000
ENV NEXT_PUBLIC_ARBITRUM_NETWORK=sepolia

CMD ["npm", "start"]
```

#### Netlify / Railway / AWS Amplify

All support Next.js with simple configuration.

---

## Design Principles

### 1. **No Authentication Required**
- Anyone can view and use the demo
- No wallet connection needed
- No private keys involved
- No blockchain write transactions

### 2. **Deterministic Display**
- Same inputs always show same price
- Timestamp shows when calculation occurred
- Source (Stylus/Solidity) clearly labeled
- Arbitrum network clearly displayed

### 3. **Educational Focus**
- Explain every decision
- Show the calculation formula
- Display the tier and its reasoning
- Link to documentation

### 4. **Transparency**
- No hidden logic
- Show backend responses
- Display contract addresses
- Clear about demo mode vs production

---

## Testing

### Manual Testing

```bash
# Test basic flow
1. npm run dev
2. Open http://localhost:3000
3. Adjust supply slider to 100
4. Adjust demand slider to 150
5. Click "Calculate Fair Price"
6. Verify result shows:
   - Price: 115
   - Ratio: 1.5
   - Tier: Critical Shortage
   - Reason explaining +15% adjustment
```

### Test Scenarios

| Scenario | Supply | Demand | Expected Price | Expected Tier |
|----------|--------|--------|-----------------|--------------|
| Critical Shortage | 100 | 150 | 115 | Critical Shortage |
| Shortage | 100 | 120 | 108 | Shortage |
| Balanced | 100 | 100 | 100 | Balanced |
| Surplus | 200 | 100 | 90 | Surplus |
| Hard Limit (Extreme) | 10 | 200 | 150 | Capped at +50% |

---

## Performance Optimization

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <p>Loading...</p> }
);
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="ETHANI"
  width={200}
  height={200}
  priority
/>
```

### Caching

```tsx
// Cache API responses for 5 minutes
export const revalidate = 300;
```

---

## Troubleshooting

### Backend Connection Error

```bash
# Check backend is running
curl http://localhost:8000/health

# Verify API URL in .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Restart frontend
npm run dev
```

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Slow Calculations

- Check backend is responsive: `curl http://localhost:8000/health`
- Monitor network tab in browser DevTools
- Verify Arbitrum RPC is accessible

---

## Contributing

### Code Guidelines

- TypeScript everywhere
- Semantic HTML
- Tailwind CSS for styling
- Components in `components/` folder
- No external pricing logic
- Clear prop documentation

### Component Checklist

- [ ] Uses TypeScript interfaces
- [ ] Has PropTypes or types
- [ ] Handles loading states
- [ ] Has error handling
- [ ] Responsive design (mobile-first)
- [ ] Accessible (ARIA labels)
- [ ] No wallet requirements
- [ ] Clear demo mode labels

### What NOT to Do

❌ Don't add authentication to demo  
❌ Don't use real market data feeds  
❌ Don't implement pricing logic  
❌ Don't add AI/ML models  
❌ Don't require wallet connection  
✅ Keep it simple and educational  
✅ Show clear calculation flow  
✅ Label everything as demo  

---

## Documentation

**For more information:**
- **Backend:** See [BACKEND_SERVICE.md](./BACKEND_SERVICE.md)
- **Architecture:** See [architecture.md](./architecture.md)
- **Pricing Rules:** See [pricing-model.md](./pricing-model.md)
- **Stylus Details:** See [STYLUS_VERIFICATION_GUIDE.md](./STYLUS_VERIFICATION_GUIDE.md)
- **Arbitrum Docs:** https://docs.arbitrum.io

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend URL set correctly
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Mobile responsive (test on mobile)
- [ ] Backend running and accessible
- [ ] Demo mode clearly labeled (if applicable)
- [ ] Contract info displayed (Arbitrum network, addresses)
- [ ] No authentication required
- [ ] No wallet connection needed
- [ ] HTTPS configured (production)

---

**Status:** Production-ready on Arbitrum Sepolia  
**Framework:** Next.js 14 + React 18  
**License:** MIT  
**Philosophy:** Clarity, transparency, education
