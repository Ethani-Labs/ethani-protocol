# ETHANI Frontend - Backend & Smart Contract Integration Guide

**Document Version**: 1.0.0  
**Date**: 1 Januari 2026  
**Status**: Complete Integration Ready

---

## 📋 Overview

This document describes how the ETHANI Frontend integrates with:
1. **Backend API** (FastAPI Python server)
2. **Smart Contracts** (Solidity on Mantle Testnet)
3. **Blockchain Network** (Mantle Testnet for transparency)

---

## 🔗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ETHANI Frontend (Next.js)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              User Interface (React Components)         │ │
│  │  Landing → Login → Register → Dashboards → Market    │ │
│  └────────────────────────────────────────────────────────┘ │
└──┬──────────────────┬──────────────────────┬────────────────┘
   │                  │                      │
   │                  │                      │
   ▼                  ▼                      ▼
┌─────────────┐  ┌──────────────┐   ┌──────────────────┐
│  Backend    │  │  EthaniPricing   │  EthaniRegion  │
│  API        │  │  Contract        │  Contract      │
│  FastAPI    │  │  (Mantle)        │  (Mantle)      │
│             │  │                  │                │
│ /auth       │  │ calculatePrice   │ getRegion      │
│ /products   │  │ getSupplyDemand  │ updateRegion   │
│ /pricing    │  │ getPriceWithLimit│ getAllRegions  │
│ /supplies   │  │                  │                │
│ /orders     │  └──────────────────┘────────────────┘
└─────────────┘           │
                          │ EthaniIncentive
                          │ Contract (Mantle)
                          │
                          │ grantPoints
                          │ getPoints
                          │ redeemPoints
                          ▼
                  ┌──────────────────┐
                  │  Mantle Testnet  │
                  │  Blockchain      │
                  │                  │
                  │ - Transparent    │
                  │ - Deterministic  │
                  │ - Auditable      │
                  └──────────────────┘
```

---

## 🔑 Configuration

### Environment File (.env.local)

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Smart Contract Addresses (deployed to Mantle Testnet)
NEXT_PUBLIC_CONTRACT_PRICING=0x...
NEXT_PUBLIC_CONTRACT_REGION=0x...
NEXT_PUBLIC_CONTRACT_INCENTIVE=0x...

# Blockchain Configuration
NEXT_PUBLIC_NETWORK=mantle-testnet
NEXT_PUBLIC_CHAIN_ID=5001
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.mantle.xyz
NEXT_PUBLIC_EXPLORER_URL=https://explorer.testnet.mantle.xyz

# Feature Flags
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Getting Contract Addresses

1. **Deploy Smart Contracts**:
   ```bash
   cd contracts
   export PRIVATE_KEY=0x...
   forge script script/DeployEthani.s.sol \
     --network mantle-testnet \
     --broadcast -vvv
   ```

2. **Copy Deployed Addresses**:
   ```
   [OK] EthaniPricing deployed at: 0x...
   [OK] EthaniRegion deployed at: 0x...
   [OK] EthaniIncentive deployed at: 0x...
   ```

3. **Add to .env.local**:
   ```env
   NEXT_PUBLIC_CONTRACT_PRICING=0x...
   NEXT_PUBLIC_CONTRACT_REGION=0x...
   NEXT_PUBLIC_CONTRACT_INCENTIVE=0x...
   ```

---

## 🛠️ Backend API Integration

### Endpoints Used

#### Authentication (`/auth`)
```typescript
// Login
POST /auth/login
Request: { phone: string, password: string }
Response: { token: string, user: User }

// Register
POST /auth/register
Request: {
  phone: string,
  name: string,
  nik: string,
  location: string,
  role: 'farmer' | 'distributor' | 'buyer',
  password: string
}
Response: { token: string, user: User }

// Refresh Token
GET /auth/refresh
Headers: { Authorization: `Bearer ${token}` }
Response: { token: string }
```

#### User Management (`/users`)
```typescript
// Get Profile
GET /users/profile
Headers: { Authorization: `Bearer ${token}` }
Response: User

// Update Profile
POST /users/profile/update
Request: { name?, phone?, email?, location? }
Response: User

// Delete Account
DELETE /users/profile/delete
Headers: { Authorization: `Bearer ${token}` }
Response: { message: string }
```

#### Products (`/products`)
```typescript
// List All Products
GET /products
Response: Product[]

// Get Product Detail
GET /products/:id
Response: Product

// Get Products by Category
GET /products/category/:category
Response: Product[]
```

#### Pricing (`/pricing`)
```typescript
// Get Latest Pricing
GET /pricing/latest
Response: {
  supply: number,
  demand: number,
  ratio: number,
  tier: string,
  basePrice: number,
  suggestedPrice: number,
  multiplier: number
}

// Calculate Price
POST /pricing/calculate
Request: { supply: number, demand: number, basePrice: number }
Response: {
  suggestedPrice: number,
  ratio: number,
  multiplier: number,
  reason: string,
  tier: string
}

// Price History
GET /pricing/history
Response: Array<{
  timestamp: string,
  ratio: number,
  tier: string,
  price: number
}>
```

#### Supplies (Farmer) (`/supplies`)
```typescript
// Add Supply
POST /supplies/add
Request: {
  product: string,
  quantity: number,
  unit: string,
  pricePerUnit: number
}
Response: Supply

// List Supplies
GET /supplies/list
Response: Supply[]

// Delete Supply
DELETE /supplies/:id
Response: { message: string }
```

#### Deliveries (Distributor) (`/deliveries`)
```typescript
// List Deliveries
GET /deliveries
Response: Delivery[]

// Get Delivery Detail
GET /deliveries/:id
Response: Delivery

// Create Delivery
POST /deliveries/create
Request: {
  product: string,
  quantity: number,
  fromLocation: string,
  toLocation: string
}
Response: Delivery

// Update Delivery Status
PATCH /deliveries/:id/status
Request: { status: 'pending' | 'in-transit' | 'delivered' }
Response: Delivery
```

#### Orders (Buyer) (`/orders`)
```typescript
// Create Order
POST /orders/create
Request: {
  items: Array<{ productId: number, quantity: number }>,
  deliveryAddress: string
}
Response: Order

// List Orders
GET /orders
Response: Order[]

// Get Order Detail
GET /orders/:id
Response: Order

// Cancel Order
PATCH /orders/:id/cancel
Response: { message: string }
```

### Frontend API Client

The frontend uses `lib/api.ts` to communicate with the backend:

```typescript
import {
  // Auth
  loginUser,
  registerUser,
  
  // Products
  getProducts,
  getProductsByCategory,
  
  // Pricing
  getLatestPricing,
  calculatePrice,
  
  // Supplies (Farmer)
  addSupply,
  getFarmerSupplies,
  
  // Deliveries (Distributor)
  getAvailableDeliveries,
  updateDeliveryStatus,
  
  // Orders (Buyer)
  createOrder,
  getBuyerOrders,
} from '@/lib/api';
```

---

## ⛓️ Smart Contract Integration

### Overview

Three smart contracts handle transparent pricing and farmer incentives:

1. **EthaniPricing** - Price calculation based on supply-demand rules
2. **EthaniRegion** - Regional data storage and management
3. **EthaniIncentive** - Farmer rewards and points system

### 1. EthaniPricing Contract

**Purpose**: Transparent, auditable price calculation

**Network**: Mantle Testnet  
**Chain ID**: 5001  
**Address**: `NEXT_PUBLIC_CONTRACT_PRICING`

**Key Functions**:

```solidity
// Calculate price from supply-demand ratio
function calculatePrice(
    uint256 supply,
    uint256 demand,
    uint256 basePrice
) public pure returns (uint256)
```

**Frontend Usage**:

```typescript
import { contractPricing } from '@/lib/api';

// Calculate price
const result = await contractPricing.calculatePrice(100, 150, 8500);
// Returns:
// {
//   price: 9180,
//   multiplier: 1.08,
//   reason: "Shortage - Demand exceeds supply",
//   tier: "KURANG",
//   ratio: 1.5
// }
```

**Pricing Rules** (Deterministic):

```
Supply-Demand Ratio Calculation:
  ratio = demand / supply

Tier Determination:
  If ratio ≥ 1.30:     KRITIS (Critical Shortage)  → +15% 🔴
  If ratio ≥ 1.10:     KURANG (Shortage)           → +8%  🟠
  If ratio 0.80-1.10:  SEIMBANG (Balanced)         → 0%  🟢
  If ratio ≤ 0.80:     BANYAK (Surplus)            → -10% 🔵

Hard Limits:
  maxPrice = basePrice * 1.50  (max +50%)
  minPrice = basePrice * 0.70  (min -30%)

Final Price = CLAMP(basePrice * multiplier, minPrice, maxPrice)
```

**Why Smart Contract?**
- ✅ Transparent - Auditable on blockchain
- ✅ Deterministic - Always same result for same input
- ✅ No AI - Clear mathematical rules
- ✅ No manipulation - Immutable code

### 2. EthaniRegion Contract

**Purpose**: Store and manage regional supply-demand data

**Network**: Mantle Testnet  
**Address**: `NEXT_PUBLIC_CONTRACT_REGION`

**Key Functions**:

```solidity
// Add new region
function addRegion(
    string memory name,
    uint256 foodSupply,
    uint256 foodDemand,
    uint256 basePrice
) public onlyOwner

// Get region data
function getRegion(uint256 regionId)
    public view returns (Region memory)

// Update region data
function updateRegion(
    uint256 regionId,
    uint256 foodSupply,
    uint256 foodDemand,
    uint256 basePrice
) public onlyOwner

// Get all regions
function getAllRegions()
    public view returns (Region[] memory)
```

**Frontend Usage**:

```typescript
import { contractRegion } from '@/lib/api';

// Get single region
const region = await contractRegion.getRegion(1);
// Returns:
// {
//   id: 1,
//   name: "Jawa Barat",
//   foodSupply: 1000,
//   foodDemand: 1200,
//   basePrice: 8500,
//   lastUpdateTime: 1234567890
// }

// Get all regions
const regions = await contractRegion.getAllRegions();
// Returns: Region[]

// Update region (admin only)
await contractRegion.updateRegion(1, 1100, 1300, 8500);
```

**Data Structure**:

```typescript
struct Region {
  uint256 id;
  string name;
  uint256 foodSupply;        // units
  uint256 foodDemand;        // units
  uint256 basePrice;         // in smallest unit (wei)
  uint256 lastUpdateTime;    // timestamp
  uint256 currentPrice;      // latest calculated price
}
```

### 3. EthaniIncentive Contract

**Purpose**: Manage farmer rewards and performance bonuses

**Network**: Mantle Testnet  
**Address**: `NEXT_PUBLIC_CONTRACT_INCENTIVE`

**Key Functions**:

```solidity
// Register farmer
function registerUser(address farmer) public onlyOwner

// Grant incentive points
function grantPoints(
    address farmer,
    uint256 points,
    string memory reason
) public onlyOwner

// Get farmer's points
function getPoints(address farmer)
    public view returns (uint256)

// Redeem points for rewards
function redeemPoints(uint256 amount)
    public returns (uint256 rewardAmount)
```

**Frontend Usage**:

```typescript
import { contractIncentive } from '@/lib/api';

// Get farmer points
const points = await contractIncentive.getFarmerPoints(farmerAddress);
// Returns: { points: 500, level: "Silver", nextLevel: "Gold" }

// Grant points (admin only)
await contractIncentive.grantPoints(
  farmerAddress,
  100,
  "Supplied 500kg rice"
);
// Returns: { success: true, newPoints: 600 }

// Redeem points
const reward = await contractIncentive.redeemPoints(100);
// Returns: { pointsRedeemed: 100, rewardAmount: 50000 }
```

**Incentive Tiers**:

```typescript
Points: 0-100    → Bronze (no rewards)
Points: 101-250  → Silver (5% bonus)
Points: 251-500  → Gold (10% bonus)
Points: 501+     → Platinum (15% bonus)
```

---

## 📡 Data Flow Examples

### Example 1: Farmer Checking Today's Price

```
1. User opens Farmer Dashboard
   ↓
2. Frontend calls GET /pricing/latest
   ↓
3. Backend queries EthaniPricing contract
   - Gets current supply/demand from EthaniRegion
   - Calls calculatePrice() function
   ↓
4. Contract returns:
   {
     suggestedPrice: 9180,
     multiplier: 1.08,
     tier: "KURANG",
     reason: "Shortage - Demand 1200 > Supply 1000 (ratio 1.2)"
   }
   ↓
5. Frontend displays:
   ┌────────────────────────┐
   │ Harga Hari Ini         │
   │ Rp 9.180/kg            │
   │ Tier: KURANG 🟠        │
   │ Ratio: 1.20            │
   └────────────────────────┘
```

### Example 2: Buyer Checking Product Prices

```
1. User browses Market page
   ↓
2. Frontend calls GET /products
   ↓
3. Backend returns products with prices:
   [
     {
       id: 1,
       name: "Beras Putih",
       basePrice: 8500,
       currentPrice: 9180,    ← From EthaniPricing contract
       tier: "KURANG",        ← From supply-demand analysis
       status: "TERBATAS"
     },
     ...
   ]
   ↓
4. Frontend displays products with:
   - Current price (calculated on-chain)
   - Tier indicator
   - Why price is at this level
```

### Example 3: Adding Supply (Farmer)

```
1. Farmer fills form:
   - Product: Beras
   - Quantity: 500 kg
   - Unit Price: 8000
   ↓
2. Frontend calls POST /supplies/add
   ↓
3. Backend:
   - Stores supply in database
   - Calls EthaniRegion.updateRegion() to increase supply count
   - Backend recalculates pricing using EthaniPricing
   ↓
4. Contract updates:
   - Region supply: 1000 → 1500
   - New supply-demand ratio: 0.8 (was 1.2)
   - New price tier: SEIMBANG (was KURANG)
   ↓
5. Frontend updates displayed prices for all users
   - Prices drop to balanced level
   - Farmers see lower prices (fair)
   - Buyers see lower prices (benefit)
```

---

## 🔐 Authentication Flow

### Login Process with Blockchain Awareness

```typescript
// 1. User submits credentials
const response = await loginUser('08123456789', 'password123');

// 2. Backend validates and returns token
// 3. Frontend stores token
localStorage.setItem('authToken', response.token);
localStorage.setItem('userRole', response.user.role);
localStorage.setItem('userId', response.user.id);

// 4. All subsequent requests include token
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
};

// 5. Token used for:
//    - User API calls (protected endpoints)
//    - Blockchain calls (backend executes on behalf of user)
//    - Order management
//    - Supply tracking
```

### Smart Contract Interaction (Backend Proxy)

Frontend does NOT directly call smart contracts. Instead:

```
Frontend (JavaScript)
  ↓ (HTTP request with token)
Backend (Python)
  ↓ (Web3.py or ethers.js)
Smart Contract (Solidity)
  ↓ (State change or read)
Blockchain (Mantle Testnet)
```

**Why?**
- ✅ User doesn't need to have ETH/MNT for gas
- ✅ Backend manages contract interactions
- ✅ Frontend stays lightweight
- ✅ Easier to handle errors and retries

---

## 📊 Configuration Classes

### lib/config.ts Structure

```typescript
// API Configuration
export const API_CONFIG = {
  baseUrl: 'http://localhost:8000',
  endpoints: {
    health: '/health',
    auth: { login, register, logout, refresh },
    users: { profile, update, delete },
    products: { list, detail, byCategory },
    pricing: { latest, calculate, history },
    supplies: { add, list, delete },
    deliveries: { list, detail, update, create },
    orders: { create, list, detail, cancel },
    blockchain: { getRatio, getPricing, recordTransaction }
  }
}

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  network: {
    name: 'mantle-testnet',
    chainId: 5001,
    rpcUrl: 'https://rpc.testnet.mantle.xyz',
    explorerUrl: 'https://explorer.testnet.mantle.xyz'
  },
  contracts: {
    pricing: { address: '0x...', functions: {...} },
    region: { address: '0x...', functions: {...} },
    incentive: { address: '0x...', functions: {...} }
  }
}

// Pricing Rules
export const PRICING_CONFIG = {
  tiers: [
    { id: 'KRITIS', ratio_min: 1.30, multiplier: 1.15 },
    { id: 'KURANG', ratio_min: 1.10, ratio_max: 1.29, multiplier: 1.08 },
    { id: 'SEIMBANG', ratio_min: 0.80, ratio_max: 1.09, multiplier: 1.0 },
    { id: 'BANYAK', ratio_max: 0.79, multiplier: 0.9 }
  ],
  hardLimits: { maxIncrease: 1.50, maxDecrease: 0.70 }
}
```

---

## 🚀 Deployment Checklist

### Backend Setup
- [ ] Backend API running on configured URL
- [ ] All endpoints implemented and tested
- [ ] Database connected and migrations run
- [ ] Web3 library configured for contract calls
- [ ] Error handling and logging in place

### Smart Contracts
- [ ] Contracts compiled without errors
- [ ] Tests passing (17/17 tests)
- [ ] Deployed to Mantle Testnet
- [ ] Deployment addresses verified on explorer
- [ ] Addresses copied to frontend `.env.local`

### Frontend
- [ ] `.env.local` configured with:
  - [ ] Backend API URL
  - [ ] All three contract addresses
  - [ ] Network parameters
- [ ] Build succeeds: `npm run build` ✓
- [ ] All pages accessible
- [ ] Type checking passes: `npm run type-check` ✓
- [ ] No console errors

### Integration Testing
- [ ] Login flow works end-to-end
- [ ] User can view dashboard
- [ ] Prices display from contract
- [ ] Supplies can be added (farmer)
- [ ] Deliveries can be tracked (distributor)
- [ ] Orders can be placed (buyer)
- [ ] Responsive design works on mobile

### Production Deployment
- [ ] Backend deployed to production
- [ ] Contracts verified on Mainnet (when ready)
- [ ] Frontend deployed to Vercel/production
- [ ] Environment variables set on hosting
- [ ] SSL certificates configured
- [ ] Monitoring and logging enabled
- [ ] Backup and disaster recovery plan

---

## 🐛 Troubleshooting Integration Issues

### Issue: "API connection failed"

**Solutions**:
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS headers on backend
4. Look at browser console and network tab

### Issue: "Contract address not configured"

**Solutions**:
1. Deploy contracts: `forge script script/DeployEthani.s.sol --network mantle-testnet --broadcast -vvv`
2. Copy addresses to `.env.local`:
   ```env
   NEXT_PUBLIC_CONTRACT_PRICING=0x...
   NEXT_PUBLIC_CONTRACT_REGION=0x...
   NEXT_PUBLIC_CONTRACT_INCENTIVE=0x...
   ```
3. Verify contracts exist on explorer: https://explorer.testnet.mantle.xyz

### Issue: "Pricing calculation fails"

**Solutions**:
1. Verify contract address is correct
2. Check EthaniRegion has supply/demand data
3. Verify backend can call contracts
4. Check Mantle RPC is accessible
5. Look at backend logs for details

### Issue: "Authentication token invalid"

**Solutions**:
1. Clear localStorage: `localStorage.clear()`
2. Login again
3. Check token format in backend
4. Verify token expiration settings
5. Check Authorization header in requests

---

## 📚 Related Documentation

- [Frontend README](../frontend/README.md) - Setup instructions
- [SMART_CONTRACTS_DEPLOYED.md](./SMART_CONTRACTS_DEPLOYED.md) - Contract deployment
- [BACKEND_SERVICE.md](./BACKEND_SERVICE.md) - Backend API docs
- [FRONTEND_BUILD_COMPLETE.md](../FRONTEND_BUILD_COMPLETE.md) - Architecture overview

---

## ✅ Verification Checklist

Use this to verify integration is working:

```bash
# 1. Backend health check
curl http://localhost:8000/health

# 2. Contract addresses configured
grep NEXT_PUBLIC_CONTRACT .env.local

# 3. Frontend builds
npm run build

# 4. Frontend starts
npm run dev

# 5. Can access pages
curl http://localhost:3000

# 6. Type checking passes
npm run type-check

# 7. Can view contract on explorer
# https://explorer.testnet.mantle.xyz/address/0x...
```

---

**Built with ❤️ for ETHANI**

Last Updated: 1 Januari 2026  
Version: 1.0.0
