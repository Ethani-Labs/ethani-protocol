"""
ETHANI Pricing Engine — Rule-Based Supply-Demand

Pricing tiers (Demand / Supply ratio):
  > 1.30  →  +15%  (Critical Shortage)
  > 1.10  →   +8%  (Shortage)
  0.80–1.10 →  0%  (Balanced)
  < 0.80  →  -10%  (Surplus)

Hard limits: max +50%, max -30%
All calculations are deterministic and fully auditable.
"""

# Ratio thresholds
CRITICAL_SHORTAGE_THRESHOLD = 1.30
SHORTAGE_THRESHOLD = 1.10
SURPLUS_THRESHOLD = 0.80

# Price multipliers
CRITICAL_SHORTAGE_MULTIPLIER = 1.15  # +15%
SHORTAGE_MULTIPLIER = 1.08           # +8%
NORMAL_MULTIPLIER = 1.0              # 0%
SURPLUS_MULTIPLIER = 0.90            # -10%

# Hard limits
MAX_PRICE_INCREASE = 1.50            # +50%
MAX_PRICE_DECREASE = 0.70            # -30%


def calculate_price(supply: int, demand: int, base_price: int, season_factor: float = 1.0) -> dict:
    """
    Calculate fair food price.

    Returns dict with: suggested_price, ratio, multiplier, reason, is_capped, calculations
    """
    if supply <= 0:
        return {
            "suggested_price": base_price,
            "ratio": None,
            "multiplier": 1.0,
            "reason": "No supply — using base price",
            "is_capped": False,
            "calculations": {"base_price": base_price, "supply": supply, "demand": demand}
        }

    ratio = demand / supply

    if ratio > CRITICAL_SHORTAGE_THRESHOLD:
        multiplier = CRITICAL_SHORTAGE_MULTIPLIER
        reason = "Critical shortage (ratio > 1.30)"
    elif ratio > SHORTAGE_THRESHOLD:
        multiplier = SHORTAGE_MULTIPLIER
        reason = "Shortage (ratio > 1.10)"
    elif ratio < SURPLUS_THRESHOLD:
        multiplier = SURPLUS_MULTIPLIER
        reason = "Surplus (ratio < 0.80)"
    else:
        multiplier = NORMAL_MULTIPLIER
        reason = "Balanced (0.80–1.10)"

    calculated_price = base_price * multiplier * season_factor
    max_allowed = base_price * MAX_PRICE_INCREASE
    min_allowed = base_price * MAX_PRICE_DECREASE

    is_capped = False
    if calculated_price > max_allowed:
        calculated_price = max_allowed
        reason += " [CAPPED +50%]"
        is_capped = True
    elif calculated_price < min_allowed:
        calculated_price = min_allowed
        reason += " [FLOORED -30%]"
        is_capped = True

    final_price = int(round(calculated_price))

    return {
        "suggested_price": final_price,
        "ratio": round(ratio, 2),
        "multiplier": round(multiplier, 2),
        "reason": reason,
        "is_capped": is_capped,
        "calculations": {
            "base_price": base_price,
            "supply": supply,
            "demand": demand,
            "season_factor": season_factor,
            "ratio_formula": f"{demand} / {supply} = {round(ratio, 2)}",
            "price_formula": f"{base_price} × {round(multiplier, 2)} × {season_factor} = {int(calculated_price)}"
        }
    }


def get_supply_demand_ratio(supply: int, demand: int) -> dict:
    """Return ratio value and pricing tier classification."""
    if supply <= 0:
        return {"ratio": None, "tier": "error", "tier_description": "No supply to calculate ratio"}

    ratio = demand / supply

    if ratio > CRITICAL_SHORTAGE_THRESHOLD:
        tier, desc = "critical_shortage", "Critical shortage — price +15%"
    elif ratio > SHORTAGE_THRESHOLD:
        tier, desc = "shortage", "Shortage — price +8%"
    elif ratio < SURPLUS_THRESHOLD:
        tier, desc = "surplus", "Surplus — price -10%"
    else:
        tier, desc = "balanced", "Balanced — price baseline"

    return {
        "ratio": round(ratio, 2),
        "tier": tier,
        "tier_description": desc,
        "supply": supply,
        "demand": demand
    }


def validate_inputs(supply: int, demand: int, base_price: int) -> tuple[bool, str]:
    """Validate pricing inputs. Returns (is_valid, error_message)."""
    if base_price <= 0:
        return False, "Base price must be positive"
    if supply < 0:
        return False, "Supply cannot be negative"
    if demand < 0:
        return False, "Demand cannot be negative"
    if supply == 0 and demand > 0:
        return False, "Cannot have demand with zero supply"
    return True, ""
