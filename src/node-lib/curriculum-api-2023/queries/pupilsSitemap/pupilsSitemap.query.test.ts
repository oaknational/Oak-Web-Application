import sdk from "../../sdk";

import pupilsSitemap from "./pupilsSitemap.query";

describe("teacher sitemap query", () => {
  test("throws a not found error if no teacher sitemap is found", async () => {
    await expect(async () => {
      await pupilsSitemap({
        ...sdk,
        teachersSitemap: jest.fn(() =>
          Promise.resolve({ teachersSitemap: [] }),
        ),
      })();
    }).rejects.toThrow(`Resource not found`);
  });
});
