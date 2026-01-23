# 🌱 Ethani Labs

Ethani is a decentralized, rule-based system to stabilize food prices and empower rural communities through transparent logistics and circular energy principles.

## 🚀 Live Deployment (Arbitrum Sepolia - Jan 23, 2026)

All smart contracts are **deployed and verified** on Arbitrum Sepolia testnet:

| Contract | Address | Status | Explorer |
|----------|---------|--------|----------|
| **EthaniPricing** | `0xc92fd01c122821Eb2C911d16468B20b07E25abC0` | ✅ Verified | [Arbiscan](https://sepolia.arbiscan.io/address/0xc92fd01c122821Eb2C911d16468B20b07E25abC0) |
| **EthaniRegion** | `0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143` | ✅ Verified | [Arbiscan](https://sepolia.arbiscan.io/address/0x5836cdde4d05b0abdb97ae556a0b9e3971a16143) |
| **EthaniIncentive** | `0xE6C246d7Ba92c4d35076C91B686d104ad3118172` | ✅ Verified | [Arbiscan](https://sepolia.arbiscan.io/address/0xe6c246d7ba92c4d35076c91b686d104ad3118172) |
| **EthaniCore** | `0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4` | ✅ Verified | [Arbiscan](https://sepolia.arbiscan.io/address/0x05af2330e286197e4a2304fd708aa333ab3acde4) |
| **PriceOracle** | `0x139a3036052761341212C7d06488C27fb000a167` | ✅ Verified | [Arbiscan](https://sepolia.arbiscan.io/address/0x139a3036052761341212c7d06488c27fb000a167) |

**Network:** Arbitrum Sepolia Testnet (Chain ID: 421614)  
**RPC:** `https://sepolia-rollup.arbitrum.io/rpc`  
**Explorer:** https://sepolia.arbiscan.io

## Structure
- `contracts/`  → Smart contracts (Arbitrum Sepolia - deployed & verified)
- `backend/`    → Rule-based FastAPI (connects to contracts)
- `frontend/`   → Next.js web interface

## Philosophy
- Explainable over complex
- Stability over speculation
- People over technology

---

## 📚 Documentation

For comprehensive guides, see the [docs/](./docs/) folder:
- [README.md](./docs/README.md) - Complete setup & architecture
- [FRONTEND.md](./docs/FRONTEND.md) - Next.js frontend guide
- [BACKEND_SERVICE.md](./docs/BACKEND_SERVICE.md) - FastAPI backend guide
- [SMART_CONTRACTS.md](./docs/SMART_CONTRACTS.md) - Solidity contracts
- [vision.md](./docs/vision.md) - Mission & values
- [pricing-model.md](./docs/pricing-model.md) - Pricing rules
- [roadmap.md](./docs/roadmap.md) - Development plan
- [architecture.md](./docs/architecture.md) - System design

## 🚀 Quick Start

### Backend
```bash
cd backend
./start.sh
# API at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm run dev
# App at http://localhost:3000
```

### Smart Contracts
```bash
cd contracts
forge test
forge build
```

## 📋 Core Rules

**Pricing Tiers (by supply-demand ratio):**
- Ratio > 1.30: +15% (Critical Shortage)
- Ratio > 1.10: +8% (Shortage)
- Ratio 0.80-1.10: 0% (Balanced)
- Ratio < 0.80: -10% (Surplus)

**Hard Limits:**
- Max increase: +50%
- Max decrease: -30%

## 🛠️ Technology

- **Blockchain:** Solidity 0.8.20 on Mantle
- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (React/TypeScript)
- **Testing:** Foundry (contracts), pytest (backend)
- **CI/CD:** GitHub Actions

## 📖 License

MIT - Open source for community benefit
