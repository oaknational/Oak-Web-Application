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
  test("throws a not found error if no teacher sitemap is found", async () => {
    await expect(async () => {
      await teacherSitemap({
        ...sdk,
        teachersSitemap: jest.fn(() =>
          Promise.resolve({
            keyStages: [],
            programmes: [],
            units: [],
            lessons: [],
            specialistProgrammes: [],
            specialistUnits: [],
            specialistLessons: [],
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
            keyStages: [{ lesson: "" }],
          }),
        ),
      })();
    }).rejects.toThrow(`slug`);
  });
});
