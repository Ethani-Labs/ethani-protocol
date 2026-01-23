from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "ETHANI Backend"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Demo Mode (for hackathon)
    DEMO_MODE: bool = False
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis
    REDIS_URL: Optional[str] = None
    CACHE_TTL: int = 300
    
    # Blockchain
    ARBITRUM_NETWORK: str = "sepolia"
    ARBITRUM_RPC_URL: str
    ARBITRUM_CHAIN_ID: int = 421614
    
    # Contract addresses (Arbitrum Sepolia - Deployed Jan 23, 2026)
    CONTRACT_ETHANI_PRICING: str = "0xc92fd01c122821Eb2C911d16468B20b07E25abC0"
    CONTRACT_ETHANI_REGION: str = "0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143"
    CONTRACT_ETHANI_INCENTIVE: str = "0xE6C246d7Ba92c4d35076C91B686d104ad3118172"
    CONTRACT_ETHANI_CORE: str = "0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4"
    CONTRACT_PRICE_ORACLE: str = "0x139a3036052761341212C7d06488C27fb000a167"

    # On-chain oracle signer
    ORACLE_PRIVATE_KEY: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Allow extra fields in .env
        
        @staticmethod
        def parse_env_var(field_name: str, raw_val: str):
            if field_name == "CORS_ORIGINS":
                # Handle both JSON format and comma-separated format
                if raw_val.startswith('['):
                    import json
                    return json.loads(raw_val)
                return [x.strip() for x in raw_val.split(',')]
            return raw_val


@lru_cache()
def get_settings() -> Settings:
    return Settings()
