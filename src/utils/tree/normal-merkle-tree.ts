import { buildPoseidon } from "../crypto/poseidon_wasm.js";
import buildPedersenHash from "../crypto/wasmcurves/build_pedersenhash.js";
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
  //let perdersen = await buildPedersenHash();
  return new NormalMerkleTree(hight, poseidon);
}
