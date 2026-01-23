"""
ETHANI Blockchain Integration Layer

Handles smart contract interaction for:
- EthaniPricing: Calculate fair prices
- EthaniRegion: Store and fetch base prices
- EthaniIncentive: Track farmer points

This layer supports both:
1. Real contracts (when deployed to Mantle Testnet)
2. Mock contracts (for development & testing)
"""

import os
import json
from typing import Dict, Tuple, Optional
from enum import Enum

# Contract ABIs (minimal - just what we need)
ETHANI_PRICING_ABI = [
    {
        "name": "calculatePrice",
        "type": "function",
        "inputs": [
            {"name": "supply", "type": "uint256"},
            {"name": "demand", "type": "uint256"},
            {"name": "basePrice", "type": "uint256"}
        ],
        "outputs": [
            {"name": "newPrice", "type": "uint256"},
            {"name": "reason", "type": "string"}
        ],
        "stateMutability": "view"
    }
]

ETHANI_REGION_ABI = [
    {
        "name": "getBasePrice",
        "type": "function",
        "inputs": [{"name": "regionId", "type": "uint256"}],
        "outputs": [{"name": "price", "type": "uint256"}],
        "stateMutability": "view"
    },
    {
        "name": "setBasePrice",
        "type": "function",
        "inputs": [
            {"name": "regionId", "type": "uint256"},
            {"name": "price", "type": "uint256"}
        ],
        "stateMutability": "nonpayable"
    }
]


class BlockchainMode(Enum):
    """Blockchain operation mode"""
    MOCK = "mock"          # Local calculations (for development)
    REAL = "real"          # Real contract calls (requires deployed contracts)


class ContractIntegration:
    """
    Integrates backend with smart contracts on Mantle Testnet.
    
    Supports fallback to local pricing if contracts unavailable.
    Per spec: "Backend must fetch from contracts, not calculate locally"
    """
    
    def __init__(self, mode: BlockchainMode = BlockchainMode.MOCK):
        """
        Initialize contract integration.
        
        Args:
            mode: BlockchainMode.MOCK (development) or BlockchainMode.REAL (production)
        """
        self.mode = mode
        self.pricing_contract_address = os.getenv("ETHANI_PRICING_ADDRESS", "")
        self.region_contract_address = os.getenv("ETHANI_REGION_ADDRESS", "")
        self.rpc_url = os.getenv("BLOCKCHAIN_RPC_URL", "https://rpc.testnet.mantle.xyz")
        
        # Detect if contracts are deployed
        self.contracts_available = bool(
            self.pricing_contract_address and 
            self.region_contract_address
        )
        
        # If real mode requested but contracts not deployed, fallback to mock
        if mode == BlockchainMode.REAL and not self.contracts_available:
            print("⚠️  Real mode requested but contracts not deployed. Using MOCK mode.")
            self.mode = BlockchainMode.MOCK
    
    def calculate_price(
        self,
        supply: int,
        demand: int,
        base_price: int,
        region: str = "Default"
    ) -> Dict:
        """
        Calculate price via smart contract or mock.
        
        Per Spec Section III:
        Backend must "Call pricing contracts" and return result.
        
        Args:
            supply: Food supply units
            demand: Food demand units
            base_price: Base/reference price
            region: Region name (for logging)
            
        Returns:
            Dict with: final_price, reason, source (contract or local)
        """
        
        if self.mode == BlockchainMode.REAL and self.contracts_available:
            try:
                return self._call_pricing_contract(supply, demand, base_price, region)
            except Exception as e:
                print(f"❌ Contract call failed: {e}")
                return self._fallback_to_base_price(base_price, "CONTRACT_UNAVAILABLE")
        
        else:  # MOCK mode
            return self._mock_pricing_calculation(supply, demand, base_price, region)
    
    def _call_pricing_contract(
        self,
        supply: int,
        demand: int,
        base_price: int,
        region: str
    ) -> Dict:
        """
        Call EthaniPricing contract on Mantle Testnet.
        
        This is implemented when contracts are deployed.
        For now, raises NotImplementedError with clear message.
        """
        raise NotImplementedError(
            "Contract calls require deployed contracts. "
            "Use MOCK mode or deploy contracts first."
        )
    
    def _mock_pricing_calculation(
        self,
        supply: int,
        demand: int,
        base_price: int,
        region: str
    ) -> Dict:
        """
        Mock pricing calculation.
        Uses same logic as smart contract for consistency.
        
        This mimics EthaniPricing.sol logic exactly.
        """
        
        # Validate
        if supply <= 0:
            return self._fallback_to_base_price(base_price, "INSUFFICIENT_DATA")
        
        if demand < 0:
            return self._fallback_to_base_price(base_price, "INSUFFICIENT_DATA")
        
        # Calculate ratio
        ratio = demand / supply
        
        # Determine multiplier (MUST match contract)
        if ratio > 1.30:
            multiplier = 1.15
            tier_reason = "Critical shortage (ratio > 1.30)"
        elif ratio > 1.10:
            multiplier = 1.08
            tier_reason = "Shortage (ratio > 1.10)"
        elif ratio < 0.80:
            multiplier = 0.90
            tier_reason = "Surplus (ratio < 0.80)"
        else:
            multiplier = 1.0
            tier_reason = "Balanced (0.80-1.10)"
        
        # Apply multiplier
        calculated_price = int(base_price * multiplier)
        
        # Apply hard limits (MUST match contract)
        max_allowed = int(base_price * 1.50)  # +50%
        min_allowed = int(base_price * 0.70)  # -30%
        
        is_capped = False
        if calculated_price > max_allowed:
            calculated_price = max_allowed
            tier_reason += " [CAPPED +50%]"
            is_capped = True
        elif calculated_price < min_allowed:
            calculated_price = min_allowed
            tier_reason += " [FLOORED -30%]"
            is_capped = True
        
        return {
            "final_price": calculated_price,
            "reason": tier_reason,
            "source": "mock_pricing" if self.mode == BlockchainMode.MOCK else "smart_contract",
            "is_capped": is_capped,
            "audit": {
                "supply": supply,
                "demand": demand,
                "ratio": round(ratio, 2),
                "multiplier": multiplier,
                "base_price": base_price,
                "calculated_price": calculated_price
            }
        }
    
    def _fallback_to_base_price(
        self,
        base_price: int,
        reason: str
    ) -> Dict:
        """
        Fallback to base price per Spec Section VI.
        
        Per spec:
        - Smart contract failure → fallback to base price
        - Missing data → fallback to base price
        """
        return {
            "final_price": base_price,
            "reason": reason,
            "source": "fallback",
            "is_capped": False,
            "audit": {
                "fallback_reason": reason,
                "base_price": base_price
            }
        }
    
    def get_base_price(self, region: str) -> int:
        """
        Get base price for region from contract or mock.
        
        Per Spec Section III:
        Backend must "Fetch base price from contracts"
        """
        
        if self.mode == BlockchainMode.REAL and self.contracts_available:
            try:
                return self._call_region_contract_get_base_price(region)
            except Exception as e:
                print(f"❌ Contract call failed: {e}")
                return self._mock_base_price(region)
        
        else:  # MOCK mode
            return self._mock_base_price(region)
    
    def _call_region_contract_get_base_price(self, region: str) -> int:
        """Call EthaniRegion.getBasePrice contract."""
        raise NotImplementedError(
            "Contract calls require deployed contracts. "
            "Use MOCK mode or deploy contracts first."
        )
    
    def _mock_base_price(self, region: str) -> int:
        """Mock base prices for different regions."""
        # Default prices per region (Indonesia market)
        mock_prices = {
            "default": 10000,
            "minahasa_selatan": 10500,
            "java": 9800,
            "sumatra": 10200,
        }
        
        region_key = region.lower().replace(" ", "_")
        return mock_prices.get(region_key, mock_prices["default"])
    
    def health_check(self) -> Dict:
        """Check blockchain integration health."""
        return {
            "mode": self.mode.value,
            "contracts_deployed": self.contracts_available,
            "pricing_contract": self.pricing_contract_address or "NOT_SET",
            "region_contract": self.region_contract_address or "NOT_SET",
            "rpc_url": self.rpc_url,
            "ready": self.mode == BlockchainMode.REAL and self.contracts_available
        }


# Global contract instance (use MOCK mode by default)
blockchain = ContractIntegration(mode=BlockchainMode.MOCK)


def update_blockchain_mode(mode: BlockchainMode):
    """Update global blockchain mode (for testing)."""
    global blockchain
    blockchain = ContractIntegration(mode=mode)
