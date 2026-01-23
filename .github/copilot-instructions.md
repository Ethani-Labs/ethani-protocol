# ETHANI Copilot Instructions

GitHub Copilot instructions for assisting with ETHANI development.

## Project Context

ETHANI is a decentralized, rule-based food price stabilization system.

**Key Principles:**
1. NO AI/ML for decision-making
2. All logic must be deterministic and transparent
3. Rule-based supply-demand formulas
4. Blockchain for transparency, not trading
5. Simple, auditable code

## Core Rules

### Pricing Tiers
- Ratio > 1.30: +15% (Critical Shortage)
- Ratio > 1.10: +8% (Shortage)
- Ratio 0.80-1.10: 0% (Balanced)
- Ratio < 0.80: -10% (Surplus)

### Hard Limits
- Max increase: +50%
- Max decrease: -30%

## Code Style Guidelines

### Python (Backend)
```python
# Deterministic, no AI
def calculate_price(supply, demand, base_price):
    """Always document the rule being applied"""
    if supply <= 0:
        return base_price
    
    ratio = demand / supply
    
    # Apply rule-based multiplier
    if ratio > 1.30:
        multiplier = 1.15  # +15%
    # ... etc
    
    # Always return with explanation
    return {
        'price': calculated_price,
        'multiplier': multiplier,
        'reason': "Critical shortage - price +15%"
    }
```

### Solidity (Smart Contracts)
```solidity
// Same logic as backend for consistency
function calculatePrice(
    uint256 supply,
    uint256 demand,
    uint256 basePrice
) public pure returns (uint256) {
    // No external calls
    // No randomness
    // Fully deterministic
    // Same calculation as backend
}
```

### TypeScript (Frontend)
```typescript
// Call backend API, don't duplicate logic
async function getPrice(supply: number, demand: number, basePrice: number) {
  const response = await fetch('/api/price?...');
  return response.json();
}
```

## File Structure

```
ethani-labs/
├── docs/                    # Documentation
├── contracts/               # Smart Contracts (Foundry)
├── backend/                 # FastAPI Backend
│   └── app/
│       ├── main.py         # FastAPI app
│       ├── pricing.py      # Pricing logic (CORE)
│       ├── models.py       # Pydantic models
│       └── config.py       # Configuration
├── frontend/                # Next.js Frontend
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   └── lib/                # Utilities (api.ts = backend client)
└── .github/                # CI/CD workflows
```

## When Assisting

### Do:
- ✅ Ask for clarification on requirements
- ✅ Suggest rule-based approaches
- ✅ Point out when AI/ML might be tempting but unnecessary
- ✅ Emphasize transparency and auditability
- ✅ Check for consistency between backend and contracts
- ✅ Suggest tests for edge cases
- ✅ Add clear documentation

### Don't:
- ❌ Suggest ML models for pricing
- ❌ Use randomness or unpredictability
- ❌ Create complex black-box logic
- ❌ Introduce external dependencies without discussion
- ❌ Skip documentation
- ❌ Violate the "no AI for decisions" principle

## Common Tasks

### Adding a New Endpoint
1. Create handler in `backend/app/main.py`
2. Add Pydantic model in `backend/app/models.py` if needed
3. Implement logic in `backend/app/pricing.py` or new module
4. Add tests in `backend/tests/`
5. Update frontend client in `frontend/lib/api.ts`
6. Update documentation

### Adding a New Smart Contract
1. Write in `contracts/src/`
2. Match backend logic exactly
3. Write tests in `contracts/test/` (Foundry format)
4. Run `forge test`
5. Document in comments
6. Update `docs/architecture.md` if needed

### Deploying Changes
1. Test locally (backend, contracts, frontend)
2. Run full test suite
3. Update documentation
4. Create PR with clear description
5. Get code review
6. Deploy to testnet first
7. Monitor for issues

## Testing

### Backend (Python)
```bash
cd backend
pip install pytest
pytest
```

### Smart Contracts (Solidity)
```bash
cd contracts
forge test -vvv
```

### Frontend (TypeScript)
```bash
cd frontend
npm test
```

## Documentation Standards

- Every function should explain the rule it applies
- Examples should be concrete (supply=100, demand=150, etc.)
- Document edge cases
- Explain why (not just what)
- Keep it simple - write for a farmer to understand

## Review Checklist

- [ ] Is this rule-based or AI-based?
- [ ] Is it deterministic?
- [ ] Is it documented?
- [ ] Is it tested?
- [ ] Does it match the backend/contract?
- [ ] Does it explain why clearly?
- [ ] Could it be simpler?
- [ ] Will a farmer understand it?
