"""
ETHANI Backend - Rule-Based Food Price Stabilization API

This API provides transparent, deterministic food pricing
based on supply-demand rules. No AI, no external APIs, no black boxes.

Blockchain integration:
- Calls EthaniPricing contract for price calculation
- Calls EthaniRegion contract for base prices
- Falls back to base price if contracts unavailable (per spec)

Endpoints:
  GET /health           - Service health check
  GET /price            - Calculate fair price (via contract)
  GET /ratio            - Analyze supply-demand ratio
  GET /rules            - View all pricing rules
  GET /blockchain       - Blockchain integration status
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from pricing import (
    calculate_price,
    get_supply_demand_ratio,
    validate_inputs
)
from blockchain import blockchain
from users import (
    register_user,
    get_user_by_phone,
    get_user_by_id,
    get_users_by_role,
    get_users_by_location,
    add_points,
    record_supply,
    get_supply_by_region,
    record_waste,
    get_waste_by_user,
    create_delivery,
    complete_delivery,
    get_deliveries_by_status,
    get_regional_metrics
)

app = FastAPI(
    title="ETHANI Pricing API",
    description="Transparent, rule-based food price calculation",
    version="1.0.0"
)

# ========== PYDANTIC MODELS ==========

class PriceRequest(BaseModel):
    """Request model for price calculation"""
    supply: int = Field(..., gt=0, description="Food supply units")
    demand: int = Field(..., ge=0, description="Food demand units")
    base_price: int = Field(..., gt=0, description="Base/reference price")
    season_factor: Optional[float] = Field(
        default=1.0,
        ge=0.5,
        le=2.0,
        description="Seasonal multiplier (0.5-2.0)"
    )


class PriceResponse(BaseModel):
    """Response model for price calculation - SPEC COMPLIANT"""
    region: str
    base_price: int
    supply: int
    demand: int
    final_price: int
    reason: str
    method: str
    ai_used: bool


class RatioResponse(BaseModel):
    """Response model for ratio analysis"""
    ratio: Optional[float]
    tier: str
    tier_description: str
    supply: int
    demand: int


# ========== USER MODELS ==========

class RegisterRequest(BaseModel):
    """User registration request"""
    phone: str = Field(..., min_length=10, description="Phone number")
    name: str = Field(..., min_length=2, description="Full name")
    email: Optional[str] = Field(None, description="Email (optional)")
    national_id: Optional[str] = Field(None, description="National ID / KTP (optional)")
    location: str = Field(..., description="Region or location")
    role: str = Field(..., description="User role (farmer, livestock_farmer, distributor, buyer, investor, circular_economy, learner)")


class LoginRequest(BaseModel):
    """User login request"""
    phone: str = Field(..., min_length=10, description="Phone number")
    # For MVP: password is optional, just verify phone exists
    password: Optional[str] = Field(None, description="Password (optional for MVP)")


class SupplyReportRequest(BaseModel):
    """Supply report from farmer"""
    phone: str
    region: str
    food_category: str
    supply_units: int = Field(..., gt=0)


class WasteReportRequest(BaseModel):
    """Waste tracking report"""
    phone: str
    waste_type: str
    quantity_kg: float = Field(..., gt=0)
    processing_method: str


# ========== ENDPOINTS ==========

# ========== USER MANAGEMENT ==========

@app.post("/register")
def register(request: RegisterRequest):
    """
    Register a new user
    
    Roles:
    - farmer: Plant farmer
    - livestock_farmer: Livestock farmer
    - distributor: Transport & distribution
    - buyer: Restaurant, factory, shop
    - investor: Impact investor
    - circular_economy: Waste processor, maggot farmer
    - learner: Community learner
    """
    
    result = register_user(
        phone=request.phone,
        name=request.name,
        email=request.email,
        national_id=request.national_id,
        location=request.location,
        role=request.role
    )
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['message'])
    
    return result


@app.post("/login")
def login(request: LoginRequest):
    """
    Login user by phone number (MVP: phone verification only)
    
    Returns user profile including role for dashboard routing
    """
    user = get_user_by_phone(request.phone)
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found. Please register first.")
    
    return {
        "success": True,
        "user": user,
        "message": f"Welcome back, {user['name']}!"
    }


@app.get("/user/{phone}")
def get_user(phone: str):
    """Get user profile by phone number"""
    user = get_user_by_phone(phone)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@app.get("/users/role/{role}")
def get_users_by_role_endpoint(role: str):
    """Get all users with a specific role"""
    users = get_users_by_role(role)
    return {"role": role, "count": len(users), "users": users}


@app.get("/users/location/{location}")
def get_users_by_location_endpoint(location: str):
    """Get all users in a specific location"""
    users = get_users_by_location(location)
    return {"location": location, "count": len(users), "users": users}


@app.post("/supply-report")
def submit_supply_report(request: SupplyReportRequest):
    """
    Submit supply report (farmer endpoint)
    
    Awards 10 points for accurate reporting
    """
    user = get_user_by_phone(request.phone)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user['role'] not in ['farmer', 'livestock_farmer']:
        raise HTTPException(status_code=403, detail="Only farmers can submit supply reports")
    
    result = record_supply(
        user_id=user['id'],
        region=request.region,
        food_category=request.food_category,
        supply_units=request.supply_units
    )
    
    return result


@app.get("/supply/{region}")
def get_regional_supply(region: str):
    """Get all supply reports from a region"""
    reports = get_supply_by_region(region)
    return {
        "region": region,
        "total_reports": len(reports),
        "reports": reports
    }


@app.post("/waste-report")
def submit_waste_report(request: WasteReportRequest):
    """
    Submit waste processing report (circular economy)
    
    Tracks plastic, organic waste, maggot farming
    Awards energy credits and points
    """
    user = get_user_by_phone(request.phone)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user['role'] != 'circular_economy':
        raise HTTPException(status_code=403, detail="Only circular economy participants can submit waste reports")
    
    result = record_waste(
        user_id=user['id'],
        waste_type=request.waste_type,
        quantity_kg=request.quantity_kg,
        processing_method=request.processing_method
    )
    
    return result


@app.get("/waste/{phone}")
def get_user_waste_reports(phone: str):
    """Get waste reports for a user"""
    user = get_user_by_phone(phone)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    reports = get_waste_by_user(user['id'])
    
    total_kg = sum(r['quantity_kg'] for r in reports)
    total_credits = sum(r['energy_credits'] for r in reports)
    
    return {
        "phone": phone,
        "total_waste_kg": total_kg,
        "total_energy_credits": total_credits,
        "reports": reports
    }


@app.get("/regional-metrics/{region}")
def get_region_metrics(region: str):
    """Get aggregated supply-demand metrics for a region"""
    metrics = get_regional_metrics(region)
    return metrics


@app.post("/delivery/create")
def create_delivery_order(
    phone: str = Query(...),
    origin: str = Query(...),
    destination: str = Query(...),
    food_category: str = Query(...),
    quantity: int = Query(..., gt=0)
):
    """Create a delivery order (distributor)"""
    user = get_user_by_phone(phone)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user['role'] != 'distributor':
        raise HTTPException(status_code=403, detail="Only distributors can create deliveries")
    
    result = create_delivery(
        distributor_id=user['id'],
        origin=origin,
        destination=destination,
        food_category=food_category,
        quantity=quantity
    )
    
    return result


@app.post("/delivery/complete/{delivery_id}")
def complete_delivery_order(delivery_id: int):
    """Mark delivery as complete (awards points)"""
    result = complete_delivery(delivery_id)
    return result


@app.get("/deliveries/{status}")
def get_deliveries(status: str):
    """Get all deliveries with a specific status"""
    valid_statuses = ['pending', 'in_transit', 'completed']
    
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")
    
    deliveries = get_deliveries_by_status(status)
    return {"status": status, "count": len(deliveries), "deliveries": deliveries}


# ========== PRICE CALCULATION ==========
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "ETHANI Pricing API",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_used": False
    }


@app.get("/price")
def get_price(
    supply: int = Query(..., gt=0, description="Food supply units"),
    demand: int = Query(..., ge=0, description="Food demand units"),
    base_price: int = Query(..., gt=0, description="Base/reference price"),
    region: str = Query("Default Region", description="Region name"),
    season_factor: float = Query(1.0, ge=0.5, le=2.0, description="Seasonal factor")
) -> dict:
    """
    Calculate fair food price using smart contract.
    
    Per Spec Section III:
    Backend MUST "Call pricing contracts" and return result.
    
    This endpoint:
    1. Calls EthaniPricing smart contract
    2. Returns result exactly as contract provides
    3. Falls back to base price if contract unavailable
    
    Rules (transparent and auditable):
    - Ratio > 1.30: +15% (critical shortage)
    - Ratio > 1.10: +8% (shortage)
    - Ratio 0.80-1.10: 0% (balanced)
    - Ratio < 0.80: -10% (surplus)
    
    Hard limits:
    - Max increase: +50%
    - Max decrease: -30%
    """
    
    # Validate inputs
    is_valid, error_msg = validate_inputs(supply, demand, base_price)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Per spec: Backend should fetch base_price from contract
    # For now, using parameter. When contracts deployed, will fetch from EthaniRegion
    # fetched_base_price = blockchain.get_base_price(region)
    
    # CALL SMART CONTRACT for price calculation
    # Per Spec Section III: "Call pricing contracts"
    contract_result = blockchain.calculate_price(supply, demand, base_price, region)
    
    # Return SPEC-COMPLIANT response (Section V)
    return {
        "region": region,
        "base_price": base_price,
        "supply": supply,
        "demand": demand,
        "final_price": contract_result['final_price'],
        "reason": contract_result['reason'],
        "method": "rule_based",
        "ai_used": False
    }


@app.get("/ratio")
def get_ratio(
    supply: int = Query(..., gt=0, description="Food supply units"),
    demand: int = Query(..., ge=0, description="Food demand units")
) -> dict:
    """
    Analyze supply-demand ratio and determine pricing tier.
    
    Returns:
    - Ratio value (demand / supply)
    - Pricing tier (critical_shortage, shortage, balanced, surplus)
    - Expected price impact
    """
    
    if supply <= 0:
        raise HTTPException(status_code=400, detail="Supply must be positive")
    if demand < 0:
        raise HTTPException(status_code=400, detail="Demand cannot be negative")
    
    result = get_supply_demand_ratio(supply, demand)
    
    return {
        "supply": supply,
        "demand": demand,
        "ratio": result['ratio'],
        "tier": result['tier'],
        "tier_description": result['tier_description']
    }


@app.post("/price-detailed")
def calculate_price_detailed(request: PriceRequest) -> dict:
    """
    Detailed price calculation endpoint.
    Returns full breakdown of all calculations and rules applied.
    """
    
    # Validate inputs
    is_valid, error_msg = validate_inputs(
        request.supply,
        request.demand,
        request.base_price
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Calculate price
    result = calculate_price(
        request.supply,
        request.demand,
        request.base_price,
        request.season_factor
    )
    
    # Get ratio analysis
    ratio_analysis = get_supply_demand_ratio(request.supply, request.demand)
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "inputs": {
            "supply": request.supply,
            "demand": request.demand,
            "base_price": request.base_price,
            "season_factor": request.season_factor
        },
        "ratio_analysis": ratio_analysis,
        "price_calculation": {
            "suggested_price": result['suggested_price'],
            "multiplier": result['multiplier'],
            "reason": result['reason'],
            "is_capped": result['is_capped'],
            "formulas": result['calculations']
        },
        "metadata": {
            "ai_used": False,
            "method": "rule_based",
            "auditable": True
        }
    }


@app.get("/rules")
def get_pricing_rules() -> dict:
    """
    Get all pricing rules and thresholds.
    Complete transparency - see exactly how prices are calculated.
    """
    
    return {
        "system": "ETHANI Food Price Stabilization",
        "method": "Rule-Based Supply-Demand",
        "ai_used": False,
        "description": "Deterministic pricing based on supply-demand ratio",
        
        "supply_demand_tiers": [
            {
                "tier": "Critical Shortage",
                "condition": "Ratio > 1.30 (Demand > 130% of Supply)",
                "price_adjustment": "+15%",
                "purpose": "Encourage farmers to increase production"
            },
            {
                "tier": "Shortage",
                "condition": "Ratio > 1.10 (Demand > 110% of Supply)",
                "price_adjustment": "+8%",
                "purpose": "Incentivize supply increase"
            },
            {
                "tier": "Balanced",
                "condition": "0.80 ≤ Ratio ≤ 1.10",
                "price_adjustment": "0% (base price)",
                "purpose": "Market equilibrium"
            },
            {
                "tier": "Surplus",
                "condition": "Ratio < 0.80 (Demand < 80% of Supply)",
                "price_adjustment": "-10%",
                "purpose": "Protect consumers from over-supply"
            }
        ],
        
        "safeguards": {
            "max_price_increase": "+50%",
            "max_price_decrease": "-30%",
            "purpose": "Prevent extreme volatility and price shocks"
        },
        
        "seasonal_adjustment": {
            "range": "0.5 to 2.0",
            "default": "1.0",
            "description": "Adjust for seasonal factors (harvest time, holidays, etc.)"
        },
        
        "formula": {
            "basic": "Final Price = Base Price × Multiplier × Season Factor",
            "ratio": "Ratio = Demand / Supply",
            "example": "If base = 100, demand = 150, supply = 100: Ratio = 1.50 → Shortage → Multiplier 1.15 → Price = 115"
        }
    }


# ========== ERROR HANDLERS ==========

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )


@app.get("/")
def root():
    """API root - redirects to docs"""
    return {
        "message": "ETHANI Pricing API",
        "docs": "/docs",
        "health": "/health",
        "blockchain": "/blockchain",
        "rules": "/rules"
    }


@app.get("/blockchain")
def blockchain_status():
    """
    Check blockchain integration status.
    
    Returns:
    - mode: "mock" (development) or "real" (production with deployed contracts)
    - contracts_deployed: true if addresses set in .env
    - pricing_contract: EthaniPricing contract address
    - region_contract: EthaniRegion contract address
    - ready: true if all contracts deployed and accessible
    """
    return blockchain.health_check()


# ========== RUN ==========

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
