# ETHANI Smart Contracts

**Rule-based food price stabilization system on Arbitrum**

ETHANI is a decentralized, deterministic food price stabilization system designed for emerging markets. It uses **transparent, rule-based pricing logic** (no AI, no oracles) to ensure fair prices across supply-demand cycles.

## 🚀 Quick Start

### Prerequisites

- **Foundry** (Solidity development framework)
- **Cast** (Foundry CLI tool)
- Arbitrum RPC endpoint (free via [Alchemy](https://alchemy.com), [Infura](https://infura.io), or [QuickNode](https://quicknode.com))
- Private key for deployment

### Installation

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone repo (if needed)
cd ethani-labs/contracts

# Install dependencies
make install

# Setup environment
cp .env.example .env
# Edit .env with your RPC URLs and private key
nano .env
```

### Build & Test

```bash
# Build contracts
make build

# Run tests
make test

# Run tests with verbose output
make test-verbose

# Generate gas report
make test-gas

# Coverage report
make coverage
```

## 📦 Project Structure

```
contracts/
├── src/
│   ├── core/
│   │   ├── PriceStabilizer.sol       # Rule-based pricing engine
│   │   └── [ProductRegistry.sol]     # (Planned)
│   ├── access/
│   │   └── RoleManager.sol           # RBAC (farmer, buyer, etc)
│   ├── interfaces/
│   │   └── IPriceStabilizer.sol      # Interface definitions
│   └── utils/
│       └── Constants.sol             # Shared constants
│
├── script/
│   ├── Deploy.s.sol                  # Base deployment script
│   ├── DeployArbitrumSepolia.s.sol   # Testnet deployment
│   └── DeployArbitrumOne.s.sol       # Mainnet deployment
│
├── test/
│   ├── unit/
│   │   └── PriceStabilizer.t.sol     # Unit tests
│   ├── integration/
│   │   └── [FullFlow.t.sol]          # (Planned)
│   └── fuzz/
│       └── [PriceStabilizer.fuzz.t.sol] # (Planned)
│
├── foundry.toml                      # Foundry configuration
├── remappings.txt                    # Import path remappings
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore file
├── Makefile                          # Common commands
└── README.md                         # This file
```

## 🔗 Core Contracts

### PriceStabilizer.sol

Deterministic pricing engine implementing ETHANI's supply-demand rules.

**Pricing Rules:**
- Ratio ≥ 1.30: **+15%** (critical shortage)
- Ratio ≥ 1.10: **+8%** (shortage)
- Ratio ≤ 0.80: **-10%** (surplus)
- Ratio 0.80-1.10: **0%** (balanced)

**Hard Limits:**
- Maximum increase: **+50%**
- Maximum decrease: **-30%**

**Key Functions:**
```solidity
// Calculate fair price
function calculatePrice(uint256 productId, uint256 supply, uint256 demand) 
    external view returns (uint256 finalPrice, string memory tier)

// Get current price
function getPrice(uint256 productId) external view returns (uint256)

// Update supply/demand data
function updateSupplyDemand(uint256 productId, uint256 supply, uint256 demand)
    external

// Create product
function createProduct(uint256 basePrice) external returns (uint256 productId)
```

### RoleManager.sol

Role-based access control for ETHANI ecosystem.

**Roles:**
- `FARMER_ROLE`: Can register products and update supply
- `BUYER_ROLE`: Can purchase products
- `DISTRIBUTOR_ROLE`: Can handle logistics
- `OPERATOR_ROLE`: Can manage system parameters
- `AUDITOR_ROLE`: Can audit transactions

## 🧪 Testing

### Run All Tests

```bash
make test
```

### Run Specific Test

```bash
forge test --match-test "test_PricingTier_CriticalShortage"
```

### Run with Debugging

```bash
forge test -vvvv --match-test "test_PricingTier_CriticalShortage"
```

### Generate Coverage

```bash
make coverage
```

### Fuzz Testing

```bash
forge test --match-test "testFuzz"
```

## 🚢 Deployment

### Deploy to Arbitrum Sepolia (Testnet)

```bash
# Load environment variables
source .env

# Deploy with automatic verification
make deploy-sepolia

# Or manually:
forge script script/DeployArbitrumSepolia.s.sol \
    --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
    --broadcast \
    --verify \
    -vvvv
```

### Deploy to Arbitrum One (Mainnet)

```bash
source .env

# ⚠️ WARNING: This is irreversible!
make deploy-mainnet
```

### Manual Verification

```bash
forge verify-contract \
    --chain-id 421614 \
    --num-of-optimizations 200 \
    --compiler-version v0.8.20 \
    0xYourContractAddress \
    src/core/PriceStabilizer.sol:PriceStabilizer \
    --etherscan-api-key $ARBISCAN_API_KEY
```

## 📋 Environment Configuration

Create `.env` from template:

```bash
cp .env.example .env
```

**Required variables:**

```env
# Arbitrum RPC URLs (choose one or use Alchemy)
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_MAINNET_RPC_URL=https://arb1.arbitrum.io/rpc

# Your deployer private key (NEVER share!)
PRIVATE_KEY=0x...

# Arbiscan API key for contract verification
ARBISCAN_API_KEY=...
```

**Optional variables:**

```env
# Alternative RPC providers
ALCHEMY_API_KEY=...
INFURA_API_KEY=...

# Deployment settings
ADMIN_ADDRESS=0x...
```

## 📊 Network Information

### Arbitrum Sepolia (Testnet)

- **Chain ID:** 421614
- **RPC:** https://sepolia-rollup.arbitrum.io/rpc
- **Explorer:** https://sepolia.arbiscan.io
- **Faucet:** https://faucet.quicknode.com/arbitrum/sepolia

### Arbitrum One (Mainnet)

- **Chain ID:** 42161
- **RPC:** https://arb1.arbitrum.io/rpc
- **Explorer:** https://arbiscan.io
- **Bridge:** https://bridge.arbitrum.io

## 🔒 Security Considerations

### Code Audits

- [ ] Internal audit (pending)
- [ ] External audit (planned for mainnet)

### Safety Features

- **Reentrancy guards** on all external functions
- **Access control** for admin-only functions
- **Hard limits** on price adjustments
- **Deterministic pricing** (no random numbers)
- **Event logging** for transparency

### Known Limitations

- MVP doesn't use external price oracles
- No ERC-20 token trading yet
- Rate limiting on price updates (1 hour intervals)

## 🛠️ Development Commands

### Build

```bash
make build          # Build all contracts
forge build -c      # Clean build
```

### Testing

```bash
make test           # Run all tests
make test-verbose   # Verbose output
make test-gas       # With gas report
make coverage       # Coverage analysis
```

### Code Quality

```bash
make format         # Format code
make lint           # Run solhint
make slither        # Security analysis (requires slither)
```

### Local Development

```bash
# Terminal 1: Start local node
make anvil

# Terminal 2: Deploy locally
ARBITRUM_SEPOLIA_RPC_URL=http://127.0.0.1:8545 \
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d6c1f7d02e6c6f9de0 \
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

## 📚 Documentation

- [Pricing Rules](../docs/pricing-model.md)
- [Architecture](../docs/architecture.md)
- [Smart Contract Audit](../docs/SMART_CONTRACTS.md)

## 🔗 Contract Addresses

### Arbitrum Sepolia (Testnet)

| Contract | Address |
|----------|---------|
| RoleManager | TBA |
| PriceStabilizer | TBA |

### Arbitrum One (Mainnet)

| Contract | Address |
|----------|---------|
| RoleManager | TBA |
| PriceStabilizer | TBA |

## 📝 License

MIT License - see [LICENSE](../LICENSE)

## 🤝 Contributing

1. Write tests for new features
2. Ensure all tests pass: `make test`
3. Run coverage: `make coverage`
4. Format code: `make format`
5. Submit PR with description

## 📞 Support

- GitHub Issues: [ETHANI-Labs/issues](https://github.com/ETHANI-Labs/issues)
- Documentation: [/docs](../docs)

## ⚡ Quick Reference

```bash
# Install & setup
curl -L https://foundry.paradigm.xyz | bash && foundryup
make install && cp .env.example .env && nano .env

# Build & test
make build && make test

# Deploy to testnet
source .env && make deploy-sepolia

# Check gas usage
make test-gas

# Coverage report
make coverage
```

---

**ETHANI Smart Contracts** | Built with ❤️ using Foundry | Rule-based pricing for food security
