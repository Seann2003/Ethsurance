// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@chainlink/contracts/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InsuranceContract is ReentrancyGuard, Ownable, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    IERC20 public usdtToken;
    address private policyHolder;
    string[] private disasterTypes;
    string private location;
    uint256 public subscriptionFee;
    uint256 public oraclePaymentAmount;
    uint256 private premium;
    uint256 private payoutValue;
    uint256 private policyEndTime;
    uint256 private lastPaymentTime;
    uint256 private riskAssessmentScore;
    uint256 public subscriptionPeriod = 30 days;
    uint256 public gracePeriod = 14 days;
    bool private isActive = true;

    modifier onlyOwnerOrPolicyHolder() {
        require(
            msg.sender == owner() || msg.sender == policyHolder,
            "Not owner or policy holder"
        );
        _;
    }

    modifier onlyPolicyHolder() {
        require(msg.sender == policyHolder, "Not policy holder");
        _;
    }

    event SubscriptionExpired(
        address indexed policyHolder,
        address insuranceContract,
        uint256 expiryTime
    );

    event SubscriptionPaid(
        address indexed policyHolder,
        address insuranceContract,
        uint256 amount,
        uint256 timestamp
    );

    event PremiumClaimed(
        address indexed policyHolder,
        address InsuranceContract,
        uint256 amountClaimed,
        uint256 timestamp
    );

    event BalanceReclaimed(
        address insuranceContract,
        uint256 linkAmount,
        uint256 tokenAmount,
        uint256 timestamp
    );

    constructor(
        address _factoryContract,
        address _usdtToken,
        address _linkToken,
        address _policyHolder,
        string[] memory _disasterTypes,
        string memory _location,
        uint256 _duration,
        uint256 _premium,
        uint256 _payoutValue,
        uint256 _oraclePaymentAmount,
        uint256 _riskAssessmentScore,
        uint256 _subscriptionFee
    ) payable Ownable(msg.sender) {
        transferOwnership(_factoryContract);
        _setChainlinkToken(_linkToken);
        usdtToken = IERC20(_usdtToken);

        policyHolder = _policyHolder;
        disasterTypes = _disasterTypes;
        location = _location;
        premium = _premium;
        payoutValue = _payoutValue;
        policyEndTime = block.timestamp + _duration;
        lastPaymentTime = block.timestamp;
        oraclePaymentAmount = _oraclePaymentAmount;
        riskAssessmentScore = _riskAssessmentScore;
        subscriptionFee = _subscriptionFee;
    }

    /**
     * In parent contract I funded child contract with our mock token and LINK tokens
     * So you can just focus on chainlink calling requests etc.
     * Not yet do test script
     *
     * Right now can only claim once within period, want subsequent claims need implement better mechanism (still thinking)
     */

    // TBA
    function viewPolicy() external onlyOwnerOrPolicyHolder {}

    function paySubscription() external nonReentrant onlyPolicyHolder {
        // Check if policy still valid
        bool active = isActive &&
            (block.timestamp + gracePeriod - lastPaymentTime <
                subscriptionPeriod);

        require(active, "Policy expired");

        require(
            block.timestamp >= lastPaymentTime + subscriptionPeriod,
            "Payment not due yet"
        );

        require(
            usdtToken.transferFrom(msg.sender, address(this), subscriptionFee),
            "Subscription payment failed"
        );
        // Update status
        lastPaymentTime = block.timestamp;
        isActive = true;

        emit SubscriptionPaid(
            msg.sender,
            address(this),
            subscriptionFee,
            block.timestamp
        );
    }

    function checkInactivity() external onlyOwnerOrPolicyHolder {
        // Check activity over subscription + grace period and end time
        if (
            block.timestamp >
            lastPaymentTime + subscriptionPeriod + gracePeriod ||
            block.timestamp >= policyEndTime
        ) {
            isActive = false;
            emit SubscriptionExpired(
                policyHolder,
                address(this),
                block.timestamp
            );
        }
    }

    function payPremium() external onlyOwnerOrPolicyHolder {
        // Implement checking mechanism here
        require(
            usdtToken.transferFrom(policyHolder, address(this), payoutValue),
            "Payment failed"
        );
        isActive = false; // Will allow multiple claims in future
        emit PremiumClaimed(
            policyHolder,
            address(this),
            payoutValue,
            block.timestamp
        );
    }

    function withdrawBalanceToFactory() external onlyOwner nonReentrant {
        require(
            !isActive || block.timestamp >= policyEndTime,
            "Policy still active"
        );

        uint256 tokenBalance = address(this).balance;
        require(
            usdtToken.transfer(msg.sender, tokenBalance),
            "Balance withdrawal failed"
        );

        LinkTokenInterface linkToken = LinkTokenInterface(
            _chainlinkTokenAddress()
        );
        uint256 linkBalance = linkToken.balanceOf(address(this));

        if (linkBalance > 0) {
            require(
                linkToken.transfer(msg.sender, linkBalance),
                "LINK withdrawal failed"
            );
        }
        emit BalanceReclaimed(
            address(this),
            linkBalance,
            tokenBalance,
            block.timestamp
        );
    }
}
