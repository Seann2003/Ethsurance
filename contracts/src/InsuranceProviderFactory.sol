// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./InsuranceContract.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsurancePolicyFactory is ReentrancyGuard, Ownable {
    IERC20 public usdtToken;

    mapping(address => InsuranceContract) contracts;

    event PolicyCreated(
        address newContract,
        address policyHolder,
        string location,
        string[] disasterTypes,
        uint256 premium,
        uint256 payoutValue,
        uint256 duration,
        uint256 timestamp
    );

    event ContractFunded(uint256 amount, uint256 timestamp);

    constructor(address _usdtToken) Ownable(msg.sender) {
        // Self-minted token
        usdtToken = IERC20(_usdtToken);
    }

    // Ensure contract has sufficient funding
    function fundContract(uint256 _amount) external onlyOwner {
        require(
            usdtToken.transferFrom(msg.sender, address(this), _amount),
            "Top up failed: Unable to transfer Funds"
        );
        emit ContractFunded(_amount, block.timestamp);
    }

    function createPolicy(
        address _policyHolder,
        string[] memory _disasterTypes,
        string memory _location,
        uint256 _premium,
        uint256 _payoutValue,
        uint256 _policyDuration,
        uint256 _riskAssessmentScore,
        uint256 _oraclePaymentAmount
    ) external nonReentrant onlyOwner returns (address) {
        // Calculate subscription fee based on coverage, payoutAmount and riskAssessmentScore
        uint256 subscriptionFee = 1e17;

        // Fund the contract with payout value to ensure payout can be met
        InsuranceContract newContract = new InsuranceContract(
            address(this),
            address(usdtToken),
            _policyHolder,
            _disasterTypes,
            _location,
            _policyDuration,
            _premium,
            _payoutValue,
            subscriptionFee
        );

        // Fund payout amount
        require(
            usdtToken.transferFrom(
                msg.sender,
                address(newContract),
                _payoutValue
            ),
            "Funding failed: Unable to transfer USDT"
        );

        contracts[_policyHolder] = newContract;
        emit PolicyCreated(
            address(newContract),
            _policyHolder,
            _location,
            _disasterTypes,
            _premium,
            _payoutValue,
            _policyDuration,
            block.timestamp
        );
        return address(newContract);
    }

    function reclaimBalance(address policyHolder) external onlyOwner {
        contracts[policyHolder].withdrawBalanceToFactory();
    }
}
