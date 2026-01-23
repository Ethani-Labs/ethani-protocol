"""
ETHANI Pricing Module - Rule-Based Supply-Demand System

RULES (100% Transparent, No AI):
==================================

Supply-Demand Ratio Tiers:
  Ratio (Demand/Supply):
    > 1.30  →  +15% (Critical Shortage)
    > 1.10  →  +8%  (Shortage)
    0.80-1.10 →  0%  (Balanced)
    < 0.80  → -10%  (Surplus)

Hard Limits (Safeguards):
    Max price increase:  +50%
    Max price decrease:  -30%

All calculations are deterministic, auditable, and reproducible.
"""

# ========== PRICING CONSTANTS ==========

# Supply-demand ratio thresholds
CRITICAL_SHORTAGE_THRESHOLD = 1.30
SHORTAGE_THRESHOLD = 1.10
SURPLUS_THRESHOLD = 0.80

# Price multipliers (ratio-based)
CRITICAL_SHORTAGE_MULTIPLIER = 1.15  # +15%
SHORTAGE_MULTIPLIER = 1.08           # +8%
NORMAL_MULTIPLIER = 1.0              # 0%
SURPLUS_MULTIPLIER = 0.90            # -10%

# Hard limits to prevent extreme swings
MAX_PRICE_INCREASE = 1.50            # +50%
MAX_PRICE_DECREASE = 0.70            # -30%


def calculate_price(
    supply: int,
    demand: int,
    base_price: int,
    season_factor: float = 1.0
) -> dict:
    """
    Calculate fair food price using rule-based supply-demand formula.
    
    Args:
        supply (int): Current food supply units
        demand (int): Current food demand units
        base_price (int): Reference/baseline price
        season_factor (float): Seasonal adjustment (0.8-1.2 typical range)
    
    Returns:
        dict: {
            'suggested_price': int,
            'ratio': float,
            'multiplier': float,
            'reason': str,
            'is_capped': bool,
            'calculations': {...}
        }
    """
    
    if supply <= 0:
        return {
            'suggested_price': base_price,
            'ratio': None,
            'multiplier': 1.0,
            'reason': 'No supply available - using base price',
            'is_capped': False,
            'calculations': {
                'base_price': base_price,
                'supply': supply,
                'demand': demand,
                'season_factor': season_factor
            }
        }
    
    # Calculate demand-supply ratio
    ratio = demand / supply
    
    # Determine multiplier based on ratio
    if ratio > CRITICAL_SHORTAGE_THRESHOLD:
        multiplier = CRITICAL_SHORTAGE_MULTIPLIER
        tier_reason = "Critical shortage (ratio > 1.30)"
    elif ratio > SHORTAGE_THRESHOLD:
        multiplier = SHORTAGE_MULTIPLIER
        tier_reason = "Shortage detected (ratio > 1.10)"
    elif ratio < SURPLUS_THRESHOLD:
        multiplier = SURPLUS_MULTIPLIER
        tier_reason = "Surplus available (ratio < 0.80)"
    else:
        multiplier = NORMAL_MULTIPLIER
        tier_reason = "Balanced supply-demand (0.80-1.10)"
    
    # Apply multiplier and seasonal factor
    calculated_price = base_price * multiplier * season_factor
    
    # Apply hard limits to prevent extreme swings
    max_allowed = base_price * MAX_PRICE_INCREASE
    min_allowed = base_price * MAX_PRICE_DECREASE
    
    is_capped = False
    if calculated_price > max_allowed:
        calculated_price = max_allowed
        tier_reason += " [CAPPED at +50%]"
        is_capped = True
    elif calculated_price < min_allowed:
        calculated_price = min_allowed
        tier_reason += " [FLOORED at -30%]"
        is_capped = True
    
    # Round to nearest integer
    final_price = int(round(calculated_price))
    
    return {
        'suggested_price': final_price,
        'ratio': round(ratio, 2),
        'multiplier': round(multiplier, 2),
        'reason': tier_reason,
        'is_capped': is_capped,
        'calculations': {
            'base_price': base_price,
            'supply': supply,
            'demand': demand,
            'season_factor': season_factor,
            'ratio_formula': f"{demand} / {supply} = {round(ratio, 2)}",
            'price_formula': f"{base_price} × {round(multiplier, 2)} × {season_factor} = {int(calculated_price)}"
        }
    }


def get_supply_demand_ratio(supply: int, demand: int) -> dict:
    """
    Calculate and explain the supply-demand ratio.
    
    Args:
        supply (int): Current supply
        demand (int): Current demand
    
    Returns:
        dict: Ratio analysis with tier classification
    """
    if supply <= 0:
        return {
            'ratio': None,
            'tier': 'error',
            'tier_description': 'No supply to calculate ratio'
        }
    
    ratio = demand / supply
    
    if ratio > CRITICAL_SHORTAGE_THRESHOLD:
        tier = "critical_shortage"
        tier_desc = "Critical shortage - price +15%"
    elif ratio > SHORTAGE_THRESHOLD:
        tier = "shortage"
        tier_desc = "Shortage - price +8%"
    elif ratio < SURPLUS_THRESHOLD:
        tier = "surplus"
        tier_desc = "Surplus - price -10%"
    else:
        tier = "balanced"
        tier_desc = "Balanced supply-demand - price baseline"
    
    return {
        'ratio': round(ratio, 2),
        'tier': tier,
        'tier_description': tier_desc,
        'supply': supply,
        'demand': demand
    }


def validate_inputs(supply: int, demand: int, base_price: int) -> tuple[bool, str]:
    """
    Validate pricing inputs to prevent errors.
    
    Returns:
        (is_valid, error_message)
    """
    if base_price <= 0:
        return False, "Base price must be positive"
    if supply < 0:
        return False, "Supply cannot be negative"
    if demand < 0:
        return False, "Demand cannot be negative"
    if supply == 0 and demand > 0:
        return False, "Cannot have demand with zero supply"
    
    return True, ""
