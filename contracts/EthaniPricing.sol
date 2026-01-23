// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EthaniPricing
 * @notice Rule-based pricing system using supply-demand formula.
 * 
 * RULES (no AI, fully transparent):
 * - Price adjusts based on supply-demand ratio
 * - Hard floor/ceiling prevents extreme volatility
 * - Price caps protect consumers, floor protects farmers
 * - All math is deterministic and auditable
 */

contract EthaniPricing {
    
    // ========== PRICING TIERS (EXPLICIT AND AUDITABLE) ==========
    
    /**
     * SUPPLY-DEMAND RATIO TIERS:
     * Ratio = (Demand / Supply) * 100
     * 
     * Ratio >130:  +15% (critical shortage)
     * Ratio >110:  +8%  (shortage)
     * Ratio 80-110: 0%  (balanced)
     * Ratio <80:   -10% (surplus)
     */

    // Price multipliers (in basis points: 10000 = 1x)
    uint256 public constant CRITICAL_SHORTAGE_MULTIPLIER = 11500; // +15%
    uint256 public constant SHORTAGE_MULTIPLIER = 10800;          // +8%
    uint256 public constant NORMAL_MULTIPLIER = 10000;            // 0% (baseline)
    uint256 public constant SURPLUS_MULTIPLIER = 9000;            // -10%

    // Supply-demand ratio thresholds (in percentage units)
    uint256 public constant CRITICAL_SHORTAGE_THRESHOLD = 130;
    uint256 public constant SHORTAGE_THRESHOLD = 110;
    uint256 public constant SURPLUS_THRESHOLD = 80;

    // Hard limits to prevent extreme price swings
    uint256 public constant MAX_PRICE_INCREASE_BPS = 5000;  // Max +50%
    uint256 public constant MAX_PRICE_DECREASE_BPS = 3000;  // Max -30%

    // ========== STATE & EVENTS ==========

    address public owner;
    bool public emergencyHaltActive;

    mapping(uint256 => PriceRecord) public priceHistory;
    uint256 public priceHistoryCount;

    struct PriceRecord {
        uint256 timestamp;
        uint256 supply;
        uint256 demand;
        uint256 basePrice;
        uint256 calculatedPrice;
        string reason;
    }

    event PriceCalculated(
        uint256 indexed regionId,
        uint256 supply,
        uint256 demand,
        uint256 basePrice,
        uint256 newPrice,
        string reason
    );
    event EmergencyHalt(bool active);
    event OwnershipTransferred(address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emergencyHaltActive = false;
    }

    // ========== MAIN PRICING FUNCTION ==========

    /**
     * @notice Calculate price based on supply-demand ratio.
     * @param supply Current food supply in the region
     * @param demand Current food demand in the region
     * @param basePrice Base/reference price for the food item
     * @return newPrice The calculated price after adjustments
     * @return reason Plain English explanation of the calculation
     */
    function calculatePrice(
        uint256 supply,
        uint256 demand,
        uint256 basePrice
    ) public view returns (uint256 newPrice, string memory reason) {
        require(!emergencyHaltActive, "Emergency halt active");
        require(basePrice > 0, "Base price must be positive");

        // If no supply, price stays at base
        if (supply == 0) {
            return (basePrice, "No supply available");
        }

        // Calculate demand-supply ratio (in percentage)
        // ratio = (demand / supply) * 100
        uint256 ratio = (demand * 100) / supply;

        // Determine multiplier based on ratio
        uint256 multiplier;
        string memory ratioReason;

        if (ratio > CRITICAL_SHORTAGE_THRESHOLD) {
            multiplier = CRITICAL_SHORTAGE_MULTIPLIER;
            ratioReason = "Critical shortage (ratio > 130%)";
        } else if (ratio > SHORTAGE_THRESHOLD) {
            multiplier = SHORTAGE_MULTIPLIER;
            ratioReason = "Shortage (ratio > 110%)";
        } else if (ratio < SURPLUS_THRESHOLD) {
            multiplier = SURPLUS_MULTIPLIER;
            ratioReason = "Surplus (ratio < 80%)";
        } else {
            multiplier = NORMAL_MULTIPLIER;
            ratioReason = "Balanced supply-demand (80-110%)";
        }

        // Apply multiplier
        uint256 calculatedPrice = (basePrice * multiplier) / 10000;

        // Apply hard limits to prevent extreme swings
        uint256 maxAllowedPrice = (basePrice * (10000 + MAX_PRICE_INCREASE_BPS)) / 10000;
        uint256 minAllowedPrice = (basePrice * (10000 - MAX_PRICE_DECREASE_BPS)) / 10000;

        if (calculatedPrice > maxAllowedPrice) {
            calculatedPrice = maxAllowedPrice;
            ratioReason = string(abi.encodePacked(ratioReason, " [CAPPED at +50%]"));
        } else if (calculatedPrice < minAllowedPrice) {
            calculatedPrice = minAllowedPrice;
            ratioReason = string(abi.encodePacked(ratioReason, " [FLOORED at -30%]"));
        }

        return (calculatedPrice, ratioReason);
    }

    // ========== GOVERNANCE & SAFETY ==========

    /**
     * @notice Record a price calculation to on-chain history for transparency.
     */
    function recordPrice(
        uint256 regionId,
        uint256 supply,
        uint256 demand,
        uint256 basePrice
    ) external {
        (uint256 newPrice, string memory reason) = calculatePrice(supply, demand, basePrice);

        priceHistory[priceHistoryCount] = PriceRecord({
            timestamp: block.timestamp,
            supply: supply,
            demand: demand,
            basePrice: basePrice,
            calculatedPrice: newPrice,
            reason: reason
        });

        emit PriceCalculated(regionId, supply, demand, basePrice, newPrice, reason);
        priceHistoryCount++;
    }

    /**
     * @notice Emergency halt for price calculations (safeguard against bugs/attacks).
     */
    function setEmergencyHalt(bool _halt) external onlyOwner {
        emergencyHaltActive = _halt;
        emit EmergencyHalt(_halt);
    }

    /**
     * @notice Transfer ownership to a new address.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
        emit OwnershipTransferred(newOwner);
    }

    // ========== VIEW FUNCTIONS (AUDITING) ==========

    /**
     * @notice Get the supply-demand ratio for display/analysis.
     */
    function getSupplyDemandRatio(uint256 supply, uint256 demand) public pure returns (uint256) {
        if (supply == 0) return 0;
        return (demand * 100) / supply;
    }

    /**
     * @notice Get a price record from history.
     */
    function getPriceRecord(uint256 index) external view returns (PriceRecord memory) {
        return priceHistory[index];
    }
}
