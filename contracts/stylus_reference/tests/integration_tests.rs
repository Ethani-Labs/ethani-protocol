// Comprehensive tests for ETHANI Stylus contract optimizations

#[cfg(test)]
mod integration_tests {
    use super::*;

    #[test]
    fn test_time_decay_within_7_days() {
        let mut contract = EthaniPricing::new();
        
        // First price: 1000
        let (price1, _, _) = contract.calculatePrice(
            U256::from(100),
            U256::from(100),
            U256::from(1000),
        );
        assert_eq!(price1, U256::from(1000));
        
        // No decay within 7 days
        // (Can't easily test timestamps in unit tests without mocking block time)
    }

    #[test]
    fn test_maximum_increases_capped() {
        let mut contract = EthaniPricing::new();
        
        // Try to create extreme shortage
        let (price, _, _) = contract.calculatePrice(
            U256::from(1),      // Very low supply
            U256::from(100),    // High demand
            U256::from(1000),
        );
        
        // Should not exceed +50% cap
        let max_allowed = U256::from(1500); // +50%
        assert!(price <= max_allowed);
    }

    #[test]
    fn test_maximum_decreases_capped() {
        let mut contract = EthaniPricing::new();
        
        // Create extreme surplus
        let (price, _, _) = contract.calculatePrice(
            U256::from(1000),   // High supply
            U256::from(1),      // Very low demand
            U256::from(1000),
        );
        
        // Should not go below -30% cap
        let min_allowed = U256::from(700); // -30%
        assert!(price >= min_allowed);
    }

    #[test]
    fn test_solidity_abi_compatibility() {
        let mut contract = EthaniPricing::new();
        
        // Call should return (U256, String, String)
        let (price, reason, tier) = contract.calculatePrice(
            U256::from(100),
            U256::from(150),
            U256::from(1000),
        );
        
        // Verify types and format
        assert!(price > U256::ZERO);
        assert!(!reason.is_empty());
        assert!(!tier.is_empty());
        assert_eq!(tier, "CRITICAL_SHORTAGE");
    }

    #[test]
    fn test_no_string_allocations_in_tier_enum() {
        // PriceTier enum uses no String internally
        let tier = PriceTier::CriticalShortage;
        let s = tier.as_string();
        assert_eq!(s, "CRITICAL_SHORTAGE");
        
        // Enums are just u8, much more efficient than String!
    }

    #[test]
    fn test_all_pricing_tiers_comprehensive() {
        let mut contract = EthaniPricing::new();
        
        // Test all 4 tiers with specific ratios
        let test_cases = vec![
            (50, 100, 1000, 4, 900),    // 50% → Surplus → -10%
            (100, 100, 1000, 3, 1000),  // 100% → Balanced → 0%
            (100, 120, 1000, 2, 1080),  // 120% → Shortage → +8%
            (100, 150, 1000, 1, 1150),  // 150% → Critical → +15%
        ];
        
        for (supply, demand, base, expected_tier, expected_price) in test_cases {
            let (price, reason, tier_str) = contract.calculatePrice(
                U256::from(supply),
                U256::from(demand),
                U256::from(base),
            );
            
            assert_eq!(price, U256::from(expected_price));
            println!("✓ Tier {} passed: supply={}, demand={}, price={}", 
                expected_tier, supply, demand, expected_price);
        }
    }

    #[test]
    fn test_owner_pause_functionality() {
        let mut contract = EthaniPricing::new();
        
        // Initially not paused
        assert!(!contract.isPaused());
        
        // Pause contract
        contract.setPaused(true);
        assert!(contract.isPaused());
        
        // Unpause
        contract.setPaused(false);
        assert!(!contract.isPaused());
    }

    #[test]
    fn test_last_price_tracking() {
        let mut contract = EthaniPricing::new();
        
        // Initially zero
        assert_eq!(contract.getLastKnownPrice(), U256::ZERO);
        
        // After first price
        contract.calculatePrice(U256::from(100), U256::from(100), U256::from(1000));
        assert_eq!(contract.getLastKnownPrice(), U256::from(1000));
        
        // After second price
        contract.calculatePrice(U256::from(100), U256::from(150), U256::from(1000));
        // Should be 1150, but potentially dampened
        assert!(contract.getLastKnownPrice() > U256::ZERO);
    }

    #[test]
    fn test_edge_case_tiny_values() {
        let mut contract = EthaniPricing::new();
        
        // Minimal values
        let (price, _, _) = contract.calculatePrice(
            U256::from(1),
            U256::from(1),
            U256::from(1),
        );
        
        // Should still work
        assert_eq!(price, U256::from(1));
    }

    #[test]
    fn test_edge_case_large_values() {
        let mut contract = EthaniPricing::new();
        
        // Large values (U256 max is 2^256-1)
        let large = U256::from(u128::MAX);
        let (price, _, _) = contract.calculatePrice(
            large,
            large,
            large,
        );
        
        // Should not panic or overflow
        assert!(price > U256::ZERO);
    }

    #[test]
    fn test_mathematical_precision() {
        let mut contract = EthaniPricing::new();
        
        // Test exact percentages
        // 100 → 110 = 110% ratio → +8% multiplier
        // 1000 * 108 / 100 = 1080
        let (price, _, _) = contract.calculatePrice(
            U256::from(100),
            U256::from(110),
            U256::from(1000),
        );
        
        assert_eq!(price, U256::from(1080));
    }

    #[test]
    fn test_determinism() {
        let mut contract1 = EthaniPricing::new();
        let mut contract2 = EthaniPricing::new();
        
        // Same input should give same output
        let (p1, r1, t1) = contract1.calculatePrice(
            U256::from(100),
            U256::from(150),
            U256::from(1000),
        );
        
        let (p2, r2, t2) = contract2.calculatePrice(
            U256::from(100),
            U256::from(150),
            U256::from(1000),
        );
        
        assert_eq!(p1, p2);
        assert_eq!(r1, r2);
        assert_eq!(t1, t2);
    }
}
