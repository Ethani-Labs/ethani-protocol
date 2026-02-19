from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .pricing import calculate_price, get_supply_demand_ratio, validate_inputs
from .blockchain import blockchain
from .models import PriceRequest
from .config import config

app = FastAPI(
    title=config.API_TITLE,
    description=config.API_DESCRIPTION,
    version=config.API_VERSION,
    debug=config.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=config.CORS_ALLOW_CREDENTIALS,
    allow_methods=config.CORS_ALLOW_METHODS,
    allow_headers=config.CORS_ALLOW_HEADERS,
)


@app.get("/")
def root():
    return {
        "message": "ETHANI Pricing API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "price": "/price",
            "ratio": "/ratio",
            "rules": "/rules",
            "blockchain": "/blockchain",
            "pricing_v1": "/api/v1/pricing/calculate",
        }
    }


@app.get("/health")
def health_check():
    return {
        "status": "operational",
        "service": "ETHANI Pricing API",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_used": False,
        "environment": getattr(config, "ENVIRONMENT", "development")
    }


@app.post("/api/v1/pricing/calculate")
def calculate_price_v1(request: PriceRequest):
    """Calculate fair food price using rule-based engine."""
    try:
        is_valid, error_msg = validate_inputs(request.supply, request.demand, request.base_price)
        if not is_valid:
            return {"success": False, "error": error_msg}

        result = calculate_price(
            request.supply, request.demand, request.base_price,
            getattr(request, "season_factor", 1.0)
        )
        ratio_result = get_supply_demand_ratio(request.supply, request.demand)

        tier_map = {"critical_shortage": 1, "shortage": 2, "balanced": 3, "surplus": 4}
        tier_num = tier_map.get(ratio_result["tier"], 3)
        adj_percent = round(((result["suggested_price"] - request.base_price) / request.base_price) * 100)

        return {
            "success": True,
            "data": {
                "final_price": result["suggested_price"],
                "pricing_tier": tier_num,
                "adjustment_percent": adj_percent,
                "explanation": result["reason"],
                "ratio": ratio_result["ratio"],
                "calculation_method": "rule_based",
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/price")
def get_price(
    supply: int = Query(..., gt=0, description="Food supply units"),
    demand: int = Query(..., ge=0, description="Food demand units"),
    base_price: int = Query(..., gt=0, description="Base/reference price"),
    region: str = Query("Default Region", description="Region name"),
    season_factor: float = Query(1.0, ge=0.5, le=2.0, description="Seasonal factor")
):
    """Calculate fair food price via smart contract (with local fallback)."""
    is_valid, error_msg = validate_inputs(supply, demand, base_price)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    contract_result = blockchain.calculate_price(supply, demand, base_price, region)

    return {
        "region": region,
        "base_price": base_price,
        "supply": supply,
        "demand": demand,
        "final_price": contract_result["final_price"],
        "reason": contract_result["reason"],
        "method": "rule_based",
        "ai_used": False
    }


@app.get("/ratio")
def get_ratio(
    supply: int = Query(..., gt=0, description="Food supply units"),
    demand: int = Query(..., ge=0, description="Food demand units")
):
    """Analyze supply-demand ratio and return pricing tier."""
    if supply <= 0:
        raise HTTPException(status_code=400, detail="Supply must be positive")
    if demand < 0:
        raise HTTPException(status_code=400, detail="Demand cannot be negative")

    result = get_supply_demand_ratio(supply, demand)
    return {
        "supply": supply,
        "demand": demand,
        "ratio": result["ratio"],
        "tier": result["tier"],
        "tier_description": result["tier_description"]
    }


@app.post("/price-detailed")
def calculate_price_detailed(request: PriceRequest):
    """Full price breakdown with all calculation details."""
    is_valid, error_msg = validate_inputs(request.supply, request.demand, request.base_price)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    result = calculate_price(request.supply, request.demand, request.base_price, request.season_factor)
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
            "suggested_price": result["suggested_price"],
            "multiplier": result["multiplier"],
            "reason": result["reason"],
            "is_capped": result["is_capped"],
            "formulas": result["calculations"]
        },
        "metadata": {
            "ai_used": False,
            "method": "rule_based",
            "auditable": True
        }
    }


@app.get("/rules")
def get_pricing_rules():
    """View all pricing rules — transparent and auditable."""
    return {
        "system": "ETHANI Food Price Stabilization",
        "method": "Rule-Based Supply-Demand",
        "ai_used": False,
        "supply_demand_tiers": [
            {"tier": "Critical Shortage", "condition": "Ratio > 1.30", "adjustment": "+15%"},
            {"tier": "Shortage",          "condition": "Ratio > 1.10", "adjustment": "+8%"},
            {"tier": "Balanced",          "condition": "0.80 ≤ Ratio ≤ 1.10", "adjustment": "0%"},
            {"tier": "Surplus",           "condition": "Ratio < 0.80", "adjustment": "-10%"}
        ],
        "safeguards": {
            "max_increase": "+50%",
            "max_decrease": "-30%"
        },
        "formula": "Final Price = Base Price × Multiplier × Season Factor"
    }


@app.get("/blockchain")
def blockchain_status():
    """Smart contract integration status."""
    return blockchain.health_check()


@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.on_event("startup")
async def startup_event():
    env = getattr(config, "ENVIRONMENT", "development")
    contracts = "ready" if blockchain.contracts_available else "mock"
    print(f"ETHANI API starting — {env} | blockchain: {blockchain.mode.value} ({contracts})")


@app.on_event("shutdown")
async def shutdown_event():
    print("ETHANI API shutting down")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=config.HOST, port=config.PORT, debug=config.DEBUG)
