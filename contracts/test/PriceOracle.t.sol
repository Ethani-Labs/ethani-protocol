// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PriceOracle.sol";
import "../src/interfaces/IEthaniCore.sol";

/**
 * @title PriceOracleTest
 * @notice Comprehensive test suite for PriceOracle contract
 */
contract PriceOracleTest is Test {
    PriceOracle public oracle;
    MockEthaniCore public mockCore;

    address public admin = address(0x1);
    address public priceUpdater = address(0x2);
    address public user = address(0x3);

    uint256 public constant BASE_PRICE = 1000 ether;

    event PriceCalculated(
        uint256 indexed regionId,
        uint256 indexed productId,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 supplyDemandRatio,
        PriceOracle.PriceAdjustmentReason reason,
        uint256 timestamp
    );

    function setUp() public {
        // Deploy mock EthaniCore
        mockCore = new MockEthaniCore();

        // Deploy PriceOracle
        oracle = new PriceOracle(address(mockCore), admin);

        // Grant roles
        vm.startPrank(admin);
        oracle.grantRole(oracle.PRICE_UPDATER_ROLE(), priceUpdater);
        vm.stopPrank();

        // Setup default region
        mockCore.setRegion(
            0,
            "Test Region",
            1000, // supply
            1000, // demand
            BASE_PRICE,
            block.timestamp,
            BASE_PRICE
        );
    }

    // ========== BASIC FUNCTIONALITY TESTS ==========

    function test_Deployment() public view {
        assertEq(address(oracle.ethaniCore()), address(mockCore));
        assertTrue(oracle.hasRole(oracle.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(oracle.hasRole(oracle.PRICE_UPDATER_ROLE(), admin));
    }

    function test_CalculatePriceBalanced() public view {
        // Balanced supply-demand (100% ratio)
        (uint256 price, string memory reason, PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        assertEq(price, BASE_PRICE, "Price should equal base price in balanced conditions");
        assertEq(uint256(details.adjustmentReason), uint256(PriceOracle.PriceAdjustmentReason.NORMAL));
        assertEq(details.supplyDemandRatio, 100, "Supply-demand ratio should be 100%");
    }

    function test_CalculatePriceShortage() public {
        // Create shortage (demand > supply)
        mockCore.setRegion(
            0,
            "Test Region",
            1000,  // supply
            1200,  // demand (120% ratio)
            BASE_PRICE,
            block.timestamp,
            BASE_PRICE
        );

        (uint256 price, , PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        assertGt(price, BASE_PRICE, "Price should increase during shortage");
        assertEq(uint256(details.adjustmentReason), uint256(PriceOracle.PriceAdjustmentReason.SHORTAGE));
        assertEq(details.supplyDemandRatio, 120);
    }

    function test_CalculatePriceCriticalShortage() public {
        // Critical shortage (demand >> supply)
        mockCore.setRegion(
            0,
            "Test Region",
            1000,  // supply
            1500,  // demand (150% ratio)
            BASE_PRICE,
            block.timestamp,
            BASE_PRICE
        );

        (uint256 price, , PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        assertGt(price, BASE_PRICE, "Price should increase significantly");
        assertEq(
            uint256(details.adjustmentReason),
            uint256(PriceOracle.PriceAdjustmentReason.CRITICAL_SHORTAGE)
        );
        assertEq(details.supplyDemandRatio, 150);
    }

    function test_CalculatePriceSurplus() public {
        // Surplus (supply > demand)
        mockCore.setRegion(
            0,
            "Test Region",
            1000,  // supply
            700,   // demand (70% ratio)
            BASE_PRICE,
            block.timestamp,
            BASE_PRICE
        );

        (uint256 price, , PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        assertLt(price, BASE_PRICE, "Price should decrease during surplus");
        assertEq(uint256(details.adjustmentReason), uint256(PriceOracle.PriceAdjustmentReason.SURPLUS));
        assertEq(details.supplyDemandRatio, 70);
    }

    function test_CalculatePriceExtremeSurplus() public {
        // Extreme surplus (supply >>> demand)
        mockCore.setRegion(
            0,
            "Test Region",
            1000,  // supply
            500,   // demand (50% ratio)
            BASE_PRICE,
            block.timestamp,
            BASE_PRICE
        );

        (uint256 price, , PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        assertLt(price, BASE_PRICE, "Price should decrease significantly");
        assertEq(
            uint256(details.adjustmentReason),
            uint256(PriceOracle.PriceAdjustmentReason.EXTREME_SURPLUS)
        );
        assertEq(details.supplyDemandRatio, 50);
    }

    function test_CalculatePriceZeroSupply() public {
        mockCore.setRegion(0, "Test Region", 0, 1000, BASE_PRICE, block.timestamp, BASE_PRICE);

        (uint256 price, string memory reason, ) = oracle.calculatePrice(0);

        assertEq(price, BASE_PRICE, "Should return base price when no supply");
        assertEq(reason, "No supply available - using base price");
    }

    // ========== SAFETY LIMITS TESTS ==========

    function test_PriceCeiling() public {
        // Set tighter safety limits to trigger capping
        vm.prank(admin);
        oracle.updateSafetyLimits(1000, 1000, 2000); // Max +10%, -10% per update

        // Extreme shortage should be capped
        mockCore.setRegion(0, "Test Region", 100, 10000, BASE_PRICE, block.timestamp, BASE_PRICE);

        (uint256 price, , PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        uint256 maxAllowed = (BASE_PRICE * 11000) / 10000; // +10% max
        assertLe(price, maxAllowed, "Price should be capped at maximum increase");
        assertTrue(details.wasCapped, "Should flag that price was capped");
    }

    function test_PriceFloor() public {
        // Set tighter safety limits to trigger flooring
        vm.prank(admin);
        oracle.updateSafetyLimits(1000, 1000, 2000); // Max +10%, -10% per update

        // Extreme surplus should be floored
        mockCore.setRegion(0, "Test Region", 10000, 100, BASE_PRICE, block.timestamp, BASE_PRICE);

        (uint256 price, , PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        uint256 minAllowed = (BASE_PRICE * 9000) / 10000; // -10% max
        assertGe(price, minAllowed, "Price should be floored at maximum decrease");
        assertTrue(details.wasFloored, "Should flag that price was floored");
    }

    function test_VolatilityDampening() public {
        // Set tighter volatility limit
        vm.prank(admin);
        oracle.updateSafetyLimits(5000, 3000, 500); // Max 5% volatility

        // First update to set previous price
        vm.prank(priceUpdater);
        oracle.updatePrice(0);

        // Create shortage (will try +8% but volatility caps at +5%)
        mockCore.setRegion(0, "Test Region", 1000, 1200, BASE_PRICE, block.timestamp, BASE_PRICE);

        (uint256 price, , PriceOracle.PriceCalculation memory details) = oracle.calculatePrice(0);

        assertTrue(details.hadVolatilityDampening, "Should apply volatility dampening");
    }

    // ========== UPDATE PRICE TESTS ==========

    function test_UpdatePrice() public {
        uint256 oldPrice = oracle.getLatestPrice(0);

        vm.prank(priceUpdater);
        uint256 newPrice = oracle.updatePrice(0);

        assertEq(oracle.getLatestPrice(0), newPrice);
        assertEq(oracle.lastPriceUpdateTime(0), block.timestamp);
    }

    function test_UpdatePriceEmitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit PriceCalculated(0, 0, 0, BASE_PRICE, 100, PriceOracle.PriceAdjustmentReason.NORMAL, block.timestamp);

        vm.prank(priceUpdater);
        oracle.updatePrice(0);
    }

    function test_UpdatePriceRevertsUnauthorized() public {
        vm.expectRevert();
        vm.prank(user);
        oracle.updatePrice(0);
    }

    function test_BatchUpdatePrices() public {
        // Add more regions
        mockCore.setRegion(1, "Region 1", 1000, 1000, BASE_PRICE, block.timestamp, BASE_PRICE);
        mockCore.setRegion(2, "Region 2", 1000, 1000, BASE_PRICE, block.timestamp, BASE_PRICE);

        uint256[] memory regionIds = new uint256[](3);
        regionIds[0] = 0;
        regionIds[1] = 1;
        regionIds[2] = 2;

        vm.prank(priceUpdater);
        uint256[] memory prices = oracle.batchUpdatePrices(regionIds);

        assertEq(prices.length, 3);
        assertEq(oracle.getLatestPrice(0), prices[0]);
        assertEq(oracle.getLatestPrice(1), prices[1]);
        assertEq(oracle.getLatestPrice(2), prices[2]);
    }

    // ========== CONFIGURATION TESTS ==========

    function test_ConfigureProduct() public {
        PriceOracle.ProductPricingConfig memory config = PriceOracle.ProductPricingConfig({
            isConfigured: true,
            criticalShortageMultiplier: 12000, // +20%
            shortageMultiplier: 11000,         // +10%
            normalMultiplier: 10000,           // 0%
            surplusMultiplier: 9500,           // -5%
            extremeSurplusMultiplier: 9000,    // -10%
            criticalShortageThreshold: 140,
            shortageThreshold: 115,
            surplusThreshold: 85,
            extremeSurplusThreshold: 65,
            enableTimeDecay: false,
            customDecayRate: 0
        });

        vm.prank(admin);
        oracle.configureProduct(1, config);

        (bool isConfigured, , , , , , , , , , , ) = oracle.productConfigs(1);
        assertTrue(isConfigured);
    }

    function test_UpdateSafetyLimits() public {
        vm.prank(admin);
        oracle.updateSafetyLimits(6000, 4000, 2500);

        assertEq(oracle.maxPriceIncreaseBPS(), 6000);
        assertEq(oracle.maxPriceDecreaseBPS(), 4000);
        assertEq(oracle.maxVolatilityBPS(), 2500);
    }

    function test_UpdateEthaniCore() public {
        MockEthaniCore newCore = new MockEthaniCore();

        vm.prank(admin);
        oracle.updateEthaniCore(address(newCore));

        assertEq(address(oracle.ethaniCore()), address(newCore));
    }

    // ========== EMERGENCY FUNCTIONS TESTS ==========

    function test_EmergencyShutdown() public {
        vm.prank(admin);
        oracle.toggleEmergencyShutdown();

        assertTrue(oracle.emergencyShutdown());

        vm.expectRevert("PriceOracle: Emergency shutdown active");
        oracle.calculatePrice(0);

        // Toggle back
        vm.prank(admin);
        oracle.toggleEmergencyShutdown();

        assertFalse(oracle.emergencyShutdown());
    }

    function test_Pause() public {
        vm.prank(admin);
        oracle.pause();

        assertTrue(oracle.paused());

        vm.expectRevert();
        vm.prank(priceUpdater);
        oracle.updatePrice(0);

        // Can still read
        oracle.getLatestPrice(0);
    }

    function test_Unpause() public {
        vm.startPrank(admin);
        oracle.pause();
        oracle.unpause();
        vm.stopPrank();

        assertFalse(oracle.paused());

        // Can update again
        vm.prank(priceUpdater);
        oracle.updatePrice(0);
    }

    // ========== VIEW FUNCTIONS TESTS ==========

    function test_GetLatestPrice() public {
        uint256 price = oracle.getLatestPrice(0);
        assertEq(price, BASE_PRICE, "Should return base price if never calculated");

        vm.prank(priceUpdater);
        uint256 newPrice = oracle.updatePrice(0);

        assertEq(oracle.getLatestPrice(0), newPrice);
    }

    function test_GetPriceHistory() public {
        vm.prank(priceUpdater);
        oracle.updatePrice(0);

        PriceOracle.PriceCalculation[] memory history = oracle.getPriceHistory(0);
        assertEq(history.length, 1);
        assertEq(history[0].basePrice, BASE_PRICE);
    }

    function test_GetSupplyDemandRatio() public view {
        uint256 ratio = oracle.getSupplyDemandRatio(0);
        assertEq(ratio, 100); // 1000/1000 * 100
    }

    function test_IsPriceStale() public {
        assertTrue(oracle.isPriceStale(0), "Price should be stale initially");

        vm.prank(priceUpdater);
        oracle.updatePrice(0);

        assertFalse(oracle.isPriceStale(0), "Price should be fresh after update");

        // Fast forward time
        vm.warp(block.timestamp + 8 days);

        assertTrue(oracle.isPriceStale(0), "Price should be stale after 8 days");
    }

    // ========== EDGE CASES & FUZZ TESTS ==========

    function testFuzz_CalculatePrice(uint256 supply, uint256 demand) public {
        supply = bound(supply, 0, 1e12);
        demand = bound(demand, 0, 1e12);

        mockCore.setRegion(0, "Fuzz Region", supply, demand, BASE_PRICE, block.timestamp, BASE_PRICE);

        if (supply > 0) {
            (uint256 price, , ) = oracle.calculatePrice(0);
            assertGt(price, 0, "Price should always be positive");
        } else {
            (uint256 price, , ) = oracle.calculatePrice(0);
            assertEq(price, BASE_PRICE, "Should return base price on zero supply");
        }
    }

    function testFuzz_SafetyLimits(uint256 multiplier) public {
        multiplier = bound(multiplier, 5000, 20000); // 50% to 200%

        mockCore.setRegion(
            0,
            "Test",
            100,
            (100 * multiplier) / 10000,
            BASE_PRICE,
            block.timestamp,
            BASE_PRICE
        );

        (uint256 price, , ) = oracle.calculatePrice(0);

        // Price should never exceed max increase
        uint256 maxAllowed = (BASE_PRICE * 15000) / 10000;
        assertLe(price, maxAllowed);
    }

    // ========== GAS OPTIMIZATION TESTS ==========

    function test_GasUpdateSinglePrice() public {
        vm.prank(priceUpdater);
        uint256 gasBefore = gasleft();
        oracle.updatePrice(0);
        uint256 gasUsed = gasBefore - gasleft();

        console.log("Gas used for single price update:", gasUsed);
        assertLt(gasUsed, 200000, "Gas usage should be reasonable");
    }

    function test_GasBatchUpdate() public {
        mockCore.setRegion(1, "Region 1", 1000, 1000, BASE_PRICE, block.timestamp, BASE_PRICE);
        mockCore.setRegion(2, "Region 2", 1000, 1000, BASE_PRICE, block.timestamp, BASE_PRICE);

        uint256[] memory regionIds = new uint256[](3);
        regionIds[0] = 0;
        regionIds[1] = 1;
        regionIds[2] = 2;

        vm.prank(priceUpdater);
        uint256 gasBefore = gasleft();
        oracle.batchUpdatePrices(regionIds);
        uint256 gasUsed = gasBefore - gasleft();

        console.log("Gas used for batch update (3 regions):", gasUsed);
    }
}

// ========== MOCK CONTRACTS ==========

contract MockEthaniCore is IEthaniCore {
    mapping(uint256 => Region) public regions;
    uint256 public override regionCount;

    function setRegion(
        uint256 id,
        string memory name,
        uint256 supply,
        uint256 demand,
        uint256 basePrice,
        uint256 lastUpdate,
        uint256 currentPrice
    ) external {
        regions[id] = Region({
            name: name,
            foodSupply: supply,
            foodDemand: demand,
            basePrice: basePrice,
            lastUpdateTime: lastUpdate,
            currentPrice: currentPrice
        });

        if (id >= regionCount) {
            regionCount = id + 1;
        }
    }

    function getRegion(uint256 regionId) external view override returns (Region memory) {
        return regions[regionId];
    }

    function getCurrentPrice(uint256 regionId) external view override returns (uint256) {
        return regions[regionId].currentPrice;
    }
}
