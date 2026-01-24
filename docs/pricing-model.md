# ETHANI Pricing Model

## Purpose

The ETHANI pricing model is a **deterministic, rule-based system** for stabilizing food prices in regional markets. It calculates a fair price based on current supply-demand conditions using transparent, auditable rules that apply uniformly across regions.

**Key principle:** Same inputs always produce the same output. No prediction, no discretion, no external data feeds.

The model is deployed across three layers:
- **Stylus (Rust/WASM):** Deterministic price calculation
- **Solidity (Solidity/EVM):** Result enforcement and safety limits
- **Local Python:** Offline verification and fallback

---

## Deterministic Design Principles

### 1. No External Dependencies

The pricing calculation depends **only** on:
- Supply (regional commodity quantity)
- Demand (regional commodity consumption)
- Base Price (regional commodity reference price)

It does **not** depend on:
- Live market feeds
- Price predictions
- Machine learning models
- External API calls
- Real-time oracle data
- Sentiment analysis
- Historical volatility

**Why this matters:** A system with external dependencies can be manipulated. ETHANI's pricing is determined entirely by local, verifiable data.

### 2. Determinism Guarantee

The same calculation runs identically in three places:
- **Stylus (WASM):** Primary engine on Arbitrum
- **Solidity (EVM):** Fallback layer, same logic
- **Python:** Offline verification, identical rules

**Verification:** Anyone can run the calculation offline and reproduce the on-chain result.

```
Input: supply=100, demand=150, basePrice=10000
Run on Stylus:   Price = 11500
Run on Solidity: Price = 11500
Run on Python:   Price = 11500
→ Same result, always
```

### 3. Integer Arithmetic Only

All calculations use integers (no floating-point):
- Prevents precision errors
- Makes calculations verifiable by hand
- Eliminates rounding ambiguity
- Makes bytecode deterministic across platforms

```
Ratio calculation: (demand × 1000) / supply  [basis points]
Price calculation: (base_price × multiplier) / 1000
```

### 4. Transparent Rule Application

The calculation is a sequence of explicit rules:
1. Validate inputs (supply > 0, base price > 0)
2. Calculate ratio (demand / supply)
3. Determine tier (which rule applies)
4. Apply multiplier (price adjustment)
5. Enforce hard limits (absolute min/max)
6. Return result with explanation

No hidden parameters. No approximations. No "learning."

---

## Supply-Demand Ratio

### Calculation

```
Ratio = (Demand × 1000) / Supply

Example:
  Demand: 150 units
  Supply: 100 units
  Ratio: (150 × 1000) / 100 = 1500 basis points
  → Represents 150% (demand is 150% of supply)
```

The ratio is expressed in basis points (1000 = 100%, or 1x) for precision without floating-point arithmetic.

### Interpretation

| Ratio Range | Meaning | Implication |
|---|---|---|
| < 800 | Demand < 80% of supply | Surplus (too much food) |
| 800–1100 | Demand 80–110% of supply | Balanced (healthy equilibrium) |
| 1100–1300 | Demand 110–130% of supply | Shortage (not enough food) |
| > 1300 | Demand > 130% of supply | Critical shortage (severe scarcity) |

**These are not market signals.** These are structural conditions in the food market that require different policy responses.

---

## Pricing Tiers (Policy Bands)

ETHANI defines four pricing tiers corresponding to different supply-demand conditions. Each tier applies a price multiplier to encourage or discourage market behavior.

### Tier 1: Critical Shortage

**Condition:** Ratio ≥ 1300 (demand ≥ 130% of supply)  
**Multiplier:** +15%  
**Policy Goal:** Encourage urgent production increase; signal scarcity to all market participants

**Mechanism:**
```
Base Price: 10,000
Ratio: 1500 (150% of supply)
Multiplier: 1150 (15% increase)
→ Final Price: 11,500
```

**Effect:**
- Farmers are incentivized to produce emergency supply
- Consumers know supply is genuinely scarce
- Price increase is proportional to scarcity severity (all critical shortages get +15%)

**Real-world example:**
- Normal supply: 100,000 bags of rice
- Normal demand: 100,000 bags
- A harvest failure reduces supply to 60,000 bags
- Demand remains 100,000 bags
- Ratio: 1667 (167% of supply)
- → Triggers critical shortage tier → +15% price
- New price: $100 → $115
- Signal: Supply is severely limited; increase production or accept higher cost

### Tier 2: Shortage

**Condition:** 1100 ≤ Ratio < 1300 (110% ≤ demand < 130% of supply)  
**Multiplier:** +8%  
**Policy Goal:** Encourage moderate production increase; signal modest scarcity

**Mechanism:**
```
Base Price: 10,000
Ratio: 1200 (120% of supply)
Multiplier: 1080 (8% increase)
→ Final Price: 10,800
```

**Effect:**
- Farmers are incentivized to increase supply gradually
- Consumers adjust behavior (use less, source alternatives)
- Price increase is moderate, proportional to shortage severity

**Real-world example:**
- Supply: 90,000 bags
- Demand: 105,000 bags
- Ratio: 1167 (116.7% of supply)
- → Triggers shortage tier → +8% price
- New price: $100 → $108

### Tier 3: Balanced

**Condition:** 800 ≤ Ratio < 1100 (80% ≤ demand < 110% of supply)  
**Multiplier:** 0% (baseline)  
**Policy Goal:** Market equilibrium; no price signal needed

**Mechanism:**
```
Base Price: 10,000
Ratio: 1000 (100% of supply, perfect balance)
Multiplier: 1000 (0% change)
→ Final Price: 10,000
```

**Effect:**
- Price remains at baseline
- No artificial incentive to increase or decrease supply
- Market is in natural equilibrium

**Real-world example:**
- Supply: 100,000 bags
- Demand: 95,000 bags
- Ratio: 950 (95% of supply)
- → Triggers balanced tier → 0% change
- Price remains: $100

### Tier 4: Surplus

**Condition:** Ratio < 800 (demand < 80% of supply)  
**Multiplier:** -10%  
**Policy Goal:** Protect consumers from price collapse; signal over-production

**Mechanism:**
```
Base Price: 10,000
Ratio: 600 (60% of supply)
Multiplier: 900 (10% decrease)
→ Final Price: 9,000
```

**Effect:**
- Farmers cannot collapse entire income due to over-supply
- Consumers benefit from lower prices during abundance
- Price decrease is proportional to surplus severity (all surpluses get -10%)

**Real-world example:**
- Supply: 150,000 bags
- Demand: 100,000 bags
- Ratio: 667 (66.7% of supply)
- → Triggers surplus tier → -10% price
- New price: $100 → $90

---

## Safety Limits (Hard Constraints)

Even with extreme supply-demand conditions, prices cannot exceed these absolute bounds. Safety limits protect food security by preventing price shocks that would harm consumers or bankrupt farmers.

### Maximum Increase: +50%

**Rule:** Price cannot exceed base price × 1.50  
**Rationale:** Extreme shortage response is capped to prevent humanitarian crisis

**Trigger:** Ratios above 2.0× (demand double supply) still result in +50%, not higher

```
Example 1: Severe critical shortage
  Supply: 50 units
  Demand: 200 units (400% of supply)
  Ratio: 4000 (would suggest +1500% without limit)
  Hard Limit Applied: +50% maximum
  Base Price: $100
  Final Price: $150 (not higher)
```

**Rationale:** At extreme scarcity, additional price increases don't increase supply (farming takes time). Allowing unlimited price increases only harms consumers without helping farmers. The +50% is large enough to signal critical shortage while preventing humanitarian crisis.

### Maximum Decrease: -30%

**Rule:** Price cannot fall below base price × 0.70  
**Rationale:** Farmer income floor; prevents income collapse during surplus

**Trigger:** Ratios below 0.3× (demand one-third of supply) still result in -30%, not lower

```
Example 2: Severe surplus
  Supply: 500 units
  Demand: 50 units (10% of supply)
  Ratio: 100 (would suggest -90% without limit)
  Hard Limit Applied: -30% maximum decrease
  Base Price: $100
  Final Price: $70 (not lower)
```

**Rationale:** Farmers cannot survive if prices fall more than 30% during surplus. Without this floor, each surplus season would bankrupt producers, reducing future supply. The -30% allows market adjustment while protecting farmer viability.

### Application Sequence

```
1. Calculate multiplier from ratio
2. Apply multiplier to base price
3. Check against hard limits
4. Return bounded price

Example:
  Base: $100
  Ratio: 2000 (would give +100%)
  Raw multiplier: 1150 (critical shortage tier)
  Raw price: $115
  Check: $115 < $150 (upper bound) ✓
  Check: $115 > $70 (lower bound) ✓
  Final: $115
```

---

## Regional Adjustments (Structural Factors)

Regional adjustments modify the base price to reflect structural differences in food costs, not live market conditions.

### Types of Regional Adjustments

Regional adjustments are **structural, not dynamic.** They reflect permanent features of a region's food system, not real-time market movements.

#### 1. Transportation Cost Factor

Different regions have different costs to deliver food.

```
Urban region (good infrastructure):     Base × 1.0  (no adjustment)
Rural region (poor roads):               Base × 1.2  (+20% transport cost)
Remote island region (air freight):      Base × 1.5  (+50% transport cost)
```

**These are set once per region and change only when infrastructure improves.**

#### 2. Production Cost Factor

Different regions have different production costs.

```
Fertile plains (low cost):               Base × 0.9  (-10% from natural advantage)
Marginal land (high cost):               Base × 1.1  (+10% higher cost)
Irrigated valley (high input cost):      Base × 1.3  (+30% higher cost)
```

**These change only when climate, resources, or technology changes—not every day.**

#### 3. Seasonal Adjustment

Some regions have strong seasonal production patterns.

```
During harvest month:                    Base × 0.8  (abundant local supply)
Post-harvest, pre-next-harvest:          Base × 1.0  (normal supply)
Off-season (importing):                  Base × 1.3  (high cost imports)
```

**Applied based on calendar date, not market price.**

### How Adjustments Work with Tiers

Regional adjustments are **applied once to the base price**, then tiers are applied to that adjusted base.

```
Regional Base Price = Reference Price × Regional Factor
Applied Price = Regional Base Price × Tier Multiplier

Example:
  Reference price: $100
  Regional factor: 1.2 (20% higher transportation)
  Regional base: $100 × 1.2 = $120
  
  Supply: 100, Demand: 150 (critical shortage)
  Tier multiplier: 1.15 (+15%)
  Final price: $120 × 1.15 = $138
```

**Important:** Regional adjustments are **not live feed data.** They are structural policy parameters set by regional governance councils, updated quarterly or annually—not in real-time response to market conditions.

---

## Execution Flow (Stylus + Solidity)

### Data Flow

```
Regional Data Input
  ↓
Stylus Calculation Engine (WASM)
  ├─ Validates inputs
  ├─ Calculates ratio
  ├─ Determines tier
  ├─ Applies multiplier
  └─ Enforces hard limits
  ↓
Return Price (fast, cheap)
  ↓
Solidity Enforcement Layer
  ├─ Records result on-chain
  ├─ Emits event for audit trail
  ├─ Stores for historical analysis
  └─ Enables fallback if needed
  ↓
Result Published to Frontend
  └─ Display with full explanation
```

### Layer 1: Stylus (Deterministic Computation)

**Engine:** Rust/WASM, running on Arbitrum  
**Function:** Calculate price deterministically  
**Cost:** ~2,500 gas ($0.01)  
**Speed:** 1-2 seconds

**Calculation (pseudocode):**
```rust
fn calculate_price(
    supply: u128,
    demand: u128,
    base_price: u128,
    regional_factor: u128,
) -> (u128, String, String) {
    // Validate
    if supply == 0 {
        return (base_price, "Zero supply - emergency", "ERROR");
    }
    
    // Calculate ratio
    let ratio = (demand * 1000) / supply;
    
    // Determine tier
    let multiplier = match ratio {
        r if r >= 1300 => 1150,  // +15%
        r if r >= 1100 => 1080,  // +8%
        r if r < 800   => 900,   // -10%
        _              => 1000,  // 0%
    };
    
    // Calculate price
    let regional_base = (base_price * regional_factor) / 1000;
    let mut final_price = (regional_base * multiplier) / 1000;
    
    // Apply hard limits
    let max = (base_price * 1500) / 1000;  // +50%
    let min = (base_price * 700) / 1000;   // -30%
    if final_price > max { final_price = max; }
    if final_price < min { final_price = min; }
    
    (final_price, tier_name, explanation)
}
```

**Why Stylus:**
- Deterministic (no floating-point errors)
- Fast (10x faster than Solidity)
- Cheap (90% cheaper gas)
- Auditable (WASM bytecode queryable on-chain)

### Layer 2: Solidity (Enforcement & Governance)

**Engine:** EVM, running on Arbitrum  
**Function:** Record pricing result, enforce limits, provide fallback  
**Cost:** ~25,000 gas ($0.25) if Stylus fails  
**Speed:** 10-30 seconds (fallback only)

**Enforcement logic:**
```solidity
function enforcePrice(
    uint256 stylusPrice,
    uint256 basePrice,
    uint256 supplyDemandRatio
) external view returns (uint256) {
    // Hard limit check
    uint256 maxPrice = (basePrice * 150) / 100;
    uint256 minPrice = (basePrice * 70) / 100;
    
    require(stylusPrice >= minPrice, "Price below minimum");
    require(stylusPrice <= maxPrice, "Price above maximum");
    
    // Record on-chain
    emit PricingApplied(stylusPrice, supplyDemandRatio, block.timestamp);
    
    return stylusPrice;
}
```

**Why Solidity fallback:**
- Verifies Stylus result against hard limits
- Records decision on-chain for audit trail
- Provides fallback if Stylus unavailable
- Enables governance override if policy changes

### Layer 3: Python (Offline Verification)

**Engine:** CPython, runs on backend server  
**Function:** Offline calculation, verification, audit trail

**Verification process:**
```python
def verify_price_calculation(
    supply, demand, base_price, regional_factor
):
    """
    Run identical calculation to verify Stylus result.
    Can be run offline by anyone with the data.
    """
    ratio = (demand * 1000) // supply
    
    if ratio >= 1300:
        multiplier = 1150
    elif ratio >= 1100:
        multiplier = 1080
    elif ratio < 800:
        multiplier = 900
    else:
        multiplier = 1000
    
    regional_base = (base_price * regional_factor) // 1000
    final_price = (regional_base * multiplier) // 1000
    
    # Hard limits
    max_price = (base_price * 150) // 100
    min_price = (base_price * 70) // 100
    
    final_price = max(min(final_price, max_price), min_price)
    return final_price
```

**Why Python:**
- Same code as backend
- Fully transparent (open source)
- Easily auditable by anyone
- Offline-reproducible (no dependencies)

### Fallback Chain

```
Request for Price
  ↓
Try Stylus (fast, cheap)
  ├─ Success? Return result
  └─ Failure? ↓
    Try Solidity (slow, expensive)
      ├─ Success? Return result
      └─ Failure? ↓
        Use Python fallback (backend)
          └─ Return with explanation
```

---

## Example: Full Calculation

### Inputs

```
Region: East Africa (Arbitrum Orbit pilot)
Commodity: Rice
Date: 2026-01-25

Current Data:
  Supply: 100,000 bags
  Demand: 150,000 bags
  Reference Price: 10,000 (smallest denomination)
  Regional Factor: 1.1 (+10% transportation)
```

### Step 1: Regional Base Price

```
Regional Base = Reference × Regional Factor
               = 10,000 × 1.1 / 1000
               = 11,000
```

### Step 2: Calculate Ratio

```
Ratio = (Demand × 1000) / Supply
      = (150,000 × 1000) / 100,000
      = 1,500 basis points
      = 150% (demand is 150% of supply)
```

### Step 3: Determine Tier

```
Ratio 1,500 ≥ 1,300 → Critical Shortage Tier
Multiplier: 1.15 (+15%)
```

### Step 4: Apply Multiplier

```
Calculated Price = Regional Base × Multiplier
                 = 11,000 × 1.15 / 1000
                 = 12,650
```

### Step 5: Enforce Hard Limits

```
Max allowed: 10,000 × 1.50 / 1000 = 15,000
Min allowed: 10,000 × 0.70 / 1000 = 7,000

Check: 12,650 ∈ [7,000, 15,000] ✓
Final Price: 12,650
```

### Step 6: Return with Explanation

```json
{
  "inputs": {
    "supply": 100000,
    "demand": 150000,
    "reference_price": 10000,
    "regional_factor": 1.1
  },
  "calculations": {
    "regional_base_price": 11000,
    "ratio": 1500,
    "tier": "Critical Shortage",
    "multiplier": 1.15,
    "calculated_price": 12650,
    "hard_limit_max": 15000,
    "hard_limit_min": 7000,
    "price_within_limits": true
  },
  "result": {
    "final_price": 12650,
    "price_change_percent": "+15%",
    "explanation": "Demand is 150% of supply (critical shortage) - applying +15% multiplier",
    "policy_band": "Critical Shortage",
    "computation_engine": "Stylus (WASM)",
    "timestamp": "2026-01-25T14:30:00Z"
  }
}
```

---

## Transparency & Auditability

### Every Calculation Is Auditable

Each pricing decision includes complete information:
- All inputs (supply, demand, base price)
- All intermediate calculations (ratio, tier, multiplier)
- All constraint checks (hard limits)
- Final result with explanation

### Audit Verification

Anyone can verify a pricing decision by:

1. **Getting the data:** Supply, demand, base price from on-chain records
2. **Running the calculation:** Using the Python code (available on GitHub)
3. **Comparing results:** Offline calculation matches on-chain result

```bash
# Download data from smart contract
python verify_price.py \
    --supply 100000 \
    --demand 150000 \
    --base_price 10000 \
    --regional_factor 1.1

# Output:
# Final Price: 12650
# Matches on-chain: ✓
```

### No Black Boxes

- No neural networks
- No hidden parameters
- No proprietary formulas
- Source code is open (GitHub)
- Logic can be explained to a farmer

---

## Limitations & Design Constraints

### What This Model Does NOT Do

1. **Predict future prices:** Calculates current fair price only
2. **Forecast supply/demand:** Uses only current data
3. **Account for quality differences:** All units treated equally
4. **Handle external shocks instantly:** Requires data input
5. **Optimize across regions:** Each region independent

### What This Model REQUIRES

1. **Accurate supply/demand data:** Garbage in, garbage out
2. **Stable base prices:** Structural, not speculative
3. **Human governance:** Policy decisions are human responsibility
4. **Regional coordination:** Bridge to prevent arbitrage
5. **Community buy-in:** System only works with trust

### When Intervention May Be Needed

1. **Data corruption:** If supply/demand reporting is unreliable
2. **Black swan events:** War, disease, climate disaster
3. **Policy changes:** Base prices or tiers must change
4. **System errors:** Backend/contract mismatch detected
5. **Market manipulation:** Deliberate false data reporting

---

## Future Enhancements

### Phase 2: Multi-Commodity (2026)

Support separate pricing for:
- Rice, maize, wheat (different supply patterns)
- Beans, cassava, sorghum (regional staples)
- Each commodity has its own base price and tier thresholds

### Phase 3: Storage Integration (2027)

Account for:
- Grain storage capacity (supply smoothing)
- Storage decay (spoilage over time)
- Strategic reserve levels (government granaries)

### Phase 4: Supply Chain (2028)

Integrate:
- Transport capacity constraints
- Logistics node bottlenecks
- Market structure analysis

---

## References

### Implementation

| Component | Location | Language |
|-----------|----------|----------|
| Stylus Engine | contracts/stylus_reference/src/ | Rust |
| Solidity Layer | contracts/src/EthaniPricing.sol | Solidity |
| Backend | backend/app/pricing.py | Python |
| Frontend | frontend/lib/api.ts | TypeScript |
| Tests | contracts/test/ | Solidity (Foundry) |

### Specification

- Pricing Tiers: ±15%, ±8%, 0%, -10%
- Hard Limits: +50% / -30%
- Regional Factors: 0.5× to 2.0×
- Ratio Basis Points: 1000 = 100%

### Governance

- Tier thresholds: Immutable (Arbitrum One)
- Regional factors: Regional councils (quarterly review)
- Hard limits: Community vote to adjust
- Base prices: Regional administration

---

**Project:** ETHANI Food Price Stabilization  
**Status:** Live on Arbitrum Sepolia, Mainnet Q2 2026  
**Model Version:** 1.0 (Deterministic, Regulation-Ready)  
**Last Updated:** January 2026
