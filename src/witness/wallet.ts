import Account from "../models/accounts/account";
import State from "../models/state/state";

import * as utils from "../utils/scripts-webauthn/utils.js";
import { parseCryptoKey } from "../utils/scripts-webauthn/server";
import { error } from "console";
export async function changeAmount(authenticaion: any, acc: Account, state: State) {
  const authenticatorData = authenticaion.authenticatorData;
  const clientData = authenticaion.clientData;
  const signature = authenticaion.signature;

  let clientHash = await utils.sha256(utils.parseBase64url(clientData));

  let comboBuffer = utils.concatenateBuffers(utils.parseBase64url(authenticatorData), clientHash);
  let signatureBuffer = utils.parseBase64url(signature);

  const algoParams = { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" };

  var challenge = await utils.sha256(comboBuffer);
  let sigInput = new Uint8Array(signatureBuffer);
  let challengeInput = new Uint8Array(challenge);

  acc.spkis.forEach(async function (spki, index) {
    let cryptoKey = await parseCryptoKey(algoParams, spki);
    console.debug(cryptoKey);
    const isValid = await crypto.subtle.verify(algoParams, cryptoKey, signatureBuffer, comboBuffer);

    let small = await acc.tree.getPathProof(index);

    let stateIndex = -1;
    let accHash = await acc.getHash();
    state.tree.leaves.forEach((e, index) => {
      if (accHash == e) stateIndex = index;
    });

    if (stateIndex == -1) throw " Not fount account in state";
    let big = await state.tree.getPathProof(stateIndex);
    if (isValid == true) {
      // find out
      let publickey = acc.publicKeys.at(index);
      let publickeyX = publickey.X;
      let publickeyY = publickey.Y;

      return {
        publicKeyX: publickeyX,
        publicKeyY: publickeyY,
        signature: sigInput,
        challenge: challengeInput,

        accountPath: small.path,
        accountIndex: small.index,
        accountRoot: acc.tree.getRoot(),

        statePath: big.path,
        stateIndex: big.index,
        stateRoot: state.tree.getRoot(),
      };
    }
  });
}
