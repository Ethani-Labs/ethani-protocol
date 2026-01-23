"""
ETHANI Backend Configuration

Environment-specific settings and defaults.
"""

import os
from typing import Optional

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
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8000").split(",")
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]
    
    # Pricing Engine Settings
    MAX_PRICE_INCREASE_BPS = 5000  # +50%
    MAX_PRICE_DECREASE_BPS = 3000  # -30%
    
    # Blockchain Settings
    BLOCKCHAIN_ENABLED = os.getenv("BLOCKCHAIN_ENABLED", "False").lower() == "true"
    BLOCKCHAIN_RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "http://localhost:8545")
    BLOCKCHAIN_NETWORK = os.getenv("BLOCKCHAIN_NETWORK", "mantle-testnet")
    
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
