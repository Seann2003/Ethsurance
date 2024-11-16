// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract InsuranceContract is ReentrancyGuard, Ownable {
    using Strings for int256;

    IERC20 public usdtToken;
    address private policyHolder;
    string[] private disasterTypes;
    string[] public coveredDisasters;
    int256 private latitude;
    int256 private longitude;
    int256 public coordinatePrecision = 10 ** 6;
    uint256 public subscriptionPeriod = 30 days;
    uint256 public gracePeriod = 14 days;
    uint256 public subscriptionFee;
    uint256 public duration;
    uint256 private payoutValue;
    uint256 private policyEndTime;
    uint256 public lastPaymentTime;
    bool private isActive = true;
    bool public isClaimable = false;

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

    event SubscriptionCancelled(
        address indexed policyHolder,
        address insuranceContract,
        uint256 cancellationTime
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
        uint256 tokenAmount,
        uint256 timestamp
    );

    constructor(
        address _usdtToken,
        address _policyHolder,
        string[] memory _disasterTypes,
        string[] memory _coveredDisasters,
        int256 _latitude,
        int256 _longitude,
        uint256 _policyDuration,
        uint256 _payoutValue,
        uint256 _subscriptionFee
    ) payable Ownable(msg.sender) {
        usdtToken = IERC20(_usdtToken);
        policyHolder = _policyHolder;
        disasterTypes = _disasterTypes;
        coveredDisasters = _coveredDisasters;
        latitude = _latitude * coordinatePrecision;
        longitude = _longitude * coordinatePrecision;
        duration = _policyDuration;
        payoutValue = _payoutValue;
        subscriptionFee = _subscriptionFee;
    }

    function paySubscription() external nonReentrant onlyPolicyHolder {
        // Check if policy still valid
        bool active = isActive &&
            ((block.timestamp - lastPaymentTime) <
                subscriptionPeriod + gracePeriod);

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
        isActive = false;

        emit SubscriptionPaid(
            msg.sender,
            address(this),
            subscriptionFee,
            block.timestamp
        );
    }

    function updateEligibility(
        string memory _disaster
    ) external onlyOwnerOrPolicyHolder {
        if (isDisasterCovered(_disaster)) {
            isClaimable = true;
        }
    }

    function checkPayoutValue()
        external
        view
        onlyOwnerOrPolicyHolder
        returns (uint256)
    {
        return payoutValue;
    }

    function isDisasterCovered(
        string memory _disaster
    ) public view returns (bool) {
        for (uint256 i = 0; i < coveredDisasters.length; i++) {
            if (
                keccak256(abi.encodePacked(coveredDisasters[i])) ==
                keccak256(abi.encodePacked(_disaster))
            ) {
                return true;
            }
        }
        return false;
    }

    function checkInactivity()
        external
        view
        onlyOwnerOrPolicyHolder
        returns (bool)
    {
        // Check activity over subscription + grace period and end time
        return
            isActive &&
            (block.timestamp >
                lastPaymentTime + subscriptionPeriod + gracePeriod ||
                block.timestamp >= policyEndTime);
    }

    function claimPremium() external onlyPolicyHolder {
        require(isClaimable, "Cannot claim payout yet");
        require(
            usdtToken.transferFrom(policyHolder, address(this), payoutValue),
            "Payment failed"
        );
        isActive = false;
        emit PremiumClaimed(
            policyHolder,
            address(this),
            payoutValue,
            block.timestamp
        );
    }

    function cancelPolicy() external nonReentrant onlyPolicyHolder {
        require(isActive, "Policy is no longer active");
        require(!isClaimable, "Cannot cancel a claimable policy");

        // Calculate cancellation refund
        uint256 timeElapsed = block.timestamp > lastPaymentTime
            ? block.timestamp - lastPaymentTime
            : 0;
        uint256 unusedDuration = subscriptionPeriod > timeElapsed
            ? subscriptionPeriod - timeElapsed
            : 0;

        uint256 refundAmount = (subscriptionFee * unusedDuration) /
            subscriptionPeriod;

        // 10% of the refund amount
        uint256 cancellationFee = (refundAmount * 10) / 100;

        // Calculate final refund amount after deduction
        uint256 finalRefund = refundAmount > cancellationFee
            ? refundAmount - cancellationFee
            : 0;

        // Transfer the refund to the policyholder
        if (finalRefund > 0) {
            require(
                usdtToken.transfer(policyHolder, finalRefund),
                "Refund transfer failed"
            );
        }

        // Transfer cancellation fee to the owner
        if (cancellationFee > 0) {
            require(
                usdtToken.transfer(owner(), cancellationFee),
                "Cancellation fee transfer failed"
            );
        }

        isActive = false;

        emit SubscriptionCancelled(
            policyHolder,
            address(this),
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
        emit BalanceReclaimed(address(this), tokenBalance, block.timestamp);
    }
}
