import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BalanceReclaimed,
  OwnershipTransferred,
  PremiumClaimed,
  SubscriptionCancelled,
  SubscriptionExpired,
  SubscriptionPaid
} from "../generated/InsuranceContract/InsuranceContract"

export function createBalanceReclaimedEvent(
  insuranceContract: Address,
  tokenAmount: BigInt,
  timestamp: BigInt
): BalanceReclaimed {
  let balanceReclaimedEvent = changetype<BalanceReclaimed>(newMockEvent())

  balanceReclaimedEvent.parameters = new Array()

  balanceReclaimedEvent.parameters.push(
    new ethereum.EventParam(
      "insuranceContract",
      ethereum.Value.fromAddress(insuranceContract)
    )
  )
  balanceReclaimedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAmount",
      ethereum.Value.fromUnsignedBigInt(tokenAmount)
    )
  )
  balanceReclaimedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return balanceReclaimedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPremiumClaimedEvent(
  policyHolder: Address,
  InsuranceContract: Address,
  amountClaimed: BigInt,
  timestamp: BigInt
): PremiumClaimed {
  let premiumClaimedEvent = changetype<PremiumClaimed>(newMockEvent())

  premiumClaimedEvent.parameters = new Array()

  premiumClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "policyHolder",
      ethereum.Value.fromAddress(policyHolder)
    )
  )
  premiumClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "InsuranceContract",
      ethereum.Value.fromAddress(InsuranceContract)
    )
  )
  premiumClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "amountClaimed",
      ethereum.Value.fromUnsignedBigInt(amountClaimed)
    )
  )
  premiumClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return premiumClaimedEvent
}

export function createSubscriptionCancelledEvent(
  policyHolder: Address,
  insuranceContract: Address,
  cancellationTime: BigInt
): SubscriptionCancelled {
  let subscriptionCancelledEvent = changetype<SubscriptionCancelled>(
    newMockEvent()
  )

  subscriptionCancelledEvent.parameters = new Array()

  subscriptionCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "policyHolder",
      ethereum.Value.fromAddress(policyHolder)
    )
  )
  subscriptionCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "insuranceContract",
      ethereum.Value.fromAddress(insuranceContract)
    )
  )
  subscriptionCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "cancellationTime",
      ethereum.Value.fromUnsignedBigInt(cancellationTime)
    )
  )

  return subscriptionCancelledEvent
}

export function createSubscriptionExpiredEvent(
  policyHolder: Address,
  insuranceContract: Address,
  expiryTime: BigInt
): SubscriptionExpired {
  let subscriptionExpiredEvent = changetype<SubscriptionExpired>(newMockEvent())

  subscriptionExpiredEvent.parameters = new Array()

  subscriptionExpiredEvent.parameters.push(
    new ethereum.EventParam(
      "policyHolder",
      ethereum.Value.fromAddress(policyHolder)
    )
  )
  subscriptionExpiredEvent.parameters.push(
    new ethereum.EventParam(
      "insuranceContract",
      ethereum.Value.fromAddress(insuranceContract)
    )
  )
  subscriptionExpiredEvent.parameters.push(
    new ethereum.EventParam(
      "expiryTime",
      ethereum.Value.fromUnsignedBigInt(expiryTime)
    )
  )

  return subscriptionExpiredEvent
}

export function createSubscriptionPaidEvent(
  policyHolder: Address,
  insuranceContract: Address,
  amount: BigInt,
  timestamp: BigInt
): SubscriptionPaid {
  let subscriptionPaidEvent = changetype<SubscriptionPaid>(newMockEvent())

  subscriptionPaidEvent.parameters = new Array()

  subscriptionPaidEvent.parameters.push(
    new ethereum.EventParam(
      "policyHolder",
      ethereum.Value.fromAddress(policyHolder)
    )
  )
  subscriptionPaidEvent.parameters.push(
    new ethereum.EventParam(
      "insuranceContract",
      ethereum.Value.fromAddress(insuranceContract)
    )
  )
  subscriptionPaidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  subscriptionPaidEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return subscriptionPaidEvent
}
