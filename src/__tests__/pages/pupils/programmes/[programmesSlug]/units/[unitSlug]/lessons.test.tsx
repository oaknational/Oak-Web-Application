import {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/beta//programmes/[programmeSlug]/units/[unitSlug]/lessons";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/index", () => {
  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();
      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should call API:pupilLessonLisitngQuery", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonListingQuery,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
      });
    });
  });
});
