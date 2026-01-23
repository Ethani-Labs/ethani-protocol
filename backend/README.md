# 🚀 ETHANI Backend API

Rule-based FastAPI backend for ETHANI price stabilization system.

## ✅ Smart Contract Integration (Arbitrum Sepolia)

Backend connects to verified smart contracts on Arbitrum Sepolia testnet:

```python
# Contract Addresses (from backend/app/core/config.py)
CONTRACT_ETHANI_PRICING = "0xc92fd01c122821Eb2C911d16468B20b07E25abC0"
CONTRACT_ETHANI_REGION = "0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143"
CONTRACT_ETHANI_INCENTIVE = "0xE6C246d7Ba92c4d35076C91B686d104ad3118172"
CONTRACT_ETHANI_CORE = "0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4"
CONTRACT_PRICE_ORACLE = "0x139a3036052761341212C7d06488C27fb000a167"

# Network Configuration
ARBITRUM_NETWORK = "sepolia"
ARBITRUM_RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc"
ARBITRUM_CHAIN_ID = 421614
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip/poetry
- .env file configured (see .env.example)

### Setup & Run

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env  # Add database URL, RPC endpoint, contract addresses

# Run development server
./start.sh
# or: python -m uvicorn app.main:app --reload

# API Documentation
# Swagger UI: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc
# OpenAPI Schema: http://localhost:8000/openapi.json
```

## 📚 Key Endpoints

### Health Check
```bash
GET /health
```

### Pricing Engine
```bash
# Calculate price based on supply/demand
POST /api/v1/pricing/calculate
{
  "supply": 100,
  "demand": 150,
  "base_price": 1000
}

# Get latest price
GET /api/v1/pricing/latest

# Price history
GET /api/v1/pricing/history
```

### Supply & Demand (Farmer/Distributor)
```bash
# Add supply
POST /api/v1/supplies/add
{
  "commodity": "rice",
  "quantity": 1000,
  "region": "jakarta"
}

# Get supplies
GET /api/v1/supplies/list
```

### Blockchain Integration
```bash
# Record transaction on chain
POST /api/v1/blockchain/transaction
{
  "supply": 100,
  "demand": 150,
  "calculated_price": 1150
}

# Get current supply/demand ratio
GET /api/v1/blockchain/ratio
```

## 🏗️ Architecture

```
backend/
├── app/
│   ├── main.py           # FastAPI app & routes
│   ├── core/
│   │   └── config.py     # Settings + contract addresses
│   ├── models/           # Pydantic schemas
│   ├── services/         # Business logic
│   ├── blockchain/       # Web3 integration
│   ├── api/              # API endpoints
│   └── db/               # Database
├── tests/
├── requirements.txt
└── start.sh
```

## 🔗 Blockchain Integration

Backend uses Web3.py to interact with smart contracts:

1. **PriceOracle** (Entry point)
   - Receives supply/demand from API
   - Calls EthaniCore to store data
   - Triggers EthaniPricing to calculate

2. **EthaniCore** (Data storage)
   - Records supply/demand updates
   - Maintains price history
   - Transparent on-chain record

3. **EthaniPricing** (Calculation engine)
   - Deterministic ratio-based pricing
   - No AI/ML, fully auditable
   - Rules: shortage +15%, balanced 0%, surplus -10%

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test
pytest tests/test_pricing.py -v
```

## 📖 Documentation

- [BACKEND_SERVICE.md](../docs/BACKEND_SERVICE.md) - Full service guide
- [BACKEND_INTEGRATION.md](../docs/BACKEND_INTEGRATION.md) - Integration details
- [pricing-model.md](../docs/pricing-model.md) - Pricing rules

## 🚨 Environment Variables

See `.env.example` for required variables:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis cache (optional)
- `ARBITRUM_RPC_URL` - Arbitrum Sepolia RPC
- `ORACLE_PRIVATE_KEY` - Deployer's private key for transactions

## 📞 Support

For issues or questions:
1. Check [BACKEND_SERVICE.md](../docs/BACKEND_SERVICE.md)
2. Review contract addresses in [contracts/README.md](../contracts/README.md)
3. See blockchain network details in root [README.md](../README.md)
