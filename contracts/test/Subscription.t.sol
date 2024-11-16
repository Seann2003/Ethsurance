// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {InsurancePolicy} from "../src/InsurancePolicy.sol";
import {Subscription} from "../src/Subscription.sol";
import {MockUSDT} from "../src/MockUSDT.sol";

contract SubscriptionTest is Test {
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
        token.faucet(address(holder), 1e18);
    }

    function testPaySubscription() public {
        // Impersonate holder to approve and pay the subscription
        vm.prank(holder);
        token.approve(address(subscription), subscriptionFee);

        vm.prank(holder);
        subscription.paySubscription();

        // Verify subscription is active
        vm.prank(address(insurance));
        bool isActive = subscription.isSubscriptionActive(holder);
        assertTrue(isActive, "Subscription should be active after payment");
    }

    function testSubscriptionStatusAfter30Days() public {
        // Initially, the subscription should be active after payment
        vm.prank(holder);
        token.approve(address(subscription), subscriptionFee);

        vm.prank(holder);
        subscription.paySubscription();

        vm.prank(address(insurance));
        bool isActiveInitially = subscription.isSubscriptionActive(holder);
        assertTrue(isActiveInitially, "Subscription should be active immediately after payment");

        // Fast forward time by 31 days (31 * 24 * 60 * 60 seconds)
        vm.warp(block.timestamp + 31 days);

        // Check subscription status again, which should now be inactive
        vm.prank(address(insurance));
        bool isActiveAfter30Days = subscription.isSubscriptionActive(holder);
        assertFalse(isActiveAfter30Days, "Subscription should be inactive after 30 days without renewal");
    }
}
