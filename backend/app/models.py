from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime


class PriceRequest(BaseModel):
    supply: int = Field(..., gt=0, description="Food supply units")
    demand: int = Field(..., ge=0, description="Food demand units")
    base_price: int = Field(..., gt=0, description="Base/reference price")
    season_factor: Optional[float] = Field(default=1.0, ge=0.5, le=2.0, description="Seasonal multiplier")

    @validator("season_factor")
    def validate_season_factor(cls, v):
        if v is not None and (v < 0.5 or v > 2.0):
            raise ValueError("Season factor must be between 0.5 and 2.0")
        return v


class PriceResponse(BaseModel):
    suggested_price: int
    ratio: Optional[float]
    multiplier: float
    reason: str
    is_capped: bool
    ai_used: bool = False
    method: str = "rule_based"
    calculations: Optional[Dict[str, Any]] = None


class RatioResponse(BaseModel):
    supply: int
    demand: int
    ratio: Optional[float]
    tier: str
    tier_description: str


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
    ai_used: bool
    environment: Optional[str] = None


class DetailedPriceResponse(BaseModel):
    timestamp: datetime
    inputs: Dict[str, Any]
    ratio_analysis: RatioResponse
    price_calculation: Dict[str, Any]
    metadata: Dict[str, Any]


class RegionData(BaseModel):
    region_id: int
    name: str
    supply: int
    demand: int
    base_price: int
    current_price: int
    last_update: datetime


class PriceHistory(BaseModel):
    timestamp: datetime
    region_id: int
    supply: int
    demand: int
    base_price: int
    calculated_price: int
    reason: str
