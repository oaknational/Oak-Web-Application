import { buildAllUrlFields } from "./sitemap-pages-helper";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { teachersSitemapDataSchema } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.schema";
import { teachersSitemapDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/teachersSiteMap.fixture";

describe("teacher sitemaps", () => {
  describe("buildAllUrlFields", () => {
    it("returns results with expected properties", async () => {
      const parsedFixture = teachersSitemapDataSchema.parse(
        teachersSitemapDataFixture,
      );
      const firstHalf = await buildAllUrlFields({
        firstHalf: true,
        teachersSitemapData: keysToCamelCase({
          ...parsedFixture,
        }),
      });
      const secondHalf = await buildAllUrlFields({
        firstHalf: false,
        teachersSitemapData: keysToCamelCase({
          ...parsedFixture,
        }),
      });

      expect(firstHalf).toEqual(expect.any(Array));
      expect(firstHalf.length).toBeGreaterThan(0);
      expect(firstHalf[0]).toHaveProperty("loc");
      expect(firstHalf[0]).toHaveProperty("lastmod");
      expect(firstHalf[0]?.loc).toEqual(
        "http://localhost:3000/teachers/key-stages/ks1/subjects",
      );

      expect(secondHalf).toEqual(expect.any(Array));
      expect(secondHalf.length).toBeGreaterThan(0);
      expect(secondHalf[0]).toHaveProperty("loc");
      expect(secondHalf[0]).toHaveProperty("lastmod");
      expect(secondHalf[0]?.loc).toEqual(
        "http://localhost:3000/teachers/programmes/programme-2/units/unit-2/lessons/lesson-2",
      );
    });
  });
});
