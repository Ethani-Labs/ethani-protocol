// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PriceOracle.sol";
import "../src/interfaces/IEthaniCore.sol";

/**
 * @title DeployPriceOracle
 * @notice Deployment script for PriceOracle contract on Arbitrum network
 *
 * @dev Usage:
 * 1. Testnet deployment (Arbitrum Sepolia):
 *    forge script script/DeployPriceOracle.s.sol:DeployPriceOracle --rpc-url arbitrum-sepolia --broadcast --verify
 *
 * 2. Mainnet deployment (Arbitrum One):
 *    forge script script/DeployPriceOracle.s.sol:DeployPriceOracle --rpc-url arbitrum-one --broadcast --verify
 *
 * 3. Local deployment (testing):
 *    forge script script/DeployPriceOracle.s.sol:DeployPriceOracle --rpc-url localhost --broadcast
 */
contract DeployPriceOracle is Script {

    // Configuration variables (set via environment or modify here)
    address public ethaniCoreAddress;
    address public adminAddress;

    function setUp() public {
        // Load from environment variables
        ethaniCoreAddress = vm.envOr("ETHANI_CORE_ADDRESS", address(0));
        adminAddress = vm.envOr("ADMIN_ADDRESS", msg.sender);
    }

    function run() public {
        // Start broadcasting transactions
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("=== ETHANI PriceOracle Deployment ===");
        console.log("Deployer:", msg.sender);
        console.log("Chain ID:", block.chainid);

        // Validate configuration
        require(ethaniCoreAddress != address(0), "ETHANI_CORE_ADDRESS not set");
        require(adminAddress != address(0), "ADMIN_ADDRESS not set");

        console.log("EthaniCore Address:", ethaniCoreAddress);
        console.log("Admin Address:", adminAddress);

        // Deploy PriceOracle
        PriceOracle oracle = new PriceOracle(ethaniCoreAddress, adminAddress);

        console.log("\n=== Deployment Successful ===");
        console.log("PriceOracle deployed at:", address(oracle));

        // Log initial configuration
        console.log("\n=== Initial Configuration ===");
        console.log("Max Price Increase (BPS):", oracle.maxPriceIncreaseBPS());
        console.log("Max Price Decrease (BPS):", oracle.maxPriceDecreaseBPS());
        console.log("Max Volatility (BPS):", oracle.maxVolatilityBPS());
        console.log("Price Decay Rate (BPS/day):", oracle.priceDecayRate());
        console.log("Stale Price Threshold (seconds):", oracle.stalePriceThreshold());

        console.log("\n=== Role Configuration ===");
        console.log("DEFAULT_ADMIN_ROLE granted to:", adminAddress);
        console.log("PRICE_UPDATER_ROLE granted to:", adminAddress);
        console.log("EMERGENCY_ROLE granted to:", adminAddress);
        console.log("CONFIGURATOR_ROLE granted to:", adminAddress);

        vm.stopBroadcast();

        // Save deployment info
        string memory deploymentInfo = string(
            abi.encodePacked(
                "PriceOracle deployed at: ",
                vm.toString(address(oracle)),
                "\nEthaniCore: ",
                vm.toString(ethaniCoreAddress),
                "\nAdmin: ",
                vm.toString(adminAddress)
            )
        );

        vm.writeFile("deployments/latest-priceoracle.txt", deploymentInfo);

        console.log("\n=== Next Steps ===");
        console.log("1. Verify contract on explorer (if --verify flag was used)");
        console.log("2. Update EthaniCore to use this PriceOracle:");
        console.log("   ethaniCore.setPricingEngine(", address(oracle), ")");
        console.log("3. Grant additional roles as needed:");
        console.log("   oracle.grantRole(PRICE_UPDATER_ROLE, <backend-address>)");
        console.log("4. Test price calculation with:");
        console.log("   oracle.calculatePrice(<regionId>)");
    }
}
