import { registerProofWitness } from "..";
import Account from "../accounts";
import State from "../state/state";
import { buildPoseidon } from "../utils/crypto/poseidon_wasm";
import { createCleanTree } from "../utils/tree/normal-merkle-tree";

export async function register(
  id: BigInt,
  publicKeyX: BigInt,
  publicKeyY: BigInt,
  spki: string,
  state: State
): Promise<registerProofWitness> {
  let stateOldRoot = state.tree.getRoot();
  let acc = new Account(1000n, id, await createCleanTree(5));
  let accountOldRoot = acc.tree.getRoot();
  acc.tree.insert(acc.tree.hasher([publicKeyX, publicKeyY]));
  acc.publicKeys.push({ X: publicKeyX, Y: publicKeyY });
  acc.spkis.push(spki);
  let small = await acc.tree?.getPathProof(1);
  var stt = await state.tree.insert(await acc.getHash());
  let big = await state.tree.getPathProof(stt);

  return {
    publicKeyX: publicKeyX,
    publicKeyY: publicKeyY,
    accountIndex: 1,
    accountPath: small?.path,
    accountNewRoot: acc.tree?.getRoot(),
    accountOldRoot: accountOldRoot,
    stateIndex: stt,
    statePath: big.path,
    stateNewRoot: state.tree.getRoot(),
    stateOldRoot: stateOldRoot,
  };
}
