// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IEthaniCore.sol";

/**
 * @title EthaniCore
 * @notice Central data management for ETHANI regional food markets
 *
 * Features:
 * - Store supply/demand data per region
 * - Track current and base prices
 * - Integration point for PriceOracle
 * - Admin-controlled data updates
 */
contract EthaniCore is IEthaniCore, AccessControl {

    // ==================== ROLES ====================

    bytes32 public constant DATA_UPDATER_ROLE = keccak256("DATA_UPDATER_ROLE");

    // ==================== STATE ====================

    Region[] private regions;
    mapping(uint256 => bool) public regionExists;

    // ==================== EVENTS ====================

    event RegionCreated(
        uint256 indexed regionId,
        string name,
        uint256 basePrice,
        uint256 timestamp
    );

    event RegionUpdated(
        uint256 indexed regionId,
        uint256 foodSupply,
        uint256 foodDemand,
        uint256 timestamp
    );

    event PriceUpdated(
        uint256 indexed regionId,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 timestamp
    );

    // ==================== CONSTRUCTOR ====================

    constructor(address admin) {
        require(admin != address(0), "EthaniCore: Invalid admin address");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DATA_UPDATER_ROLE, admin);
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @notice Create a new region
     * @param name Region name (village/city/market)
     * @param basePrice Base food price for this region
     */
    function createRegion(
        string calldata name,
        uint256 basePrice
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bytes(name).length > 0, "EthaniCore: Empty name");
        require(basePrice > 0, "EthaniCore: Invalid base price");

        uint256 regionId = regions.length;

        regions.push(Region({
            name: name,
            foodSupply: 0,
            foodDemand: 0,
            basePrice: basePrice,
            lastUpdateTime: block.timestamp,
            currentPrice: basePrice
        }));

        regionExists[regionId] = true;

        emit RegionCreated(regionId, name, basePrice, block.timestamp);
    }

    /**
     * @notice Update supply and demand for a region
     * @param regionId Region identifier
     * @param foodSupply New supply amount
     * @param foodDemand New demand amount
     */
    function updateRegionData(
        uint256 regionId,
        uint256 foodSupply,
        uint256 foodDemand
    ) external onlyRole(DATA_UPDATER_ROLE) {
        require(regionExists[regionId], "EthaniCore: Invalid region");

        regions[regionId].foodSupply = foodSupply;
        regions[regionId].foodDemand = foodDemand;
        regions[regionId].lastUpdateTime = block.timestamp;

        emit RegionUpdated(regionId, foodSupply, foodDemand, block.timestamp);
    }

    /**
     * @notice Update current price for a region (called by PriceOracle)
     * @param regionId Region identifier
     * @param newPrice New calculated price
     */
    function updatePrice(
        uint256 regionId,
        uint256 newPrice
    ) external onlyRole(DATA_UPDATER_ROLE) {
        require(regionExists[regionId], "EthaniCore: Invalid region");
        require(newPrice > 0, "EthaniCore: Invalid price");

        uint256 oldPrice = regions[regionId].currentPrice;
        regions[regionId].currentPrice = newPrice;

        emit PriceUpdated(regionId, oldPrice, newPrice, block.timestamp);
    }

    /**
     * @notice Update base price for a region
     * @param regionId Region identifier
     * @param newBasePrice New base price
     */
    function updateBasePrice(
        uint256 regionId,
        uint256 newBasePrice
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(regionExists[regionId], "EthaniCore: Invalid region");
        require(newBasePrice > 0, "EthaniCore: Invalid base price");

        regions[regionId].basePrice = newBasePrice;
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get region details
     * @param regionId Region identifier
     * @return region The region struct
     */
    function getRegion(uint256 regionId)
        external
        view
        override
        returns (Region memory region)
    {
        require(regionExists[regionId], "EthaniCore: Invalid region");
        return regions[regionId];
    }

    /**
     * @notice Get current price for a region
     * @param regionId Region identifier
     * @return price Current calculated price
     */
    function getCurrentPrice(uint256 regionId)
        external
        view
        override
        returns (uint256 price)
    {
        require(regionExists[regionId], "EthaniCore: Invalid region");
        return regions[regionId].currentPrice;
    }

    /**
     * @notice Get total number of regions
     * @return count Total region count
     */
    function regionCount() external view override returns (uint256 count) {
        return regions.length;
    }

    /**
     * @notice Get all regions (paginated for gas efficiency)
     * @param offset Starting index
     * @param limit Maximum number of regions to return
     * @return regionList Array of regions
     */
    function getRegions(uint256 offset, uint256 limit)
        external
        view
        returns (Region[] memory regionList)
    {
        require(offset < regions.length, "EthaniCore: Invalid offset");

        uint256 end = offset + limit;
        if (end > regions.length) {
            end = regions.length;
        }

        uint256 resultLength = end - offset;
        regionList = new Region[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            regionList[i] = regions[offset + i];
        }

        return regionList;
    }
}
