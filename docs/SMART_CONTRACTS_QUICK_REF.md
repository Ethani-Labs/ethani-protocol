# ETHANI Smart Contracts - Quick Reference

## ✅ Production Status: READY FOR DEPLOYMENT

**All 3 contracts compiled and tested:**
- ✅ EthaniPricing.sol (180 lines) - Core pricing engine
- ✅ EthaniRegion.sol (180 lines) - Regional data  
- ✅ EthaniIncentive.sol (210 lines) - Points system
- ✅ DeployEthani.s.sol (60 lines) - Deployment script
- ✅ EthaniPricing.t.sol (260 lines) - 17 passing tests

---

## One-Liner Deploy Commands

### Mantle Testnet
```bash
export PRIVATE_KEY=0x... && cd contracts && forge script script/DeployEthani.s.sol --network mantle-testnet --broadcast -vvv
```

### Mantle Mainnet
```bash
export PRIVATE_KEY=0x... && cd contracts && forge script script/DeployEthani.s.sol --network mantle-mainnet --broadcast -vvv
```

### Local Testing
```bash
cd contracts && forge test -vvv
```

---

## Core Pricing Rules (Immutable)

```
Supply-Demand Ratio → Price Change → Tier
├─ ≥ 1.30 → +15% → CRITICAL_SHORTAGE
├─ ≥ 1.10 → +8%  → SHORTAGE
├─ 0.80-1.10 → 0% → BALANCED
└─ ≤ 0.80 → -10% → SURPLUS
```

**Example:**
```
Supply: 100 units
Demand: 150 units
Ratio: 1.50 (≥ 1.30)
Base Price: $100
→ Final Price: $115 (+15%) [CRITICAL_SHORTAGE]
```

---

## Contract Interfaces

### EthaniPricing (Pure Functions Only)
```solidity
// Main function
function calculatePrice(uint256 supply, uint256 demand, uint256 basePrice)
    → (uint256 finalPrice, string memory reason, string memory tier)

// Utilities
function getSupplyDemandRatio(uint256 supply, uint256 demand)
    → uint256 ratio
function getPricingTier(uint256 supply, uint256 demand)
    → string memory tier
function getPriceMultiplier(uint256 supply, uint256 demand)
    → uint256 multiplier
function getPricingRules()
    → (uint256 critical, uint256 shortage, uint256 surplus)
```

### EthaniRegion (Admin-Controlled)
```solidity
// Admin Functions
function createRegion(string calldata name, uint256 basePrice)
function updateBasePrice(uint256 regionId, uint256 newBasePrice)
function setRegionActive(uint256 regionId, bool isActive)
function changeAdmin(address newAdmin)

// Read Functions
function getRegion(uint256 regionId) → Region
function getBasePrice(uint256 regionId) → uint256
function isRegionActive(uint256 regionId) → bool
function getTotalRegions() → uint256
```

### EthaniIncentive (Admin-Controlled)
```solidity
// Admin Functions
function registerUser(address user)
function grantPoints(address user, uint256 points, string calldata reason)
function revokePoints(address user, uint256 points, string calldata reason)
function deactivateUser(address user)
function changeAdmin(address newAdmin)

// Read Functions
function getPoints(address user) → uint256
function getUserInfo(address user) → UserPoints
function isUserActive(address user) → bool
function getTotalUsers() → uint256
function getLeaderboard(uint256 limit) → (address[], uint256[])
```

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Contracts | 3 |
| Total Lines of Code | 630 |
| Test Coverage | 17 tests |
| Pass Rate | 100% |
| Avg Gas per Price Calc | ~10,000 gas |
| Compiler | Solc 0.8.20 |
| Framework | Foundry |

---

## File Locations

```
/Users/macbookair/Documents/Ethani-Labs/
├── contracts/
│   ├── src/
│   │   ├── EthaniPricing.sol      ← Core pricing logic
│   │   ├── EthaniRegion.sol       ← Regional config
│   │   └── EthaniIncentive.sol    ← Points system
│   ├── script/
│   │   └── DeployEthani.s.sol     ← Deployment
│   ├── test/
│   │   └── EthaniPricing.t.sol    ← Tests (17 tests)
│   ├── foundry.toml               ← Config
│   └── lib/forge-std/             ← Dependencies
│
├── SMART_CONTRACTS_DEPLOYED.md    ← Full documentation
├── docs/SMART_CONTRACTS_COMPLETE.md ← Technical guide
└── backend/, frontend/            ← Other components
```

---

## Deployment Checklist

- [ ] Have testnet MNT tokens for gas: https://faucet.mantle.xyz
- [ ] Set PRIVATE_KEY env variable
- [ ] Run deployment script
- [ ] Record contract addresses
- [ ] Verify on Blockscout: https://mantle.blockscout.com
- [ ] Integrate with backend API
- [ ] Test pricing calculations
- [ ] Monitor gas usage

---

## Testing Command
```bash
cd /Users/macbookair/Documents/Ethani-Labs/contracts
forge test -vvv --match-test "test_" --reporter default
```

**Expected Output:**
```
Ran 17 tests
[PASS] test_CriticalShortage
[PASS] test_Shortage
[PASS] test_BalancedMarket
[PASS] test_Surplus
... (13 more)
17 passed; 0 failed
```

---

## Build Command
```bash
cd /Users/macbookair/Documents/Ethani-Labs/contracts
forge build
```

**Generates:**
- `contracts/out/EthaniPricing.sol/EthaniPricing.json`
- `contracts/out/EthaniRegion.sol/EthaniRegion.json`
- `contracts/out/EthaniIncentive.sol/EthaniIncentive.json`

Use these ABIs in frontend/backend code.

---

## Support

**Documentation:**
- [SMART_CONTRACTS_DEPLOYED.md](./SMART_CONTRACTS_DEPLOYED.md) - Full guide
- [docs/SMART_CONTRACTS_COMPLETE.md](./docs/SMART_CONTRACTS_COMPLETE.md) - Technical details

**Network Details:**
- Mantle Testnet RPC: `https://rpc.testnet.mantle.xyz`
- Mantle Mainnet RPC: `https://rpc.mantle.xyz`
- Block Explorer: `https://mantle.blockscout.com`
- Chain ID Testnet: 5003
- Chain ID Mainnet: 5000

**Useful Links:**
- Foundry Docs: https://book.getfoundry.sh
- Solidity Docs: https://docs.soliditylang.org/en/v0.8.20
- Mantle Docs: https://docs.mantle.xyz

---

Generated: January 2025
Status: ✅ Production Ready
