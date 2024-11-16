// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {InsurancePolicy} from "../src/InsurancePolicy.sol";
import {Subscription} from "../src/Subscription.sol";
import {MockUSDT} from "../src/MockUSDT.sol";

contract InsuranceTest is Test {
    MockUSDT public token;
    InsurancePolicy public insurance;
    Subscription public subscription;

    address owner;
    address holder = vm.addr(1);
    uint256 subscriptionFee;

    function setUp() public {
        owner = address(this); // Set the test contract as the owner
        // Deploy subscription and insurance contracts
        subscriptionFee = 1e17;
        token = new MockUSDT();
        subscription = new Subscription(address(token), subscriptionFee);
        insurance = new InsurancePolicy(address(token), address(subscription));
        
        subscription.setInsuranceContract(address(insurance));

        // Transfer mock token to insurance contract
        // Method 1: Transfer
        token.transfer(address(insurance), 1e18);
        // Method 2: Faucet
        token.faucet(address(insurance), 1e18);
    }

    function testCreatePolicy() public {
        vm.prank(owner);
        insurance.createPolicy(holder, 1e18);  // Coverage amount is set to 1 USDT
    }

    function testClaim() public {
        vm.prank(owner);
        insurance.createPolicy(holder, 1e18);

        // Impersonate holder for claiming
        vm.prank(holder);
        insurance.claim(0);
    }
}
