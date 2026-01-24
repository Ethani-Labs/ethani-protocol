// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IEthaniCore.sol";

/**
 * @title PriceOracle
 * @notice Advanced rule-based pricing engine for ETHANI food price stabilization
 *
 * @dev ARCHITECTURE PRINCIPLES:
 * - Source of truth for all price calculations
 * - Deterministic, rule-based logic (NO AI/ML)
 * - Multi-product support with configurable pricing tiers
 * - Time-weighted adjustments for seasonal variations
 * - Gas-optimized with comprehensive event logging
 * - Full integration with EthaniCore data layer
 *
 * @dev PRICING METHODOLOGY:
 * 1. Base price from EthaniCore region data
 * 2. Supply-demand ratio calculation
 * 3. Apply tier-based multipliers
 * 4. Time decay adjustments (freshness)
 * 5. Product-specific rule overlays
 * 6. Hard floor/ceiling enforcement
 * 7. Volatility dampening (max change per update)
 */
contract PriceOracle is AccessControl, ReentrancyGuard, Pausable {

    // ========== ROLES ==========

    bytes32 public constant PRICE_UPDATER_ROLE = keccak256("PRICE_UPDATER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant CONFIGURATOR_ROLE = keccak256("CONFIGURATOR_ROLE");

    // ========== CONSTANTS ==========

    uint256 private constant BASIS_POINTS = 10000; // 100.00%
    uint256 private constant RATIO_PRECISION = 100; // For percentage calculations

    // Default pricing tiers (can be overridden per product)
    uint256 public constant DEFAULT_CRITICAL_SHORTAGE_MULTIPLIER = 11500; // +15%
    uint256 public constant DEFAULT_SHORTAGE_MULTIPLIER = 10800;          // +8%
    uint256 public constant DEFAULT_NORMAL_MULTIPLIER = 10000;            // 0%
    uint256 public constant DEFAULT_SURPLUS_MULTIPLIER = 9000;            // -10%
    uint256 public constant DEFAULT_EXTREME_SURPLUS_MULTIPLIER = 8500;    // -15%

    // Default thresholds
    uint256 public constant DEFAULT_CRITICAL_SHORTAGE_THRESHOLD = 130; // Demand/Supply > 130%
    uint256 public constant DEFAULT_SHORTAGE_THRESHOLD = 110;          // Demand/Supply > 110%
    uint256 public constant DEFAULT_SURPLUS_THRESHOLD = 80;            // Demand/Supply < 80%
    uint256 public constant DEFAULT_EXTREME_SURPLUS_THRESHOLD = 60;    // Demand/Supply < 60%

    // Safety limits
    uint256 public maxPriceIncreaseBPS = 5000;  // Max +50% per update
    uint256 public maxPriceDecreaseBPS = 3000;  // Max -30% per update
    uint256 public maxVolatilityBPS = 2000;     // Max 20% change from previous price

    // Time-based parameters
    uint256 public priceDecayRate = 50;         // 0.5% decay per day if stale (BPS/day)
    uint256 public stalePriceThreshold = 7 days; // Price considered stale after 7 days

    // ========== STATE VARIABLES ==========

    IEthaniCore public ethaniCore;

    // Product-specific pricing configurations
    mapping(uint256 => ProductPricingConfig) public productConfigs;

    // Price calculation history for transparency
    mapping(uint256 => PriceCalculation[]) public priceHistory;

    // Latest calculated prices per region
    mapping(uint256 => uint256) public latestPrices;
    mapping(uint256 => uint256) public lastPriceUpdateTime;

    // Circuit breaker for emergency situations
    bool public emergencyShutdown;

    // ========== STRUCTS ==========

    struct ProductPricingConfig {
        bool isConfigured;
        uint256 criticalShortageMultiplier;
        uint256 shortageMultiplier;
        uint256 normalMultiplier;
        uint256 surplusMultiplier;
        uint256 extremeSurplusMultiplier;
        uint256 criticalShortageThreshold;
        uint256 shortageThreshold;
        uint256 surplusThreshold;
        uint256 extremeSurplusThreshold;
        bool enableTimeDecay;
        uint256 customDecayRate; // BPS per day
    }

    struct PriceCalculation {
        uint256 timestamp;
        uint256 supply;
        uint256 demand;
        uint256 basePrice;
        uint256 previousPrice;
        uint256 calculatedPrice;
        uint256 finalPrice;
        uint256 supplyDemandRatio;
        uint256 appliedMultiplier;
        PriceAdjustmentReason adjustmentReason;
        bool wasCapped;
        bool wasFloored;
        bool hadVolatilityDampening;
    }

    enum PriceAdjustmentReason {
        CRITICAL_SHORTAGE,
        SHORTAGE,
        NORMAL,
        SURPLUS,
        EXTREME_SURPLUS,
        NO_SUPPLY,
        EMERGENCY_OVERRIDE
    }

    // ========== EVENTS ==========

    event PriceCalculated(
        uint256 indexed regionId,
        uint256 indexed productId,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 supplyDemandRatio,
        PriceAdjustmentReason reason,
        uint256 timestamp
    );

    event PriceAdjusted(
        uint256 indexed regionId,
        uint256 originalPrice,
        uint256 adjustedPrice,
        string adjustmentType
    );

    event ProductConfigured(
        uint256 indexed productId,
        uint256 criticalShortageMultiplier,
        uint256 shortageMultiplier,
        uint256 surplusMultiplier
    );

    event SafetyLimitsUpdated(
        uint256 maxPriceIncreaseBPS,
        uint256 maxPriceDecreaseBPS,
        uint256 maxVolatilityBPS
    );

    event EmergencyShutdownToggled(bool active, address indexed triggeredBy);

    event EthaniCoreUpdated(address indexed oldCore, address indexed newCore);

    // ========== CONSTRUCTOR ==========

    /**
     * @notice Initialize the PriceOracle with EthaniCore reference
     * @param _ethaniCore Address of the EthaniCore contract
     * @param _admin Address to receive admin role
     */
    constructor(address _ethaniCore, address _admin) {
        require(_ethaniCore != address(0), "PriceOracle: Invalid core address");
        require(_admin != address(0), "PriceOracle: Invalid admin address");

        ethaniCore = IEthaniCore(_ethaniCore);

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(PRICE_UPDATER_ROLE, _admin);
        _grantRole(EMERGENCY_ROLE, _admin);
        _grantRole(CONFIGURATOR_ROLE, _admin);
    }

    // ========== CORE PRICING FUNCTIONS ==========

    /**
     * @notice Calculate price for a region using rule-based algorithm
     * @param regionId The region identifier
     * @return finalPrice The calculated stabilized price
     * @return reason Human-readable explanation of the calculation
     * @return details Detailed calculation breakdown for transparency
     */
    function calculatePrice(uint256 regionId)
        public
        view
        whenNotPaused
        returns (
            uint256 finalPrice,
            string memory reason,
            PriceCalculation memory details
        )
    {
        require(!emergencyShutdown, "PriceOracle: Emergency shutdown active");
        require(regionId < ethaniCore.regionCount(), "PriceOracle: Invalid region");

        IEthaniCore.Region memory region = ethaniCore.getRegion(regionId);

        // Initialize calculation struct
        details.timestamp = block.timestamp;
        details.supply = region.foodSupply;
        details.demand = region.foodDemand;
        details.basePrice = region.basePrice;
        details.previousPrice = latestPrices[regionId] > 0 ? latestPrices[regionId] : region.basePrice;

        // Handle zero supply edge case
        if (region.foodSupply == 0) {
            details.calculatedPrice = region.basePrice;
            details.finalPrice = region.basePrice;
            details.adjustmentReason = PriceAdjustmentReason.NO_SUPPLY;
            return (region.basePrice, "No supply available - using base price", details);
        }

        // Calculate supply-demand ratio
        details.supplyDemandRatio = (region.foodDemand * RATIO_PRECISION) / region.foodSupply;

        // Get product config (use defaults if not configured for this region)
        ProductPricingConfig memory config = _getEffectiveConfig(regionId);

        // Determine multiplier and reason based on ratio
        (details.appliedMultiplier, details.adjustmentReason) = _determineMultiplier(
            details.supplyDemandRatio,
            config
        );

        // Apply base calculation
        details.calculatedPrice = (region.basePrice * details.appliedMultiplier) / BASIS_POINTS;

        // Apply time decay if enabled and price is stale
        if (config.enableTimeDecay) {
            details.calculatedPrice = _applyTimeDecay(
                details.calculatedPrice,
                region.lastUpdateTime,
                config.customDecayRate > 0 ? config.customDecayRate : priceDecayRate
            );
        }

        // Apply safety limits (floor and ceiling)
        (details.finalPrice, details.wasCapped, details.wasFloored) = _applySafetyLimits(
            details.calculatedPrice,
            region.basePrice
        );

        // Apply volatility dampening
        (details.finalPrice, details.hadVolatilityDampening) = _applyVolatilityDampening(
            details.finalPrice,
            details.previousPrice
        );

        // Generate human-readable reason
        reason = _generatePriceReason(details);

        return (details.finalPrice, reason, details);
    }

    /**
     * @notice Calculate and record price on-chain
     * @param regionId The region to calculate price for
     * @return newPrice The newly calculated price
     */
    function updatePrice(uint256 regionId)
        external
        nonReentrant
        whenNotPaused
        onlyRole(PRICE_UPDATER_ROLE)
        returns (uint256 newPrice)
    {
        return _updatePriceInternal(regionId);
    }

    /**
     * @notice Batch update prices for multiple regions (gas-optimized)
     * @param regionIds Array of region IDs to update
     * @return newPrices Array of newly calculated prices
     */
    function batchUpdatePrices(uint256[] calldata regionIds)
        external
        nonReentrant
        whenNotPaused
        onlyRole(PRICE_UPDATER_ROLE)
        returns (uint256[] memory newPrices)
    {
        newPrices = new uint256[](regionIds.length);

        for (uint256 i = 0; i < regionIds.length; i++) {
            newPrices[i] = _updatePriceInternal(regionIds[i]);
        }

        return newPrices;
    }

    /**
     * @notice Internal function to update price (called by updatePrice and batchUpdatePrices)
     * @param regionId The region to calculate price for
     * @return newPrice The newly calculated price
     */
    function _updatePriceInternal(uint256 regionId)
        internal
        returns (uint256 newPrice)
    {
        (uint256 price, , PriceCalculation memory details) = calculatePrice(regionId);

        uint256 oldPrice = latestPrices[regionId];
        latestPrices[regionId] = price;
        lastPriceUpdateTime[regionId] = block.timestamp;

        // Store in history for transparency
        priceHistory[regionId].push(details);

        emit PriceCalculated(
            regionId,
            0, // productId placeholder for future multi-product support
            oldPrice,
            price,
            details.supplyDemandRatio,
            details.adjustmentReason,
            block.timestamp
        );

        return price;
    }

    // ========== CONFIGURATION FUNCTIONS ==========

    /**
     * @notice Configure product-specific pricing rules
     * @param productId The product identifier (use 0 for default/all products)
     * @param config The pricing configuration struct
     */
    function configureProduct(uint256 productId, ProductPricingConfig calldata config)
        external
        onlyRole(CONFIGURATOR_ROLE)
    {
        require(config.criticalShortageMultiplier >= BASIS_POINTS, "PriceOracle: Invalid critical multiplier");
        require(config.normalMultiplier == BASIS_POINTS, "PriceOracle: Normal multiplier must be 100%");
        require(config.surplusMultiplier <= BASIS_POINTS, "PriceOracle: Invalid surplus multiplier");

        productConfigs[productId] = config;
        productConfigs[productId].isConfigured = true;

        emit ProductConfigured(
            productId,
            config.criticalShortageMultiplier,
            config.shortageMultiplier,
            config.surplusMultiplier
        );
    }

    /**
     * @notice Update safety limits for price changes
     * @param _maxIncrease Maximum price increase per update (BPS)
     * @param _maxDecrease Maximum price decrease per update (BPS)
     * @param _maxVolatility Maximum volatility from previous price (BPS)
     */
    function updateSafetyLimits(
        uint256 _maxIncrease,
        uint256 _maxDecrease,
        uint256 _maxVolatility
    )
        external
        onlyRole(CONFIGURATOR_ROLE)
    {
        require(_maxIncrease <= BASIS_POINTS, "PriceOracle: Invalid max increase");
        require(_maxDecrease <= BASIS_POINTS, "PriceOracle: Invalid max decrease");
        require(_maxVolatility <= BASIS_POINTS, "PriceOracle: Invalid max volatility");

        maxPriceIncreaseBPS = _maxIncrease;
        maxPriceDecreaseBPS = _maxDecrease;
        maxVolatilityBPS = _maxVolatility;

        emit SafetyLimitsUpdated(_maxIncrease, _maxDecrease, _maxVolatility);
    }

    /**
     * @notice Update reference to EthaniCore contract
     * @param _newCore Address of new EthaniCore contract
     */
    function updateEthaniCore(address _newCore)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_newCore != address(0), "PriceOracle: Invalid address");
        address oldCore = address(ethaniCore);
        ethaniCore = IEthaniCore(_newCore);
        emit EthaniCoreUpdated(oldCore, _newCore);
    }

    // ========== EMERGENCY FUNCTIONS ==========

    /**
     * @notice Toggle emergency shutdown (stops all price calculations)
     */
    function toggleEmergencyShutdown() external onlyRole(EMERGENCY_ROLE) {
        emergencyShutdown = !emergencyShutdown;
        emit EmergencyShutdownToggled(emergencyShutdown, msg.sender);
    }

    /**
     * @notice Pause contract (prevents price updates but allows reads)
     */
    function pause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyRole(EMERGENCY_ROLE) {
        _unpause();
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @notice Get latest price for a region
     * @param regionId The region identifier
     * @return price Latest calculated price (returns base price if never calculated)
     */
    function getLatestPrice(uint256 regionId) external view returns (uint256 price) {
        if (latestPrices[regionId] > 0) {
            return latestPrices[regionId];
        }

        IEthaniCore.Region memory region = ethaniCore.getRegion(regionId);
        return region.basePrice;
    }

    /**
     * @notice Get full price history for a region
     * @param regionId The region identifier
     * @return history Array of all price calculations
     */
    function getPriceHistory(uint256 regionId)
        external
        view
        returns (PriceCalculation[] memory history)
    {
        return priceHistory[regionId];
    }

    /**
     * @notice Get supply-demand ratio for a region
     * @param regionId The region identifier
     * @return ratio The current supply-demand ratio (percentage)
     */
    function getSupplyDemandRatio(uint256 regionId) external view returns (uint256 ratio) {
        IEthaniCore.Region memory region = ethaniCore.getRegion(regionId);
        if (region.foodSupply == 0) return 0;
        return (region.foodDemand * RATIO_PRECISION) / region.foodSupply;
    }

    /**
     * @notice Check if a price is stale (needs update)
     * @param regionId The region identifier
     * @return isStale True if price hasn't been updated within threshold
     */
    function isPriceStale(uint256 regionId) external view returns (bool isStale) {
        if (lastPriceUpdateTime[regionId] == 0) return true;
        return (block.timestamp - lastPriceUpdateTime[regionId]) > stalePriceThreshold;
    }

    // ========== INTERNAL HELPER FUNCTIONS ==========

    /**
     * @notice Get effective config (uses product-specific or defaults)
     */
    function _getEffectiveConfig(uint256 productId)
        internal
        view
        returns (ProductPricingConfig memory config)
    {
        if (productConfigs[productId].isConfigured) {
            return productConfigs[productId];
        }

        // Return default configuration
        return ProductPricingConfig({
            isConfigured: true,
            criticalShortageMultiplier: DEFAULT_CRITICAL_SHORTAGE_MULTIPLIER,
            shortageMultiplier: DEFAULT_SHORTAGE_MULTIPLIER,
            normalMultiplier: DEFAULT_NORMAL_MULTIPLIER,
            surplusMultiplier: DEFAULT_SURPLUS_MULTIPLIER,
            extremeSurplusMultiplier: DEFAULT_EXTREME_SURPLUS_MULTIPLIER,
            criticalShortageThreshold: DEFAULT_CRITICAL_SHORTAGE_THRESHOLD,
            shortageThreshold: DEFAULT_SHORTAGE_THRESHOLD,
            surplusThreshold: DEFAULT_SURPLUS_THRESHOLD,
            extremeSurplusThreshold: DEFAULT_EXTREME_SURPLUS_THRESHOLD,
            enableTimeDecay: true,
            customDecayRate: 0
        });
    }

    /**
     * @notice Determine price multiplier based on supply-demand ratio
     */
    function _determineMultiplier(uint256 ratio, ProductPricingConfig memory config)
        internal
        pure
        returns (uint256 multiplier, PriceAdjustmentReason reason)
    {
        if (ratio > config.criticalShortageThreshold) {
            return (config.criticalShortageMultiplier, PriceAdjustmentReason.CRITICAL_SHORTAGE);
        } else if (ratio > config.shortageThreshold) {
            return (config.shortageMultiplier, PriceAdjustmentReason.SHORTAGE);
        } else if (ratio < config.extremeSurplusThreshold) {
            return (config.extremeSurplusMultiplier, PriceAdjustmentReason.EXTREME_SURPLUS);
        } else if (ratio < config.surplusThreshold) {
            return (config.surplusMultiplier, PriceAdjustmentReason.SURPLUS);
        } else {
            return (config.normalMultiplier, PriceAdjustmentReason.NORMAL);
        }
    }

    /**
     * @notice Apply time decay to price if data is stale
     */
    function _applyTimeDecay(
        uint256 price,
        uint256 lastUpdate,
        uint256 decayRate
    )
        internal
        view
        returns (uint256 decayedPrice)
    {
        if (block.timestamp <= lastUpdate + stalePriceThreshold) {
            return price;
        }

        uint256 daysStale = (block.timestamp - lastUpdate) / 1 days;
        uint256 totalDecay = daysStale * decayRate;

        if (totalDecay >= BASIS_POINTS) {
            totalDecay = BASIS_POINTS - 1; // Max 99.99% decay
        }

        return (price * (BASIS_POINTS - totalDecay)) / BASIS_POINTS;
    }

    /**
     * @notice Apply hard floor and ceiling limits
     */
    function _applySafetyLimits(
        uint256 calculatedPrice,
        uint256 basePrice
    )
        internal
        view
        returns (uint256 limitedPrice, bool wasCapped, bool wasFloored)
    {
        uint256 maxAllowed = (basePrice * (BASIS_POINTS + maxPriceIncreaseBPS)) / BASIS_POINTS;
        uint256 minAllowed = (basePrice * (BASIS_POINTS - maxPriceDecreaseBPS)) / BASIS_POINTS;

        if (calculatedPrice > maxAllowed) {
            return (maxAllowed, true, false);
        }

        if (calculatedPrice < minAllowed) {
            return (minAllowed, false, true);
        }

        return (calculatedPrice, false, false);
    }

    /**
     * @notice Apply volatility dampening (prevent extreme changes from previous price)
     */
    function _applyVolatilityDampening(
        uint256 newPrice,
        uint256 previousPrice
    )
        internal
        view
        returns (uint256 dampenedPrice, bool hadDampening)
    {
        if (previousPrice == 0) return (newPrice, false);

        uint256 maxAllowedIncrease = (previousPrice * (BASIS_POINTS + maxVolatilityBPS)) / BASIS_POINTS;
        uint256 maxAllowedDecrease = (previousPrice * (BASIS_POINTS - maxVolatilityBPS)) / BASIS_POINTS;

        if (newPrice > maxAllowedIncrease) {
            return (maxAllowedIncrease, true);
        }

        if (newPrice < maxAllowedDecrease) {
            return (maxAllowedDecrease, true);
        }

        return (newPrice, false);
    }

    /**
     * @notice Generate human-readable price calculation reason
     */
    function _generatePriceReason(PriceCalculation memory details)
        internal
        pure
        returns (string memory reason)
    {
        if (details.adjustmentReason == PriceAdjustmentReason.NO_SUPPLY) {
            return "No supply available";
        } else if (details.adjustmentReason == PriceAdjustmentReason.CRITICAL_SHORTAGE) {
            reason = "Critical shortage detected (ratio > 130%)";
        } else if (details.adjustmentReason == PriceAdjustmentReason.SHORTAGE) {
            reason = "Shortage detected (ratio > 110%)";
        } else if (details.adjustmentReason == PriceAdjustmentReason.EXTREME_SURPLUS) {
            reason = "Extreme surplus detected (ratio < 60%)";
        } else if (details.adjustmentReason == PriceAdjustmentReason.SURPLUS) {
            reason = "Surplus detected (ratio < 80%)";
        } else {
            reason = "Balanced supply-demand (80-110%)";
        }

        if (details.wasCapped) {
            reason = string(abi.encodePacked(reason, " [CAPPED]"));
        }
        if (details.wasFloored) {
            reason = string(abi.encodePacked(reason, " [FLOORED]"));
        }
        if (details.hadVolatilityDampening) {
            reason = string(abi.encodePacked(reason, " [DAMPENED]"));
        }

        return reason;
    }
}
