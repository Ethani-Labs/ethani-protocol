"""
ETHANI Backend Data Models

Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime

class PriceRequest(BaseModel):
    """Request model for price calculation"""
    supply: int = Field(..., gt=0, description="Food supply units")
    demand: int = Field(..., ge=0, description="Food demand units")
    base_price: int = Field(..., gt=0, description="Base/reference price")
    season_factor: Optional[float] = Field(
        default=1.0,
        ge=0.5,
        le=2.0,
        description="Seasonal multiplier"
    )

    @validator('season_factor')
    def validate_season_factor(cls, v):
        if v is not None and (v < 0.5 or v > 2.0):
            raise ValueError('Season factor must be between 0.5 and 2.0')
        return v

class PriceResponse(BaseModel):
    """Response model for price calculation"""
    suggested_price: int
    ratio: Optional[float]
    multiplier: float
    reason: str
    is_capped: bool
    ai_used: bool = False
    method: str = "rule_based"
    calculations: Optional[Dict[str, Any]] = None

class RatioResponse(BaseModel):
    """Response model for ratio analysis"""
    supply: int
    demand: int
    ratio: Optional[float]
    tier: str
    tier_description: str

class RulesResponse(BaseModel):
    """Response model for pricing rules"""
    system: str
    method: str
    ai_used: bool
    supply_demand_tiers: list
    safeguards: dict
    seasonal_adjustment: dict
    formula: dict

class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    service: str
    timestamp: datetime
    ai_used: bool
    environment: Optional[str] = None

class DetailedPriceResponse(BaseModel):
    """Detailed response with full breakdown"""
    timestamp: datetime
    inputs: Dict[str, Any]
    ratio_analysis: RatioResponse
    price_calculation: Dict[str, Any]
    metadata: Dict[str, Any]

class RegionData(BaseModel):
    """Region information"""
    region_id: int
    name: str
    supply: int
    demand: int
    base_price: int
    current_price: int
    last_update: datetime

class FarmerData(BaseModel):
    """Farmer information"""
    farmer_id: str
    name: str
    region_id: int
    production_units: int
    is_active: bool
    joined_date: datetime

class PriceHistory(BaseModel):
    """Price history entry"""
    timestamp: datetime
    region_id: int
    supply: int
    demand: int
    base_price: int
    calculated_price: int
    reason: str

class BlockchainTransaction(BaseModel):
    """Blockchain transaction info"""
    tx_hash: str
    contract_address: str
    block_number: int
    timestamp: datetime
    status: str  # pending, confirmed, failed
    gas_used: Optional[int] = None
