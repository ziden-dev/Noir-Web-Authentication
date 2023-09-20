import { int } from "hardhat/internal/core/params/argumentTypes";
import { registerProofWitness } from "..";
import Account from "../models/accounts/account.js";
import State from "../models/state/state.js";
import { getRSAPublicKeyFromSPKI } from "../utils/index.js";
import { uint8ArrayToBigInt } from "../utils/bits.js";

import { parseBase64url } from "../utils/scripts-webauthn/utils.js";
import { createCleanTree } from "../utils/tree/normal-merkle-tree.js";
import * as utils from "../utils/scripts-webauthn/utils.js";

export async function register(registration: any, state: State): Promise<registerProofWitness> {
  let id = uint8ArrayToBigInt(new Uint8Array(parseBase64url(registration!.credential.id!)));
  let spki = registration!.credential.publicKey!;
  let RSAPulicKey = await getRSAPublicKeyFromSPKI(spki);
  let acc = new Account(1000n, id, await createCleanTree(5), RSAPulicKey, spki);
  let intX = uint8ArrayToBigInt(new Uint8Array(utils.parseBase64url(RSAPulicKey.x)));
  let intY = uint8ArrayToBigInt(new Uint8Array(utils.parseBase64url(RSAPulicKey.y)));
  acc.tree.insert(acc.tree.hash([intX, intY]));
  acc.RSAPublicKeys.push(RSAPulicKey);
  acc.spkis.push(spki);

  let small = await acc.tree?.getPathProof(0);

  let stateOldRoot = state.tree.getRoot();
  let accHash = await acc.getHash();
  console.log("accHash = ", accHash);
  var stt = await state.tree.insert(accHash);
  let big = await state.tree.getPathProof(stt);

  return {
    publicKeyX: intX,
    publicKeyY: intY,
    accountIndex: 0,
    accountPath: small?.path,
    accountNewRoot: acc.tree?.getRoot(),
    stateIndex: stt,
    statePath: big.path,
    stateNewRoot: state.tree.getRoot(),
    stateOldRoot: stateOldRoot,
  };
}
