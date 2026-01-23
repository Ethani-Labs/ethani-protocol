// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {EthaniPricing} from "../src/EthaniPricing.sol";
import {EthaniRegion} from "../src/EthaniRegion.sol";
import {EthaniIncentive} from "../src/EthaniIncentive.sol";

/**
 * @title DeployEthani
 * @notice Foundry deployment script for all ETHANI contracts
 * 
 * Prerequisites:
 * - Set PRIVATE_KEY environment variable with deployer's private key
 * - Install Foundry: curl -L https://foundry.paradigm.xyz | bash
 * 
 * Deploy to Arbitrum Sepolia Testnet:
 * forge script script/DeployEthani.s.sol --network arbitrum-sepolia --broadcast -vvv
 * 
 * Deploy to localhost:
 * forge script script/DeployEthani.s.sol --fork-url http://localhost:8545 --broadcast
 */

contract DeployEthani is Script {
    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions to network
        vm.startBroadcast(deployerPrivateKey);
        
        // ==================== DEPLOY CONTRACTS ====================
        
        // 1. Deploy EthaniPricing (core pricing logic)
        EthaniPricing pricingContract = new EthaniPricing();
        console2.log("[OK] EthaniPricing deployed at:", address(pricingContract));
        
        // 2. Deploy EthaniRegion (regional data management)
        EthaniRegion regionContract = new EthaniRegion();
        console2.log("[OK] EthaniRegion deployed at:", address(regionContract));
        
        // 3. Deploy EthaniIncentive (participation points)
        EthaniIncentive incentiveContract = new EthaniIncentive();
        console2.log("[OK] EthaniIncentive deployed at:", address(incentiveContract));
        
        // Stop broadcasting transactions
        vm.stopBroadcast();
        
        // ==================== DEPLOYMENT SUMMARY ====================
        console2.log("\n========== ETHANI DEPLOYMENT SUCCESSFUL ==========");
        console2.log("EthaniPricing deployed at:", address(pricingContract));
        console2.log("EthaniRegion deployed at:", address(regionContract));
        console2.log("EthaniIncentive deployed at:", address(incentiveContract));
        console2.log("==================================================\n");
    }
}
