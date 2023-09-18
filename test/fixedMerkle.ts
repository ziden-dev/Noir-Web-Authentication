import assert from "assert";
import { IndexedMerkleTree } from "../scripts/main.js";
import wasm_tester from "circom_tester/wasm/tester.js";
import path from "path";
import { Console, log } from "console";

describe("indexed merkle tree", function () {
  it("test js insert", async function () {
    //   root
    //    /\
    //   a  zero[2]
    //  /  \
    // b    c
    // /\   /\
    //0  3 1  zero[0]
    //1  0 3
    //2  0 1
    var tree = new IndexedMerkleTree(3);
    await tree.init();
    tree.insert(3);
    tree.insert(1);

    var leaf1 = tree.hash([0, 1, 2]);
    var leaf2 = tree.hash([3, 0, 0]);
    var leaf3 = tree.hash([1, 3, 1]);

    var c = tree.hash([leaf3, tree.zero[0]]);
    var b = tree.hash([leaf1, leaf2]);
    var a = tree.hash([b, c]);
    var root = tree.hash([a, tree.zero[2]]);

    assert.equal(root, tree.getRoot());

    /// check path
    var { leaf, path } = tree.getPath(1);

    var leaf4 = tree.hash([leaf.val, leaf.nextVal, leaf.nextIdx]);
    var c2 = tree.hash([leaf4, path[0]]);
    var a2 = tree.hash([path[1], c2]);
    var root2 = tree.hash([a2, path[2]]);

    assert.equal(root, root2);
  });

  it("test js insert batch", async function () {
    var tree1 = new IndexedMerkleTree(10);
    await tree1.init();
    tree1.insert(1);
    tree1.insert(9);
    tree1.insert(5);
    tree1.insert(2);
    tree1.insert(4);
    tree1.insert(6);
    tree1.insert(8);
    ////
    var tree2 = new IndexedMerkleTree(10);
    await tree2.init();
    tree2.insert(1);
    tree2.insert(9);
    tree2.insert(5);
    tree2.insert_batch(2, [8, 2, 4, 6]);

    assert.equal(tree1.getRoot(), tree2.getRoot());
  });

  it("test circom insert", async function () {
    //console.log(path.join(, "./circuits"));
    var circuit = await wasm_tester("./src/circuits/insert.circom");
    var tree = new IndexedMerkleTree(30);
    await tree.init();

    tree.insert(100);
    tree.insert(102);
    var input = tree.insert(103);

    var witness = await circuit.calculateWitness(input);
    await circuit.checkConstraints(witness);
  });

  it("test circom insert batch", async function () {
    //console.log(path.join(, "./circuits"));
    var circuit = await wasm_tester("./src/circuits/insertbatch.circom");
    var tree = new IndexedMerkleTree(10);
    await tree.init();

    tree.insert(1);
    tree.insert(9);
    tree.insert(5);

    var input = tree.insert_batch(2, [2, 4, 6, 8]);

    var witness = await circuit.calculateWitness(input);
    await circuit.checkConstraints(witness);
  });
});
