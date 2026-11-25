import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { buildAllUrlFields } from "@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper";

describe("pupils sitemaps", () => {
  describe("buildAllUrlFields", () => {
    it("excludes Years 1–9 but retains the hub and Years 10–11 across both halves", async () => {
      const entries = [
        ...(await buildAllUrlFields({ firstHalf: true })),
        ...(await buildAllUrlFields({ firstHalf: false })),
      ];
      const paths = entries.map(({ loc }) => new URL(loc).pathname);

      for (let year = 1; year <= 9; year++) {
        expect(paths).not.toContain(`/pupils/years/year-${year}/subjects`);
      }
      expect(paths).toEqual(
        expect.arrayContaining([
          "/pupils/years",
          "/pupils/years/year-10/subjects",
          "/pupils/years/year-11/subjects",
        ]),
      );
    });

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
