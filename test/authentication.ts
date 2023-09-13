import { authenticaion, registration } from "../src/mockdata.js";
import { getAlgoParams } from "../src/scripts/server.js";
import { NamedAlgo } from "../src/scripts/types.js";
import * as utils from "../src/scripts/utils.js";
import { convertToHexAndPad } from "../src/utils/bits.js";
import circuit from "../src/circuits/authentication/target/authentication.json" assert { type: "json" };
import { webcrypto } from "node:crypto";

import * as crypto from "node:crypto";
import { validateWitness } from "../src/berretenberg-api/index.js";
import { expect } from "chai";

describe("test authentication", () => {
  before(async () => {});

  it("circuit authentication ", async () => {
    const algorithm: NamedAlgo = <NamedAlgo>registration.credential.algorithm;
    const publicKey = registration.credential.publicKey;
    const authenticatorData = authenticaion.authenticatorData;
    const clientData = authenticaion.clientData;
    const signature = authenticaion.signature;

    const algoParams = getAlgoParams(algorithm);
    console.log(algoParams);
    console.log(publicKey);
    let cryptoKey = await parseCryptoKey(algoParams, publicKey);
    console.log("cryptoKey = ", cryptoKey);
    const PublicKeyJSON = await crypto.webcrypto.subtle.exportKey(
      "jwk",
      cryptoKey
    );

    console.log(" PublicKeyJSON ", PublicKeyJSON);

    let clientHash = await utils.sha256(utils.parseBase64url(clientData));

    let comboBuffer = utils.concatenateBuffers(
      utils.parseBase64url(authenticatorData),
      clientHash
    );
    let signatureBuffer = utils.parseBase64url(signature);

    if (algorithm == "ES256")
      signatureBuffer = convertASN1toRaw(signatureBuffer);

    console.log("algoParams ", algoParams);
    console.log(" signatureBuffer ", signatureBuffer);

    console.log(" comboBuffer ", comboBuffer);

    var challenge = await utils.sha256(comboBuffer);
    console.log(" kk ", challenge);

    const isValid = await webcrypto.subtle.verify(
      algoParams,
      cryptoKey,
      signatureBuffer,
      comboBuffer
    );

    expect(isValid).to.be.true;

    let pubXInput = new Uint8Array(utils.parseBase64url(PublicKeyJSON.x!));
    let pubYInput = new Uint8Array(utils.parseBase64url(PublicKeyJSON.y!));
    let sigInput = new Uint8Array(signatureBuffer);
    let challengeInput = new Uint8Array(challenge);

    const inputs = [...pubXInput, ...pubYInput, ...sigInput, ...challengeInput];

    console.log(" INPUT = ", inputs);

    const witness = new Map<number, string>();
    inputs.forEach((input, index) => {
      witness.set(index + 1, convertToHexAndPad(input));
    });

    console.log(witness);

    const isWitnessValid = await validateWitness(witness, circuit);
    expect(isWitnessValid).to.be.true;
  });
});

async function parseCryptoKey(algoParams: any, publicKey: string) {
  const buffer = utils.parseBase64url(publicKey);
  return webcrypto.subtle.importKey("spki", buffer, algoParams, true, [
    "verify",
  ]);
}

function convertASN1toRaw(signatureBuffer: ArrayBuffer) {
  // Convert signature from ASN.1 sequence to "raw" format
  const usignature = new Uint8Array(signatureBuffer);
  const rStart = usignature[4] === 0 ? 5 : 4;
  const rEnd = rStart + 32;
  const sStart = usignature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  const r = usignature.slice(rStart, rEnd);
  const s = usignature.slice(sStart);
  return new Uint8Array([...r, ...s]);
}
