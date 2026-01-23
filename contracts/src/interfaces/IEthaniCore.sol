// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IEthaniCore
 * @notice Interface for EthaniCore contract to enable PriceOracle integration
 */
interface IEthaniCore {
    struct Region {
        string name;
        uint256 foodSupply;
        uint256 foodDemand;
        uint256 basePrice;
        uint256 lastUpdateTime;
        uint256 currentPrice;
    }

    function getRegion(uint256 regionId) external view returns (Region memory);
    function getCurrentPrice(uint256 regionId) external view returns (uint256);
    function regionCount() external view returns (uint256);
}
