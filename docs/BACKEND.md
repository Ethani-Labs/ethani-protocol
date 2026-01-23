# ETHANI Backend - Rule-Based Pricing API

A deterministic, transparent food pricing system with **no AI, no external APIs, no black boxes**.

## Installation

```bash
pip install -r requirements.txt
```

## Running

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Core Endpoints

### 1. `/price` - Quick Price Calculation

```bash
curl "http://localhost:8000/price?supply=100&demand=150&base_price=100"
```

Response:
```json
{
  "suggested_price": 115,
  "ratio": 1.5,
  "multiplier": 1.15,
  "reason": "Critical shortage (ratio > 1.30) - price +15%",
  "is_capped": false,
  "ai_used": false,
  "method": "rule_based",
  "calculations": {
    "base_price": 100,
    "supply": 100,
    "demand": 150,
    "ratio_formula": "150 / 100 = 1.5"
  }
}
```

### 2. `/ratio` - Analyze Supply-Demand

```bash
curl "http://localhost:8000/ratio?supply=100&demand=150"
```

Response:
```json
{
  "supply": 100,
  "demand": 150,
  "ratio": 1.5,
  "tier": "critical_shortage",
  "tier_description": "Critical shortage - price +15%"
}
```

### 3. `/price-detailed` - Full Calculation Breakdown

```bash
curl -X POST "http://localhost:8000/price-detailed" \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 100,
    "demand": 150,
    "base_price": 100,
    "season_factor": 1.0
  }'
```

### 4. `/rules` - View All Pricing Rules

```bash
curl "http://localhost:8000/rules"
```

Shows complete pricing tiers, safeguards, and formulas.

## Pricing Rules (100% Transparent)

**Supply-Demand Ratio Tiers:**

| Ratio | Condition | Price Adjustment | Tier |
|-------|-----------|------------------|------|
| > 1.30 | Demand > 130% of Supply | +15% | Critical Shortage |
| > 1.10 | Demand > 110% of Supply | +8% | Shortage |
| 0.80-1.10 | Balanced | 0% (baseline) | Balanced |
| < 0.80 | Demand < 80% of Supply | -10% | Surplus |

**Hard Limits (Safeguards):**
- Max price increase: +50%
- Max price decrease: -30%

**Formula:**
```
Final Price = Base Price × Multiplier × Season Factor
Ratio = Demand / Supply
```

## Example Scenarios

### Scenario 1: Critical Shortage
- Supply: 50 units
- Demand: 80 units
- Base Price: 100

Calculation:
- Ratio = 80 / 50 = 1.60
- Tier: Critical Shortage (> 1.30)
- Multiplier: +15%
- **Suggested Price: 115**

### Scenario 2: Balanced Market
- Supply: 100 units
- Demand: 95 units
- Base Price: 100

Calculation:
- Ratio = 95 / 100 = 0.95
- Tier: Balanced
- Multiplier: 0%
- **Suggested Price: 100**

### Scenario 3: Surplus (Price Protection for Consumers)
- Supply: 200 units
- Demand: 100 units
- Base Price: 100

Calculation:
- Ratio = 100 / 200 = 0.50
- Tier: Surplus (< 0.80)
- Multiplier: -10%
- **Suggested Price: 90**

## Design Principles

✅ **No AI/ML** - All decisions are rule-based and deterministic
✅ **Transparent** - Every calculation is auditable
✅ **Simple** - Easy to understand, no black boxes
✅ **Fair** - Protects both farmers (floor) and consumers (ceiling)
✅ **Deterministic** - Same inputs always produce same outputs
✅ **Explainable** - Can be explained to farmers and officials

## Architecture

```
main.py          → FastAPI app, endpoints, request/response handling
pricing.py       → Core pricing logic, rule definitions, calculations
```

All pricing logic is in `pricing.py` for easy auditing and modification.

## Testing

Example test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Get rules
curl http://localhost:8000/rules

# Calculate price
curl "http://localhost:8000/price?supply=100&demand=150&base_price=100&season_factor=1.0"
```

## Extending

To add new pricing rules:

1. Edit `pricing.py` constants (thresholds, multipliers)
2. Update the calculation logic in `calculate_price()`
3. Update `/rules` endpoint to document changes
4. No changes needed to API structure

## Deployment

For Hackathon/Demo:

```bash
# Run locally
python main.py

# Or use gunicorn for production-like setup
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## Integration with Smart Contracts

This API provides the **oracle/data source** for the Solidity contracts:

1. Smart contracts define the rules
2. Backend API implements the same rules
3. Both can validate each other's calculations
4. Blockchain records the price decisions (transparency)

## License

MIT - Open source for transparency and community audit
