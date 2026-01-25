# 🌾 ETHANI - Quick Start & Development Guide

Welcome to ETHANI! A rule-based food price stabilization system on **Arbitrum**, built with **Stylus (Rust/WASM) + Solidity** hybrid architecture and transparent, deterministic pricing logic.

> **Core Stack:** Arbitrum Sepolia → Stylus (compute) + Solidity (governance) → Backend (Python) → Frontend (Next.js)

---

## ⚡ Arbitrum-Native Architecture

ETHANI is built as a **native Arbitrum protocol** using cutting-edge infrastructure:

- **Stylus (Rust/WASM)** — Primary pricing computation (~10x faster, $0.01 per call)
- **Solidity (EVM)** — Governance, state management, fallback
- **3-Tier Fallback** — Stylus → Solidity → Python (never fails)
- **Arbitrum Sepolia** — Testnet deployment (Chain ID: 421614)
- **FastAPI Backend** — Orchestrates contract calls, handles fallbacks
- **Next.js Frontend** — Web UI for price calculations

---

## ✅ Installation & Quick Start (5 minutes)

### 1. Start Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
./start.sh
```
✅ API available at: **http://localhost:8000/docs** (Swagger UI)

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
✅ App available at: **http://localhost:3000**

### 3. Test Backend
```bash
curl "http://localhost:8000/price?supply=100&demand=150&base_price=100"
```

---

## 📁 Project Structure

### Backend (`/backend`) — Rule-Based Pricing Engine
**FastAPI service with deterministic calculations**

Key files:
- `main.py` — 5 REST endpoints for pricing, contract routing
- `pricing.py` — Deterministic supply-demand formulas (fallback logic)
- `requirements.txt` — Python dependencies

**What it does:**
- Routes pricing requests to Stylus (primary) → Solidity (fallback) → Python (emergency)
- Calculates fair food prices using supply-demand ratio
- Returns detailed calculation breakdown with audit trail
- 100% transparent, no AI, no randomness

**Endpoints:**
```
GET  /health              - Service status & contract status
GET  /price               - Quick price calculation
GET  /ratio               - Supply-demand ratio analysis
POST /price-detailed      - Full calculation breakdown
GET  /rules               - View all pricing rules
```

---

### Smart Contracts (`/contracts`) — Arbitrum Hybrid

**Stylus + Solidity dual-layer contracts on Arbitrum Sepolia**

Key files:
- **Stylus (Rust)** — `src/EthaniPricing.sol` (WASM compiled)
  - Address: `0xf174bC196b4e0886aeA7e48D91661798B376F57C`
  - 10x faster, ~2,500 gas per call
  
- **Solidity (EVM)** — `src/EthaniPricing.sol`
  - Address: `0xc92fd01c122821Eb2C911d16468B20b07E25abC0`
  - Verified fallback, ~25,000 gas per call

- **Other EVM Contracts:**
  - `EthaniCore.sol` — Regional data & governance
  - `EthaniRegion.sol` — Region management
  - `EthaniIncentive.sol` — Incentive system
  - `PriceOracle.sol` — Oracle integration

**What they do:**
- On-chain price calculations (deterministic)
- Record supply/demand data for audit trail
- Farmer registration & regional data
- Price history for transparency
- No randomness, fully deterministic

**Compile & Test:**
```bash
cd contracts
forge build              # Solidity compilation
forge test              # Run test suite
forge script script/DeployEthani.s.sol --rpc-url https://sepolia-rollup.arbitrum.io/rpc --broadcast
```

---

### Frontend (`/frontend`) — Next.js UI

**React application for price visualization**

Key files:
- `app/page.tsx` — Main price calculator page
- `lib/api.ts` — Backend API client

**What it does:**
- Price calculator with transparent breakdown
- Regional dashboard
- Farmer/Trader interface
- Price history viewer
- Smart contract interaction via ethers.js

**Run:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ETHANI System (Arbitrum)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Next.js)  ←→  Backend (FastAPI)  ←→  Arbitrum  │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Web UI Components                                  │    │
│  │ • Price Calculator                                 │    │
│  │ • Regional Dashboard                               │    │
│  │ • Farmer Registry                                  │    │
│  │ • Transaction History                              │    │
│  └────────────────────────────────────────────────────┘    │
│                       ↓                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Backend API (FastAPI)                              │    │
│  │ • Route to Stylus (primary)                         │    │
│  │ • Fallback to Solidity (EVM)                        │    │
│  │ • Emergency Python calculation                      │    │
│  │ • Return price + reasoning + audit trail            │    │
│  └────────────────────────────────────────────────────┘    │
│                       ↓                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Smart Contracts (Arbitrum Sepolia)                 │    │
│  │                                                     │    │
│  │ Tier 1: Stylus (WASM) ⚡                            │    │
│  │ • 0xf174bC196b4e0886... (Primary - 10x faster)    │    │
│  │ • Deterministic pricing calculation                │    │
│  │ • ~$0.01 per call                                  │    │
│  │                                                     │    │
│  │ Tier 2: Solidity (EVM) ✅                           │    │
│  │ • 0xc92fd01c122821... (Fallback)                   │    │
│  │ • Verified calculation                             │    │
│  │ • ~$0.10 per call                                  │    │
│  │                                                     │    │
│  │ Tier 3: Python (Local) 💻                           │    │
│  │ • Same deterministic logic                         │    │
│  │ • Emergency backup (no gas)                        │    │
│  └────────────────────────────────────────────────────┘    │
│                       ↓                                      │
│         Arbitrum Sepolia Blockchain (421614)                │
│         RPC: https://sepolia-rollup.arbitrum.io/rpc        │
│         Explorer: https://sepolia.arbiscan.io              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📖 Pricing Rules (Transparent & Auditable)

**All calculations are 100% deterministic and rule-based (no AI/ML)**

### Supply-Demand Ratio Tiers

| Ratio | Price Change | Tier | Logic |
|-------|--------------|------|-------|
| > 130% | **+15%** | Critical Shortage | Demand far exceeds supply |
| > 110% | **+8%** | Shortage | Demand exceeds supply |
| 80-110% | **0%** | Balanced | Supply matches demand |
| < 80% | **-10%** | Surplus | Supply exceeds demand |

### Hard Limits (Safeguards)
- **Maximum increase**: +50%
- **Maximum decrease**: -30%

### Formula
```
Ratio = (Demand × 1000) / Supply  [basis points]
Final Price = Base Price × Multiplier (capped)
```

### Example Calculation
```
Input: supply=100, demand=150, base_price=1000

Calculation:
  Ratio = 150 ÷ 100 = 1.50 (150%)
  Ratio (1.50) > 1.30 → Critical Shortage
  Multiplier = +15%
  Final price = 1000 × 1.15 = 1,150

Output:
  suggested_price: 1,150
  tier: "Critical Shortage"
  multiplier: 1.15
  reason: "Critical shortage detected (ratio > 1.30)"
  ratio: 1.50
```

---

## 🧪 Testing Backend

### Test 1: Critical Shortage (Stylus will handle this)
```bash
curl "http://localhost:8000/price?supply=50&demand=80&base_price=100"
```
**Expected:** Price ~115 (critical shortage, +15%)
**Execution:** Stylus (primary) → Returns result in 1-2s (~$0.01)

### Test 2: Balanced Market
```bash
curl "http://localhost:8000/price?supply=100&demand=95&base_price=100"
```
**Expected:** Price 100 (balanced, 0%)
**Execution:** Stylus (primary)

### Test 3: Surplus
```bash
curl "http://localhost:8000/price?supply=200&demand=100&base_price=100"
```
**Expected:** Price 90 (surplus, -10%)
**Execution:** Stylus (primary)

### Test 4: View All Rules
```bash
curl "http://localhost:8000/rules"
```
**Expected:** Full pricing rules, thresholds, and tier definitions

### Test 5: Detailed Breakdown
```bash
curl "http://localhost:8000/price-detailed?supply=100&demand=150&base_price=1000"
```
**Expected:** Full calculation with ratio, tier, multiplier, reasoning

**Backend Priority:**
- ✅ Try **Stylus** (WASM) first — 10x faster
- ✅ If fails → Try **Solidity** (EVM) — Verified fallback
- ✅ If fails → Use **Python** — Emergency backup
- ✅ Always returns valid price (3-tier fallback guarantees reliability)

---

## 🌐 Deployment

### Local Development ✅ (Already Running)
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Can test against local Stylus/Solidity deployment

### Arbitrum Sepolia Testnet (Current)

**Smart Contracts Already Deployed:**

| Contract | Address | Type | Status |
|----------|---------|------|--------|
| EthaniPricing | `0xf174bC196b4e0886...` | Stylus (WASM) ⚡ | ✅ Operational |
| EthaniPricing | `0xc92fd01c122821Eb...` | Solidity (EVM) | ✅ Verified |
| EthaniCore | `0x05aF2330e286197e...` | Solidity (EVM) | ✅ Verified |
| EthaniRegion | `0x5836cdDE4D05B0aB...` | Solidity (EVM) | ✅ Verified |

**Network Details:**
- Chain ID: 421614
- RPC: `https://sepolia-rollup.arbitrum.io/rpc`
- Explorer: https://sepolia.arbiscan.io

**Contract Deployment (if redeploy needed):**
```bash
cd contracts
forge script script/DeployEthani.s.sol:DeployEthani \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc \
  --broadcast
```

### Frontend Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

### Backend Deployment (Railway/Render)

```bash
# Commit to GitHub first
git add .
git commit -m "Backend deployment ready"
git push origin main

# Connect to Railway or Render
# Set Python runtime and start command:
# python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 🏗️ Development Workflow

### 1. Make Changes

**Backend (Pricing Logic):**
```bash
cd backend
# Edit app/pricing.py (fallback logic)
# or app/main.py (API routes)
# API hot-reloads automatically
```

**Frontend (UI):**
```bash
cd frontend
# Edit app/page.tsx or create new components
# Saves automatically with hot reload
```

**Smart Contracts:**
```bash
cd contracts
# Edit src/EthaniPricing.sol or other contracts
forge build
forge test
```

### 2. Test Changes

**Backend:**
```bash
cd backend
# Test pricing logic
python3 -c "from app.pricing import calculate_price; print(calculate_price(100, 150, 100))"

# Test API
curl http://localhost:8000/price?supply=100&demand=150&base_price=100
```

**Smart Contracts:**
```bash
cd contracts
forge test -vvv                    # Verbose testing
forge test --match-contract EthaniPricing    # Test specific contract
```

**Frontend:**
```bash
cd frontend
npm run dev                        # Dev server with hot reload
npm run build                      # Test production build
```

### 3. Deploy Changes

**Local Testing:**
```bash
# Terminal 1: Backend
cd backend && ./start.sh

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Test backend API
curl http://localhost:8000/health
```

**Testnet Testing:**
```bash
cd contracts
forge test --fork-url https://sepolia-rollup.arbitrum.io/rpc
```

**Production Deployment:**
```bash
# Update version in package.json
# Commit all changes
git add -A
git commit -m "Release v1.x.x - [description]"
git push origin main

# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Railway/Render
# Usually automatic on push to main
```

---

## 🔗 API Integration Examples

### JavaScript (Frontend)

```typescript
// Fetch price from backend
// Backend will automatically route to Stylus (primary)
async function getPrice(supply: number, demand: number, basePrice: number) {
  const response = await fetch(
    `http://localhost:8000/price?supply=${supply}&demand=${demand}&base_price=${basePrice}`
  );
  const data = await response.json();
  
  return {
    price: data.suggested_price,
    tier: data.tier,
    reason: data.reason,
    multiplier: data.multiplier,
    ratio: data.ratio
  };
}

// Usage
const priceData = await getPrice(100, 150, 1000);
console.log(`Fair price: ${priceData.price} (${priceData.tier})`);
console.log(`Reason: ${priceData.reason}`);
```

### Python (Direct or Backend)

```python
from app.pricing import calculate_price

result = calculate_price(supply=100, demand=150, base_price=1000)

print(f"Price: {result['suggested_price']}")
print(f"Tier: {result['tier']}")
print(f"Reason: {result['reason']}")
print(f"Multiplier: {result['multiplier']}")
```

### Web3 Integration (Contract Interaction)

```typescript
import { ethers } from 'ethers';

// Connect to Arbitrum Sepolia
const provider = new ethers.providers.JsonRpcProvider(
  'https://sepolia-rollup.arbitrum.io/rpc'
);

// Contract ABI (simplified)
const ABI = [
  'function calculatePrice(uint256 supply, uint256 demand, uint256 basePrice) public view returns (uint256)'
];

// Stylus contract (primary)
const stylusContract = new ethers.Contract(
  '0xf174bC196b4e0886aeA7e48D91661798B376F57C',
  ABI,
  provider
);

// Call Stylus directly
const price = await stylusContract.calculatePrice(100, 150, 1000);
console.log(`Stylus calculation: ${price}`);
```

---

## 📚 Documentation Index

**Complete documentation available in `/docs/`:**

- **[architecture.md](./architecture.md)** — Full system design and components
- **[HYBRID_ARCHITECTURE.md](./HYBRID_ARCHITECTURE.md)** — Stylus + Solidity dual-layer design
- **[BACKEND_SERVICE.md](./BACKEND_SERVICE.md)** — Backend API guide
- **[FRONTEND.md](./FRONTEND.md)** — Frontend development guide
- **[SMART_CONTRACTS.md](./SMART_CONTRACTS.md)** — Smart contract reference
- **[pricing-model.md](./pricing-model.md)** — Pricing rules and formulas
- **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** — Deployment details
- **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** — Security audit and test results
- **[STYLUS_VERIFICATION_GUIDE.md](./STYLUS_VERIFICATION_GUIDE.md)** — Stylus verification

---

## 🧭 Core Principles

1. ✅ **Rule-Based (No AI/ML)** — Pure deterministic logic
2. ✅ **Transparent** — Every calculation auditable and explainable
3. ✅ **Deterministic** — Same inputs always produce same outputs
4. ✅ **Reliable** — 3-tier fallback ensures system never fails
5. ✅ **Efficient** — Stylus hybrid for 10x performance improvement
6. ✅ **Fair** — Protects both producers and consumers
7. ✅ **Decentralized** — On-chain audit trail and records

---

## 📝 Common Commands Reference

```bash
# ═══════════════════════════════════════════════════════════
# BACKEND
# ═══════════════════════════════════════════════════════════

cd backend
./start.sh                          # Run API on localhost:8000
pip install -r requirements.txt     # Install dependencies
python3 -m pytest                   # Run tests (if available)

# Test pricing endpoint
curl "http://localhost:8000/price?supply=100&demand=150&base_price=100"
curl "http://localhost:8000/rules"
curl "http://localhost:8000/health"

# ═══════════════════════════════════════════════════════════
# FRONTEND
# ═══════════════════════════════════════════════════════════

cd frontend
npm install                         # Install dependencies
npm run dev                         # Dev server (hot reload)
npm run build                       # Production build
npm run start                       # Run production build

# ═══════════════════════════════════════════════════════════
# SMART CONTRACTS (Foundry)
# ═══════════════════════════════════════════════════════════

cd contracts
forge build                         # Compile Solidity + Stylus
forge test                          # Run test suite
forge test -vvv                     # Verbose testing
forge clean                         # Remove build artifacts
forge script script/DeployEthani.s.sol:DeployEthani \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc \
  --broadcast                       # Deploy to Arbitrum Sepolia
```

---

## 🚀 Next Development Steps

1. **Backend Enhancement** — Add data persistence (database)
2. **Frontend Dashboard** — Create advanced UI with charts
3. **Oracle Integration** — Connect to real data sources
4. **Regional Customization** — Per-region pricing rules
5. **Historical Analysis** — Price trend tracking
6. **Mobile Support** — React Native app for farmers
7. **Mainnet Readiness** — Upgrade from Sepolia to Arbitrum One

---

## ❓ Troubleshooting

### Backend won't start?
```bash
# Check Python version
python3 --version                  # Should be 3.9+

# Check dependencies
pip3 list | grep fastapi

# Reinstall dependencies
cd backend && pip3 install -r requirements.txt

# Check port
lsof -i :8000                      # Check if port 8000 is in use
```

### Frontend build issues?
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev

# Check Node version
node --version                     # Should be 18+
```

### Smart contract compilation fails?
```bash
cd contracts
forge clean                        # Remove build artifacts
forge build                        # Rebuild

# Check Foundry installation
forge --version
```

### API calls failing?
```bash
# Check backend is running
curl http://localhost:8000/health

# Check network connectivity
ping sepolia-rollup.arbitrum.io

# Check contract status
curl "http://localhost:8000/health" | jq .
```

---

## 📞 Getting Help

1. Check relevant documentation in `/docs/` folder
2. Review code comments in source files
3. Test endpoints individually with curl
4. Check terminal logs for error messages
5. Review [AUDIT_REPORT.md](./AUDIT_REPORT.md) for system verification
6. Consult [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) for deployment details

---

## 🌍 Arbitrum Ecosystem

- **Arbitrum Sepolia (Testnet):** https://sepolia.arbiscan.io
- **Arbitrum Docs:** https://docs.arbitrum.io
- **Stylus Guide:** https://docs.arbitrum.io/stylus/stylus-by-example
- **Foundry Book:** https://book.getfoundry.sh

---

**Welcome to ETHANI on Arbitrum! 🌾⚡**

Building transparent, rule-based food price stabilization with hybrid Stylus + Solidity architecture.
