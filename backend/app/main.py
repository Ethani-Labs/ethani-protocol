"""
ETHANI Backend - Rule-Based Food Price Stabilization API

This API provides transparent, deterministic food pricing
based on supply-demand rules. No AI, no external APIs, no black boxes.

Blockchain integration:
- Calls EthaniPricing contract for price calculation
- Calls EthaniRegion contract for base prices
- Falls back to base price if contracts unavailable (per spec)

API v1 Endpoints (/api/v1/):
  POST /auth/login      - Login with email/password
  POST /auth/register   - Register new user
  GET  /auth/me         - Get current user
  POST /auth/logout     - Logout
  POST /auth/select-roles - Update user roles
  GET  /products        - List products
  GET  /products/{id}/price - Get product price
  GET  /market/listings - List market listings
  POST /market/listings - Create market listing
  GET  /orders          - List orders
  POST /orders          - Create order
  GET  /orders/{id}     - Get order details
  POST /orders/{id}/confirm - Confirm order
  POST /orders/{id}/fulfill - Fulfill order
  POST /orders/{id}/cancel - Cancel order
  POST /supply          - Record supply
  GET  /supply/me       - Get my supply
  POST /waste/record    - Record waste
  GET  /waste/records   - Get waste records
  GET  /waste/stats     - Get waste stats
  GET  /profile         - Get profile
  PUT  /profile         - Update profile

Legacy Endpoints:
  GET /health           - Service health check
  GET /price            - Calculate fair price (via contract)
  GET /ratio            - Analyze supply-demand ratio
  GET /rules            - View all pricing rules
  GET /blockchain       - Blockchain integration status
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
from .pricing import (
    calculate_price,
    get_supply_demand_ratio,
    validate_inputs
)
from .blockchain import blockchain
from .models import (
    PriceRequest, PriceResponse, RatioResponse, HealthResponse,
    DetailedPriceResponse
)
from .config import config

app = FastAPI(
    title=config.API_TITLE,
    description=config.API_DESCRIPTION,
    version=config.API_VERSION,
    debug=config.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=config.CORS_ALLOW_CREDENTIALS,
    allow_methods=config.CORS_ALLOW_METHODS,
    allow_headers=config.CORS_ALLOW_HEADERS,
)

# ========== ROOT ENDPOINT ==========

@app.get("/")
def root():
    """API root - redirects to docs"""
    return {
        "message": "ETHANI Pricing API",
        "version": "1.0.0",
        "docs": "/docs",
        "api_v1": "/api/v1",
        "endpoints": {
            "auth": "/api/v1/auth",
            "products": "/api/v1/products",
            "market": "/api/v1/market",
            "orders": "/api/v1/orders",
            "supply": "/api/v1/supply",
            "waste": "/api/v1/waste",
            "profile": "/api/v1/profile"
        },
        "legacy": {
            "health": "/health",
            "price": "/price",
            "rules": "/rules",
            "blockchain": "/blockchain"
        }
    }

# ========== HEALTH CHECK ==========

@app.get("/health")
def health_check() -> dict:
    """Health check endpoint"""
    return {
        "status": "operational",
        "service": "ETHANI Pricing API",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_used": False,
        "environment": config.ENVIRONMENT if hasattr(config, 'ENVIRONMENT') else None
    }

# ========== API v1 PRICING ENDPOINTS ==========

@app.post("/api/v1/pricing/calculate")
def calculate_price_v1(request: PriceRequest) -> dict:
    """
    API v1 Pricing Endpoint - Calculate fair food price.
    
    Request body:
    {
        "supply": 100,
        "demand": 120,
        "base_price": 10000,
        "region": "ID"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "final_price": 10800,
            "pricing_tier": 2,
            "adjustment_percent": 8,
            "explanation": "Shortage condition detected - price adjusted by +8%",
            "ratio": 1.2,
            "calculation_method": "rule_based",
            "timestamp": "2026-01-25T..."
        }
    }
    """
    try:
        # Validate inputs
        is_valid, error_msg = validate_inputs(
            request.supply,
            request.demand,
            request.base_price
        )
        if not is_valid:
            return {
                "success": False,
                "error": error_msg
            }
        
        # Calculate price using rule-based engine
        result = calculate_price(
            request.supply,
            request.demand,
            request.base_price,
            getattr(request, 'season_factor', 1.0)
        )
        
        # Get tier information
        ratio_result = get_supply_demand_ratio(request.supply, request.demand)
        
        # Map tier number
        tier_map = {
            "critical_shortage": 1,
            "shortage": 2,
            "balanced": 3,
            "surplus": 4
        }
        tier_num = tier_map.get(ratio_result['tier'], 3)
        
        # Calculate adjustment percent
        adj_percent = round(((result['suggested_price'] - request.base_price) / request.base_price) * 100)
        
        return {
            "success": True,
            "data": {
                "final_price": result['suggested_price'],
                "pricing_tier": tier_num,
                "adjustment_percent": adj_percent,
                "explanation": result['reason'],
                "ratio": ratio_result['ratio'],
                "calculation_method": "rule_based",
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/health")
def health_check() -> dict:
    """Health check endpoint"""
    return {
        "status": "operational",
        "service": "ETHANI Pricing API",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_used": False,
        "environment": config.ENVIRONMENT if hasattr(config, 'ENVIRONMENT') else None
    }

# ========== PRICE ENDPOINTS ==========

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
    1. Calls EthaniPricing smart contract (or mock in development)
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

# ========== RULES ENDPOINT ==========

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

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# ========== STARTUP / SHUTDOWN ==========

@app.on_event("startup")
async def startup_event():
    """Run on server startup"""
    print(f"🚀 ETHANI API starting...")
    print(f"📊 Pricing Engine: Rule-based (No AI)")
    print(f"🌍 Environment: {config.ENVIRONMENT if hasattr(config, 'ENVIRONMENT') else 'development'}")
    print(f"🔐 API v1 endpoints available at /api/v1")
    print(f"⛓️  Blockchain Mode: {blockchain.mode.value}")
    if blockchain.contracts_available:
        print(f"✅ Smart Contracts Ready")
    else:
        print(f"⚠️  Using mock pricing (contracts not deployed yet)")


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


@app.on_event("shutdown")
async def shutdown_event():
    """Run on server shutdown"""
    print("🛑 ETHANI API shutting down...")

# ========== RUN ==========

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG
    )
