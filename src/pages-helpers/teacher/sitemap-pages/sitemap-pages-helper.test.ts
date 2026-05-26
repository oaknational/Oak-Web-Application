import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { teachersSitemapDataFixtureCamelCase } from "@/node-lib/curriculum-api-2023/fixtures/teachersSiteMap.fixture";

describe("teacher sitemaps", () => {
  beforeEach(() => {
    process.env.SITEMAP_BASE_URL = "http://localhost:3000";
  });

  afterEach(() => {
    process.env.SITEMAP_BASE_URL = "";
    jest.resetModules();
  });

  describe("buildTeachersSitemapEntries", () => {
    it("returns integrated programme, unit, and lesson URLs", async () => {
      const { buildTeachersSitemapEntries } = await import(
        "./sitemap-pages-helper"
      );
      const entries = buildTeachersSitemapEntries(
        teachersSitemapDataFixtureCamelCase,
        curriculumPhaseOptionsFixture(),
      );
      const allUrls = entries.map((entry) => entry.url);

      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0]).toHaveProperty("url");
      expect(entries[0]).toHaveProperty("lastModified");

      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/english-primary/units",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/english-secondary-aqa/units",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/english-secondary-edexcel/units",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/geography-secondary/units",
      );
      expect(allUrls).not.toContain(
        "http://localhost:3000/teachers/programmes/programme-1/units",
      );

      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/programme-1/units/unit-1/lessons",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/programme-1/units/unit-1/lessons/lesson-1",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/programme-2/units/unit-2/lessons/lesson-2",
      );
    });

    it("uses SITEMAP_BASE_URL", async () => {
      process.env.SITEMAP_BASE_URL = "https://www.thenational.academy";

      const { buildTeachersSitemapEntries } = await import(
        "./sitemap-pages-helper"
      );
      const entries = buildTeachersSitemapEntries(
        teachersSitemapDataFixtureCamelCase,
        curriculumPhaseOptionsFixture(),
      );

      expect(entries[0]?.url).toMatch(/^https:\/\/www\.thenational\.academy\//);
    });

    it("throws when SITEMAP_BASE_URL is not defined", async () => {
      delete process.env.SITEMAP_BASE_URL;

      const { buildTeachersSitemapEntries } = await import(
        "./sitemap-pages-helper"
      );

      expect(() =>
        buildTeachersSitemapEntries(
          teachersSitemapDataFixtureCamelCase,
          curriculumPhaseOptionsFixture(),
        ),
      ).toThrow(
        "process.env.SITEMAP_BASE_URL not defined. See code in next.config.ts",
      );
    });
  });
});
