// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EthaniPricing
 * @notice Core rule-based pricing logic for ETHANI
 * 
 * Implements deterministic, transparent price calculation
 * based on supply-demand ratio. No randomness. No AI.
 * 
 * Pricing Rules:
 * - supply == 0 → return base price
 * - demand/supply ≥ 1.30 → price = base × 1.15 (critical shortage)
 * - demand/supply ≥ 1.10 → price = base × 1.08 (shortage)
 * - demand/supply ≤ 0.80 → price = base × 0.90 (surplus)
 * - else → price = base (balanced)
 */

contract EthaniPricing {
    // ==================== CONSTANTS ====================
    
    // Ratio thresholds (using basis points: 100 = 1%)
    uint256 constant CRITICAL_SHORTAGE_RATIO = 130; // 1.30
    uint256 constant SHORTAGE_RATIO = 110;          // 1.10
    uint256 constant SURPLUS_RATIO = 80;            // 0.80
    
    // Price multipliers (in basis points: 1000 = 1x)
    uint256 constant CRITICAL_SHORTAGE_MULTIPLIER = 1150; // 1.15x
    uint256 constant SHORTAGE_MULTIPLIER = 1080;          // 1.08x
    uint256 constant NORMAL_MULTIPLIER = 1000;            // 1.00x
    uint256 constant SURPLUS_MULTIPLIER = 900;            // 0.90x
    
    // ==================== EVENTS ====================
    
    event PriceCalculated(
        uint256 indexed supply,
        uint256 indexed demand,
        uint256 basePrice,
        uint256 finalPrice,
        string tier,
        string reason
    );
    
    // ==================== CORE PRICING LOGIC ====================
    
    /**
     * @notice Calculate fair food price based on supply and demand
     * @dev Pure function - no state modification
     * @param supply Available food supply
     * @param demand Market demand for food
     * @param basePrice Base/reference price
     * @return finalPrice Calculated fair price
     * @return reason Human-readable explanation
     * @return tier Pricing tier name
     */
    function calculatePrice(
        uint256 supply,
        uint256 demand,
        uint256 basePrice
    )
        external
        pure
        returns (
            uint256 finalPrice,
            string memory reason,
            string memory tier
        )
    {
        // Safety check: zero supply returns base price
        if (supply == 0) {
            return (
                basePrice,
                "No supply available - using base price",
                "ERROR"
            );
        }
        
        // Calculate ratio: (demand / supply) * 100
        // Using integer math to avoid floating point issues
        uint256 ratio = (demand * 100) / supply;
        
        // Determine tier and multiplier based on ratio
        uint256 multiplier;
        string memory tierName;
        string memory explanation;
        
        if (ratio >= CRITICAL_SHORTAGE_RATIO) {
            // Demand significantly exceeds supply
            multiplier = CRITICAL_SHORTAGE_MULTIPLIER;
            tierName = "CRITICAL_SHORTAGE";
            explanation = "Demand far exceeds supply (+15%)";
        } else if (ratio >= SHORTAGE_RATIO) {
            // Demand exceeds supply
            multiplier = SHORTAGE_MULTIPLIER;
            tierName = "SHORTAGE";
            explanation = "Demand exceeds supply (+8%)";
        } else if (ratio <= SURPLUS_RATIO) {
            // Supply exceeds demand
            multiplier = SURPLUS_MULTIPLIER;
            tierName = "SURPLUS";
            explanation = "Supply exceeds demand (-10%)";
        } else {
            // Supply and demand balanced
            multiplier = NORMAL_MULTIPLIER;
            tierName = "BALANCED";
            explanation = "Supply and demand balanced (0%)";
        }
        
        // Calculate final price: basePrice * (multiplier / 1000)
        finalPrice = (basePrice * multiplier) / 1000;
        
        return (finalPrice, explanation, tierName);
    }
    
    /**
     * @notice Get the supply-demand ratio for analysis
     * @dev Public function for ratio inspection
     * @param supply Available supply
     * @param demand Current demand
     * @return ratio The ratio * 100 (for integer math)
     */
    function getSupplyDemandRatio(uint256 supply, uint256 demand)
        external
        pure
        returns (uint256 ratio)
    {
        if (supply == 0) return 0;
        return (demand * 100) / supply;
    }
    
    /**
     * @notice Get the pricing tier for a given ratio
     * @param ratio Supply-demand ratio (as returned by getSupplyDemandRatio)
     * @return tier Name of the pricing tier
     */
    function getPricingTier(uint256 ratio)
        external
        pure
        returns (string memory tier)
    {
        if (ratio >= CRITICAL_SHORTAGE_RATIO) {
            return "CRITICAL_SHORTAGE";
        } else if (ratio >= SHORTAGE_RATIO) {
            return "SHORTAGE";
        } else if (ratio <= SURPLUS_RATIO) {
            return "SURPLUS";
        } else {
            return "BALANCED";
        }
    }
    
    /**
     * @notice Get the price multiplier for a given ratio
     * @param ratio Supply-demand ratio (as returned by getSupplyDemandRatio)
     * @return multiplier Price multiplier in basis points (1000 = 1x)
     */
    function getPriceMultiplier(uint256 ratio)
        external
        pure
        returns (uint256 multiplier)
    {
        if (ratio >= CRITICAL_SHORTAGE_RATIO) {
            return CRITICAL_SHORTAGE_MULTIPLIER;
        } else if (ratio >= SHORTAGE_RATIO) {
            return SHORTAGE_MULTIPLIER;
        } else if (ratio <= SURPLUS_RATIO) {
            return SURPLUS_MULTIPLIER;
        } else {
            return NORMAL_MULTIPLIER;
        }
    }
    
    // ==================== RULES REFERENCE ====================
    
    /**
     * @notice Get all pricing rules as a reference
     * @return criticalThreshold Critical shortage threshold (ratio >= this)
     * @return shortageThreshold Shortage threshold (ratio >= this)
     * @return surplusThreshold Surplus threshold (ratio <= this)
     */
    function getPricingRules()
        external
        pure
        returns (
            uint256 criticalThreshold,
            uint256 shortageThreshold,
            uint256 surplusThreshold
        )
    {
        return (
            CRITICAL_SHORTAGE_RATIO,
            SHORTAGE_RATIO,
            SURPLUS_RATIO
        );
    }
}
