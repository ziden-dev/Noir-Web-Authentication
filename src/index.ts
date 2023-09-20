import { LargeNumberLike } from "crypto";

export interface registerProofWitness {
  publicKeyX: BigInt;
  publicKeyY: BigInt;
  accountIndex: number;
  accountPath: BigInt[];
  accountNewRoot: BigInt;
  accountOldRoot: BigInt;
  stateIndex: number;
  statePath: BigInt[];
  stateNewRoot: BigInt;
  stateOldRoot: BigInt;
}

export interface accKeyProofWitness {
  publicKeyX: BigInt;
  publicKeyY: BigInt;
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
