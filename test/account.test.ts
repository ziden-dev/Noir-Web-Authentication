import { registrations } from "../src/mockdata.js";
import State from "../src/models/state/state.js";
import { createCleanTree } from "../src/utils/tree/normal-merkle-tree.js";
import { addKey, register } from "../src/witness/accountTransaction.js";

import circuitRegister from "../src/circuits/registerTransaction/target/registerTransaction.json" assert { type: "json" };

import circuitAddKey from "../src/circuits/addKeyTransaction/target/addKeyTransaction.json" assert { type: "json" };

import { convertToHexAndPad, object2Array } from "../src/utils/bits.js";
import { validateWitness } from "../src/utils/berretenberg-api/index.js";
import { expect } from "chai";
import Account from "../src/models/accounts/account.js";

describe("test account transaction", () => {
  let accounts: any[] = [];
  let state: any;
  it("create first account", async () => {
    state = new State(await createCleanTree(3));
    let info = registrations.at(0);
    let registerProof = await register(info, state);
    let acc = registerProof.account;

    accounts.push(acc);
    const inputs = object2Array(registerProof.inputs);
    const witness = new Map<number, string>();
    inputs.forEach((input, index) => {
      witness.set(index + 1, convertToHexAndPad(input));
    });
    const isWitnessValid = await validateWitness(witness, circuitRegister);
    expect(isWitnessValid).to.be.true;
  }).timeout(100000);

  it("create second account", async () => {
    let info = registrations.at(1);

    let registerProof = await register(info, state);
    let acc = registerProof.account;
    const inputs = object2Array(registerProof.inputs);
    accounts.push(acc);
    const witness = new Map<number, string>();
    inputs.forEach((input, index) => {
      witness.set(index + 1, convertToHexAndPad(input));
    });
    const isWitnessValid = await validateWitness(witness, circuitRegister);
    expect(isWitnessValid).to.be.true;
  }).timeout(100000);

  it("add second key in 1st account", async () => {
    let info = registrations.at(2);
    let acc = accounts[0];
    const addKetProof = await addKey(info, acc, state);
    const inputs = object2Array(addKetProof);
    accounts.push(acc);
    const witness = new Map<number, string>();
    inputs.forEach((input, index) => {
      witness.set(index + 1, convertToHexAndPad(input));
    });
    const isWitnessValid = await validateWitness(witness, circuitAddKey);
    expect(isWitnessValid).to.be.true;
    //console.log(addKetProof);
  }).timeout(100000);
});
