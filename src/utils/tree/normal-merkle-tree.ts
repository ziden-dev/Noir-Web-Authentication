import { buildPoseidon } from "../crypto/poseidon_wasm.js";
import { Leaf, MerkleTree } from "./merkle-tree.js";

export class NormalMerkleTree extends MerkleTree {
  insert(value: BigInt) {
    var newLeaf: Leaf = {
      toNode(hash: Function) {
        return value;
      },
    };
    this.leaves.push(newLeaf);
    this.update(this.leaves.length - 1);
    return this.leaves.length - 1;
  }
}

export async function createCleanTree(hight: number) {
  let poseidon = await buildPoseidon();
  return new NormalMerkleTree(hight, buildPoseidon);
}
