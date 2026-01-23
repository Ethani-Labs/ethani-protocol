# 🚀 ETHANI Smart Contracts - DEPLOYED

**Network:** Arbitrum Sepolia Testnet
**Chain ID:** 421614
**Deployer:** 0x02cE05049D7A1dAEb7987CA9Ed5104003E7B778e
**Deployment Date:** January 23, 2026

---

## 📝 Contract Addresses

### Simple Contracts

| Contract | Address | Explorer |
|---|---|---|
| **EthaniPricing** | `0xc92fd01c122821Eb2C911d16468B20b07E25abC0` | [View →](https://sepolia.arbiscan.io/address/0xc92fd01c122821Eb2C911d16468B20b07E25abC0) |
| **EthaniRegion** | `0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143` | [View →](https://sepolia.arbiscan.io/address/0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143) |
| **EthaniIncentive** | `0xE6C246d7Ba92c4d35076C91B686d104ad3118172` | [View →](https://sepolia.arbiscan.io/address/0xE6C246d7Ba92c4d35076C91B686d104ad3118172) |

### Core Infrastructure

| Contract | Address | Explorer |
|---|---|---|
| **EthaniCore** | `0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4` | [View →](https://sepolia.arbiscan.io/address/0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4) |
| **PriceOracle** | `0x139a3036052761341212C7d06488C27fb000a167` | [View →](https://sepolia.arbiscan.io/address/0x139a3036052761341212C7d06488C27fb000a167) |

---

## ⚙️ Configuration

### Roles Granted

- ✅ **EthaniCore**: DATA_UPDATER_ROLE granted to PriceOracle
- ✅ **PriceOracle**: PRICE_UPDATER_ROLE granted to deployer
- ✅ **PriceOracle**: All admin roles granted to deployer

### Initial Setup

- ✅ Sample region created (Region ID: 0)
- ✅ Base price: 1000 ether
- ✅ Ready for testing

---

## 🧪 Testing Commands

### 1. Update Region Data

```bash
export ETHANI_CORE=0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4
export PRIVATE_KEY=0x710bef627f4735faedc7a44f37d9ac30ee537d1cec5570c966be42feeb62b534

# Update supply and demand
cast send $ETHANI_CORE \
    "updateRegionData(uint256,uint256,uint256)" \
    0 1000 1200 \
    --rpc-url https://arb-sepolia.g.alchemy.com/v2/E78T_tzodU3GWlfC5QCHL \
    --private-key $PRIVATE_KEY \
    --legacy
```

### 2. Calculate Price

```bash
export PRICE_ORACLE=0x139a3036052761341212C7d06488C27fb000a167

# Update price based on supply-demand
cast send $PRICE_ORACLE \
    "updatePrice(uint256)" 0 \
    --rpc-url https://arb-sepolia.g.alchemy.com/v2/E78T_tzodU3GWlfC5QCHL \
    --private-key $PRIVATE_KEY \
    --legacy
```

### 3. Get Latest Price

```bash
# View calculated price
cast call $PRICE_ORACLE \
    "getLatestPrice(uint256)" 0 \
    --rpc-url https://arb-sepolia.g.alchemy.com/v2/E78T_tzodU3GWlfC5QCHL
```

### 4. Test Simple Pricing

```bash
export ETHANI_PRICING=0xc92fd01c122821Eb2C911d16468B20b07E25abC0

# Calculate price: supply=100, demand=150, basePrice=1000
cast call $ETHANI_PRICING \
    "calculatePrice(uint256,uint256,uint256)" \
    100 150 1000 \
    --rpc-url https://arb-sepolia.g.alchemy.com/v2/E78T_tzodU3GWlfC5QCHL
```

---

## 📊 Gas Usage Report

| Contract | Gas Used | Estimated Cost (ETH) |
|---|---|---|
| EthaniPricing | 305,950 | ~0.000306 ETH |
| EthaniRegion | 601,563 | ~0.000602 ETH |
| EthaniIncentive | 689,444 | ~0.000689 ETH |
| EthaniCore | 833,677 | ~0.000834 ETH |
| PriceOracle | 2,111,613 | ~0.002112 ETH |
| Configuration | ~170,000 | ~0.000170 ETH |
| **TOTAL** | **~4,712,247** | **~0.0047 ETH** |

*(Actual cost ~$0.01 USD on Arbitrum Sepolia)*

---

## 🔗 Integration with Backend

### Environment Variables (.env)

Add these to your backend `.env` file:

```bash
# Arbitrum Sepolia Testnet
ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/E78T_tzodU3GWlfC5QCHL
CHAIN_ID=421614

# Contract Addresses
ETHANI_PRICING_ADDRESS=0xc92fd01c122821Eb2C911d16468B20b07E25abC0
ETHANI_REGION_ADDRESS=0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143
ETHANI_INCENTIVE_ADDRESS=0xE6C246d7Ba92c4d35076C91B686d104ad3118172
ETHANI_CORE_ADDRESS=0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4
ETHANI_PRICE_ORACLE_ADDRESS=0x139a3036052761341212C7d06488C27fb000a167
```

### JavaScript/TypeScript Example

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(
  'https://arb-sepolia.g.alchemy.com/v2/E78T_tzodU3GWlfC5QCHL'
);

const priceOracleAddress = '0x139a3036052761341212C7d06488C27fb000a167';
const priceOracleABI = [
  'function calculatePrice(uint256 regionId) view returns (uint256, string, tuple)',
  'function getLatestPrice(uint256 regionId) view returns (uint256)'
];

const oracle = new ethers.Contract(priceOracleAddress, priceOracleABI, provider);

// Get latest price for region 0
const price = await oracle.getLatestPrice(0);
console.log('Current price:', ethers.formatEther(price));
```

---

## ✅ Next Steps

1. **Verify Contracts on Arbiscan** (optional)
   - Get API key: https://arbiscan.io/apis
   - Run verification script

2. **Test Full Flow**
   - Update region data
   - Calculate prices
   - Verify pricing logic

3. **Integrate with Backend**
   - Update `.env` with contract addresses
   - Test API endpoints
   - Connect frontend

4. **Production Readiness**
   - External security audit (if going to mainnet)
   - Load testing
   - Monitoring setup

---

## 📚 Documentation

- [Contract Source Code](../contracts/src/)
- [Deployment Script](../contracts/script/DeployAll.s.sol)
- [Test Suite](../contracts/test/)
- [Smart Contract Docs](./SMART_CONTRACTS_COMPLETE.md)

---

**Status:** ✅ LIVE on Arbitrum Sepolia Testnet
**Deployment Verified:** Yes
**Ready for Integration:** Yes
