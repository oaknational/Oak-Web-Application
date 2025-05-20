import { getStaticProps } from "@/pages/pupils/beta/previews/lessons/[lessonSlug]/[section]";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import OakError from "@/errors/OakError";
import { PupilExperienceViewProps } from "@/components/PupilViews/PupilExperience";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";

jest.mock(
  "@/components/PupilComponents/pupilUtils/requestLessonResources",
  () => ({
    requestLessonResources: jest
      .fn()
      .mockResolvedValue({ transcriptSentences: [], hasWorksheet: false }),
  }),
);

jest.mock("@/components/PupilComponents/pupilUtils/getWorksheetInfo", () => ({
  getWorksheetInfo: jest
    .fn()
    .mockResolvedValue({ transcriptSentences: [], hasWorksheet: false }),
}));

describe("pages/pupils/beta/previews/lessons/[lessonSlug]/index", () => {
  describe("getStaticProps", () => {
    it("Should call API:pupilPreviewLessonQuery", async () => {
      await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(curriculumApi2023.pupilPreviewLessonQuery).toHaveBeenCalledWith({
        lessonSlug: "lessonSlug",
      });
    });

    it("should return props", async () => {
      const content = lessonContentFixture({});

      (
        curriculumApi2023.pupilPreviewLessonQuery as jest.Mock
      ).mockResolvedValueOnce({ content });

      const res = (await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      })) as {
        props: PupilExperienceViewProps;
      };

      expect(res.props.lessonContent.lessonId).toEqual(content.lessonId);
    });

    it("should return 404 if lesson not found", async () => {
      (
        curriculumApi2023.pupilPreviewLessonQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        notFound: true,
      });
    });

    it("should return 404 if lesson not found", async () => {
      (
        curriculumApi2023.pupilPreviewLessonQuery as jest.Mock
      ).mockResolvedValueOnce(null);
      const res = await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        notFound: true,
      });
    });
  });
});
