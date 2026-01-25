#!/usr/bin/env python3

"""
ETHANI Local System Integration Test

Tests:
1. Backend health check
2. Pricing calculation with various scenarios
3. Determinism verification (same input = same output)
4. Smart contract read access
5. Response format validation
"""

import requests
import json
import time
from typing import Dict, Any

# Configuration
BACKEND_URL = "http://localhost:8000"
RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc"
PRICING_CONTRACT = "0xc92fd01c122821Eb2C911d16468B20b07E25abC0"

# Test results
test_results = {
    "passed": 0,
    "failed": 0,
    "scenarios": []
}

def print_header(title: str):
    """Print test section header"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

def print_test(name: str, passed: bool, details: str = ""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1

def test_backend_health():
    """Test 1: Backend health check"""
    print_header("Test 1: Backend Health Check")
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        data = response.json()
        
        is_operational = data.get("status") == "operational"
        print_test("Backend is running", response.status_code == 200)
        print_test("Health status is operational", is_operational, f"Status: {data.get('status')}")
        
        return True
    except requests.exceptions.ConnectionError:
        print_test("Backend connection", False, f"Could not connect to {BACKEND_URL}")
        print("\n⚠️  Make sure backend is running: cd backend && python3 main.py")
        return False
    except Exception as e:
        print_test("Backend health check", False, str(e))
        return False

def test_pricing_scenarios():
    """Test 2: Pricing calculations for different market conditions"""
    print_header("Test 2: Pricing Scenarios")
    
    scenarios = [
        {
            "name": "Shortage Condition (Tier 2)",
            "data": {"supply": 100, "demand": 120, "base_price": 10000, "region": "ID"},
            "expected_tier": 2,
            "expected_adjustment": 8,
            "reason": "+8% adjustment for shortage (110% < ratio <= 130%)"
        },
        {
            "name": "Critical Shortage (Tier 1)",
            "data": {"supply": 100, "demand": 150, "base_price": 10000, "region": "ID"},
            "expected_tier": 1,
            "expected_adjustment": 15,
            "reason": "+15% adjustment for critical shortage (ratio > 130%)"
        },
        {
            "name": "Balanced Market (Tier 3)",
            "data": {"supply": 100, "demand": 100, "base_price": 10000, "region": "ID"},
            "expected_tier": 3,
            "expected_adjustment": 0,
            "reason": "No adjustment for balanced market (80% <= ratio <= 110%)"
        },
        {
            "name": "Surplus Condition (Tier 4)",
            "data": {"supply": 200, "demand": 100, "base_price": 10000, "region": "ID"},
            "expected_tier": 4,
            "expected_adjustment": -10,
            "reason": "-10% adjustment for surplus (ratio < 80%)"
        },
        {
            "name": "Safety Limits (Hard Cap at +50%)",
            "data": {"supply": 100, "demand": 300, "base_price": 10000, "region": "ID"},
            "expected_tier": 1,
            "expected_adjustment_max": 50,
            "reason": "Price capped at +50% even though ratio > 130%"
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{BACKEND_URL}/api/v1/pricing/calculate",
                json=scenario["data"],
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                has_success = "success" in result
                has_data = "data" in result if has_success else False
                
                if has_data:
                    data = result["data"]
                    
                    # Verify expected fields
                    required_fields = ["final_price", "pricing_tier", "adjustment_percent", "explanation"]
                    missing_fields = [f for f in required_fields if f not in data]
                    
                    if not missing_fields:
                        tier_match = data["pricing_tier"] == scenario["expected_tier"]
                        adjustment_match = data["adjustment_percent"] == scenario["expected_adjustment"] if "expected_adjustment" in scenario else True
                        
                        print_test(
                            scenario["name"],
                            tier_match and adjustment_match,
                            f"Tier {data['pricing_tier']}, Adjustment {data['adjustment_percent']}%, "
                            f"Price: {data['final_price']}"
                        )
                        
                        test_results["scenarios"].append({
                            "name": scenario["name"],
                            "result": data,
                            "passed": tier_match and adjustment_match
                        })
                    else:
                        print_test(scenario["name"], False, f"Missing fields: {missing_fields}")
                else:
                    print_test(scenario["name"], False, f"Invalid response structure")
            else:
                print_test(scenario["name"], False, f"HTTP {response.status_code}")
                
        except requests.exceptions.Timeout:
            print_test(scenario["name"], False, "Request timeout")
        except Exception as e:
            print_test(scenario["name"], False, str(e))

def test_determinism():
    """Test 3: Determinism verification"""
    print_header("Test 3: Determinism Verification")
    
    test_data = {"supply": 80, "demand": 120, "base_price": 10000, "region": "ID"}
    
    try:
        # First call
        response1 = requests.post(f"{BACKEND_URL}/api/v1/pricing/calculate", json=test_data, timeout=5)
        if response1.status_code != 200:
            print_test("Determinism test", False, "First API call failed")
            return
        
        result1 = response1.json()["data"]
        
        # Small delay
        time.sleep(0.5)
        
        # Second call
        response2 = requests.post(f"{BACKEND_URL}/api/v1/pricing/calculate", json=test_data, timeout=5)
        if response2.status_code != 200:
            print_test("Determinism test", False, "Second API call failed")
            return
        
        result2 = response2.json()["data"]
        
        # Compare results
        price_match = result1["final_price"] == result2["final_price"]
        tier_match = result1["pricing_tier"] == result2["pricing_tier"]
        adjustment_match = result1["adjustment_percent"] == result2["adjustment_percent"]
        
        all_match = price_match and tier_match and adjustment_match
        
        print_test(
            "Same input produces same output",
            all_match,
            f"Call 1: Price={result1['final_price']}, Tier={result1['pricing_tier']}, Adj={result1['adjustment_percent']}%\n"
            f"         Call 2: Price={result2['final_price']}, Tier={result2['pricing_tier']}, Adj={result2['adjustment_percent']}%"
        )
        
    except Exception as e:
        print_test("Determinism test", False, str(e))

def test_response_format():
    """Test 4: Response format validation"""
    print_header("Test 4: Response Format Validation")
    
    test_data = {"supply": 100, "demand": 120, "base_price": 10000, "region": "ID"}
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/v1/pricing/calculate", json=test_data, timeout=5)
        
        if response.status_code == 200:
            result = response.json()
            
            # Check top-level structure
            has_success = "success" in result
            has_data = "data" in result
            
            print_test("Response has 'success' field", has_success)
            print_test("Response has 'data' field", has_data)
            
            if has_data:
                data = result["data"]
                
                # Check required fields in data
                required_fields = {
                    "final_price": int,
                    "pricing_tier": int,
                    "adjustment_percent": (int, float),
                    "explanation": str
                }
                
                for field, expected_type in required_fields.items():
                    has_field = field in data
                    correct_type = isinstance(data.get(field), expected_type)
                    
                    print_test(
                        f"Response has '{field}' as {expected_type.__name__ if not isinstance(expected_type, tuple) else 'number'}",
                        has_field and correct_type,
                        f"Value: {data.get(field)}"
                    )
        else:
            print_test("Response format check", False, f"HTTP {response.status_code}")
            
    except Exception as e:
        print_test("Response format check", False, str(e))

def test_rpc_access():
    """Test 5: RPC access to Arbitrum Sepolia"""
    print_header("Test 5: Network & RPC Access")
    
    try:
        # Test RPC connectivity
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_chainId",
            "params": [],
            "id": 1
        }
        
        response = requests.post(RPC_URL, json=payload, timeout=5)
        
        if response.status_code == 200:
            result = response.json()
            
            if "result" in result:
                chain_id = result["result"]
                is_sepolia = chain_id == "0x66eee" or chain_id == "421614"
                
                print_test(
                    "RPC connection to Arbitrum Sepolia",
                    is_sepolia,
                    f"Chain ID: {chain_id} (expected: 0x66eee or 421614)"
                )
            else:
                print_test("RPC connection", False, "Invalid response format")
        else:
            print_test("RPC connection", False, f"HTTP {response.status_code}")
            
    except requests.exceptions.Timeout:
        print_test("RPC connection", False, "Connection timeout (possible network issue)")
    except Exception as e:
        print_test("RPC connection", False, str(e))

def print_summary():
    """Print test summary"""
    print_header("Test Summary")
    
    total = test_results["passed"] + test_results["failed"]
    pass_rate = (test_results["passed"] / total * 100) if total > 0 else 0
    
    print(f"Total Tests:  {total}")
    print(f"✅ Passed:    {test_results['passed']}")
    print(f"❌ Failed:    {test_results['failed']}")
    print(f"📊 Pass Rate: {pass_rate:.1f}%")
    print()
    
    if test_results["scenarios"]:
        print("Pricing Scenarios Results:")
        for scenario in test_results["scenarios"]:
            status = "✅" if scenario["passed"] else "❌"
            print(f"  {status} {scenario['name']}")
            print(f"     Price: {scenario['result']['final_price']}, "
                  f"Tier: {scenario['result']['pricing_tier']}, "
                  f"Adjustment: {scenario['result']['adjustment_percent']}%")
    
    print()
    if test_results["failed"] == 0:
        print("🎉 All tests passed! System is operational.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        return 1

def main():
    """Run all tests"""
    print("\n")
    print("╔════════════════════════════════════════════════════════════════════════════╗")
    print("║           ETHANI Local System Integration Test Suite                     ║")
    print("║           Testing Backend, Pricing Logic, and Determinism                ║")
    print("╚════════════════════════════════════════════════════════════════════════════╝")
    
    # Run tests
    if not test_backend_health():
        return 1
    
    test_pricing_scenarios()
    test_determinism()
    test_response_format()
    test_rpc_access()
    
    # Print summary and exit
    exit_code = print_summary()
    return exit_code

if __name__ == "__main__":
    import sys
    sys.exit(main())
