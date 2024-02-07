import {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";

jest.mock("@/utils/handleTranscript");

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
    it("Should call API:pupilLessonOverview on 'pupil'", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonOverview,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
        lessonSlug: "lessonSlug",
      });
      expect(curriculumApi2023.default.pupilLessonOverview).toHaveBeenCalled();
    });
    it("Should call both API::pupilLessonOverview on 'teachers-2023'", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonOverview,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
        lessonSlug: "lessonSlug",
      });
      expect(
        curriculumApi2023.default.pupilLessonOverview,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
        lessonSlug: "lessonSlug",
      });
    });
  });
});
