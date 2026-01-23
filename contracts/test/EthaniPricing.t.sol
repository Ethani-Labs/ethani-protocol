// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {EthaniPricing} from "../src/EthaniPricing.sol";

/**
 * @title EthaniPricingTest
 * @notice Unit tests for EthaniPricing contract
 * 
 * Tests cover:
 * - All 4 pricing tiers (shortage, balanced, surplus, critical)
 * - Edge cases (zero supply, extreme ratios)
 * - Ratio and tier calculations
 * 
 * Run with:
 * forge test -vvv
 */

contract EthaniPricingTest is Test {
    EthaniPricing public pricing;
    
    // ==================== SETUP ====================
    
    function setUp() public {
        pricing = new EthaniPricing();
    }
    
    // ==================== CRITICAL SHORTAGE TESTS ====================
    
    /**
     * @notice Test critical shortage pricing (+15%)
     * Demand/Supply ratio > 1.30
     */
    function test_CriticalShortage() public {
        // Supply: 100, Demand: 150, Ratio: 1.50 (> 1.30)
        (uint256 finalPrice, string memory reason, string memory tier) 
            = pricing.calculatePrice(100, 150, 100);
        
        // Expected: 100 * 1.15 = 115
        assertEq(finalPrice, 115, "Price should be +15%");
        assertEq(tier, "CRITICAL_SHORTAGE", "Tier should be CRITICAL_SHORTAGE");
        assertTrue(bytes(reason).length > 0, "Reason should not be empty");
    }
    
    /**
     * @notice Test extreme critical shortage
     */
    function test_ExtremeCriticalShortage() public {
        // Supply: 10, Demand: 200, Ratio: 20.00 (>> 1.30)
        (uint256 finalPrice, , ) = pricing.calculatePrice(10, 200, 100);
        
        // Should still be +15% (no hard limits in this contract version)
        assertEq(finalPrice, 115, "Price should be +15% even in extreme shortage");
    }
    
    // ==================== SHORTAGE TESTS ====================
    
    /**
     * @notice Test shortage pricing (+8%)
     * Demand/Supply ratio > 1.10 and <= 1.30
     */
    function test_Shortage() public {
        // Supply: 100, Demand: 120, Ratio: 1.20 (> 1.10, < 1.30)
        (uint256 finalPrice, string memory reason, string memory tier) 
            = pricing.calculatePrice(100, 120, 100);
        
        // Expected: 100 * 1.08 = 108
        assertEq(finalPrice, 108, "Price should be +8%");
        assertEq(tier, "SHORTAGE", "Tier should be SHORTAGE");
        assertTrue(bytes(reason).length > 0, "Reason should not be empty");
    }
    
    /**
     * @notice Test boundary: exactly at shortage threshold
     */
    function test_ShortageAtThreshold() public {
        // Ratio exactly 1.10
        (uint256 finalPrice, , ) = pricing.calculatePrice(100, 110, 100);
        
        assertEq(finalPrice, 108, "Price at 1.10 ratio should be +8%");
    }
    
    // ==================== BALANCED TESTS ====================
    
    /**
     * @notice Test balanced pricing (0%)
     * Demand/Supply ratio between 0.80 and 1.10
     */
    function test_BalancedMarket() public {
        // Supply: 100, Demand: 100, Ratio: 1.00 (balanced)
        (uint256 finalPrice, string memory reason, string memory tier) 
            = pricing.calculatePrice(100, 100, 100);
        
        // Expected: 100 * 1.00 = 100
        assertEq(finalPrice, 100, "Price should be unchanged in balanced market");
        assertEq(tier, "BALANCED", "Tier should be BALANCED");
        assertTrue(bytes(reason).length > 0, "Reason should not be empty");
    }
    
    /**
     * @notice Test near-balanced market
     */
    function test_AlmostBalanced() public {
        // Supply: 100, Demand: 95, Ratio: 0.95 (balanced range)
        (uint256 finalPrice, , string memory tier) = pricing.calculatePrice(100, 95, 100);
        
        assertEq(finalPrice, 100, "Price should be 0% in balanced range");
        assertEq(tier, "BALANCED", "Should be BALANCED tier");
    }
    
    // ==================== SURPLUS TESTS ====================
    
    /**
     * @notice Test surplus pricing (-10%)
     * Demand/Supply ratio <= 0.80
     */
    function test_Surplus() public {
        // Supply: 200, Demand: 100, Ratio: 0.50 (< 0.80)
        (uint256 finalPrice, string memory reason, string memory tier) 
            = pricing.calculatePrice(200, 100, 100);
        
        // Expected: 100 * 0.90 = 90
        assertEq(finalPrice, 90, "Price should be -10%");
        assertEq(tier, "SURPLUS", "Tier should be SURPLUS");
        assertTrue(bytes(reason).length > 0, "Reason should not be empty");
    }
    
    /**
     * @notice Test boundary: exactly at surplus threshold
     */
    function test_SurplusAtThreshold() public {
        // Ratio exactly 0.80
        (uint256 finalPrice, , ) = pricing.calculatePrice(125, 100, 100);
        
        assertEq(finalPrice, 90, "Price at 0.80 ratio should be -10%");
    }
    
    /**
     * @notice Test extreme surplus
     */
    function test_ExtremeSurplus() public {
        // Supply: 1000, Demand: 10, Ratio: 0.01 (extreme surplus)
        (uint256 finalPrice, , ) = pricing.calculatePrice(1000, 10, 100);
        
        // Should be -10% (no hard limits in basic version)
        assertEq(finalPrice, 90, "Price should be -10% in extreme surplus");
    }
    
    // ==================== EDGE CASE TESTS ====================
    
    /**
     * @notice Test zero supply handling
     * Should return base price
     */
    function test_ZeroSupply() public {
        (uint256 finalPrice, string memory reason, ) 
            = pricing.calculatePrice(0, 100, 100);
        
        assertEq(finalPrice, 100, "Should return base price when supply is zero");
        assertGt(bytes(reason).length, 0, "Should provide a reason");
    }
    
    /**
     * @notice Test zero demand
     * Should return base price (balanced)
     */
    function test_ZeroDemand() public {
        // Zero demand = ratio 0, which triggers SURPLUS (-10%)
        (uint256 finalPrice, string memory reason, string memory tier) = pricing.calculatePrice(100, 0, 100);
        
        assertEq(finalPrice, 90, "Should apply -10% when demand is zero (surplus)");
        assertEq(tier, "SURPLUS");
    }
    
    /**
     * @notice Test with different base prices
     */
    function test_DifferentBasePrices() public {
        // Same ratio, different base prices
        (uint256 price1, , ) = pricing.calculatePrice(100, 150, 100);
        (uint256 price2, , ) = pricing.calculatePrice(100, 150, 200);
        
        // Both should be +15% of their base price
        assertEq(price1, 115, "Price1 should be 115");
        assertEq(price2, 230, "Price2 should be 230 (200 * 1.15)");
        
        // Ratio should be same, prices proportional
        assertEq(price2 / price1, 2, "Prices should scale with base price");
    }
    
    // ==================== RATIO CALCULATION TESTS ====================
    
    /**
     * @notice Test supply-demand ratio calculation
     */
    function test_SupplyDemandRatio() public {
        uint256 ratio = pricing.getSupplyDemandRatio(100, 150);
        
        // Expected: (150 / 100) * 100 = 150
        assertEq(ratio, 150, "Ratio should be 150 (1.50 * 100)");
    }
    
    /**
     * @notice Test ratio zero supply
     */
    function test_RatioZeroSupply() public {
        uint256 ratio = pricing.getSupplyDemandRatio(0, 100);
        
        assertEq(ratio, 0, "Ratio should be 0 when supply is zero");
    }
    
    // ==================== TIER DETERMINATION TESTS ====================
    
    /**
     * @notice Test pricing tier determination
     */
    function test_PricingTiers() public {
        // Critical shortage: ratio >= 130
        assertEq(pricing.getPricingTier(130), "CRITICAL_SHORTAGE");
        assertEq(pricing.getPricingTier(150), "CRITICAL_SHORTAGE");
        
        // Shortage: ratio >= 110 and < 130
        assertEq(pricing.getPricingTier(110), "SHORTAGE");
        assertEq(pricing.getPricingTier(120), "SHORTAGE");
        
        // Balanced: ratio < 110 and > 80
        assertEq(pricing.getPricingTier(100), "BALANCED");
        assertEq(pricing.getPricingTier(90), "BALANCED");
        
        // Surplus: ratio <= 80
        assertEq(pricing.getPricingTier(80), "SURPLUS");
        assertEq(pricing.getPricingTier(50), "SURPLUS");
    }
    
    /**
     * @notice Test price multiplier retrieval
     */
    function test_PriceMultipliers() public {
        // Each ratio should return correct multiplier
        assertEq(pricing.getPriceMultiplier(150), 1150); // +15%
        assertEq(pricing.getPriceMultiplier(120), 1080); // +8%
        assertEq(pricing.getPriceMultiplier(100), 1000); // 0%
        assertEq(pricing.getPriceMultiplier(50), 900);   // -10%
    }
    
    // ==================== RULES REFERENCE TEST ====================
    
    /**
     * @notice Test pricing rules can be retrieved
     */
    function test_PricingRulesReference() public {
        (uint256 critical, uint256 shortage, uint256 surplus) 
            = pricing.getPricingRules();
        
        assertEq(critical, 130, "Critical threshold should be 130");
        assertEq(shortage, 110, "Shortage threshold should be 110");
        assertEq(surplus, 80, "Surplus threshold should be 80");
    }
}
