/// Example usage of ETHANI Pricing contract
/// 
/// Shows how to:
/// 1. Initialize contract
/// 2. Calculate prices in different market conditions
/// 3. Handle results

fn main() {
    println!("🦀 ETHANI Pricing - Stylus Contract Example\n");

    // Initialize contract
    let contract = EthaniPricing::new();

    // Example 1: Critical Shortage
    println!("Example 1: Critical Shortage");
    println!("─────────────────────────────");
    let (price, reason, tier) = contract.calculate_price(
        U256::from(100),    // supply: 100 tons
        U256::from(150),    // demand: 150 tons
        U256::from(10000),  // base_price: 10,000 wei
    );
    println!("  Supply: 100 tons");
    println!("  Demand: 150 tons");
    println!("  Ratio: 150% (>130% threshold)");
    println!("  Tier: {} (Critical Shortage)", tier);
    println!("  Base Price: 10,000 wei");
    println!("  Final Price: {} wei (+15%)", price);
    println!("  Reason: {}\n", reason);

    // Example 2: Shortage
    println!("Example 2: Shortage");
    println!("─────────────────────");
    let (price, reason, tier) = contract.calculate_price(
        U256::from(100),
        U256::from(120),
        U256::from(10000),
    );
    println!("  Supply: 100 tons");
    println!("  Demand: 120 tons");
    println!("  Ratio: 120% (110-130% range)");
    println!("  Tier: {} (Shortage)", tier);
    println!("  Base Price: 10,000 wei");
    println!("  Final Price: {} wei (+8%)", price);
    println!("  Reason: {}\n", reason);

    // Example 3: Balanced Market
    println!("Example 3: Balanced Market");
    println!("──────────────────────────");
    let (price, reason, tier) = contract.calculate_price(
        U256::from(100),
        U256::from(100),
        U256::from(10000),
    );
    println!("  Supply: 100 tons");
    println!("  Demand: 100 tons");
    println!("  Ratio: 100% (within 80-110% range)");
    println!("  Tier: {} (Balanced)", tier);
    println!("  Base Price: 10,000 wei");
    println!("  Final Price: {} wei (0%)", price);
    println!("  Reason: {}\n", reason);

    // Example 4: Surplus
    println!("Example 4: Surplus");
    println!("──────────────────");
    let (price, reason, tier) = contract.calculate_price(
        U256::from(200),
        U256::from(100),
        U256::from(10000),
    );
    println!("  Supply: 200 tons");
    println!("  Demand: 100 tons");
    println!("  Ratio: 50% (<80% threshold)");
    println!("  Tier: {} (Surplus)", tier);
    println!("  Base Price: 10,000 wei");
    println!("  Final Price: {} wei (-10%)", price);
    println!("  Reason: {}\n", reason);

    // Example 5: Extreme Shortage with Safety Limits
    println!("Example 5: Extreme Shortage (Safety Limits)");
    println!("──────────────────────────────────────────");
    let (price, reason, tier) = contract.calculate_price(
        U256::from(10),     // Very low supply
        U256::from(100),    // High demand
        U256::from(10000),
    );
    println!("  Supply: 10 tons (very low)");
    println!("  Demand: 100 tons (very high)");
    println!("  Ratio: 1000% (way over 130%)");
    println!("  Would suggest: +15% → but CAPPED");
    println!("  Tier: {} (Critical Shortage)", tier);
    println!("  Base Price: 10,000 wei");
    println!("  Final Price: {} wei (capped at +50%)", price);
    println!("  Reason: {}\n", reason);
    println!("  ✅ Safety limits prevent price shock!\n");

    println!("═════════════════════════════════════════");
    println!("✅ All examples complete");
    println!("═════════════════════════════════════════");
}

/// Real-world scenario: Indonesian Rice Market
fn rice_market_scenario() {
    println!("\n📊 Real-World Scenario: Indonesian Rice Market");
    println!("═════════════════════════════════════════════\n");

    let contract = EthaniPricing::new();

    // Scenario: Sudden drought reduces supply
    println!("Scenario: Drought reduces rice supply");
    println!("─────────────────────────────────────");
    
    // Before drought
    println!("\n🟢 BEFORE (Normal conditions):");
    let (price_before, _, _) = contract.calculate_price(
        U256::from(500000),  // 500,000 tons supply
        U256::from(480000),  // 480,000 tons demand
        U256::from(10000),   // Rp 10,000 base price
    );
    println!("  Supply: 500,000 tons (normal)");
    println!("  Demand: 480,000 tons (normal)");
    println!("  Price: {} Rp/kg (balanced)", price_before);

    // After drought
    println!("\n🔴 AFTER (Drought strikes):");
    let (price_after, reason, tier) = contract.calculate_price(
        U256::from(300000),  // 300,000 tons (40% reduction)
        U256::from(480000),  // Still 480,000 tons demand
        U256::from(10000),   // Same base price
    );
    println!("  Supply: 300,000 tons (-40%)");
    println!("  Demand: 480,000 tons (unchanged)");
    println!("  Ratio: 160% → CRITICAL SHORTAGE");
    println!("  Tier: {} (Shortage)", tier);
    println!("  Price: {} Rp/kg (+15%)", price_after);
    println!("  Reason: {}", reason);
    println!("\n✅ Price signal encourages:");
    println!("   - Farmers to plant more rice");
    println!("   - Imports from other regions");
    println!("   - Consumer awareness");
    println!("   - Protects farmer income");
}
