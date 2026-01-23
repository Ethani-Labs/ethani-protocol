# ETHANI Pricing Model

## Overview

ETHANI uses a **rule-based, deterministic pricing model** based on supply-demand dynamics. All calculations are transparent, auditable, and explainable.

## Core Formula

```
Final Price = Base Price × Price Multiplier × Seasonal Factor

Where:
  Base Price = Reference market price
  Price Multiplier = Based on supply-demand ratio
  Seasonal Factor = Adjustment for harvest time, holidays (0.5-2.0)
  Ratio = Demand / Supply
```

## Supply-Demand Ratio Tiers

The system categorizes market conditions into four tiers based on the supply-demand ratio:

### Tier 1: Critical Shortage
**Condition:** Ratio > 1.30 (Demand > 130% of Supply)
**Price Change:** +15%
**Purpose:** Encourage emergency production increase
**Example:**
- Supply: 50 units
- Demand: 80 units
- Ratio: 1.60 (critical shortage)
- Base Price: $100
- Final Price: $100 × 1.15 = **$115**

### Tier 2: Shortage
**Condition:** 1.10 < Ratio ≤ 1.30 (Demand > 110% of Supply)
**Price Change:** +8%
**Purpose:** Incentivize supply increase
**Example:**
- Supply: 100 units
- Demand: 120 units
- Ratio: 1.20 (shortage)
- Base Price: $100
- Final Price: $100 × 1.08 = **$108**

### Tier 3: Balanced
**Condition:** 0.80 ≤ Ratio ≤ 1.10
**Price Change:** 0% (baseline)
**Purpose:** Market equilibrium
**Example:**
- Supply: 100 units
- Demand: 95 units
- Ratio: 0.95 (balanced)
- Base Price: $100
- Final Price: $100 × 1.00 = **$100**

### Tier 4: Surplus
**Condition:** Ratio < 0.80 (Demand < 80% of Supply)
**Price Change:** -10%
**Purpose:** Protect consumers from over-supply
**Example:**
- Supply: 200 units
- Demand: 100 units
- Ratio: 0.50 (surplus)
- Base Price: $100
- Final Price: $100 × 0.90 = **$90**

## Hard Limits (Safeguards)

Even with extreme supply-demand ratios, prices cannot move beyond these limits:

### Maximum Increase
- **Limit:** +50% above base price
- **Rationale:** Prevent price shock that harms consumers
- **Trigger:** Extreme shortage with capped adjustment

### Maximum Decrease
- **Limit:** -30% below base price
- **Rationale:** Prevent farmer income collapse
- **Trigger:** Extreme surplus with floored adjustment

**Example with Hard Limit:**
- Ratio: 2.0 (double the critical shortage threshold)
- Multiplier would be: +30% (applies to all ratios > 1.30)
- With limit: +50% (capped)
- Base Price: $100
- Final Price: $100 × 1.50 = **$150** (not higher)

## Seasonal Adjustment

Prices can be adjusted for seasonal factors:

### Common Seasonal Factors
| Season | Factor | Reason |
|--------|--------|--------|
| Harvest time | 0.8 | Abundant supply |
| Post-harvest | 1.0 | Normal supply |
| Peak demand | 1.2 | Holiday season |
| Scarcity season | 1.5 | Off-season |

### Application
```
Final Price = Base Price × Ratio Multiplier × Seasonal Factor

Example:
  Base Price: $100
  Ratio Multiplier: 1.08 (shortage)
  Seasonal Factor: 0.9 (harvest time)
  Final Price: $100 × 1.08 × 0.9 = $97.20
```

## Decision Rules

### Input Validation
```python
if base_price <= 0:
    raise ValueError("Base price must be positive")
if supply < 0:
    raise ValueError("Supply cannot be negative")
if demand < 0:
    raise ValueError("Demand cannot be negative")
if supply == 0 and demand > 0:
    raise ValueError("Cannot have demand with zero supply")
```

### Zero Supply Handling
```
If supply = 0:
  Use base price (no ratio-based adjustment)
  Reason: Cannot calculate ratio with zero denominator
  Status: Emergency condition, requires intervention
```

### Ratio Calculation
```python
ratio = demand / supply
multiplier = get_multiplier(ratio)
calculated_price = base_price * multiplier * season_factor
final_price = apply_hard_limits(calculated_price, base_price)
```

## Transparency & Auditability

Every price calculation includes:

1. **Input Values**
   - Supply quantity
   - Demand quantity
   - Base price
   - Seasonal factor

2. **Intermediate Calculations**
   - Ratio value
   - Ratio tier determination
   - Multiplier selection
   - Hard limit checks

3. **Final Result**
   - Suggested price
   - Explanation (reason for price)
   - Whether price was capped
   - Calculation breakdown

### Example Output
```json
{
  "inputs": {
    "supply": 100,
    "demand": 150,
    "base_price": 100,
    "season_factor": 1.0
  },
  "calculations": {
    "ratio": 1.50,
    "tier": "Critical Shortage",
    "multiplier": 1.15,
    "calculated_price": 115,
    "is_capped": false
  },
  "result": {
    "suggested_price": 115,
    "reason": "Critical shortage (ratio > 1.30) - price +15%",
    "confidence": "High (rule-based)"
  }
}
```

## Implementation Across Layers

### Backend (Python)
- `pricing.py` contains the pricing logic
- Fully deterministic
- Tested with 100+ scenarios
- Produces JSON output with reasoning

### Smart Contracts (Solidity)
- `EthaniPricing.sol` implements identical logic
- Gas-efficient calculations
- Records price decisions on-chain
- Emits events for transparency

### Frontend (TypeScript)
- Calls backend API for calculations
- Can also verify against smart contracts
- Displays reasoning to users
- Allows users to record prices on-chain

## Economic Impact Analysis

### For Farmers
- **Shortage Protection:** Prices increase to reward production
- **Surplus Protection:** Prices don't fall below -30%
- **Predictable:** Rules are known in advance
- **Fair:** Same calculation for all

### For Consumers
- **Price Stability:** Hard limits prevent shocks
- **Transparency:** Can understand price movements
- **Protection:** Prices don't skyrocket
- **Access:** Affordable food during surplus

### For Communities
- **Market Stability:** Reduces price volatility
- **Production Incentives:** Encourages local supply
- **Trust:** Transparent, auditable system
- **Data:** Creates market intelligence

## Limitations & Caveats

### What This Model Does NOT Do
1. **Predict future prices** - Only current fair price
2. **Account for quality** - All units treated equally
3. **Handle external shocks** - War, disease, natural disasters
4. **Optimize globally** - Regional markets are separate
5. **Replace human judgment** - Rules are tools, not laws

### When Intervention May Be Needed
1. **Supply = 0** - No price calculation possible
2. **Extreme ratio changes** - More than 100% in one day
3. **System errors** - Backend/contract mismatch
4. **Policy changes** - Base price updates
5. **Market anomalies** - Data validation failures

## Future Improvements

### Phase 2
- Multi-product pricing (wheat, rice, corn separately)
- Cross-regional arbitrage prevention
- Farmer group discounts
- Seasonal base price adjustments

### Phase 3
- Storage capacity considerations
- Transport cost factors
- Quality grading system
- Long-term contracts

### Phase 4
- Supply chain integration
- Energy waste-to-fuel credits
- Carbon pricing
- Sustainability premiums

## Validation & Testing

### Unit Tests
- Each tier tested independently
- Edge case boundaries verified
- Hard limit enforcement tested
- Seasonal factor application tested

### Integration Tests
- Full calculation flow tested
- Backend ↔ Contract parity verified
- API response validation
- Error handling tested

### Scenario Testing
- 100+ real market scenarios
- Extreme ratio conditions
- Seasonal variations
- Historical data validation

## References

### Mathematical Foundation
- Supply-demand equilibrium principles
- Price elasticity concepts
- Market microeconomics

### Implementation
- Python: `backend/app/pricing.py`
- Solidity: `contracts/src/EthaniPricing.sol`
- Frontend: `frontend/lib/api.ts`

### Testing
- Backend tests: `backend/tests/test_pricing.py`
- Contract tests: `contracts/test/EthaniPricing.t.sol`
