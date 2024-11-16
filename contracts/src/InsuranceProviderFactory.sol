// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./InsuranceContract.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsurancePolicyFactory is ReentrancyGuard, Ownable {
    IERC20 public usdtToken;
    uint256 public defaultBasePayout = 10_000 * 1e18; // Default base payout
    uint256 public maxBasePayout = 100_000 * 1e18; // Maximum allowed payout
    uint256 public defaultDeductable;
    uint256 public baseCoverage;
    string[] public coveredDisasters = [
        "Earthquakes",
        "Floods",
        "Landslides",
        "Severe Storms"
        "Volcanoes",
        "Wildfires"
    ];

    mapping(address => InsuranceContract) public contracts;

    event PolicyCreated(
        address newContract,
        address policyHolder,
        string[] disasterTypes,
        int256 latitude,
        int256 longitude,
        uint256 premium,
        uint256 payoutValue,
        uint256 duration,
        uint256 timestamp
    );

    event ContractFunded(uint256 amount, uint256 timestamp);

    constructor(
        address _usdtToken,
        uint256 _defaultDeductable,
        uint256 _baseCoverage
    ) Ownable(msg.sender) {
        // Self-minted token
        usdtToken = IERC20(_usdtToken);
        defaultDeductable = _defaultDeductable;
        baseCoverage = _baseCoverage;
    }

    // Ensure contract has sufficient funding
    function fundContract(uint256 _amount) external onlyOwner {
        require(
            usdtToken.transferFrom(msg.sender, address(this), _amount),
            "Top up failed: Unable to transfer Funds"
        );
        emit ContractFunded(_amount, block.timestamp);
    }

    function calculatePayout(
        uint256 basePayout,
        uint256 contractDuration
    ) public view returns (uint256) {
        // Duration factor: 1 for 12 months, 1.5 for 24 months, etc.
        uint256 durationFactor = (100 +
            ((contractDuration / (12 * 2592000)) * 50)) / 100;

        // Adjust base payout by duration, coverage, and risk factors
        uint256 payout = (basePayout * durationFactor * baseCoverage) / 100;

        // Deduct the deductible
        if (payout > defaultDeductable) {
            payout -= defaultDeductable;
        } else {
            payout = 0; // Ensure no negative payouts
        }

        // Enforce max payout cap
        if (payout > maxBasePayout) {
            payout = maxBasePayout;
        }

        return payout;
    }

    function createPolicy(
        address _policyHolder,
        string[] memory _disasterTypes,
        int256 _latitude,
        int256 _longitude,
        uint256 _premium,
        uint256 _policyDuration
    ) external nonReentrant onlyOwner returns (address) {
        // Calculate subscription fee based on coverage, payoutAmount and riskAssessmentScore
        uint256 calculatedPayout = calculatePayout(1e17, _policyDuration);
        uint256 subscriptionFee = (calculatedPayout * 1) / 100; // 1% of the payout value
        // Fund the contract with payout value to ensure payout can be met
        InsuranceContract newContract = new InsuranceContract(
            // address(this),
            address(usdtToken),
            _policyHolder,
            _disasterTypes,
            coveredDisasters,
            _latitude,
            _longitude,
            _policyDuration,
            calculatedPayout,
            subscriptionFee
        );

        // Fund payout amount
        require(
            usdtToken.transferFrom(
                msg.sender,
                address(newContract),
                calculatedPayout
            ),
            "Funding failed: Unable to transfer USDT"
        );

        contracts[_policyHolder] = newContract;
        emit PolicyCreated(
            address(newContract),
            _policyHolder,
            _disasterTypes,
            _latitude,
            _longitude,
            _premium,
            calculatedPayout,
            _policyDuration,
            block.timestamp
        );
        return address(newContract);
    }

    function reclaimBalance(address policyHolder) external onlyOwner {
        contracts[policyHolder].withdrawBalanceToFactory();
    }
}
