// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EthaniRegion
 * @notice Regional market data management for ETHANI
 * 
 * Stores regional information (villages, cities, markets) with:
 * - Region names
 * - Base food prices
 * - Active/inactive status
 * 
 * Admin-only operations for data integrity.
 */

contract EthaniRegion {
    // ==================== TYPES ====================
    
    struct Region {
        uint256 id;
        string name;
        uint256 basePrice;
        bool isActive;
        uint256 createdAt;
    }
    
    // ==================== STATE ====================
    
    address public admin;
    uint256 public regionCount = 0;
    
    mapping(uint256 => Region) public regions;
    mapping(string => bool) private regionNameExists;
    
    // ==================== EVENTS ====================
    
    event RegionCreated(
        uint256 indexed regionId,
        string name,
        uint256 basePrice,
        uint256 timestamp
    );
    
    event RegionUpdated(
        uint256 indexed regionId,
        uint256 newBasePrice,
        bool isActive,
        uint256 timestamp
    );
    
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    
    // ==================== MODIFIERS ====================
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    modifier regionExists(uint256 regionId) {
        require(regionId < regionCount, "Region does not exist");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() {
        admin = msg.sender;
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    /**
     * @notice Create a new region
     * @param name Region name (village/city/market)
     * @param basePrice Base food price for this region
     */
    function createRegion(string calldata name, uint256 basePrice) external onlyAdmin {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(basePrice > 0, "Base price must be positive");
        require(!regionNameExists[name], "Region name already exists");
        
        regions[regionCount] = Region({
            id: regionCount,
            name: name,
            basePrice: basePrice,
            isActive: true,
            createdAt: block.timestamp
        });
        
        regionNameExists[name] = true;
        
        emit RegionCreated(regionCount, name, basePrice, block.timestamp);
        regionCount++;
    }
    
    /**
     * @notice Update region base price
     * @param regionId Region identifier
     * @param newBasePrice New base price
     */
    function updateBasePrice(uint256 regionId, uint256 newBasePrice)
        external
        onlyAdmin
        regionExists(regionId)
    {
        require(newBasePrice > 0, "Base price must be positive");
        
        regions[regionId].basePrice = newBasePrice;
        
        emit RegionUpdated(
            regionId,
            newBasePrice,
            regions[regionId].isActive,
            block.timestamp
        );
    }
    
    /**
     * @notice Activate or deactivate a region
     * @param regionId Region identifier
     * @param isActive True to activate, false to deactivate
     */
    function setRegionActive(uint256 regionId, bool isActive)
        external
        onlyAdmin
        regionExists(regionId)
    {
        regions[regionId].isActive = isActive;
        
        emit RegionUpdated(
            regionId,
            regions[regionId].basePrice,
            isActive,
            block.timestamp
        );
    }
    
    /**
     * @notice Transfer admin rights to new address
     * @param newAdmin New admin address
     */
    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        require(newAdmin != admin, "Must be different from current admin");
        
        address oldAdmin = admin;
        admin = newAdmin;
        
        emit AdminChanged(oldAdmin, newAdmin);
    }
    
    // ==================== READ-ONLY FUNCTIONS ====================
    
    /**
     * @notice Get region details
     * @param regionId Region identifier
     */
    function getRegion(uint256 regionId)
        external
        view
        regionExists(regionId)
        returns (Region memory)
    {
        return regions[regionId];
    }
    
    /**
     * @notice Get base price for a region
     * @param regionId Region identifier
     */
    function getBasePrice(uint256 regionId)
        external
        view
        regionExists(regionId)
        returns (uint256)
    {
        return regions[regionId].basePrice;
    }
    
    /**
     * @notice Check if region is active
     * @param regionId Region identifier
     */
    function isRegionActive(uint256 regionId)
        external
        view
        regionExists(regionId)
        returns (bool)
    {
        return regions[regionId].isActive;
    }
    
    /**
     * @notice Get total number of regions
     */
    function getTotalRegions() external view returns (uint256) {
        return regionCount;
    }
}
