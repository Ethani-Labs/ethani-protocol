# 🎨 Frontend Web App - Ethani

Simple, educational Next.js interface for transparent food price stabilization.

## Philosophy

✅ **Next.js** - Modern React framework, great for education  
✅ **Simple UI** - Clean, focus on clarity not complexity  
✅ **Educational** - Explains pricing rules and why they matter  
✅ **Transparent** - Show all calculations, no hidden logic  

---

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

Open: **http://localhost:3000**

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout (header, footer)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── ...                 # Other pages
│
├── components/
│   ├── PriceCard.tsx       # Main price calculator component
│   ├── RuleExplainer.tsx   # Educational component (to create)
│   ├── RatioAnalyzer.tsx   # Ratio analysis component (to create)
│   └── ...                 # Other components
│
├── lib/
│   └── api.ts              # Backend API client
│
├── package.json            # Dependencies
└── public/                 # Static assets (images, icons)
```

---

## Core Components

### 1. **PriceCard.tsx** - Main Calculator

The primary component for price calculation.

**Features:**
- Input sliders for supply, demand, base price
- Real-time price calculation
- Shows current tier (shortage, balanced, surplus)
- Displays multiplier and final price
- Explains the pricing decision

**Usage:**

```tsx
import PriceCard from '@/components/PriceCard';

export default function Home() {
  return <PriceCard />;
}
```

**Props:**
```typescript
interface PriceCardProps {
  initialSupply?: number;
  initialDemand?: number;
  initialBasePrice?: number;
  onPriceChange?: (result: PriceResult) => void;
}
```

**User Flow:**
1. User adjusts supply slider (0-1000)
2. User adjusts demand slider (0-1000)
3. Component calculates ratio in real-time
4. Shows pricing tier and adjustment
5. Displays final price and explanation

**Example Code:**

```tsx
'use client';

import { useState } from 'react';
import { calculatePrice, PriceResult } from '@/lib/api';

export default function PriceCard() {
  const [supply, setSupply] = useState(100);
  const [demand, setDemand] = useState(150);
  const [basePrice, setBasePrice] = useState(100);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Price Calculator</h2>
      
      {/* Supply Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Supply: {supply} units
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
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Demand: {demand} units
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
          Base Price: ${basePrice}
        </label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate Price'}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-bold text-lg">Result</h3>
          <p className="text-gray-600 text-sm">Ratio: {result.ratio}</p>
          <p className="text-2xl font-bold text-green-600 my-2">
            ${result.suggested_price}
          </p>
          <p className="text-sm text-gray-700">{result.reason}</p>
          {result.is_capped && (
            <p className="text-sm text-red-600 mt-2">⚠️ Price is hard-limited</p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 2. **RuleExplainer.tsx** - Educational Component

Explains pricing rules in simple language.

**To Create:**

```tsx
// components/RuleExplainer.tsx

export default function RuleExplainer() {
  const rules = [
    {
      tier: "Critical Shortage",
      ratio: "> 1.30",
      adjustment: "+15%",
      icon: "🚨",
      explanation: "Demand is much higher than supply. Increase price to encourage supply and reduce demand.",
      example: "Supply: 100, Demand: 150 → Price: +15%"
    },
    {
      tier: "Shortage",
      ratio: "> 1.10",
      adjustment: "+8%",
      icon: "⚠️",
      explanation: "Demand exceeds supply. Slightly increase price to balance the market.",
      example: "Supply: 100, Demand: 120 → Price: +8%"
    },
    {
      tier: "Balanced",
      ratio: "0.80-1.10",
      adjustment: "0%",
      icon: "✅",
      explanation: "Supply and demand are balanced. Keep price stable.",
      example: "Supply: 100, Demand: 100 → Price: 0%"
    },
    {
      tier: "Surplus",
      ratio: "< 0.80",
      adjustment: "-10%",
      icon: "📦",
      explanation: "Supply exceeds demand. Decrease price to encourage consumption.",
      example: "Supply: 200, Demand: 100 → Price: -10%"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">📚 How Pricing Works</h2>
      
      {rules.map((rule, idx) => (
        <div key={idx} className="border-l-4 border-green-600 p-4 bg-green-50">
          <div className="flex items-start">
            <span className="text-3xl mr-4">{rule.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{rule.tier}</h3>
              <p className="text-sm text-gray-600">Ratio: {rule.ratio}</p>
              <p className="text-lg font-bold text-green-600 my-2">{rule.adjustment}</p>
              <p className="text-gray-700 mb-2">{rule.explanation}</p>
              <p className="text-sm text-gray-500 italic">{rule.example}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">🛡️ Hard Limits</h3>
        <p className="text-sm text-gray-700">
          Even with extreme supply-demand imbalances, prices are protected:
        </p>
        <ul className="text-sm text-gray-700 mt-2 space-y-1">
          <li>✅ Maximum price increase: <strong>+50%</strong></li>
          <li>✅ Maximum price decrease: <strong>-30%</strong></li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          This prevents farmers from losing money and protects consumers from excessive prices.
        </p>
      </div>
    </div>
  );
}
```

---

### 3. **RatioAnalyzer.tsx** - Educational Component

Shows supply-demand ratio analysis.

**To Create:**

```tsx
// components/RatioAnalyzer.tsx

export default function RatioAnalyzer() {
  const [supply, setSupply] = useState(100);
  const [demand, setDemand] = useState(100);
  const [ratio, setRatio] = useState(1.0);

  useEffect(() => {
    setRatio(demand / supply);
  }, [supply, demand]);

  const getTierColor = (r: number) => {
    if (r > 1.3) return 'bg-red-100 border-red-300 text-red-800';
    if (r > 1.1) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (r >= 0.8) return 'bg-green-100 border-green-300 text-green-800';
    return 'bg-blue-100 border-blue-300 text-blue-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Supply-Demand Ratio</h2>
      
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">{supply}</p>
          <p className="text-gray-600">Supply</p>
        </div>
        
        <div className="text-4xl text-gray-400">÷</div>
        
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">{demand}</p>
          <p className="text-gray-600">Demand</p>
        </div>
        
        <div className="text-4xl text-gray-400">=</div>
        
        <div className="text-center">
          <p className="text-4xl font-bold text-green-600">{ratio.toFixed(2)}</p>
          <p className="text-gray-600">Ratio</p>
        </div>
      </div>

      <div className={`p-4 rounded border-2 ${getTierColor(ratio)} text-center`}>
        <p className="font-bold text-lg">
          {ratio > 1.3 ? '🚨 Critical Shortage' : 
           ratio > 1.1 ? '⚠️ Shortage' :
           ratio >= 0.8 ? '✅ Balanced' :
           '📦 Surplus'}
        </p>
      </div>
    </div>
  );
}
```

---

## Pages

### Home Page (`app/page.tsx`)

Main landing page with price calculator.

```tsx
import PriceCard from '@/components/PriceCard';
import RuleExplainer from '@/components/RuleExplainer';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Fair Food Prices for Everyone
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          ETHANI uses transparent, rule-based pricing to stabilize food markets.
          No AI. No hidden algorithms. Just clear, auditable logic.
        </p>
      </section>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Calculator */}
        <div>
          <PriceCard />
        </div>

        {/* Right: Education */}
        <div>
          <RuleExplainer />
        </div>
      </div>
    </div>
  );
}
```

### Documentation Page (`app/docs.tsx`)

```tsx
export default function DocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded p-6 mb-8">
        <p className="text-gray-700 mb-4">
          ETHANI provides a simple REST API for price calculations.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">Base URL</h3>
            <code className="bg-white p-2 rounded text-sm">
              http://localhost:8000
            </code>
          </div>

          <div>
            <h3 className="font-bold mb-2">GET /price</h3>
            <p className="text-sm text-gray-700 mb-2">Calculate fair price</p>
            <code className="bg-white p-2 rounded text-xs block overflow-auto">
              /price?supply=100&demand=150&base_price=100
            </code>
          </div>

          <div>
            <h3 className="font-bold mb-2">GET /ratio</h3>
            <p className="text-sm text-gray-700 mb-2">Analyze ratio</p>
            <code className="bg-white p-2 rounded text-xs block overflow-auto">
              /ratio?supply=100&demand=150
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Styling

### Tailwind CSS Configuration

Use Tailwind CSS for styling (already included in Next.js):

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom colors for ETHANI */
:root {
  --color-primary: #16a34a; /* green-600 */
  --color-shortage: #ea580c; /* orange-600 */
  --color-critical: #dc2626; /* red-600 */
  --color-surplus: #2563eb; /* blue-600 */
}

/* Reusable component classes */
@layer components {
  .btn-primary {
    @apply bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700;
  }

  .card {
    @apply bg-white rounded-lg shadow p-6;
  }

  .tier-badge {
    @apply inline-block px-3 py-1 rounded font-medium text-sm;
  }
}
```

---

## API Client (`lib/api.ts`)

TypeScript client for backend communication.

**Main Functions:**

```typescript
// Calculate price
async function calculatePrice(input: PriceInput): Promise<PriceResult>

// Get ratio analysis
async function getSupplyDemandRatio(supply: number, demand: number): Promise<RatioResult>

// Get detailed calculation
async function getDetailedPrice(input: PriceRequest): Promise<DetailedPriceResult>

// Get all rules
async function getPricingRules(): Promise<RulesResponse>

// Health check
async function healthCheck(): Promise<HealthResponse>
```

**Error Handling:**

```typescript
try {
  const result = await calculatePrice(input);
  setResult(result);
} catch (error) {
  if (error instanceof FetchError) {
    setError(`API Error: ${error.message}`);
  } else {
    setError('Failed to calculate price');
  }
}
```

---

## Environment Configuration

### `.env.local` (Development)

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=

# Optional: Feature flags
NEXT_PUBLIC_SHOW_ADVANCED=false
```

### `.env.production` (Production)

```bash
# Production API
NEXT_PUBLIC_API_URL=https://api.ethani.example.com

# Analytics
NEXT_PUBLIC_GA_ID=your-ga-id

# Feature flags
NEXT_PUBLIC_SHOW_ADVANCED=true
```

---

## Development

### Running Development Server

```bash
npm run dev
# Server at http://localhost:3000
# Hot reload on file changes
```

### Code Quality

```bash
# Format code
npm run format

# Lint
npm run lint

# Type check
npm run type-check
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Building for Production

### Build

```bash
npm run build
```

Optimizes and prepares for deployment.

### Deployment Options

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Benefits:**
- Zero config
- Automatic deployments on git push
- Built-in analytics
- Global CDN
- Free tier available

#### Netlify

```bash
npm run build
# Deploy build/ folder to Netlify
```

#### Self-Hosted

```bash
npm run build
npm start
# Server at http://localhost:3000
```

#### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t ethani-frontend .
docker run -p 3000:3000 ethani-frontend
```

---

## Educational Features

### 1. **Transparency**
- Show all calculations
- Explain every decision
- Visualize ratio changes
- Display formulas

### 2. **Interactivity**
- Real-time sliders
- Instant calculations
- Dynamic feedback
- Visual tier changes

### 3. **Learning**
- Clear explanations
- Examples for each tier
- Educational tooltips
- Rules documentation

### 4. **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- High contrast colors

---

## Component Development Guide

### Creating a New Component

```tsx
// components/MyComponent.tsx
'use client';

import { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  data?: any[];
  onAction?: (data: any) => void;
}

export default function MyComponent({ 
  title, 
  data = [], 
  onAction 
}: MyComponentProps) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {/* Component content */}
    </div>
  );
}
```

### Key Principles

✅ **Client Components** - Use `'use client'` for interactivity  
✅ **Props Over Globals** - Accept props for configuration  
✅ **TypeScript** - Define interfaces for props  
✅ **Error Handling** - Try/catch API calls  
✅ **Loading States** - Show feedback during operations  
✅ **Responsive** - Mobile-first design  

---

## Performance

### Optimization Techniques

1. **Code Splitting**
   ```tsx
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(
     () => import('./HeavyComponent'),
     { loading: () => <p>Loading...</p> }
   );
   ```

2. **Image Optimization**
   ```tsx
   import Image from 'next/image';
   
   <Image
     src="/ethani-logo.png"
     alt="ETHANI"
     width={200}
     height={200}
   />
   ```

3. **Caching**
   ```tsx
   export const revalidate = 3600; // 1 hour cache
   ```

---

## Troubleshooting

### API Connection Issues

```bash
# Check backend is running
curl http://localhost:8000/health

# Update API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Restart dev server
npm run dev
```

### CORS Errors

Backend needs CORS configured:

```bash
# In backend .env
CORS_ORIGINS=http://localhost:3000
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## Contributing

### Code Style

- Use TypeScript everywhere
- Follow ESLint/Prettier rules
- Write semantic HTML
- Use Tailwind classes consistently
- Add comments for complex logic

### Component Checklist

- [ ] Uses TypeScript interfaces
- [ ] Has PropTypes or TypeScript types
- [ ] Handles loading states
- [ ] Has error handling
- [ ] Works on mobile
- [ ] Accessible (ARIA labels)
- [ ] Documented with JSDoc

### No AI/ML Rule

- ❌ Don't use ML for predictions
- ❌ Don't call AI APIs
- ❌ Don't use randomness
- ✅ Use backend-calculated values
- ✅ Display calculations clearly
- ✅ Explain every decision

---

## Learning Resources

### For New Developers

1. **Next.js Basics**
   - App Router: https://nextjs.org/docs/app
   - Components: https://nextjs.org/docs/app/building-your-application/rendering

2. **React Patterns**
   - Hooks: https://react.dev/reference/react
   - State Management: useState, useContext

3. **Tailwind CSS**
   - Utilities: https://tailwindcss.com/docs
   - Responsive Design: https://tailwindcss.com/docs/responsive-design

4. **TypeScript**
   - Interfaces: https://www.typescriptlang.org/docs/handbook/2/objects.html

### File Structure Tips

- Keep components small and reusable
- One component per file
- Group related components in folders
- Separate logic into hooks
- Use lib/ for utilities and API

---

## Deployment Checklist

- [ ] Environment variables set
- [ ] API URL configured
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Backend running
- [ ] CORS configured
- [ ] Analytics enabled (optional)
- [ ] SEO meta tags updated
- [ ] SSL certificate (HTTPS)

---

## Support

- **Docs:** [docs/FRONTEND.md](./FRONTEND.md)
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Design System:** See `components/` folder

---

**Status:** Production-ready  
**Framework:** Next.js 14  
**License:** MIT  
**Philosophy:** Clarity over complexity
