import { RSAPublicKey } from "../../index.js";
import { buildPoseidon } from "../../utils/crypto/poseidon_wasm.js";
import { NormalMerkleTree } from "../../utils/tree/normal-merkle-tree.js";

export default class Account {
  public amount: BigInt;
  public id: BigInt;
  public tree: NormalMerkleTree;
  public stt: number = 0;
  public RSAPublicKeys: any[];
  public spkis: any[];
  constructor(amount: BigInt, id: BigInt, tree: NormalMerkleTree, rsa: RSAPublicKey, spki: string) {
    this.amount = amount;
    this.id = id;
    this.tree = tree;
    this.RSAPublicKeys = [rsa];
    this.spkis = [spki];
  }
  setstt(stt: number) {
    this.stt = stt;
  }

  async getHash() {
    return this.tree?.getRoot();
  }
}
