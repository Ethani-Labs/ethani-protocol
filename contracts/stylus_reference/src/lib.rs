//! ETHANI Pricing - Rust/Stylus Implementation
//! High-performance rule-based food price stabilization
//! 
//! Compiled to WASM for Arbitrum Stylus
//! Deployed at: 0xf174bC196b4e0886aeA7e48D91661798B376F57C

use stylus_sdk::prelude::*;
use stylus_sdk::msg;

/// Price calculation result
#[derive(Clone)]
pub struct PriceResult {
    pub final_price: u256,
    pub reason: String,
    pub tier: u8,
    pub multiplier: u32, // in basis points (e.g., 1150 = 11.50x)
}

/// Main contract state
#[solidity_storage]
pub struct EthaniPricing {
    pub owner: Address,
    pub paused: bool,
}

/// Contract implementation
#[contract]
impl EthaniPricing {
    /// Initialize contract
    pub fn new() -> Self {
        Self {
            owner: msg::sender(),
            paused: false,
        }
    }

    /// Calculate price based on supply & demand
    /// 
    /// # Arguments
    /// * `supply` - Food supply in units
    /// * `demand` - Food demand in units  
    /// * `base_price` - Base price reference in wei
    /// 
    /// # Returns
    /// (final_price, reason_string, tier_number)
    pub fn calculate_price(
        &self,
        supply: U256,
        demand: U256,
        base_price: U256,
    ) -> (U256, String, u8) {
        require!(!self.paused, "Contract is paused");
        require!(supply > U256::ZERO, "Supply must be > 0");
        require!(base_price > U256::ZERO, "Base price must be > 0");

        // STEP 1: Calculate supply-demand ratio
        // Ratio = (Demand / Supply) × 100
        let ratio = if supply == U256::ZERO {
            U256::from(0)
        } else {
            (demand * U256::from(100)) / supply
        };

        // STEP 2: Determine tier & multiplier (in basis points)
        let (tier, multiplier_bp, reason) = self.determine_tier(ratio);

        // STEP 3: Apply multiplier to base price
        let calculated_price = (base_price * U256::from(multiplier_bp)) / U256::from(10000);

        // STEP 4: Check time decay (would need timestamp context)
        // Decay: -0.5% per day after 7 days (simplified)

        // STEP 5: Apply safety limits
        let final_price = self.apply_safety_limits(base_price, calculated_price);

        // STEP 6: Apply volatility dampening
        // Max 20% change per update (would need previous_price context)

        (final_price, reason, tier)
    }

    /// Determine pricing tier based on ratio
    /// Returns: (tier_number, multiplier_bp, reason_string)
    fn determine_tier(&self, ratio: U256) -> (u8, u32, String) {
        match ratio {
            // Critical Shortage: ratio > 130% → +15%
            r if r > U256::from(130) => {
                (1, 11500, "Critical Shortage - Demand > 130% Supply".to_string())
            }
            // Shortage: ratio 110-130% → +8%
            r if r > U256::from(110) => {
                (2, 10800, "Shortage - Demand 110-130% Supply".to_string())
            }
            // Balanced: ratio 80-110% → 0%
            r if r >= U256::from(80) => {
                (3, 10000, "Balanced - Market Equilibrium".to_string())
            }
            // Surplus: ratio < 80% → -10%
            _ => (4, 9000, "Surplus - Demand < 80% Supply".to_string()),
        }
    }

    /// Apply hard safety limits to prevent price shock
    /// Max increase: +50%
    /// Max decrease: -30%
    fn apply_safety_limits(&self, base_price: U256, calculated_price: U256) -> U256 {
        // Maximum 50% increase
        let max_increase = (base_price * U256::from(15000)) / U256::from(10000);
        // Minimum 30% decrease
        let max_decrease = (base_price * U256::from(7000)) / U256::from(10000);

        if calculated_price > max_increase {
            return max_increase;
        }
        if calculated_price < max_decrease {
            return max_decrease;
        }
        calculated_price
    }

    /// Pause/unpause contract (emergency)
    pub fn set_paused(&mut self, paused: bool) {
        require!(msg::sender() == self.owner, "Only owner");
        self.paused = paused;
    }

    /// Check if contract is paused
    pub fn is_paused(&self) -> bool {
        self.paused
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_critical_shortage() {
        let contract = EthaniPricing::new();
        
        // Supply: 100, Demand: 150 → ratio 150% → +15%
        let (price, reason, tier) = contract.calculate_price(
            U256::from(100),
            U256::from(150),
            U256::from(1000),
        );

        assert_eq!(tier, 1); // Critical shortage
        assert!(price > U256::from(1000)); // Price increased
        assert_eq!(price, U256::from(1150)); // +15%
    }

    #[test]
    fn test_shortage() {
        let contract = EthaniPricing::new();
        
        // Supply: 100, Demand: 120 → ratio 120% → +8%
        let (price, _, tier) = contract.calculate_price(
            U256::from(100),
            U256::from(120),
            U256::from(1000),
        );

        assert_eq!(tier, 2); // Shortage
        assert_eq!(price, U256::from(1080)); // +8%
    }

    #[test]
    fn test_balanced() {
        let contract = EthaniPricing::new();
        
        // Supply: 100, Demand: 95 → ratio 95% → 0%
        let (price, _, tier) = contract.calculate_price(
            U256::from(100),
            U256::from(95),
            U256::from(1000),
        );

        assert_eq!(tier, 3); // Balanced
        assert_eq!(price, U256::from(1000)); // No change
    }

    #[test]
    fn test_surplus() {
        let contract = EthaniPricing::new();
        
        // Supply: 200, Demand: 100 → ratio 50% → -10%
        let (price, _, tier) = contract.calculate_price(
            U256::from(200),
            U256::from(100),
            U256::from(1000),
        );

        assert_eq!(tier, 4); // Surplus
        assert_eq!(price, U256::from(900)); // -10%
    }

    #[test]
    fn test_safety_limits() {
        let contract = EthaniPricing::new();
        
        // Extreme shortage: ratio 300% would suggest +30%, but capped at +50%
        let (price, _, _) = contract.calculate_price(
            U256::from(100),
            U256::from(300),
            U256::from(1000),
        );

        // Should be capped at +50%
        assert_eq!(price, U256::from(1500)); // Not higher
    }

    #[test]
    fn test_zero_supply_fails() {
        let contract = EthaniPricing::new();
        
        // Should fail - zero supply
        let result = std::panic::catch_unwind(|| {
            contract.calculate_price(
                U256::from(0),
                U256::from(100),
                U256::from(1000),
            )
        });

        assert!(result.is_err());
    }
}
