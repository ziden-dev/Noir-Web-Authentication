import { registrations } from "../src/mockdata.js";
import State from "../src/models/state/state.js";
import { createCleanTree } from "../src/utils/tree/normal-merkle-tree.js";
import { register } from "../src/witness/accountTransaction.js";

import circuit from "../src/circuits/registerTransaction/target/registerTransaction.json" assert { type: "json" };
import { convertToHexAndPad, object2Array } from "../src/utils/bits.js";
import { validateWitness } from "../src/utils/berretenberg-api/index.js";
import { expect } from "chai";

describe("test account transaction", () => {
  let accounts: any[];
  let state: any;
  it("create account", async () => {
    let state = new State(await createCleanTree(3));
    let info = registrations.at(0);
    let registerProof = await register(info, state);
    console.log(" registerProof = ", registerProof);

    const inputs = object2Array(registerProof);

    const witness = new Map<number, string>();
    inputs.forEach((input, index) => {
      witness.set(index + 1, convertToHexAndPad(input));
    });
    console.log(witness);

    const isWitnessValid = await validateWitness(witness, circuit);
    expect(isWitnessValid).to.be.true;
  });
});
