import { DataSourceTemplate } from "@graphprotocol/graph-ts"
import {
  ContractFunded as ContractFundedEvent,
  PolicyCreated as PolicyCreatedEvent,
} from "../generated/InsurancePolicyFactory/InsurancePolicyFactory"
import {
  ContractFunded,
  PolicyCreated,
} from "../generated/schema"

export function handleContractFunded(event: ContractFundedEvent): void {
  let entity = new ContractFunded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePolicyCreated(event: PolicyCreatedEvent): void {
  DataSourceTemplate.create("InsuranceContract", [event.params.newContract.toHex()]);
  let entity = new PolicyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newContract = event.params.newContract
  entity.policyHolder = event.params.policyHolder
  entity.disasterTypes = event.params.disasterTypes
  entity.latitude = event.params.latitude
  entity.longitude = event.params.longitude
  entity.premium = event.params.premium
  entity.payoutValue = event.params.payoutValue
  entity.duration = event.params.duration
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
