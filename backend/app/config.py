"""
ETHANI Backend Configuration

Environment-specific settings and defaults.
"""

import os
import json
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def _parse_cors_origins(raw: str) -> list:
    """Parse CORS origins from either JSON array or comma-separated string."""
    raw = raw.strip()
    if raw.startswith("["):
        return json.loads(raw)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]

class Config:
    """Base configuration"""
    # API Settings
    API_TITLE = "ETHANI Pricing API"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "Rule-based food price stabilization"
    
    # Server Settings
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # CORS Settings
    CORS_ORIGINS = _parse_cors_origins(os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8000"))
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]
    
    # Pricing Engine Settings
    MAX_PRICE_INCREASE_BPS = 5000  # +50%
    MAX_PRICE_DECREASE_BPS = 3000  # -30%
    
    # Blockchain Settings
    BLOCKCHAIN_ENABLED = os.getenv("BLOCKCHAIN_ENABLED", "False").lower() == "true"
    BLOCKCHAIN_RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "http://localhost:8545")
    BLOCKCHAIN_NETWORK = os.getenv("ARBITRUM_NETWORK", "sepolia")
    ARBITRUM_CHAIN_ID = int(os.getenv("ARBITRUM_CHAIN_ID", "421614"))
    
    # Contract Addresses (Arbitrum Sepolia)
    ETHANI_PRICING_ADDRESS = os.getenv("ETHANI_PRICING_ADDRESS", "0xc92fd01c122821Eb2C911d16468B20b07E25abC0")
    ETHANI_REGION_ADDRESS = os.getenv("ETHANI_REGION_ADDRESS", "0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143")
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = "json"  # or "text"
    
    # Storage
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", None)
    CACHE_ENABLED = os.getenv("CACHE_ENABLED", "False").lower() == "true"

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = "DEBUG"

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = "INFO"
    CACHE_ENABLED = True

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    CORS_ORIGINS = ["*"]
    LOG_LEVEL = "DEBUG"

# Select config based on environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

if ENVIRONMENT == "production":
    config = ProductionConfig()
elif ENVIRONMENT == "testing":
    config = TestingConfig()
else:
    config = DevelopmentConfig()
