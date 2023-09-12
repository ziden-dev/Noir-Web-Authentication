import { assert } from "console";
import circuit from "../src/circuits/authentication/target/authentication.json" assert { type: "json" };
import { decompressSync } from "fflate";
import {
  Crs,
  newBarretenbergApiAsync,
  RawBuffer,
} from "@aztec/bb.js/dest/node/index.js";

describe("test authentication", () => {
  let acirBuffer: any;
  let acirBufferUncompressed: any;
  let api: any;
  let acirComposer: any;
  before(async () => {
    acirBuffer = Buffer.from(circuit.bytecode, "base64");
    acirBufferUncompressed = decompressSync(acirBuffer);
    api = await newBarretenbergApiAsync(4);
    const [_exact, circuitSize, _subgroup] = await api.acirGetCircuitSizes(
      acirBufferUncompressed
    );
    const subgroupSize = Math.pow(2, Math.ceil(Math.log2(circuitSize)));
    const crs = await Crs.new(subgroupSize + 1);
    await api.commonInitSlabAllocator(subgroupSize);
    await api.srsInitSrs(
      new RawBuffer(crs.getG1Data()),
      crs.numPoints,
      new RawBuffer(crs.getG2Data())
    );
    const acirComposer = await api.acirNewAcirComposer(subgroupSize);
  });
  it("circuit authentication ", async () => {});
});
