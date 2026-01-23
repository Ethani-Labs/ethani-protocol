# ETHANI Project Structure

Complete overview of the reorganized project layout.

## Directory Tree

```
ethani-labs/
│
├── README.md                          # Main project documentation
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore patterns
├── .env.example                       # Environment variables template
├── TOOLS.md                           # Tools & setup guide
├── QUICK_REFERENCE.txt               # Commands cheatsheet
├── SETUP_VERIFICATION.txt            # Setup verification checklist
│
├── docs/                              # Project Documentation
│   ├── vision.md                     # Project vision & values
│   ├── architecture.md               # System architecture
│   ├── pricing-model.md              # Pricing formula & rules
│   └── roadmap.md                    # Development roadmap
│
├── contracts/                         # Smart Contracts (Foundry)
│   ├── foundry.toml                  # Foundry configuration
│   ├── package.json                  # npm dependencies
│   ├── src/
│   │   ├── EthaniPricing.sol        # Price calculation contract
│   │   ├── EthaniRegion.sol         # Regional data contract
│   │   └── EthaniIncentive.sol      # Incentive contract (future)
│   ├── script/
│   │   └── DeployEthani.s.sol       # Deployment script
│   └── test/
│       └── EthaniPricing.t.sol      # Contract tests
│
├── backend/                           # FastAPI Backend
│   ├── start.sh                      # Startup script
│   ├── requirements.txt              # Python dependencies
│   ├── README.md                     # Backend documentation
│   └── app/
│       ├── main.py                  # FastAPI application
│       ├── pricing.py               # Pricing logic (CORE)
│       ├── models.py                # Pydantic models
│       └── config.py                # Configuration
│
├── frontend/                          # Next.js Frontend
│   ├── package.json                  # Next.js config
│   ├── README.md                     # Frontend documentation
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── PriceCard.tsx            # Price calculator component
│   │   └── [add more components]
│   └── lib/
│       └── api.ts                   # Backend API client
│
└── .github/
    ├── workflows/
    │   └── test.yml                 # CI/CD pipeline
    └── copilot-instructions.md      # GitHub Copilot guide
```

## What's New

### 📁 Reorganized Backend
- **Before:** `main.py`, `pricing.py` in root
- **After:** Structured in `app/` folder with proper modules
- **Added:** `config.py` for configuration, `models.py` for data models
- **Updated:** Imports use relative paths (`from .pricing import ...`)

### 📦 Migrated to Foundry
- **Before:** Hardhat configuration
- **After:** Foundry-based smart contracts
- **Added:** `foundry.toml` configuration
- **Added:** Foundry test format (`.t.sol`)
- **Added:** Deployment script (`script/DeployEthani.s.sol`)

### 🎨 Improved Frontend
- **Added:** `components/` folder for React components
- **Added:** `lib/api.ts` for API client
- **Added:** `layout.tsx` for root layout
- **Added:** Tailwind CSS classes in components

### 📚 Complete Documentation
- **docs/vision.md** - Mission, values, long-term goals
- **docs/architecture.md** - System design, data flow, deployment
- **docs/pricing-model.md** - Formula, tiers, examples, validation
- **docs/roadmap.md** - Phases, milestones, features, funding

### ⚙️ Configuration Files
- **LICENSE** - MIT License
- **.gitignore** - Comprehensive ignore patterns
- **.env.example** - Environment variable template
- **.github/workflows/test.yml** - CI/CD pipeline

---

## How to Navigate

### For Pricing Logic
→ `backend/app/pricing.py` - Core deterministic calculations

### For Backend API
→ `backend/app/main.py` - All REST endpoints

### For Smart Contracts
→ `contracts/src/EthaniPricing.sol` - On-chain pricing

### For Frontend Components
→ `frontend/components/PriceCard.tsx` - Price calculator UI

### For Architecture
→ `docs/architecture.md` - Full system design

### For Pricing Rules
→ `docs/pricing-model.md` - Complete formula documentation

---

## Development Workflow

### Backend Changes
```bash
cd backend
# Make changes in app/
# Test locally: ./start.sh
# Run tests: pytest
```

### Frontend Changes
```bash
cd frontend
# Make changes in components/ or app/
# Run dev server: npm run dev
# Tests: npm test
```

### Smart Contract Changes
```bash
cd contracts
# Make changes in src/
# Compile: forge build
# Test: forge test -vvv
```

### Documentation Changes
```bash
# Edit files in docs/
# Update README.md
# Update roadmap.md
```

---

## Deployment Paths

### Backend
```
app/ structure
→ Docker container
→ Railway/Render/Heroku
```

### Frontend
```
app/ + components/ structure
→ Next.js build
→ Vercel/Netlify
```

### Smart Contracts
```
src/ structure
→ forge build
→ Mantle testnet/mainnet
```

---

## CI/CD Pipeline

The `.github/workflows/test.yml` runs:
1. ✅ Backend tests (pytest)
2. ✅ Frontend tests (npm test)
3. ✅ Smart contract tests (forge test)
4. ✅ Code quality checks
5. ✅ Security scanning
6. ✅ Documentation validation

---

## Key Files

| File | Purpose | Location |
|------|---------|----------|
| Pricing Logic | Deterministic calculations | `backend/app/pricing.py` |
| API Server | REST endpoints | `backend/app/main.py` |
| Data Models | Request/response validation | `backend/app/models.py` |
| Configuration | Environment & settings | `backend/app/config.py` |
| Smart Contracts | On-chain logic | `contracts/src/` |
| Frontend Components | React UI | `frontend/components/` |
| API Client | Backend communication | `frontend/lib/api.ts` |
| System Architecture | Design & flow | `docs/architecture.md` |
| Pricing Model | Formula & rules | `docs/pricing-model.md` |
| Development Guide | Getting started | `README.md` |

---

## Benefits of This Structure

✅ **Scalable** - Easy to add new modules
✅ **Organized** - Clear separation of concerns
✅ **Maintainable** - Proper folder hierarchy
✅ **Professional** - Industry-standard layout
✅ **Testable** - Clear test locations
✅ **Documented** - Comprehensive guides
✅ **CI/CD Ready** - Automated testing
✅ **Production Ready** - Configuration management

---

## Next Steps

1. **Backend:** Test the new structure with `./start.sh`
2. **Frontend:** Build new components using `PriceCard.tsx` as template
3. **Contracts:** Deploy using `script/DeployEthani.s.sol`
4. **Documentation:** Add specific implementation guides
5. **CI/CD:** Monitor GitHub Actions for test results

---

**Updated:** January 1, 2026
**Version:** 2.0 (Restructured)
