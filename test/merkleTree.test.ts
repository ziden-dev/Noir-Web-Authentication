import { CryptographyPrimitives } from "../src/utils/crypto/index.js";
import { expect } from "chai";
import { buildPoseidon } from "../src/utils/crypto/poseidon_wasm.js";
import { NormalMerkleTree } from "../src/utils/tree/normal-merkle-tree.js";

import circuit from "../src/circuits/merkleTree/target/merkleTree.json" assert { type: "json" };
import { convertToHexAndPad } from "../src/utils/bits.js";
import { validateWitness } from "../src/utils/berretenberg-api/index.js";

describe("test merkle tree ", () => {
  let poseidon: any;
  let crypto: CryptographyPrimitives;

  let merkleTree: any;
  before(async () => {
    crypto = await CryptographyPrimitives.getInstance();
    poseidon = await buildPoseidon();
  });
  it("poseidon", async () => {
    const res = poseidon([1, 2]);
    expect(poseidon.F.toString(res)).equal(
      BigInt(
        "0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a"
      ).toString(10)
    );
  });

  it(" Create Normal Merkle", async () => {
    merkleTree = new NormalMerkleTree(3, poseidon);
    merkleTree.insert(1n);
    merkleTree.insert(2n);
    merkleTree.insert(3n);
    merkleTree.insert(4n);

    console.log("root = ", merkleTree.getRoot());

    let proof = merkleTree.getPathProof(1);

    let inputs = [
      proof.value,
      proof.index,
      ...proof.path,
      merkleTree.getRoot(),
    ];

    console.log(inputs);

    const witness = new Map<number, string>();
    inputs.forEach((input, index) => {
      witness.set(index + 1, convertToHexAndPad(input));
    });

    console.log(witness);

    const isWitnessValid = await validateWitness(witness, circuit);
    expect(isWitnessValid).to.be.true;
  });
});
