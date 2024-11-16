// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./InsuranceContract.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsurancePolicyFactory is ReentrancyGuard, Ownable {
    IERC20 public usdtToken;
    AggregatorV3Interface public priceFeed;
    LinkTokenInterface public linkToken;

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
        // Scroll Sepolia Testnet Token Addresses
        linkToken = LinkTokenInterface(
            0x7273ebbB21F8D8AcF2bC12E71a08937712E9E40c
        );
        priceFeed = AggregatorV3Interface(
            0xd38E5c25935291fFD51C9d66C3B7384494bb099A // Need change to scroll sepolia
        );
    }

    // Ensure contract has sufficient funding
    function fundContract(uint256 _amount) external onlyOwner {
        require(
            linkToken.transferFrom(msg.sender, address(this), _amount),
            "Top up failed: Unable to transfer LINK"
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
            address(linkToken),
            _policyHolder,
            _disasterTypes,
            _location,
            _policyDuration,
            _premium,
            _payoutValue,
            _oraclePaymentAmount,
            _riskAssessmentScore,
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

        // Get LINK token and set funding for oracle requests
        require(
            linkToken.transferFrom(
                msg.sender,
                address(newContract),
                _oraclePaymentAmount
            ),
            "Funding failed: Unable to transfer LINK"
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
