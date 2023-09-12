import { assert } from "node:console";
import { authenticaion, registration } from "../src/mockdata.js";
import { getAlgoParams } from "../src/scripts/server.js";
import { NamedAlgo } from "../src/scripts/types.js";
import * as utils from "../src/scripts/utils.js";
import { convertToHexAndPad } from "../src/ulits/bits.js";
import { X509Certificate } from "node:crypto";

import { webcrypto } from "node:crypto";

import * as crypto from "node:crypto";

import * as asn from "asn1js";

import * as Forge from "node-forge";
import { isTypedArray } from "node:util/types";

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

    var challgne = await utils.sha256(comboBuffer);
    console.log(" kk ", challgne);

    const isValid = await webcrypto.subtle.verify(
      algoParams,
      cryptoKey,
      signatureBuffer,
      comboBuffer
    );

    console.log(" Verify on nodejs:crypto  = ", isValid);

    const inputs = [
      new Uint8Array(utils.parseBase64url(PublicKeyJSON.x!)),
      new Uint8Array(utils.parseBase64url(PublicKeyJSON.y!)),
      new Uint8Array(signatureBuffer),
      new Uint8Array(challgne),
    ];

    console.log(" INPUT = ", inputs);

    const witness = new Map<number, string>();
    inputs.forEach((input, index) => {
      witness.set(index + 1, convertToHexAndPad(input));
    });

    console.log(witness);
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
