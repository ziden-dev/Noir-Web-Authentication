import { string } from "hardhat/internal/core/params/argumentTypes.js";
import * as crypto from "node:crypto";
import { RSAPublicKey } from "../index.js";
export async function getRSAPublicKeyFromSPKI(
  spki: string
): Promise<RSAPublicKey> {
  const algoParams = {
    name: "ECDSA",
    namedCurve: "P-256",
    hash: "SHA-256",
  };

  let cryptoKey = await parseCryptoKey(algoParams, spki);
  const publicKeyJSON = await crypto.webcrypto.subtle.exportKey(
    "jwk",
    cryptoKey
  );
  return {
    x: publicKeyJSON.x!,
    y: publicKeyJSON.y!,
  };
}
export function b64ToBn(b64: any) {
  var bin = atob(b64);
  var hex: any[] = [];

  bin.split("").forEach(function (ch) {
    var h = ch.charCodeAt(0).toString(16);
    if (h.length % 2) {
      h = "0" + h;
    }
    hex.push(h);
  });

  return BigInt("0x" + hex.join(""));
}

function arrayBufferToBigInt(arrayBuffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  const hexString = Array.from(uint8Array, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return BigInt(`0x${hexString}`);
}

import { webcrypto } from "node:crypto";
import * as utils from "./scripts-webauthn/utils.js";

export async function parseCryptoKey(algoParams: any, publicKey: string) {
  const buffer = utils.parseBase64url(publicKey);
  return webcrypto.subtle.importKey("spki", buffer, algoParams, true, [
    "verify",
  ]);
}
