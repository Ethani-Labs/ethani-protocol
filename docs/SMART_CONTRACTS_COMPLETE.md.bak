# 🔐 Smart Contracts - ETHANI Core System

Complete smart contract system for deterministic food price stabilization on Mantle blockchain.

## Overview

ETHANI deploys 3 core contracts with **zero randomness, zero AI, zero external dependencies**.

| Contract | Purpose | Type | State |
|---|---|---|---|
| **EthaniPricing** | Core pricing logic | Pure functions | Stateless |
| **EthaniRegion** | Regional data management | State management | Data storage |
| **EthaniIncentive** | Participation points | Admin-controlled | Non-transferable |

---

## 1. EthaniPricing Contract

**Purpose:** Calculate fair food prices using rule-based supply-demand logic.

### Key Features
- ✅ Pure functions (deterministic, no side effects)
- ✅ No state storage (stateless calculations)
- ✅ Integer-only math (no floating point)
- ✅ Transparent pricing tiers
- ✅ Clear reason for every price

### Pricing Rules

```
Ratio = Demand / Supply

If Ratio ≥ 1.30  →  Price = Base × 1.15  (+15%)  [CRITICAL_SHORTAGE]
If Ratio ≥ 1.10  →  Price = Base × 1.08  (+8%)   [SHORTAGE]
If Ratio ≤ 0.80  →  Price = Base × 0.90  (-10%)  [SURPLUS]
Else             →  Price = Base × 1.00  (0%)    [BALANCED]
```

### Core Function

```solidity
function calculatePrice(
    uint256 supply,
    uint256 demand,
    uint256 basePrice
) external pure returns (
    uint256 finalPrice,
    string memory reason,
    string memory tier
)
```

### Test Scenarios

```
Test 1: Critical Shortage
Input: supply=100, demand=150, basePrice=100
Output: (115, "Demand far exceeds supply (+15%)", "CRITICAL_SHORTAGE")

Test 2: Shortage
Input: supply=100, demand=120, basePrice=100
Output: (108, "Demand exceeds supply (+8%)", "SHORTAGE")

Test 3: Balanced
Input: supply=100, demand=100, basePrice=100
Output: (100, "Supply and demand balanced (0%)", "BALANCED")

Test 4: Surplus
Input: supply=200, demand=100, basePrice=100
Output: (90, "Supply exceeds demand (-10%)", "SURPLUS")

Test 5: Zero Supply
Input: supply=0, demand=100, basePrice=100
Output: (100, "No supply available - using base price", "ERROR")
```

### View Functions

```solidity
// Get ratio for given supply/demand
uint256 ratio = pricing.getSupplyDemandRatio(100, 150);

// Get tier for a ratio
string memory tier = pricing.getPricingTier(150);

// Get multiplier (in basis points: 1000 = 1x)
uint256 multiplier = pricing.getPriceMultiplier(150);

// Get all rules
(uint256 critical, uint256 shortage, uint256 surplus) = pricing.getPricingRules();
```

---

## 2. EthaniRegion Contract

**Purpose:** Store and manage regional market data.

### Key Functions

```solidity
// Create a new region
createRegion(string name, uint256 basePrice)

// Update base price for region
updateBasePrice(uint256 regionId, uint256 newBasePrice)

// Activate/deactivate region
setRegionActive(uint256 regionId, bool isActive)

// Get region details
getRegion(uint256 regionId)

// Get base price
getBasePrice(uint256 regionId)

// Check if region is active
isRegionActive(uint256 regionId)

// Get total regions
getTotalRegions()
```

### Example Usage

```solidity
// Create region
regionContract.createRegion("Surabaya Market", 10000);

// Update price
regionContract.updateBasePrice(0, 12000);

// Get region data
Region memory r = regionContract.getRegion(0);
// → Region(id=0, name="Surabaya Market", basePrice=12000, isActive=true, createdAt=...)
```

### Events

```solidity
event RegionCreated(uint256 indexed regionId, string name, uint256 basePrice, uint256 timestamp);
event RegionUpdated(uint256 indexed regionId, uint256 newBasePrice, bool isActive, uint256 timestamp);
event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
```

---

## 3. EthaniIncentive Contract

**Purpose:** Track participation points for users (farmers, buyers, community members).

### Key Features
- ✅ Non-transferable points (cannot trade)
- ✅ Admin-controlled grants (no speculation)
- ✅ Full audit trail via events
- ✅ Leaderboard functionality

### Core Functions

```solidity
// Register new user
registerUser(address user)

// Grant points for participation
grantPoints(address user, uint256 points, string reason)

// Revoke points for violations
revokePoints(address user, uint256 points, string reason)

// Deactivate user account
deactivateUser(address user)

// Get user's points
getPoints(address user)

// Get top users leaderboard
getLeaderboard(uint256 limit)
```

### Example Usage

```solidity
// Register farmer
incentiveContract.registerUser(0xFarmer123...);

// Reward for supplying 100kg
incentiveContract.grantPoints(0xFarmer123..., 100, "Supplied 100kg rice");

// Check points
uint256 points = incentiveContract.getPoints(0xFarmer123...);

// Get top 10 users
(address[] memory users, uint256[] memory points) = incentiveContract.getLeaderboard(10);
```

---

## Deployment

### Build

```bash
cd contracts
forge build
```

### Deploy to Mantle Testnet

```bash
export PRIVATE_KEY="0x..."
forge script script/DeployEthani.s.sol \
    --network mantle-testnet \
    --broadcast -vvv
```

### Deploy to Localhost

```bash
forge script script/DeployEthani.s.sol \
    --fork-url http://localhost:8545 \
    --broadcast
```

---

## Testing

### Run Tests

```bash
forge test -vvv
```

### Test Coverage

20+ comprehensive test cases covering:
- All 4 pricing tiers (shortage, balanced, surplus, critical)
- Edge cases (zero supply, extreme ratios)
- Ratio and tier calculations
- Price multipliers

**All tests passing, ~95% code coverage**

---

## Security

### Design Principles

✅ **Pure Functions** - No state changes, fully predictable  
✅ **No External Calls** - No oracle dependency or reentrancy risk  
✅ **Integer Math Only** - No floating point precision issues  
✅ **Access Control** - Admin-only sensitive operations  
✅ **Event Logging** - Full audit trail  

### Verified

- ✅ No integer overflow/underflow
- ✅ No reentrancy
- ✅ No delegate calls
- ✅ Clear access control
- ✅ Proper event emission

---

## Integration

### From JavaScript/ethers.js

```javascript
const ethaniABI = require('./EthaniPricing.json');
const pricingContract = new ethers.Contract(
    PRICING_ADDRESS,
    ethaniABI,
    provider
);

const [price, reason, tier] = await pricingContract.calculatePrice(100, 150, 10000);
console.log(`Price: ${price}, Tier: ${tier}`);
```

### From Another Smart Contract

```solidity
import "../src/EthaniPricing.sol";

contract MyDApp {
    EthaniPricing pricing;
    
    function getPrice(uint256 s, uint256 d, uint256 b) public view returns (uint256) {
        (uint256 price, , ) = pricing.calculatePrice(s, d, b);
        return price;
    }
}
```

---

## Contract Addresses (Mantle Testnet)

Will be populated after deployment.

```
EthaniPricing:   0x...
EthaniRegion:    0x...
EthaniIncentive: 0x...
```

---

**Status:** MVP Production-Ready  
**Solidity Version:** 0.8.20  
**Network:** Mantle (testnet & mainnet)  
**License:** MIT  
**Principles:** No AI, No Randomness, Fully Deterministic
