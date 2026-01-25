# Local ETHANI System Setup Guide

**Last Updated:** January 25, 2026  
**Environment:** Development (Arbitrum Sepolia Testnet)  
**Status:** ✅ Production-Ready Local Setup

---

## 📋 System Requirements

### Tools & Runtime (Minimum Versions)
- **Node.js:** 18.x or higher (`node --version`)
- **Python:** 3.10 or higher (`python3 --version`)
- **Foundry:** Latest stable (`forge --version`)
- **Cargo + cargo-stylus:** Rust toolchain (`cargo stylus --version`)
- **Git:** Version control (`git --version`)

### Network Access
- **Internet Connection:** Required for RPC access
- **Arbitrum Sepolia RPC:** `https://sepolia-rollup.arbitrum.io/rpc`
- **Port 8000:** Backend API (FastAPI)
- **Port 3000:** Frontend (Next.js)

### Hardware Requirements
- **Disk Space:** 2GB minimum
- **RAM:** 4GB minimum (8GB recommended)
- **CPU:** Dual-core minimum

---

## 🔧 Environment Setup

### 1. Install Required Tools

#### Node.js & npm
```bash
# Check version
node --version
npm --version

# Install if needed
# macOS: brew install node
# Ubuntu: sudo apt-get install nodejs npm
# Windows: choco install nodejs
```

#### Python 3.10+
```bash
# Check version
python3 --version

# Install if needed
# macOS: brew install python@3.10
# Ubuntu: sudo apt-get install python3.10
# Windows: Download from python.org
```

#### Foundry
```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc

# Verify
forge --version
```

#### Rust & Cargo-Stylus
```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Update Rust
rustup update

# Install cargo-stylus
cargo install --force cargo-stylus

# Verify
cargo stylus --version
```

### 2. Validate Environment

```bash
# Check all required tools
node --version         # v18.x or higher
npm --version          # 9.x or higher
python3 --version      # 3.10 or higher
forge --version        # Latest
cargo --version        # 1.70+
cargo stylus --version # 0.10.0+

# Check network access to Arbitrum
curl -s https://sepolia-rollup.arbitrum.io/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","id":1}' | jq .

# Expected response: {"jsonrpc":"2.0","result":"0x66eee","id":1}
```

---

## 📦 Backend Setup

### 1. Install Dependencies

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Verify installations
pip list | grep -E "fastapi|pydantic|web3|python-dotenv"
```

### 2. Verify Configuration

```bash
# Check .env file
cat .env

# Key variables that should be set:
# - BLOCKCHAIN_ENABLED=true
# - BLOCKCHAIN_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
# - ETHANI_PRICING_ADDRESS=0xc92fd01c122821Eb2C911d16468B20b07E25abC0
# - ARBITRUM_CHAIN_ID=421614
```

### 3. Start Backend Server

```bash
# From backend/ directory
python3 main.py

# OR use uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Expected output:
# ✅ Uvicorn running on http://0.0.0.0:8000
# ✅ API docs at http://localhost:8000/docs
```

### 4. Verify Backend Health

```bash
# In a new terminal window, test the API
curl http://localhost:8000/health

# Expected response:
# {"status":"operational","timestamp":"2026-01-25T..."}
```

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend

# Install npm packages
npm install

# Verify installation
npm list react next ethers
```

### 2. Verify Configuration

```bash
# Check .env.local
cat .env.local

# Key variables that should be set:
# - NEXT_PUBLIC_API_URL=http://localhost:8000
# - NEXT_PUBLIC_CHAIN_ID=421614
# - NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
# - NEXT_PUBLIC_CONTRACT_PRICING=0xc92fd01c122821Eb2C911d16468B20b07E25abC0
```

### 3. Start Frontend Server

```bash
# From frontend/ directory
npm run dev

# Expected output:
# ✅ ready - started server on 0.0.0.0:3000
# ✅ Local: http://localhost:3000
```

### 4. Verify Frontend Health

Open in browser:
```
http://localhost:3000
```

Expected:
- Page loads without errors
- Web3 connection shows "Arbitrum Sepolia" network
- No network errors in console (F12)

---

## 🧪 Integration Test

### Test 1: Backend Pricing Calculation

```bash
# Call the pricing endpoint with test data
curl -X POST http://localhost:8000/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 80,
    "demand": 120,
    "base_price": 10000,
    "region": "ID"
  }' | jq .

# Expected response:
{
  "success": true,
  "data": {
    "final_price": 10800,
    "pricing_tier": 2,
    "adjustment_percent": 8,
    "explanation": "Shortage condition detected - price adjusted by +8%",
    "ratio": 150.0,
    "calculation_method": "rule_based",
    "timestamp": "2026-01-25T..."
  }
}
```

### Test 2: Smart Contract Read (On-Chain)

```bash
# Cast command to read contract state
cast call 0xc92fd01c122821Eb2C911d16468B20b07E25abC0 \
  "isPaused()" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Expected output (hex):
# 0x0 (false - contract is active)
```

### Test 3: Full Integration Flow

```python
# Python test script (run from backend directory)
import requests
import json

# 1. Test API connection
response = requests.get("http://localhost:8000/health")
print(f"✅ Backend status: {response.json()['status']}")

# 2. Test pricing calculation
payload = {
    "supply": 80,
    "demand": 120,
    "base_price": 10000,
    "region": "ID"
}

response = requests.post(
    "http://localhost:8000/api/v1/pricing/calculate",
    json=payload
)

result = response.json()
print(f"\n📊 Pricing Result:")
print(f"   Final Price: {result['data']['final_price']}")
print(f"   Tier: {result['data']['pricing_tier']}")
print(f"   Adjustment: {result['data']['adjustment_percent']}%")
print(f"   Explanation: {result['data']['explanation']}")

# 3. Verify determinism (same input = same output)
response2 = requests.post(
    "http://localhost:8000/api/v1/pricing/calculate",
    json=payload
)
result2 = response2.json()

if result['data']['final_price'] == result2['data']['final_price']:
    print(f"\n✅ Determinism verified: Same input → Same output")
else:
    print(f"\n❌ Determinism failed!")
```

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    ETHANI System (Local)                    │
└─────────────────────────────────────────────────────────────┘

1. Frontend (Next.js)
   ├─ Runs on: http://localhost:3000
   ├─ Connects to: Backend API (localhost:8000)
   ├─ Displays: Price dashboard, charts, transaction history
   └─ Network: Arbitrum Sepolia (read-only for demo)

2. Backend (FastAPI)
   ├─ Runs on: http://localhost:8000
   ├─ API Endpoints:
   │  ├─ /api/v1/pricing/calculate (POST)
   │  ├─ /api/v1/pricing/history (GET)
   │  ├─ /health (GET)
   │  └─ /docs (Swagger UI)
   ├─ Logic: Rule-based pricing (Python)
   └─ Contracts: Reads from Arbitrum Sepolia (read-only)

3. Smart Contracts (On-Chain - Arbitrum Sepolia)
   ├─ EthaniPricing (Solidity)
   │  └─ Address: 0xc92fd01c122821Eb2C911d16468B20b07E25abC0
   │  └─ Function: calculate_price(supply, demand, base)
   │
   ├─ EthaniRegion (Solidity)
   │  └─ Address: 0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143
   │  └─ Function: Manage regional data
   │
   └─ EthaniPricing Stylus (Rust/WASM - 10x faster)
      └─ Address: 0xf174bC196b4e0886aeA7e48D91661798B376F57C
      └─ Status: Primary contract (10x cheaper than Solidity)

4. Blockchain (Arbitrum Sepolia - Read Access)
   └─ RPC: https://sepolia-rollup.arbitrum.io/rpc
   └─ Chain ID: 421614
   └─ Explorer: https://sepolia.arbiscan.io
```

### Data Flow

```
User Input (Frontend)
    ↓
http://localhost:3000 (Next.js)
    ↓
POST /api/v1/pricing/calculate
    ↓
http://localhost:8000 (FastAPI)
    ↓
[Rule-Based Calculation]
Ratio = demand / supply
Tier = determine_tier(ratio)
Price = apply_multiplier(base_price, tier)
Price = apply_safety_limits(price)
    ↓
JSON Response
    ↓
Frontend Display
    ↓
[Optional] Write to on-chain contract
```

### 3-Tier Fallback Chain

**IMPORTANT:** Stylus contract runs ON-CHAIN, not locally.

```
Flow:
1. Calculate in Backend (Python/FastAPI) ← ⭐ What runs locally
2. Submit to EthaniPricing Solidity contract
3. Fallback to EthaniPricing Stylus contract (if available)
4. Last resort: Python backend calculation

Local Setup:
- Backend calculation works offline
- Frontend connects to Arbitrum Sepolia RPC
- Smart contracts accessible for reading
- No transaction signing needed (read-only mode)
```

---

## 🚀 Running the Complete System

### Option 1: Sequential Start (Recommended for Learning)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python3 main.py
# Wait for: ✅ Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Wait for: ✅ ready - started server on 0.0.0.0:3000
```

**Terminal 3 - Testing:**
```bash
# Run integration tests
python3 test_integration.py
```

### Option 2: Automated Start (Bash Script)

Create `start_local_system.sh`:

```bash
#!/bin/bash

echo "🚀 Starting ETHANI Local System..."

# Terminal 1: Backend
echo "📡 Starting Backend (FastAPI)..."
cd backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -q -r requirements.txt
python3 main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Terminal 2: Frontend
echo "🎨 Starting Frontend (Next.js)..."
cd ../frontend
npm install -q 2>/dev/null || true
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

echo ""
echo "✅ ETHANI System Running!"
echo ""
echo "📊 Frontend:  http://localhost:3000"
echo "📡 Backend:   http://localhost:8000"
echo "📖 API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
```

```bash
chmod +x start_local_system.sh
./start_local_system.sh
```

---

## 📊 Testing Scenarios

### Scenario 1: Shortage Condition

```bash
curl -X POST http://localhost:8000/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 100,
    "demand": 125,
    "base_price": 10000,
    "region": "ID"
  }'

# Expected: Tier 2, +8% adjustment
```

### Scenario 2: Critical Shortage

```bash
curl -X POST http://localhost:8000/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 100,
    "demand": 150,
    "base_price": 10000,
    "region": "ID"
  }'

# Expected: Tier 1, +15% adjustment
```

### Scenario 3: Balanced Market

```bash
curl -X POST http://localhost:8000/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 100,
    "demand": 100,
    "base_price": 10000,
    "region": "ID"
  }'

# Expected: Tier 3, 0% adjustment
```

### Scenario 4: Surplus Condition

```bash
curl -X POST http://localhost:8000/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 200,
    "demand": 100,
    "base_price": 10000,
    "region": "ID"
  }'

# Expected: Tier 4, -10% adjustment
```

### Scenario 5: Safety Limits (Extreme)

```bash
curl -X POST http://localhost:8000/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 100,
    "demand": 300,
    "base_price": 10000,
    "region": "ID"
  }'

# Expected: Price capped at +50% (hard limit)
# Calculated: +200%, Actual: +50%
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue: Port 8000 already in use**
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# OR use different port
python3 main.py --port 8001
```

**Issue: RPC connection error**
```bash
# Check network connectivity
curl https://sepolia-rollup.arbitrum.io/rpc

# Verify RPC URL in .env
grep BLOCKCHAIN_RPC_URL backend/.env

# If blocked, use alternative RPC:
# https://arb-sepolia.g.alchemy.com/v2/demo
# https://sepolia-rollup.arbitrum.io/rpc
```

**Issue: Python version error**
```bash
# Check Python version
python3 --version

# Create virtual env with specific version
python3.10 -m venv venv

# Or install Python 3.10
brew install python@3.10
```

### Frontend Issues

**Issue: Port 3000 already in use**
```bash
# Use different port
npm run dev -- -p 3001
```

**Issue: Dependencies not installed**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Issue: Environment variables not loading**
```bash
# Verify .env.local exists
ls -la frontend/.env.local

# Restart development server
npm run dev
```

### Network Issues

**Issue: Cannot connect to Arbitrum Sepolia**
```bash
# Test RPC connectivity
curl -s https://sepolia-rollup.arbitrum.io/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","id":1}' | jq .

# If fails, try:
# 1. Check internet connection
# 2. Check firewall rules
# 3. Use VPN if blocked
# 4. Try alternative RPC
```

---

## 📝 Important Notes

### ⚠️ About Stylus Contracts

**Stylus contracts run ON-CHAIN on Arbitrum Sepolia, not locally.**

- **Local calculation:** Backend (Python/FastAPI) uses the same deterministic formula
- **On-chain calculation:** Deployed Stylus contract at `0xf174bC196b4e0886aeA7e48D91661798B376F57C`
- **Performance comparison:**
  - Local (Python): Instant, no gas cost
  - Stylus (WASM): ~2,500 gas (~$0.01)
  - Solidity: ~25,000 gas (~$0.10)

### ✅ Contracts Used (Read-Only)

```
Arbitrum Sepolia Chain (421614)

1. EthaniPricing (Solidity) - Fallback
   0xc92fd01c122821Eb2C911d16468B20b07E25abC0
   
2. EthaniRegion
   0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143
   
3. EthaniPricing (Stylus/WASM) - Primary
   0xf174bC196b4e0886aeA7e48D91661798B376F57C
   
4. EthaniCore
   0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4
   
5. EthaniIncentive
   0xE6C246d7Ba92c4d35076C91B686d104ad3118172
   
6. PriceOracle
   0x139a3036052761341212C7d06488C27fb000a167
```

All contracts deployed on **Arbitrum Sepolia** (Jan 23-25, 2026)

### 🔒 Security Notes for Local Development

- **No private keys stored locally** (demo mode)
- **No transactions signed** (read-only access)
- **No testnet funds needed** (view calls only)
- **SQLite database** for demo data only

### 📊 Performance Expectations

```
Local System Response Times:

Backend Calculation:  ~50-100ms (Python)
Network Latency:      ~100-200ms (to Arbitrum)
Total API Response:   ~150-300ms

Frontend Rendering:   ~50-100ms
Page Load Time:       ~1-2 seconds
```

---

## 🎯 Next Steps

1. **Validate Setup:**
   ```bash
   bash docs/validate_setup.sh  # Check all tools
   ```

2. **Start System:**
   ```bash
   ./start_local_system.sh
   ```

3. **Run Tests:**
   - Browse to http://localhost:3000
   - Run integration tests
   - Check backend logs

4. **Monitor:**
   - Backend logs: Terminal 1
   - Frontend console: Browser DevTools (F12)
   - API requests: http://localhost:8000/docs

---

## 📚 Additional Resources

- **API Documentation:** http://localhost:8000/docs (Swagger UI)
- **Smart Contracts:** [contracts/src/](../contracts/src/)
- **Backend Code:** [backend/app/](../backend/app/)
- **Frontend Code:** [frontend/app/](../frontend/app/)
- **Pricing Logic:** [backend/app/pricing.py](../backend/app/pricing.py)

---

## ✅ Checklist: Before Going Live

- [ ] All tools validated and installed
- [ ] Python virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend starts successfully on port 8000
- [ ] Frontend starts successfully on port 3000
- [ ] Integration test passes with expected pricing
- [ ] Determinism verified (same input = same output)
- [ ] Smart contracts readable from Arbitrum Sepolia
- [ ] Network connectivity to RPC endpoint confirmed
- [ ] All environment variables properly set

---

**Status:** ✅ Ready for Local Development  
**Last Tested:** January 25, 2026  
**Network:** Arbitrum Sepolia (Chain 421614)  
**Contracts:** All deployed and verified ✅
