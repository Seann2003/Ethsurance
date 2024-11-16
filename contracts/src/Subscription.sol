// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Subscription is Ownable {
    IERC20 public usdtToken;
    uint256 public subscriptionFee;
    address public insuranceContract;

    // Track last payment timestamp for each user
    mapping(address => uint256) public lastPaymentTimestamp;
    uint256 public subscriptionPeriod = 30 days;

    // Event for logging payment
    event PaymentReceived(address indexed user, uint256 amount, uint256 timestamp);

    // Modifier to allow only the insurance contract to check payment status
    modifier onlyInsuranceContract() {
        require(msg.sender == insuranceContract, "Only insurance contract allowed");
        _;
    }

    constructor(address _usdtToken, uint256 _subscriptionFee) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtToken);
        subscriptionFee = _subscriptionFee;
    }

    function setInsuranceContract(address _insuranceContract) external onlyOwner {
        insuranceContract = _insuranceContract;
    }

    // User calls this to make a payment
    function paySubscription() external {
        require(usdtToken.transferFrom(msg.sender, address(this), subscriptionFee), "Payment failed");
        
        // Update last payment timestamp
        lastPaymentTimestamp[msg.sender] = block.timestamp;

        emit PaymentReceived(msg.sender, subscriptionFee, block.timestamp);
    }

    // Function for the insurance contract to check if the subscription is active
    function isSubscriptionActive(address user) external view onlyInsuranceContract returns (bool) {
        return block.timestamp <= lastPaymentTimestamp[user] + subscriptionPeriod;
    }
}
