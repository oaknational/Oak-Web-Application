import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { buildAllUrlFields } from "@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper";

describe("pupils sitemaps", () => {
  describe("buildAllUrlFields", () => {
    it("returns results with expected properties", async () => {
      const firstHalf = await buildAllUrlFields({ firstHalf: true });
      const secondHalf = await buildAllUrlFields({ firstHalf: false });

      expect(curriculumApi2023.pupilsSitemap).toHaveBeenCalled();
      expect(firstHalf).toEqual(expect.any(Array));
      expect(firstHalf.length).toBeGreaterThan(0);
      expect(firstHalf[0]).toHaveProperty("loc");
      expect(firstHalf[0]).toHaveProperty("lastmod");

      expect(secondHalf).toEqual(expect.any(Array));
      expect(secondHalf.length).toBeGreaterThan(0);
      expect(secondHalf[0]).toHaveProperty("loc");
      expect(secondHalf[0]).toHaveProperty("lastmod");
    });
  });
});
