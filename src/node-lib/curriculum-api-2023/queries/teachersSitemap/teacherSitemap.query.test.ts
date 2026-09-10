import {
  teachersSitemapDataFixture,
  teachersSitemapDataFixtureCamelCase,
} from "../../fixtures/teachersSiteMap.fixture";
import sdk from "../../sdk";

import teacherSitemap from "./teacherSitemap.query";

describe("teacher sitemap query", () => {
  test("it returns data in the correct shape", async () => {
    const res = await teacherSitemap({
      ...sdk,
      teachersSitemap: jest.fn(() =>
        Promise.resolve(teachersSitemapDataFixture),
      ),
    })();
    expect(res).toEqual(teachersSitemapDataFixtureCamelCase);
  });

  test("preserves actions on programme filter units", async () => {
    const res = await teacherSitemap({
      ...sdk,
      teachersSitemap: jest.fn(() =>
        Promise.resolve(teachersSitemapDataFixture),
      ),
    })();

    const ruleOfLaw = res.programmeFilterUnits.find(
      (unit) => unit.subjectSlug === "rule-of-law",
    );

    expect(ruleOfLaw?.actions).toEqual({
      programme_field_overrides: { year_slug: "all-years" },
    });
  });

  test("throws a not found error if no teacher sitemap is found", async () => {
    await expect(async () => {
      await teacherSitemap({
        ...sdk,
        teachersSitemap: jest.fn(() =>
          Promise.resolve({
            units: [],
            lessons: [],
            programmeFilterUnits: [],
          }),
        ),
      })();
    }).rejects.toThrow(`Resource not found`);
  });
  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await teacherSitemap({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        teachersSitemap: jest.fn(() =>
          Promise.resolve({
            ...teachersSitemapDataFixture,
            units: [{ programme_slug: "programme-1" }],
          }),
        ),
      })();
    }).rejects.toThrow(`unit_slug`);
  });
});
