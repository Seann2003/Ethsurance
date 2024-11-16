// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {InsuranceContract} from "../src/InsuranceContract.sol";
import {Subscription} from "../src/Subscription.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsuranceScript is Script {
    InsuranceContract public insurance;
    Subscription public subscription;
    uint256 subscriptionFee = 1e17;
    address constant USDT_SCROLL = 0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        subscription = new Subscription(USDT_SCROLL, subscriptionFee);
        insurance = new InsuranceContract(USDT_SCROLL, address(subscription));

        vm.stopBroadcast();
    }
}
