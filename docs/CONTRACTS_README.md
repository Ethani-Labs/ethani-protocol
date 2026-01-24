# ETHANI Smart Contracts - Foundry

> **Live Deployment:** All 5 contracts deployed & verified on Arbitrum Sepolia (Jan 23, 2026)

This folder contains the Foundry-based smart contract development environment for ETHANI.

## ✅ Deployed Contracts (Arbitrum Sepolia - Chain ID: 421614)

| Contract | Address | Verified |
|----------|---------|----------|
| **EthaniPricing** | `0xc92fd01c122821Eb2C911d16468B20b07E25abC0` | ✅ [View](https://sepolia.arbiscan.io/address/0xc92fd01c122821Eb2C911d16468B20b07E25abC0) |
| **EthaniRegion** | `0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143` | ✅ [View](https://sepolia.arbiscan.io/address/0x5836cdde4d05b0abdb97ae556a0b9e3971a16143) |
| **EthaniIncentive** | `0xE6C246d7Ba92c4d35076C91B686d104ad3118172` | ✅ [View](https://sepolia.arbiscan.io/address/0xe6c246d7ba92c4d35076c91b686d104ad3118172) |
| **EthaniCore** | `0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4` | ✅ [View](https://sepolia.arbiscan.io/address/0x05af2330e286197e4a2304fd708aa333ab3acde4) |
| **PriceOracle** | `0x139a3036052761341212C7d06488C27fb000a167` | ✅ [View](https://sepolia.arbiscan.io/address/0x139a3036052761341212c7d06488c27fb000a167) |

🔗 **RPC:** https://sepolia-rollup.arbitrum.io/rpc | 📊 **Explorer:** https://sepolia.arbiscan.io

## 🚀 Quick Start

```bash
# Setup
make install
cp .env.example .env
nano .env  # Configure RPC URLs and private key

# Build & Test
make build
make test

# Deploy
source .env
make deploy-sepolia  # Deploy to testnet
```

## 📚 Documentation

- **[FOUNDRY_SETUP_COMPLETE.md](../docs/FOUNDRY_SETUP_COMPLETE.md)** - Complete setup guide
- **[CONTRACTS_README.md](../docs/CONTRACTS_README.md)** - Full contracts documentation

## 📋 Available Commands

```bash
make help           # Show all commands
make install        # Install dependencies
make build          # Build contracts
make test           # Run tests
make test-gas       # Show gas reports
make coverage       # Code coverage
make deploy-sepolia # Deploy to testnet
make deploy-mainnet # Deploy to mainnet
make format         # Format code
make clean          # Clean build artifacts
```

## 📂 Project Structure

```
src/
├── core/                    # Core contracts
│   ├── PriceStabilizer.sol
│   ├── ProductRegistry.sol
│   ├── TransactionManager.sol
│   └── CircularEconomy.sol
├── access/                  # Access control
│   └── RoleManager.sol
├── interfaces/              # Contract interfaces
│   └── IPriceStabilizer.sol, etc
└── utils/
    └── Constants.sol

script/
├── Deploy.s.sol
├── DeployArbitrumSepolia.s.sol
└── DeployArbitrumOne.s.sol

test/
├── unit/
│   ├── PriceStabilizer.t.sol
│   └── RoleManager.t.sol
└── integration/
```

## 🔗 Networks

- **Arbitrum Sepolia (Testnet):** Chain ID 421614
- **Arbitrum One (Mainnet):** Chain ID 42161

## ⚡ Key Features

- ✅ Rule-based pricing (no AI, no oracles)
- ✅ Role-based access control
- ✅ Comprehensive tests (40+ test cases)
- ✅ Gas optimized
- ✅ Production-ready security

---

For full documentation, see the [docs](../docs) folder.
