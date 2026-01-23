# 🌾 ETHANI - Complete Setup Guide

Welcome to ETHANI! A decentralized food price stabilization system built on transparent, rule-based logic.

## ✅ Installation Complete

All required development tools have been installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | v20.10.0 | Frontend & Solidity tooling |
| **npm** | 10.2.3 | Package management |
| **Python 3** | 3.9.6 | Backend API |
| **FastAPI** | 0.104.1 | REST API framework |
| **Hardhat** | 2.28.2 | Solidity development |
| **Next.js** | 14 | React framework |

---

## 🎯 Quick Start (5 minutes)

### 1. Start Backend (Terminal 1)
```bash
cd backend
./start.sh
```
✅ API available at: **http://localhost:8000/docs**

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ App available at: **http://localhost:3000**

### 3. Test Backend
```bash
curl "http://localhost:8000/price?supply=100&demand=150&base_price=100"
```

---

## 📁 Project Overview

### Backend (`/backend`)
**FastAPI-based rule pricing engine**

Key files:
- `main.py` - 5 REST endpoints for pricing
- `pricing.py` - Deterministic supply-demand formulas
- `requirements.txt` - Python dependencies

**What it does:**
- Calculates fair food prices using supply-demand ratio
- Returns detailed calculation breakdown
- No AI, no external APIs, 100% transparent

**Endpoints:**
```
GET  /health              - Service status
GET  /price               - Quick price calculation
GET  /ratio               - Supply-demand ratio analysis
POST /price-detailed      - Full calculation breakdown
GET  /rules               - View all pricing rules
```

---

### Smart Contracts (`/contracts`)
**Solidity contracts for Mantle testnet**

Key files:
- `EthaniPricing.sol` - Rule-based pricing engine
- `EthaniCore.sol` - Regional data & farmer registry

**What they do:**
- On-chain price calculations
- Record supply/demand data
- Farmer registration & tracking
- Price history for transparency

**Features:**
- Solidity ^0.8.20
- No randomness, fully deterministic
- Auditable price tiers
- Hard limits (floor/ceiling)

**Compile:**
```bash
cd contracts
npx hardhat compile
```

---

### Frontend (`/frontend`)
**Next.js React application**

Key files:
- `app/page.tsx` - Main page component

**What to build:**
- Price calculator UI
- Regional dashboard
- Farmer/Trader interface
- Price history viewer
- Smart contract interaction

**Run:**
```bash
cd frontend
npm run dev
```

---

## 🎓 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ETHANI System                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Next.js) ←→ Backend (FastAPI) ←→ Blockchain  │
│  ┌───────────────────────────────────────────────┐      │
│  │ UI Components                                 │      │
│  │ • Price Calculator                            │      │
│  │ • Regional Dashboard                          │      │
│  │ • Farmer Registry                             │      │
│  └───────────────────────────────────────────────┘      │
│                 ↓                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │ REST API (FastAPI)                            │      │
│  │ • /price - Calculate fair price               │      │
│  │ • /ratio - Supply-demand analysis             │      │
│  │ • /rules - Pricing rules                      │      │
│  └───────────────────────────────────────────────┘      │
│                 ↓                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │ Smart Contracts (Solidity)                    │      │
│  │ • EthaniPricing - Calculate prices            │      │
│  │ • EthaniCore - Manage regions & farmers       │      │
│  │ • Price History - On-chain records            │      │
│  └───────────────────────────────────────────────┘      │
│                 ↓                                         │
│         Mantle Testnet Blockchain                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Pricing Rules (Transparent & Auditable)

**Supply-Demand Ratio Tiers:**

| Ratio | Price Change | Tier | Purpose |
|-------|--------------|------|---------|
| > 130% | +15% | Critical Shortage | Encourage production |
| > 110% | +8% | Shortage | Incentivize supply ↑ |
| 80-110% | 0% | Balanced | Market equilibrium |
| < 80% | -10% | Surplus | Protect consumers |

**Hard Limits (Safeguards):**
- Maximum increase: +50%
- Maximum decrease: -30%

**Formula:**
```
Final Price = Base Price × Multiplier × Season Factor
Ratio = Demand / Supply
```

---

## 🧪 Testing Backend

### Test 1: Critical Shortage
```bash
curl "http://localhost:8000/price?supply=50&demand=80&base_price=100"
```
**Expected:** Price ~115 (shortage, +15%)

### Test 2: Balanced Market
```bash
curl "http://localhost:8000/price?supply=100&demand=95&base_price=100"
```
**Expected:** Price 100 (balanced, 0%)

### Test 3: Surplus
```bash
curl "http://localhost:8000/price?supply=200&demand=100&base_price=100"
```
**Expected:** Price 90 (surplus, -10%)

### Test 4: View All Rules
```bash
curl "http://localhost:8000/rules"
```
**Expected:** Full pricing rules and thresholds

---

## 🛠️ Development Workflow

### 1. Make Changes

**Backend:**
```bash
cd backend
# Edit main.py or pricing.py
# API hot-reloads automatically
```

**Frontend:**
```bash
cd frontend
# Edit app/page.tsx or create new components
# Saves automatically
```

**Smart Contracts:**
```bash
cd contracts
# Edit .sol files
npx hardhat compile
npx hardhat test
```

### 2. Test Changes

**Backend tests:**
```bash
python3 -c "from pricing import calculate_price; print(calculate_price(100, 150, 100))"
```

**Smart contract tests:**
```bash
cd contracts
npx hardhat test
```

### 3. Deploy

**Backend:**
```bash
cd backend
./start.sh
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

**Smart Contracts:**
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network mantle-testnet
```

---

## 🔗 API Integration Example

### JavaScript (Frontend)

```typescript
// Fetch price from backend
async function getPrice(supply: number, demand: number, basePrice: number) {
  const response = await fetch(
    `http://localhost:8000/price?supply=${supply}&demand=${demand}&base_price=${basePrice}`
  );
  const data = await response.json();
  return data.suggested_price;
}

// Usage
const price = await getPrice(100, 150, 100);
console.log(`Fair price: ${price}`);
```

### Python (Direct)

```python
from pricing import calculate_price

result = calculate_price(supply=100, demand=150, base_price=100)
print(f"Fair price: {result['suggested_price']}")
print(f"Reason: {result['reason']}")
```

---

## 🌐 Deployment

### Local Development
✅ Already running on localhost

### Testnet Deployment

**Mantle Testnet:**
1. Install MetaMask
2. Add Mantle testnet to MetaMask
3. Get testnet ETH from faucet
4. Deploy contracts: `npx hardhat run scripts/deploy.js --network mantle-testnet`

**Vercel (Frontend):**
```bash
npm i -g vercel
vercel
```

**Railway/Render (Backend):**
```bash
# Push to GitHub
# Connect to Railway/Render
# Set Python runtime and run `python main.py`
```

---

## 📚 Documentation

- **Backend:** [backend/README.md](backend/README.md)
- **Smart Contracts:** Solidity comments in [contracts/EthaniCore.sol](contracts/EthaniCore.sol) and [contracts/EthaniPricing.sol](contracts/EthaniPricing.sol)
- **Tools & Setup:** [TOOLS.md](TOOLS.md)

---

## 🎯 Core Principles

1. ✅ **No AI/ML** - Pure rule-based logic
2. ✅ **Transparent** - Every calculation auditable
3. ✅ **Simple** - Understandable by non-experts
4. ✅ **Fair** - Protects both farmers and consumers
5. ✅ **Deterministic** - Same inputs = same outputs
6. ✅ **Decentralized** - On-chain records

---

## 📝 Common Commands

```bash
# Backend
cd backend && ./start.sh                    # Run API
cd backend && python3 -m pytest             # Run tests (if added)

# Frontend
cd frontend && npm run dev                  # Dev server
cd frontend && npm run build                # Production build
cd frontend && npm run start                # Run production

# Smart Contracts
cd contracts && npx hardhat compile         # Compile
cd contracts && npx hardhat test            # Run tests
cd contracts && npx hardhat clean           # Clean build artifacts
```

---

## ❓ Troubleshooting

**Backend won't start?**
```bash
# Check Python
python3 --version

# Check dependencies
pip3 list | grep fastapi

# Reinstall
pip3 install -r requirements.txt
```

**Frontend build issues?**
```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
npm install
npm run dev
```

**Hardhat errors?**
```bash
# Clear artifacts
cd contracts && npx hardhat clean

# Reinstall dependencies
npm ci

# Recompile
npx hardhat compile
```

---

## 🚀 Next Steps

1. **Build Frontend Dashboard** - Create UI for price calculator
2. **Add Web3 Integration** - Connect MetaMask and interact with contracts
3. **Deploy Contracts** - Test on Mantle testnet
4. **Create Farmer Interface** - Allow supply/demand updates
5. **Add Historical Data** - Chart price movements over time

---

## 📞 Support

For issues or questions:
1. Check documentation in relevant folders
2. Review code comments
3. Test endpoints individually
4. Check terminal logs for error messages

---

**Welcome to ETHANI! 🌾**

Let's stabilize food prices and support rural communities together.
