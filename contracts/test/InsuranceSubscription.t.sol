// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockUSDT} from "../src/MockUSDT.sol";
import {InsuranceSubscription} from "../src/InsuranceSubscription.sol";

contract InsuranceSubscriptionTest is Test {
    MockUSDT public token;
    InsuranceSubscription public insuranceSubscription;

    address owner;
    address holder = vm.addr(1);
    uint256 subscriptionFee;
    uint256 serviceFeePercentage;
    // address _usdtToken,
    // uint256 _subscriptionFee,
    // uint256 _serviceFeePercentage

    function setUp() public {
        owner = address(this); // Set the test contract as the owner
        // Deploy subscription and insurance contracts
        subscriptionFee = 1e17;
        serviceFeePercentage = 5;
        token = new MockUSDT();
        insuranceSubscription = new InsuranceSubscription(
            address(token),
            subscriptionFee,
            serviceFeePercentage
        );

        // Transfer mock token to insurance contract
        // Method 1: Transfer
        token.transfer(address(insuranceSubscription), 1e18);
        // Method 2: Faucet
        token.faucet(address(insuranceSubscription), 1e18);
    }
}
