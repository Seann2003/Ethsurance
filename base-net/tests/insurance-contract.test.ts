import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { BalanceReclaimed } from "../generated/schema"
import { BalanceReclaimed as BalanceReclaimedEvent } from "../generated/InsuranceContract/InsuranceContract"
import { handleBalanceReclaimed } from "../src/insurance-contract"
import { createBalanceReclaimedEvent } from "./insurance-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let insuranceContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenAmount = BigInt.fromI32(234)
    let timestamp = BigInt.fromI32(234)
    let newBalanceReclaimedEvent = createBalanceReclaimedEvent(
      insuranceContract,
      tokenAmount,
      timestamp
    )
    handleBalanceReclaimed(newBalanceReclaimedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BalanceReclaimed created and stored", () => {
    assert.entityCount("BalanceReclaimed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BalanceReclaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "insuranceContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BalanceReclaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenAmount",
      "234"
    )
    assert.fieldEquals(
      "BalanceReclaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
