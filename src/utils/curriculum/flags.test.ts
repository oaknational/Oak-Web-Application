import { isCurricRoutingEnabled } from "./flags";

it("isCurricRoutingEnabled", () => {
  // Enabled on release
  expect(isCurricRoutingEnabled()).toEqual(true);
});
