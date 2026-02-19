import os
import json
from typing import Optional
from dotenv import load_dotenv

load_dotenv()


def _parse_cors_origins(raw: str) -> list:
    """Accept both JSON array and comma-separated CORS origins."""
    raw = raw.strip()
    if raw.startswith("["):
        return json.loads(raw)
    return [o.strip() for o in raw.split(",") if o.strip()]


class Config:
    API_TITLE = "ETHANI Pricing API"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "Rule-based food price stabilization"

    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    CORS_ORIGINS = _parse_cors_origins(
        os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8000")
    )
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]

    MAX_PRICE_INCREASE_BPS = 5000  # +50%
    MAX_PRICE_DECREASE_BPS = 3000  # -30%

    BLOCKCHAIN_ENABLED = os.getenv("BLOCKCHAIN_ENABLED", "False").lower() == "true"
    BLOCKCHAIN_RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "http://localhost:8545")
    BLOCKCHAIN_NETWORK = os.getenv("ARBITRUM_NETWORK", "sepolia")
    ARBITRUM_CHAIN_ID = int(os.getenv("ARBITRUM_CHAIN_ID", "421614"))

    # Contract Addresses (Arbitrum Sepolia)
    ETHANI_PRICING_ADDRESS = os.getenv("ETHANI_PRICING_ADDRESS", "0xc92fd01c122821Eb2C911d16468B20b07E25abC0")
    ETHANI_REGION_ADDRESS = os.getenv("ETHANI_REGION_ADDRESS", "0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143")

    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", None)
    CACHE_ENABLED = os.getenv("CACHE_ENABLED", "False").lower() == "true"


class DevelopmentConfig(Config):
    DEBUG = True
    LOG_LEVEL = "DEBUG"


class ProductionConfig(Config):
    DEBUG = False
    LOG_LEVEL = "INFO"
    CACHE_ENABLED = True


class TestingConfig(Config):
    DEBUG = True
    CORS_ORIGINS = ["*"]
    LOG_LEVEL = "DEBUG"


ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

if ENVIRONMENT == "production":
    config = ProductionConfig()
elif ENVIRONMENT == "testing":
    config = TestingConfig()
else:
    config = DevelopmentConfig()
