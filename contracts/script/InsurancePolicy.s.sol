// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDT} from "../src/MockUSDT.sol";
import {InsuranceContract} from "../src/InsuranceContract.sol";
import {InsurancePolicyFactory} from "../src/InsuranceProviderFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsuranceScript is Script {
    MockUSDT public token;
    InsuranceContract public insurance;
    InsurancePolicyFactory public insurancePolicy;
    uint256 subscriptionFee = 1e17;
    uint256 deductible = 100 * 1e18;
    address public holder;

    function setUp() public {
        holder = vm.addr(vm.envUint("PRIVATE_KEY"));
    }

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        token = new MockUSDT();
        insurancePolicy = new InsurancePolicyFactory(
            address(token),
            deductible,
            80
        );
        string[] memory disasterTypes = new string[](1);
        string[] memory coveredDisasters = new string[](2);
        disasterTypes[0] = "Floods";
        coveredDisasters[0] = "Floods";
        coveredDisasters[1] = "Wildfires";
        insurance = new InsuranceContract(
            address(token),
            holder,
            disasterTypes,
            coveredDisasters,
            int256(12345),
            int256(67890),
            30 days,
            100 * 1e18,
            1 * 1e17
        );
        vm.stopBroadcast();
    }
}
