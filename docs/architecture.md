# ETHANI System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Web UI)                        │
│  Next.js 14 | React 18 | TypeScript                         │
│  • Price Calculator                                         │
│  • Regional Dashboard                                       │
│  • Farmer Registry                                          │
│  • Price History                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (HTTP)
┌──────────────────────▼──────────────────────────────────────┐
│                   Backend API (FastAPI)                     │
│  Python 3.9 | FastAPI 0.104.1 | Uvicorn                    │
│  • Price Calculation Engine                                 │
│  • Supply-Demand Ratio Analysis                             │
│  • Regional Data Management                                 │
│  • Historical Price Tracking                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ Web3 (ethers.js)
┌──────────────────────▼──────────────────────────────────────┐
│              Smart Contracts (Blockchain)                   │
│  Solidity ^0.8.20 | Mantle Testnet                          │
│  • EthaniPricing.sol    - Fair price calculation           │
│  • EthaniRegion.sol     - Regional data                     │
│  • EthaniIncentive.sol  - Farmer incentives                │
│  • On-Chain History                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼────────┐         ┌─────────▼──────┐
   │   Local     │         │   Blockchain   │
   │   Storage   │         │   Mantle Net   │
   └─────────────┘         └────────────────┘
```

## Component Details

### Frontend (Next.js)

**Purpose:** User interface for farmers, traders, and officials

**Key Components:**
- `page.tsx` - Main dashboard
- `layout.tsx` - Root layout with navigation
- `PriceCard.tsx` - Price display component
- `api.ts` - Backend API client

**Features:**
- Real-time price display
- Regional price comparison
- Historical price charts
- Farmer registration form
- Supply/demand input interface

**Technology:**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS (optional)
- ethers.js for blockchain interaction

### Backend API (FastAPI)

**Purpose:** Core pricing engine and data management

**Key Modules:**
- `main.py` - FastAPI application and endpoints
- `pricing.py` - Deterministic pricing logic
- `models.py` - Data models (Pydantic)
- `config.py` - Configuration management

**Endpoints:**
```
GET  /health              - Health check
GET  /price               - Calculate price
GET  /ratio               - Supply-demand analysis
POST /price-detailed      - Full breakdown
GET  /rules               - Pricing rules
```

**Architecture:**
- RESTful API design
- Input validation (Pydantic)
- Error handling
- Logging
- CORS for frontend

### Smart Contracts (Solidity)

**Purpose:** On-chain record of prices and incentives

**Contracts:**
1. **EthaniPricing.sol**
   - Pure pricing calculation logic
   - Matches backend implementation
   - Immutable rules
   - Price history recording

2. **EthaniRegion.sol**
   - Regional data management
   - Supply/demand records
   - Farmer registry
   - Regional governance

3. **EthaniIncentive.sol**
   - Incentive distribution
   - Reward calculation
   - Farmer rewards
   - Producer bonuses

**Features:**
- No randomness (fully deterministic)
- Transparent and auditable
- Hard-coded rules
- Access control
- Event logging

## Data Flow

### Scenario: Calculate Fair Price

```
1. Frontend
   User inputs: supply=100, demand=150, base_price=100
   └─> HTTP POST /price-detailed

2. Backend
   • Validates inputs
   • Calculates ratio: 150/100 = 1.5
   • Determines tier: Critical Shortage (+15%)
   • Applies hard limits
   • Returns: price=115, reasoning
   └─> HTTP Response (JSON)

3. Frontend
   • Displays calculated price
   • Shows reasoning
   • Offers to record on-chain
   └─> User clicks "Record"

4. Frontend → Blockchain
   • Call EthaniPricing.recordPrice()
   • Sends: supply, demand, base_price
   • Contract calculates price (same logic)
   • Stores in history
   └─> Transaction confirmed

5. On-Chain
   • Event emitted
   • Price recorded permanently
   • History updated
```

## Deployment Architecture

### Development
```
localhost:8000 (Backend)
localhost:3000 (Frontend)
Hardhat Node (Local blockchain)
```

### Testnet (Current)
```
https://api.ethani.local (Backend)
https://ethani.local (Frontend)
Mantle Testnet (Blockchain)
```

### Production (Future)
```
https://api.ethani.farm (Backend)
https://app.ethani.farm (Frontend)
Mantle Mainnet (Blockchain)
Docker containers
Kubernetes orchestration
```

## Database & Storage

### Backend (Python)
- In-memory storage (development)
- PostgreSQL (production-ready)
- Price history logging
- Regional data cache

### Blockchain
- Smart contract state
- Price history (immutable)
- Farmer records
- Incentive tracking

### Frontend
- Browser localStorage
- Session management
- User preferences

## Security Considerations

### Backend
- Input validation (Pydantic)
- Rate limiting
- HTTPS only (production)
- API key authentication (future)
- CORS configuration

### Smart Contracts
- No external calls (no reentrancy risk)
- Access control (onlyOwner patterns)
- No randomness (deterministic)
- Audit-ready code

### Frontend
- No sensitive data in localStorage
- HTTPS required
- Content Security Policy
- Dependency scanning

## Scalability

### Backend
- Stateless design (can scale horizontally)
- Caching for frequent queries
- Async processing (Celery if needed)
- Database indexing

### Smart Contracts
- Efficient storage (no unnecessary data)
- Batch operations where possible
- Off-chain computation (pricing)
- On-chain verification (records)

### Frontend
- Static site generation (Next.js)
- CDN caching
- Image optimization
- Code splitting

## Integration Points

### External Data Sources
- Supply/demand data (APIs or manual input)
- Market data (optional)
- Weather (optional, for seasonal adjustment)
- Farmer registrations (form or CSV)

### External Systems
- Bank APIs (payment, if needed)
- Government portals (future)
- Logistics systems (future)
- Energy systems (circular economy)

## Monitoring & Observability

### Metrics
- API response times
- Price calculation accuracy
- Contract interaction success rate
- User engagement

### Logging
- Backend: Structured JSON logs
- Smart contracts: Event logs
- Frontend: Error tracking

### Alerts
- API downtime
- Price calculation anomalies
- Contract execution failures
- Security incidents

## Testing Strategy

### Backend
- Unit tests (pricing logic)
- Integration tests (API endpoints)
- Validation tests (input edge cases)
- Load tests (stress testing)

### Smart Contracts
- Unit tests (Foundry)
- Integration tests (mainnet fork)
- Formal verification (future)
- Audit (before mainnet)

### Frontend
- Component tests (React Testing Library)
- E2E tests (Playwright)
- Visual regression tests
- Accessibility tests

## CI/CD Pipeline

```
Git Push
  ├─> Run Tests (Backend)
  ├─> Run Tests (Smart Contracts)
  ├─> Run Tests (Frontend)
  ├─> Lint & Format Check
  ├─> Security Scan
  └─> Build Docker Image
       └─> Deploy to Testnet
            └─> Run E2E Tests
                 └─> Notify Team
```
