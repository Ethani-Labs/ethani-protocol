// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {EthaniPricing} from "../src/EthaniPricing.sol";
import {EthaniRegion} from "../src/EthaniRegion.sol";
import {EthaniIncentive} from "../src/EthaniIncentive.sol";
import {EthaniCore} from "../src/EthaniCore.sol";
import {PriceOracle} from "../src/PriceOracle.sol";

/**
 * @title DeployAll
 * @notice Complete deployment script for all ETHANI contracts on Arbitrum
 *
 * Prerequisites:
 * - Set PRIVATE_KEY environment variable
 * - Have testnet tokens for gas (ETH on Arbitrum Sepolia)
 *
 * Deploy to Arbitrum Sepolia (Testnet):
 * forge script script/DeployAll.s.sol \
 *     --rpc-url https://sepolia-rollup.arbitrum.io/rpc \
 *     --broadcast \
 *     --verify \
 *     -vvv
 *
 * Deploy to Arbitrum One (Mainnet):
 * forge script script/DeployAll.s.sol \
 *     --rpc-url https://arb1.arbitrum.io/rpc \
 *     --broadcast \
 *     --verify \
 *     -vvv
 *
 * Deploy to localhost:
 * forge script script/DeployAll.s.sol \
 *     --fork-url http://localhost:8545 \
 *     --broadcast
 */

contract DeployAll is Script {
    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console2.log("\n========== ETHANI DEPLOYMENT STARTING ==========");
        console2.log("Deployer:", deployer);
        console2.log("Chain ID:", block.chainid);
        console2.log("=================================================\n");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // ==================== DEPLOY SIMPLE CONTRACTS ====================

        console2.log("Deploying simple contracts...");

        // 1. EthaniPricing (stateless pricing logic)
        EthaniPricing pricingContract = new EthaniPricing();
        console2.log("[1/5] EthaniPricing deployed at:", address(pricingContract));

        // 2. EthaniRegion (regional data management)
        EthaniRegion regionContract = new EthaniRegion();
        console2.log("[2/5] EthaniRegion deployed at:", address(regionContract));

        // 3. EthaniIncentive (participation points)
        EthaniIncentive incentiveContract = new EthaniIncentive();
        console2.log("[3/5] EthaniIncentive deployed at:", address(incentiveContract));

        // ==================== DEPLOY CORE & ORACLE ====================

        console2.log("\nDeploying core infrastructure...");

        // 4. EthaniCore (central data management)
        EthaniCore coreContract = new EthaniCore(deployer);
        console2.log("[4/5] EthaniCore deployed at:", address(coreContract));

        // 5. PriceOracle (advanced pricing engine)
        PriceOracle oracleContract = new PriceOracle(address(coreContract), deployer);
        console2.log("[5/5] PriceOracle deployed at:", address(oracleContract));

        // ==================== POST-DEPLOYMENT SETUP ====================

        console2.log("\nConfiguring contracts...");

        // Grant PriceOracle permission to update EthaniCore prices
        coreContract.grantRole(coreContract.DATA_UPDATER_ROLE(), address(oracleContract));
        console2.log("- Granted DATA_UPDATER_ROLE to PriceOracle");

        // Grant deployer as price updater for testing
        oracleContract.grantRole(oracleContract.PRICE_UPDATER_ROLE(), deployer);
        console2.log("- Granted PRICE_UPDATER_ROLE to deployer");

        // Create sample region for testing
        coreContract.createRegion("Sample Region", 1000 ether);
        console2.log("- Created sample region with base price 1000");

        // Stop broadcasting
        vm.stopBroadcast();

        // ==================== DEPLOYMENT SUMMARY ====================

        console2.log("\n========== ETHANI DEPLOYMENT SUCCESSFUL ==========");
        console2.log("Simple Contracts:");
        console2.log("  EthaniPricing:   ", address(pricingContract));
        console2.log("  EthaniRegion:    ", address(regionContract));
        console2.log("  EthaniIncentive: ", address(incentiveContract));
        console2.log("\nCore Infrastructure:");
        console2.log("  EthaniCore:      ", address(coreContract));
        console2.log("  PriceOracle:     ", address(oracleContract));
        console2.log("==================================================");

        console2.log("\n========== NEXT STEPS ====================");
        console2.log("1. Save contract addresses to your .env file");
        console2.log("2. Verify contracts on block explorer (if --verify used)");
        console2.log("3. Test price calculation:");
        console2.log("   - Update region data: coreContract.updateRegionData(0, supply, demand)");
        console2.log("   - Calculate price: oracleContract.updatePrice(0)");
        console2.log("4. Integrate with backend API");
        console2.log("==========================================\n");

        console2.log("\n========== CONTRACT ADDRESSES (Copy to .env) ==========");
        console2.log("ETHANI_PRICING_ADDRESS=", address(pricingContract));
        console2.log("ETHANI_REGION_ADDRESS=", address(regionContract));
        console2.log("ETHANI_INCENTIVE_ADDRESS=", address(incentiveContract));
        console2.log("ETHANI_CORE_ADDRESS=", address(coreContract));
        console2.log("ETHANI_PRICE_ORACLE_ADDRESS=", address(oracleContract));
        console2.log("=========================================================\n");
    }
}
