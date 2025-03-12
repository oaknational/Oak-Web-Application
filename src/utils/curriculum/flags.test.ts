import { isCurricRoutingEnabled } from "./flags";

it("isCurricRoutingEnabled", () => {
  // We don't want this enabled until release
  expect(isCurricRoutingEnabled()).toEqual(false);
});
