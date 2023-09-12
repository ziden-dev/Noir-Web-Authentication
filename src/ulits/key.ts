import pkg from "secp256k1";
const { ecdsaSign, publicKeyCreate } = pkg;
import {
  bigInt2Uint8Array,
  uint8ArrayToBigInt,
} from "../crypto/wasmcurves/utils.js";

import { CryptographyPrimitives } from "../crypto/index.js";

export async function getEDDSAPublicKeyFromPrivateKey(privateKey: bigint) {
  const crypto = await CryptographyPrimitives.getInstance();
  const F = crypto.bn128ScalarField;
  var eddsa = crypto.eddsa;

  const pubkey = eddsa.prv2pub(bigInt2Uint8Array(privateKey, 32));
  return {
    X: F.toObject(pubkey[0]),
    Y: F.toObject(pubkey[1]),
    type: PublicKeyType.EDDSA,
  };
}

export async function signEDDSAChallenge(
  privateKey: bigint,
  challenge: bigint
) {
  const crypto = await CryptographyPrimitives.getInstance();
  const F = crypto.bn128ScalarField;
  var eddsa = crypto.eddsa;
  const message = F.e(challenge);
  const signature = eddsa.signPoseidon(
    bigInt2Uint8Array(privateKey, 32),
    message
  );
  return {
    signature_s: signature.S,
    signature_r8_x: F.toObject(signature.R8[0]),
    signature_r8_y: F.toObject(signature.R8[1]),
  };
}

export async function signECDSAChallenge(
  privateKey: bigint,
  challenge: bigint
) {
  const res = ecdsaSign(
    bigInt2Uint8Array(challenge, 32),
    bigInt2Uint8Array(privateKey, 32)
  );
  return Array.from(res.signature);
}
