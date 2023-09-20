import { int } from "hardhat/internal/core/params/argumentTypes";
import { addKeyProofWitness, registerProofWitness } from "..";
import Account from "../models/accounts/account.js";
import State from "../models/state/state.js";
import { getRSAPublicKeyFromSPKI } from "../utils/index.js";
import { uint8ArrayToBigInt } from "../utils/bits.js";

import { parseBase64url } from "../utils/scripts-webauthn/utils.js";
import { createCleanTree } from "../utils/tree/normal-merkle-tree.js";
import * as utils from "../utils/scripts-webauthn/utils.js";
import { stat } from "fs";

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
  let stt = await state.tree.insert(accHash);
  let big = await state.tree.getPathProof(stt);
  return {
    account: acc,
    inputs: {
      publicKeyX: intX,
      publicKeyY: intY,
      accountIndex: 0,
      accountPath: small?.path,
      accountNewRoot: acc.tree?.getRoot(),
      stateIndex: stt,
      statePath: big.path,
      stateNewRoot: state.tree.getRoot(),
      stateOldRoot: stateOldRoot,
    },
  };
}

export async function addKey(
  registration: any,
  acc: Account,
  state: State
): Promise<addKeyProofWitness> {
  let id = uint8ArrayToBigInt(new Uint8Array(parseBase64url(registration!.credential.id!)));
  let spki = registration!.credential.publicKey!;
  let RSAPulicKey = await getRSAPublicKeyFromSPKI(spki);

  let oldSmall = acc.tree.getPathProof(acc.tree.leaves.length);
  let oldSmallRoot = acc.tree.getRoot();
  let intX = uint8ArrayToBigInt(new Uint8Array(utils.parseBase64url(RSAPulicKey.x)));
  let intY = uint8ArrayToBigInt(new Uint8Array(utils.parseBase64url(RSAPulicKey.y)));

  let stt = acc.tree.insert(acc.tree.hash([intX, intY]));
  acc.RSAPublicKeys.push(RSAPulicKey);
  acc.spkis.push(spki);

  let newsmall = acc.tree.getPathProof(stt);
  let index = -1;
  state.tree.leaves.forEach((v, i) => {
    if (v.toNode(Function) == oldSmallRoot) index = i;
  });

  let oldbig = state.tree.getPathProof(index);
  let oldBigRoot = state.tree.getRoot();
  state.tree.leaves[index] = {
    toNode(hash: Function) {
      return acc.tree.getRoot();
    },
  };

  state.tree.update(index);

  let newbig = state.tree.getPathProof(index);

  return {
    publicKeyX: intX,
    publicKeyY: intY,

    oldleaf: oldSmall.value,
    accountIndex: Number(oldSmall.index),
    accountPath: oldSmall.path,
    accountOldRoot: oldSmallRoot,
    accountNewRoot: acc.tree.getRoot(),
    stateIndex: index,
    statePath: newbig.path,
    stateNewRoot: state.tree.getRoot(),
    stateOldRoot: oldBigRoot,
  };
}
