import { getStaticProps } from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/[section]";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";

jest.mock(
  "@/components/PupilComponents/pupilUtils/requestLessonResources",
  () => ({
    requestLessonResources: jest
      .fn()
      .mockResolvedValue({ transcriptSentences: [], hasWorksheet: false }),
  }),
);

jest.mock("@/components/PupilComponents/pupilUtils/getWorksheetInfo", () => ({
  getWorksheetInfo: jest.fn().mockResolvedValue({}),
}));

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/index", () => {
  describe("getStaticProps", () => {
    it("Should call API:pupilLessonQuery", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(curriculumApi2023.default.pupilLessonQuery).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
        lessonSlug: "lessonSlug",
      });
    });
  });
});
