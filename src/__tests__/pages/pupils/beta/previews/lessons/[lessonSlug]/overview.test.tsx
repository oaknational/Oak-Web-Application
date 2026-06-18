import { getStaticProps } from "@/pages/pupils/beta/previews/lessons/[lessonSlug]/overview";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import OakError from "@/errors/OakError";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

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

describe("pages/pupils/beta/previews/lessons/[lessonSlug]/overview", () => {
  describe("getStaticProps", () => {
    it("Should call API:pupilPreviewLessonQuery", async () => {
      await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
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
      ).mockResolvedValueOnce({
        browseData: lessonBrowseDataFixture({}),
        content,
      });

      const res = (await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
        },
      })) as {
        props: PupilLessonPageProps;
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
        },
      });

      expect(res).toEqual({
        notFound: true,
      });
    });
  });
});
