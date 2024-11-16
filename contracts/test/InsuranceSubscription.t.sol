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
        token.mint(holder, 10_000 * 1e18);
    }

    function testCreatePolicy() public {
        string[] memory disasterTypes = new string[](1);
        disasterTypes[0] = "Floods";
        uint256 premium = 100 * 1e18;
        uint256 duration = 12 * 30 days;

        vm.prank(owner);
        address policyAddress = insurancePolicy.createPolicy(
            holder,
            disasterTypes,
            int256(12345), // latitude
            int256(67890), // longitude
            premium,
            duration
        );

        assertTrue(policyAddress != address(0));
        assertEq(
            address(insurancePolicy.contracts(holder)),
            policyAddress,
            "Policy address mismatch"
        );
    }

    function testCancelPolicy() public {
        string[] memory disasterTypes = new string[](1);
        disasterTypes[0] = "Floods";
        uint256 premium = 100 * 1e18;
        uint256 duration = 12 * 30 days;

        vm.prank(owner);
        address policyAddress = insurancePolicy.createPolicy(
            holder,
            disasterTypes,
            int256(12345), // latitude
            int256(67890), // longitude
            premium,
            duration
        );

        InsuranceContract insurance = InsuranceContract(policyAddress);

        // Cancel the policy
        vm.prank(holder);
        insurance.cancelPolicy();

        vm.prank(holder);
        assertEq(
            insurance.checkInactivity(),
            false,
            "Policy should be inactive"
        );
    }

    function testSubscriptionPayment() public {
        string[] memory disasterTypes = new string[](1);
        disasterTypes[0] = "Floods";
        uint256 premium = 100 * 1e18;
        uint256 duration = 12 * 30 days;

        vm.prank(owner);
        address policyAddress = insurancePolicy.createPolicy(
            holder,
            disasterTypes,
            int256(12345), // latitude
            int256(67890), // longitude
            premium,
            duration
        );

        InsuranceContract insurance = InsuranceContract(policyAddress);

        // Pay subscription fee
        vm.warp(block.timestamp + 31 days); // simulate time passage
        vm.prank(holder);
        insurance.paySubscription();

        assertEq(
            insurance.lastPaymentTime(),
            block.timestamp,
            "Payment time mismatch"
        );
    }

    function testClaimPayment() public {
        string[] memory disasterTypes = new string[](1);
        disasterTypes[0] = "Floods";
        uint256 premium = 100 * 1e18;
        uint256 duration = 12 * 30 days;

        // Create policy
        vm.prank(owner);
        address policyAddress = insurancePolicy.createPolicy(
            holder,
            disasterTypes,
            int256(12345), // latitude
            int256(67890), // longitude
            premium,
            duration
        );

        InsuranceContract insurance = InsuranceContract(policyAddress);

        // Update eligibility (simulate some condition to allow claiming)
        vm.prank(owner);
        insurance.updateEligibility("Floods");

        uint256 oldBalance = holder.balance;

        // Ensure the holder is calling the claim function
        vm.prank(holder);
        insurance.claimPremium(); // Policy holder claims

        // Verify balance has increased by the payout amount
        vm.prank(holder);
        uint256 payoutValue = insurance.checkPayoutValue(); // Assuming this function returns the payout value
        assertEq(
            holder.balance,
            (oldBalance + payoutValue), // The holder's balance should increase by the payout value
            "Balance mismatch"
        );
    }
}
