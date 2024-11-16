// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockUSDT} from "../src/MockUSDT.sol";
import {InsurancePolicyFactory} from "../src/InsuranceProviderFactory.sol";
import {InsuranceContract} from "../src/InsuranceContract.sol";

contract InsuranceSubscriptionTest is Test {
    MockUSDT public token;
    InsurancePolicyFactory public insurancePolicy;

    address owner;
    address holder = vm.addr(1);
    uint256 subscriptionFee;
    uint256 serviceFeePercentage;

    function setUp() public {
        owner = address(this); // Set the test contract as the owner
        // Deploy subscription and insurance contracts
        token = new MockUSDT();
        insurancePolicy = new InsurancePolicyFactory(
            address(token),
            500 * 1e18,
            80
        );

        // Transfer mock token to insurance contract
        // Method 1: Transfer
        token.mint(address(insurancePolicy), 100_000 * 1e18);
    }

    function testCreatePolicy() public {
        string[] disasterTypes;
        disasterTypes[0] = "Flood";
    }
}
