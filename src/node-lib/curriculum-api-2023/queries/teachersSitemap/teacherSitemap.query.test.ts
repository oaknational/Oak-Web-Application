import sdk from "../../sdk";

import teacherSitemap from "./teacherSitemap.query";

describe("teacher sitemap query", () => {
  test("throws a not found error if no teacher sitemap is found", async () => {
    await expect(async () => {
      await teacherSitemap({
        ...sdk,

        teachersSitemap: jest.fn(() =>
          Promise.resolve({ teachersSitemap: [] }),
        ),
      })(false);
    }).rejects.toThrow(`Resource not found`);
  });
});
