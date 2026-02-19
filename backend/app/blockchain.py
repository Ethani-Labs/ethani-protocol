"""
ETHANI Blockchain Integration

Connects to deployed smart contracts on Arbitrum Sepolia:
- EthaniPricing  (Solidity) — deterministic price calculation
- EthaniRegion   (Solidity) — regional base price storage
- Stylus/WASM    (optional) — high-performance variant, preferred when deployed

Fallback chain: Stylus → Solidity → local calculation
"""

import os
from typing import Dict
from enum import Enum


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
    MOCK = "mock"
    REAL = "real"


class ContractType(Enum):
    SOLIDITY = "solidity"
    STYLUS = "stylus"


class ContractIntegration:
    """
    Hybrid smart contract integration (Solidity + optional Stylus/WASM).
    Falls back to local pricing if contracts are unavailable.
    """

    def __init__(self, mode: BlockchainMode = BlockchainMode.MOCK):
        self.mode = mode

        # Solidity contract addresses (Arbitrum Sepolia, deployed Jan 23 2026)
        self.pricing_contract_address = os.getenv(
            "ETHANI_PRICING_ADDRESS",
            "0xc92fd01c122821Eb2C911d16468B20b07E25abC0"
        )
        self.region_contract_address = os.getenv(
            "ETHANI_REGION_ADDRESS",
            "0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143"
        )

        # Stylus (WASM) contract addresses — preferred when deployed
        self.pricing_stylus_address = os.getenv("ETHANI_PRICING_STYLUS_ADDRESS", "")
        self.regions_stylus_address = os.getenv("ETHANI_REGIONS_STYLUS_ADDRESS", "")

        self.rpc_url = os.getenv(
            "BLOCKCHAIN_RPC_URL",
            "https://sepolia-rollup.arbitrum.io/rpc"
        )

        self.use_stylus_pricing = bool(self.pricing_stylus_address)
        self.use_stylus_regions = bool(self.regions_stylus_address)

        self.contracts_available = bool(
            (self.pricing_contract_address or self.pricing_stylus_address) and
            (self.region_contract_address or self.regions_stylus_address)
        )

        if mode == BlockchainMode.REAL and not self.contracts_available:
            print("Warning: Real mode requested but contracts not found. Falling back to MOCK.")
            self.mode = BlockchainMode.MOCK

        if self.mode == BlockchainMode.REAL:
            pricing_type = "Stylus" if self.use_stylus_pricing else "Solidity"
            region_type = "Stylus" if self.use_stylus_regions else "Solidity"
            print(f"Hybrid Contract Mode — Pricing: {pricing_type} | Regions: {region_type}")

    def calculate_price(self, supply: int, demand: int, base_price: int, region: str = "Default") -> Dict:
        """Calculate price via smart contract with local fallback."""
        if self.mode == BlockchainMode.REAL and self.contracts_available:
            try:
                if self.use_stylus_pricing:
                    return self._call_stylus_pricing_contract(supply, demand, base_price, region)
                else:
                    return self._call_pricing_contract(supply, demand, base_price, region)
            except Exception as e:
                print(f"Contract call failed: {e}")
                return self._fallback_to_base_price(base_price, "CONTRACT_UNAVAILABLE")

        return self._mock_pricing_calculation(supply, demand, base_price, region)

    def _call_pricing_contract(self, supply: int, demand: int, base_price: int, region: str) -> Dict:
        """Call EthaniPricing (Solidity) on Arbitrum Sepolia."""
        try:
            from web3 import Web3

            w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            if not w3.is_connected():
                return self._fallback_to_base_price(base_price, "BLOCKCHAIN_UNAVAILABLE")

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

            contract = w3.eth.contract(
                address=w3.to_checksum_address(self.pricing_contract_address),
                abi=abi
            )
            final_price, reason_str, tier = contract.functions.calculatePrice(supply, demand, base_price).call()

            return {
                "final_price": final_price,
                "reason": f"{reason_str} [{tier}]",
                "source": "smart_contract_solidity",
                "contract_address": self.pricing_contract_address,
                "ai_used": False
            }
        except Exception as e:
            print(f"Solidity contract call failed: {e}")
            return self._fallback_to_base_price(base_price, "CONTRACT_CALL_FAILED")

    def _call_stylus_pricing_contract(self, supply: int, demand: int, base_price: int, region: str) -> Dict:
        """Call EthaniPricing (Stylus/WASM) — same interface, faster execution."""
        try:
            from web3 import Web3

            w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            if not w3.is_connected():
                return self._fallback_to_base_price(base_price, "BLOCKCHAIN_UNAVAILABLE")

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

            contract = w3.eth.contract(
                address=w3.to_checksum_address(self.pricing_stylus_address),
                abi=abi
            )
            final_price, reason_str, tier = contract.functions.calculatePrice(supply, demand, base_price).call()

            return {
                "final_price": final_price,
                "reason": f"{reason_str} [{tier}]",
                "source": "smart_contract_stylus",
                "contract_address": self.pricing_stylus_address,
                "execution_type": "WASM",
                "ai_used": False
            }
        except Exception as e:
            print(f"Stylus contract call failed: {e}")
            if self.pricing_contract_address:
                return self._call_pricing_contract(supply, demand, base_price, region)
            return self._fallback_to_base_price(base_price, "STYLUS_CALL_FAILED")

    def _mock_pricing_calculation(self, supply: int, demand: int, base_price: int, region: str) -> Dict:
        """Local pricing — mirrors EthaniPricing.sol logic exactly."""
        if supply <= 0:
            return self._fallback_to_base_price(base_price, "INSUFFICIENT_DATA")

        ratio = demand / supply

        if ratio > 1.30:
            multiplier, reason = 1.15, "Critical shortage (ratio > 1.30)"
        elif ratio > 1.10:
            multiplier, reason = 1.08, "Shortage (ratio > 1.10)"
        elif ratio < 0.80:
            multiplier, reason = 0.90, "Surplus (ratio < 0.80)"
        else:
            multiplier, reason = 1.0, "Balanced (0.80–1.10)"

        calculated_price = int(base_price * multiplier)
        max_allowed = int(base_price * 1.50)
        min_allowed = int(base_price * 0.70)

        is_capped = False
        if calculated_price > max_allowed:
            calculated_price = max_allowed
            reason += " [CAPPED +50%]"
            is_capped = True
        elif calculated_price < min_allowed:
            calculated_price = min_allowed
            reason += " [FLOORED -30%]"
            is_capped = True

        return {
            "final_price": calculated_price,
            "reason": reason,
            "source": "mock_pricing" if self.mode == BlockchainMode.MOCK else "smart_contract",
            "is_capped": is_capped,
            "audit": {
                "supply": supply,
                "demand": demand,
                "ratio": round(ratio, 2),
                "multiplier": multiplier,
                "base_price": base_price
            }
        }

    def _fallback_to_base_price(self, base_price: int, reason: str) -> Dict:
        """Return base price unchanged when contracts are unavailable."""
        return {
            "final_price": base_price,
            "reason": reason,
            "source": "fallback",
            "is_capped": False,
            "audit": {"fallback_reason": reason, "base_price": base_price}
        }

    def get_base_price(self, region: str) -> int:
        """Get regional base price from contract or mock."""
        if self.mode == BlockchainMode.REAL and self.contracts_available:
            try:
                return self._call_region_contract_get_base_price(region)
            except Exception as e:
                print(f"Region contract call failed: {e}")
                return self._mock_base_price(region)
        return self._mock_base_price(region)

    def _call_region_contract_get_base_price(self, region: str) -> int:
        raise NotImplementedError("Deploy EthaniRegion contract first.")

    def _mock_base_price(self, region: str) -> int:
        prices = {
            "default": 10000,
            "minahasa_selatan": 10500,
            "java": 9800,
            "sumatra": 10200,
        }
        return prices.get(region.lower().replace(" ", "_"), prices["default"])

    def health_check(self) -> Dict:
        return {
            "mode": self.mode.value,
            "contracts_deployed": self.contracts_available,
            "pricing_contract": self.pricing_contract_address or "NOT_SET",
            "region_contract": self.region_contract_address or "NOT_SET",
            "stylus_pricing": self.pricing_stylus_address or "NOT_SET",
            "rpc_url": self.rpc_url,
            "ready": self.mode == BlockchainMode.REAL and self.contracts_available
        }


blockchain = ContractIntegration(mode=BlockchainMode.REAL)


def update_blockchain_mode(mode: BlockchainMode):
    global blockchain
    blockchain = ContractIntegration(mode=mode)
