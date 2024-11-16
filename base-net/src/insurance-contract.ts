import {
  BalanceReclaimed as BalanceReclaimedEvent,
  PremiumClaimed as PremiumClaimedEvent,
  SubscriptionCancelled as SubscriptionCancelledEvent,
  SubscriptionExpired as SubscriptionExpiredEvent,
  SubscriptionPaid as SubscriptionPaidEvent
} from "../generated/InsuranceContract/InsuranceContract"
import {
  BalanceReclaimed,
  PremiumClaimed,
  SubscriptionCancelled,
  SubscriptionExpired,
  SubscriptionPaid
} from "../generated/schema"

export function handleBalanceReclaimed(event: BalanceReclaimedEvent): void {
  let entity = new BalanceReclaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.insuranceContract = event.params.insuranceContract
  entity.tokenAmount = event.params.tokenAmount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePremiumClaimed(event: PremiumClaimedEvent): void {
  let entity = new PremiumClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.policyHolder = event.params.policyHolder
  entity.InsuranceContract = event.params.InsuranceContract
  entity.amountClaimed = event.params.amountClaimed
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriptionCancelled(
  event: SubscriptionCancelledEvent
): void {
  let entity = new SubscriptionCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.policyHolder = event.params.policyHolder
  entity.insuranceContract = event.params.insuranceContract
  entity.cancellationTime = event.params.cancellationTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriptionExpired(
  event: SubscriptionExpiredEvent
): void {
  let entity = new SubscriptionExpired(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.policyHolder = event.params.policyHolder
  entity.insuranceContract = event.params.insuranceContract
  entity.expiryTime = event.params.expiryTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriptionPaid(event: SubscriptionPaidEvent): void {
  let entity = new SubscriptionPaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.policyHolder = event.params.policyHolder
  entity.insuranceContract = event.params.insuranceContract
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
