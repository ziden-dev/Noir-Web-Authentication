import { LargeNumberLike } from "crypto";
import Account from "./models/accounts/account";

export interface registerProofWitness {
  account: Account;
  inputs: {
    publicKeyX: BigInt;
    publicKeyY: BigInt;
    accountIndex: number;
    accountPath: BigInt[];
    accountNewRoot: BigInt;
    stateIndex: number;
    statePath: BigInt[];
    stateNewRoot: BigInt;
    stateOldRoot: BigInt;
  };
}

export interface addKeyProofWitness {
  publicKeyX: BigInt;
  publicKeyY: BigInt;

  oldleaf: BigInt;
  accountIndex: number;
  accountPath: BigInt[];
  accountNewRoot: BigInt;
  accountOldRoot: BigInt;

  stateIndex: number;
  statePath: BigInt[];
  stateNewRoot: BigInt;
  stateOldRoot: BigInt;
}

export interface authenticaionProofWitness {
  publicKeyX: BigInt;
  publicKeyY: BigInt;
  signature: ArrayBuffer;
  challenge: ArrayBuffer;

  accountPath: BigInt[];
  accountIndex: number;
  accountRoot: BigInt;

  statePath: BigInt[];
  stateIndex: number;
  stateRoot: BigInt;
}

export interface RSAPublicKey {
  x: string;
  y: string;
}
