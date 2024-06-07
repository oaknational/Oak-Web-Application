import sdk from "../../sdk";

import pupilsSitemap from "./pupilsSitemap.query";

describe("teacher sitemap query", () => {
  test("throws a not found error if no teacher sitemap is found", async () => {
    await expect(async () => {
      await pupilsSitemap({
        ...sdk,
        pupilsSitemap: jest.fn(() => Promise.resolve({ pupilsSitemap: [] })),
      })();
    }).rejects.toThrow(`Resource not found`);
  });
});
