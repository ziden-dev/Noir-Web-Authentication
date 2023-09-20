import { NormalMerkleTree } from "../utils/tree/normal-merkle-tree";

export default class State {
  public tree: NormalMerkleTree;
  constructor(tree: NormalMerkleTree) {
    this.tree = tree;
  }

  async getState() {
    return this.tree.getRoot();
  }
}
