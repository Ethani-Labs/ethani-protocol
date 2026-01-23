// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EthaniCore
 * @notice Core data management for ETHANI food price stabilization.
 * 
 * Responsibilities:
 * - Manage regional data (supply, demand, base prices)
 * - Coordinate with pricing engine
 * - Record transparent price recommendations
 * - Enable farmers and traders to query current prices
 */

contract EthaniCore {
    
    // ========== DATA STRUCTURES ==========

    struct Region {
        string name;
        uint256 foodSupply;        // Current supply (units)
        uint256 foodDemand;        // Current demand (units)
        uint256 basePrice;         // Reference price (in smallest unit, e.g., wei)
        uint256 lastUpdateTime;    // Timestamp of last update
        uint256 currentPrice;      // Latest calculated price
    }

    struct FarmerInfo {
        string name;
        uint256 regionId;
        uint256 totalProduction;   // Total food produced
        bool isActive;
    }

    // ========== STATE ==========

    address public owner;
    address public pricingEngine;  // Reference to EthaniPricing contract

    mapping(uint256 => Region) public regions;
    uint256 public regionCount;

    mapping(address => FarmerInfo) public farmers;
    address[] public farmerAddresses;

    // Price update history (for transparency)
    mapping(uint256 => PriceUpdate) public priceUpdates;
    uint256 public priceUpdateCount;

    struct PriceUpdate {
        uint256 timestamp;
        uint256 regionId;
        uint256 oldPrice;
        uint256 newPrice;
        string reason;
    }

    // ========== EVENTS ==========

    event RegionAdded(uint256 indexed regionId, string name, uint256 basePrice);
    event RegionRemoved(uint256 indexed regionId);

    event SupplyUpdated(uint256 indexed regionId, uint256 oldSupply, uint256 newSupply, uint256 timestamp);
    event DemandUpdated(uint256 indexed regionId, uint256 oldDemand, uint256 newDemand, uint256 timestamp);
    event BasePriceUpdated(uint256 indexed regionId, uint256 oldPrice, uint256 newPrice);

    event CurrentPriceUpdated(uint256 indexed regionId, uint256 oldPrice, uint256 newPrice, string reason);
    event FarmerRegistered(address indexed farmer, string name, uint256 regionId);
    event FarmerDeactivated(address indexed farmer);

    event OwnershipTransferred(address indexed newOwner);
    event PricingEngineSet(address indexed newEngine);

    // ========== MODIFIERS ==========

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier regionExists(uint256 regionId) {
        require(regionId < regionCount, "Region does not exist");
        _;
    }

    // ========== CONSTRUCTOR ==========

    constructor() {
        owner = msg.sender;
        pricingEngine = address(0);
    }

    // ========== REGION MANAGEMENT ==========

    /**
     * @notice Add a new region to the system.
     * @param name Human-readable region name
     * @param basePrice Base reference price for food in this region
     */
    function addRegion(string calldata name, uint256 basePrice) external onlyOwner {
        require(basePrice > 0, "Base price must be positive");
        require(bytes(name).length > 0, "Name cannot be empty");

        regions[regionCount] = Region({
            name: name,
            foodSupply: 0,
            foodDemand: 0,
            basePrice: basePrice,
            lastUpdateTime: block.timestamp,
            currentPrice: basePrice
        });

        emit RegionAdded(regionCount, name, basePrice);
        regionCount++;
    }

    /**
     * @notice Update supply in a region (called by authorized traders/oracles).
     * @dev In production, this should be restricted to authorized oracle or governance.
     */
    function updateSupply(uint256 regionId, uint256 supply) external onlyOwner regionExists(regionId) {
        Region storage r = regions[regionId];
        uint256 oldSupply = r.foodSupply;
        r.foodSupply = supply;
        r.lastUpdateTime = block.timestamp;

        emit SupplyUpdated(regionId, oldSupply, supply, block.timestamp);
    }

    /**
     * @notice Update demand in a region.
     * @dev In production, this should be restricted to authorized oracle or governance.
     */
    function updateDemand(uint256 regionId, uint256 demand) external onlyOwner regionExists(regionId) {
        Region storage r = regions[regionId];
        uint256 oldDemand = r.foodDemand;
        r.foodDemand = demand;
        r.lastUpdateTime = block.timestamp;

        emit DemandUpdated(regionId, oldDemand, demand, block.timestamp);
    }

    /**
     * @notice Update base price (e.g., due to market conditions or policy).
     */
    function updateBasePrice(uint256 regionId, uint256 newBasePrice) external onlyOwner regionExists(regionId) {
        require(newBasePrice > 0, "Base price must be positive");
        Region storage r = regions[regionId];
        uint256 oldPrice = r.basePrice;
        r.basePrice = newBasePrice;

        emit BasePriceUpdated(regionId, oldPrice, newBasePrice);
    }

    /**
     * @notice Recalculate price using external pricing engine.
     * Can be called by anyone - encourages decentralization.
     */
    function recalculatePrice(uint256 regionId) external regionExists(regionId) {
        require(pricingEngine != address(0), "Pricing engine not configured");

        Region storage r = regions[regionId];
        uint256 oldPrice = r.currentPrice;

        // Call the pricing contract (would be the actual interface in production)
        // This is a placeholder showing the pattern
        uint256 newPrice = _calculatePriceViaEngine(r.foodSupply, r.foodDemand, r.basePrice);

        if (newPrice != oldPrice) {
            r.currentPrice = newPrice;
            emit CurrentPriceUpdated(regionId, oldPrice, newPrice, "Recalculated based on supply-demand");
        }
    }

    // ========== FARMER MANAGEMENT ==========

    /**
     * @notice Register a farmer in the system.
     */
    function registerFarmer(
        address farmerAddress,
        string calldata name,
        uint256 regionId
    ) external onlyOwner regionExists(regionId) {
        require(farmerAddress != address(0), "Invalid address");
        require(bytes(name).length > 0, "Name cannot be empty");

        farmers[farmerAddress] = FarmerInfo({
            name: name,
            regionId: regionId,
            totalProduction: 0,
            isActive: true
        });

        farmerAddresses.push(farmerAddress);
        emit FarmerRegistered(farmerAddress, name, regionId);
    }

    /**
     * @notice Deactivate a farmer.
     */
    function deactivateFarmer(address farmerAddress) external onlyOwner {
        require(farmers[farmerAddress].isActive, "Farmer not active");
        farmers[farmerAddress].isActive = false;
        emit FarmerDeactivated(farmerAddress);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @notice Get all region information.
     */
    function getRegion(uint256 regionId) external view regionExists(regionId) returns (Region memory) {
        return regions[regionId];
    }

    /**
     * @notice Get current price for a region.
     */
    function getCurrentPrice(uint256 regionId) external view regionExists(regionId) returns (uint256) {
        return regions[regionId].currentPrice;
    }

    /**
     * @notice Get supply-demand ratio (for transparency).
     */
    function getSupplyDemandRatio(uint256 regionId) external view regionExists(regionId) returns (uint256) {
        Region memory r = regions[regionId];
        if (r.foodSupply == 0) return 0;
        return (r.foodDemand * 100) / r.foodSupply;
    }

    /**
     * @notice Get farmer info.
     */
    function getFarmer(address farmerAddress) external view returns (FarmerInfo memory) {
        return farmers[farmerAddress];
    }

    /**
     * @notice Get all farmers in a region.
     */
    function getFarmerCount() external view returns (uint256) {
        return farmerAddresses.length;
    }

    /**
     * @notice Get a farmer by index.
     */
    function getFarmerByIndex(uint256 index) external view returns (address) {
        require(index < farmerAddresses.length, "Index out of bounds");
        return farmerAddresses[index];
    }

    // ========== GOVERNANCE ==========

    /**
     * @notice Set the pricing engine address.
     */
    function setPricingEngine(address newEngine) external onlyOwner {
        require(newEngine != address(0), "Invalid engine address");
        pricingEngine = newEngine;
        emit PricingEngineSet(newEngine);
    }

    /**
     * @notice Transfer ownership.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
        emit OwnershipTransferred(newOwner);
    }

    // ========== INTERNAL HELPERS ==========

    /**
     * @notice Internal placeholder for pricing engine call.
     * In production, this would interface with EthaniPricing contract.
     */
    function _calculatePriceViaEngine(
        uint256 supply,
        uint256 demand,
        uint256 basePrice
    ) internal view returns (uint256) {
        // Placeholder: implement actual call to EthaniPricing
        if (supply == 0) return basePrice;
        
        uint256 ratio = (demand * 100) / supply;
        
        if (ratio > 130) return (basePrice * 115) / 100;
        if (ratio > 110) return (basePrice * 108) / 100;
        if (ratio < 80) return (basePrice * 90) / 100;
        
        return basePrice;
    }
}
