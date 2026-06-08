import { buildTeachersSitemapEntries } from "./sitemap-pages-helper";

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
    it("returns integrated programme (units and curriculum explainer), unit, and lesson URLs", async () => {
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
        "http://localhost:3000/teachers/programmes/english-primary/curriculum-explainer",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/english-secondary-aqa/units",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/english-secondary-aqa/curriculum-explainer",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/english-secondary-edexcel/units",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/english-secondary-edexcel/curriculum-explainer",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/geography-secondary/units",
      );
      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/geography-secondary/curriculum-explainer",
      );
      expect(allUrls).not.toContain(
        "http://localhost:3000/teachers/programmes/programme-1/units",
      );
      expect(allUrls).not.toContain(
        "http://localhost:3000/teachers/programmes/programme-1/curriculum-explainer",
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

    it("omits curriculum explainer URLs for non-curriculum subjects", async () => {
      const entries = buildTeachersSitemapEntries({ units: [], lessons: [] }, [
        {
          title: "Financial education",
          slug: "financial-education",
          phases: [{ title: "Secondary", slug: "secondary" }],
          ks4_options: [],
          keystages: [{ title: "KS3", slug: "ks3" }],
          non_curriculum: true,
        },
      ]);
      const allUrls = entries.map((entry) => entry.url);

      expect(allUrls).toContain(
        "http://localhost:3000/teachers/programmes/financial-education-secondary/units",
      );
      expect(allUrls).not.toContain(
        "http://localhost:3000/teachers/programmes/financial-education-secondary/curriculum-explainer",
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
