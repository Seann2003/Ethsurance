import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ContractFunded,
  OwnershipTransferred,
  PolicyCreated
} from "../generated/InsurancePolicyFactory/InsurancePolicyFactory"

export function createContractFundedEvent(
  amount: BigInt,
  timestamp: BigInt
): ContractFunded {
  let contractFundedEvent = changetype<ContractFunded>(newMockEvent())

  contractFundedEvent.parameters = new Array()

  contractFundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  contractFundedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return contractFundedEvent
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

export function createPolicyCreatedEvent(
  newContract: Address,
  policyHolder: Address,
  disasterTypes: Array<string>,
  latitude: BigInt,
  longitude: BigInt,
  premium: BigInt,
  payoutValue: BigInt,
  duration: BigInt,
  timestamp: BigInt
): PolicyCreated {
  let policyCreatedEvent = changetype<PolicyCreated>(newMockEvent())

  policyCreatedEvent.parameters = new Array()

  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "newContract",
      ethereum.Value.fromAddress(newContract)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "policyHolder",
      ethereum.Value.fromAddress(policyHolder)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "disasterTypes",
      ethereum.Value.fromStringArray(disasterTypes)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "latitude",
      ethereum.Value.fromSignedBigInt(latitude)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "longitude",
      ethereum.Value.fromSignedBigInt(longitude)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "premium",
      ethereum.Value.fromUnsignedBigInt(premium)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "payoutValue",
      ethereum.Value.fromUnsignedBigInt(payoutValue)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return policyCreatedEvent
}
