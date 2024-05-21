import sdk from "../../sdk";

import unitListing from "./unitListing.query";

describe("unitListing()", () => {
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await unitListing({
        ...sdk,
        unitListing: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});
