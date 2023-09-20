import { buildPoseidon } from "../utils/crypto/poseidon_wasm";
import { NormalMerkleTree } from "../utils/tree/normal-merkle-tree";

export default class Account {
  public amount: BigInt;
  public id: BigInt;
  public tree: NormalMerkleTree;
  public stt: number = 0;
  public publicKeys: any[];
  public spkis: any[];
  constructor(amount: BigInt, id: BigInt, tree: NormalMerkleTree) {
    this.amount = amount;
    this.id = id;
    this.tree = tree;
    this.publicKeys = [];
    this.spkis = [];
  }
  setstt(stt: number) {
    this.stt = stt;
  }

  private async setupTree() {
    let poseidon = await buildPoseidon();
    this.tree = new NormalMerkleTree(5, poseidon);
  }

  async getHash() {
    let poseidon = await buildPoseidon();
    return poseidon([this.amount, this.id, this.tree?.getRoot(), this.stt]);
  }
}
