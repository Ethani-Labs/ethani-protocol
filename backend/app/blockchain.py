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


class ContractType(Enum):
    """Contract implementation type"""
    SOLIDITY = "solidity"  # Traditional EVM Solidity contracts
    STYLUS = "stylus"      # High-performance WASM contracts (Rust)


class ContractIntegration:
    """
    Integrates backend with smart contracts on Arbitrum (hybrid: Solidity + Stylus).
    
    Supports both:
    - Solidity contracts (EthaniCore, EthaniRegion, EthaniIncentive)
    - Stylus contracts (EthaniPricing, PriceOracle) - faster WASM execution
    
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
        
        # Arbitrum Sepolia contract addresses (deployed Jan 23, 2026)
        # SOLIDITY CONTRACTS
        self.pricing_contract_address = os.getenv(
            "ETHANI_PRICING_ADDRESS",
            "0xc92fd01c122821Eb2C911d16468B20b07E25abC0"
        )
        self.region_contract_address = os.getenv(
            "ETHANI_REGION_ADDRESS",
            "0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143"
        )
        
        # STYLUS CONTRACTS (Rust/WASM - High performance)
        self.pricing_stylus_address = os.getenv(
            "ETHANI_PRICING_STYLUS_ADDRESS",
            ""  # Will be set after Stylus deployment
        )
        self.regions_stylus_address = os.getenv(
            "ETHANI_REGIONS_STYLUS_ADDRESS",
            ""  # Will be set after Stylus deployment
        )
        
        # Arbitrum Sepolia RPC
        self.rpc_url = os.getenv(
            "BLOCKCHAIN_RPC_URL",
            "https://sepolia-rollup.arbitrum.io/rpc"
        )
        
        # Detect contract types and prefer Stylus when available
        self.use_stylus_pricing = bool(self.pricing_stylus_address)
        self.use_stylus_regions = bool(self.regions_stylus_address)
        
        # Detect if contracts are deployed
        self.contracts_available = bool(
            (self.pricing_contract_address or self.pricing_stylus_address) and 
            (self.region_contract_address or self.regions_stylus_address)
        )
        
        # If real mode requested but contracts not deployed, fallback to mock
        if mode == BlockchainMode.REAL and not self.contracts_available:
            print("⚠️  Real mode requested but contracts not deployed. Using MOCK mode.")
            self.mode = BlockchainMode.MOCK
        
        # Log contract configuration
        if self.mode == BlockchainMode.REAL:
            print(f"✅ Hybrid Contract Mode Enabled")
            print(f"  Pricing: {'Stylus' if self.use_stylus_pricing else 'Solidity'}")
            print(f"  Regions: {'Stylus' if self.use_stylus_regions else 'Solidity'}")
    
    def calculate_price(
        self,
        supply: int,
        demand: int,
        base_price: int,
        region: str = "Default"
    ) -> Dict:
        """
        Calculate price via smart contract (Solidity or Stylus).
        
        Hybrid approach:
        - Uses Stylus (WASM) when available (10x faster, cheaper gas)
        - Falls back to Solidity when Stylus not deployed
        - Falls back to local calculation if both unavailable
        
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
                # Try Stylus first (faster), fallback to Solidity
                if self.use_stylus_pricing:
                    return self._call_stylus_pricing_contract(supply, demand, base_price, region)
                else:
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
        Call EthaniPricing contract (Solidity) on Arbitrum Sepolia.
        
        Uses web3.py to call the deployed contract:
        Address: 0xc92fd01c122821Eb2C911d16468B20b07E25abC0
        
        Returns result exactly as contract provides it.
        """
        try:
            from web3 import Web3
            
            # Initialize web3 connection to Arbitrum Sepolia
            w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            
            # Check connection
            if not w3.is_connected():
                return self._fallback_to_base_price(base_price, "BLOCKCHAIN_UNAVAILABLE")
            
            # Contract ABI (minimal - just calculatePrice)
            abi = [
                {
                    "inputs": [
                        {"internalType": "uint256", "name": "supply", "type": "uint256"},
                        {"internalType": "uint256", "name": "demand", "type": "uint256"},
                        {"internalType": "uint256", "name": "basePrice", "type": "uint256"}
                    ],
                    "name": "calculatePrice",
                    "outputs": [
                        {"internalType": "uint256", "name": "finalPrice", "type": "uint256"},
                        {"internalType": "string", "name": "reason", "type": "string"},
                        {"internalType": "string", "name": "tier", "type": "string"}
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                }
            ]
            
            # Connect to contract on Arbitrum Sepolia
            contract = w3.eth.contract(address=w3.to_checksum_address(self.pricing_contract_address), abi=abi)
            
            # Call calculatePrice function (pure function, no gas cost)
            result = contract.functions.calculatePrice(supply, demand, base_price).call()
            
            # Unpack result: (finalPrice, reason, tier)
            final_price, reason_str, tier = result
            
            return {
                "final_price": final_price,
                "reason": f"{reason_str} [{tier}]",
                "source": "smart_contract_solidity",
                "contract_address": self.pricing_contract_address,
                "contract_type": "solidity",
                "ai_used": False
            }
            
        except Exception as e:
            print(f"❌ Solidity contract call failed: {e}")
            return self._fallback_to_base_price(base_price, "CONTRACT_CALL_FAILED")
    
    def _call_stylus_pricing_contract(
        self,
        supply: int,
        demand: int,
        base_price: int,
        region: str
    ) -> Dict:
        """
        Call EthaniPricing contract (Stylus/WASM) on Arbitrum.
        
        Uses web3.py to call the high-performance Rust contract compiled to WASM.
        Same logic as Solidity but ~10x faster execution with lower gas costs.
        
        Returns result exactly as contract provides it.
        """
        try:
            from web3 import Web3
            
            # Initialize web3 connection
            w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            
            # Check connection
            if not w3.is_connected():
                return self._fallback_to_base_price(base_price, "BLOCKCHAIN_UNAVAILABLE")
            
            # Stylus contract ABI (same interface as Solidity version)
            abi = [
                {
                    "inputs": [
                        {"internalType": "uint256", "name": "supply", "type": "uint256"},
                        {"internalType": "uint256", "name": "demand", "type": "uint256"},
                        {"internalType": "uint256", "name": "basePrice", "type": "uint256"}
                    ],
                    "name": "calculatePrice",
                    "outputs": [
                        {"internalType": "uint256", "name": "finalPrice", "type": "uint256"},
                        {"internalType": "string", "name": "reason", "type": "string"},
                        {"internalType": "string", "name": "tier", "type": "string"}
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
            
            # Connect to Stylus contract (WASM)
            contract = w3.eth.contract(address=w3.to_checksum_address(self.pricing_stylus_address), abi=abi)
            
            # Call calculatePrice function (WASM execution - much faster!)
            result = contract.functions.calculatePrice(supply, demand, base_price).call()
            
            # Unpack result: (finalPrice, reason, tier)
            final_price, reason_str, tier = result
            
            return {
                "final_price": final_price,
                "reason": f"{reason_str} [{tier}]",
                "source": "smart_contract_stylus",
                "contract_address": self.pricing_stylus_address,
                "contract_type": "stylus_wasm",
                "ai_used": False,
                "execution_type": "WASM"
            }
            
        except Exception as e:
            print(f"❌ Stylus contract call failed: {e}")
            # Fallback to Solidity version
            if self.pricing_contract_address:
                return self._call_pricing_contract(supply, demand, base_price, region)
            else:
                return self._fallback_to_base_price(base_price, "STYLUS_CALL_FAILED")
    
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


# Global contract instance (use REAL mode - contracts deployed on Arbitrum Sepolia)
blockchain = ContractIntegration(mode=BlockchainMode.REAL)


def update_blockchain_mode(mode: BlockchainMode):
    """Update global blockchain mode (for testing)."""
    global blockchain
    blockchain = ContractIntegration(mode=mode)
