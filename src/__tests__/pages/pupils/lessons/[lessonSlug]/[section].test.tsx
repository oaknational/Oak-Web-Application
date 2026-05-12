import { getStaticProps } from "@/pages/pupils/lessons/[lessonSlug]/[section]";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import OakError from "@/errors/OakError";
import { resolveOakHref } from "@/common-lib/urls";
import { PupilExperienceViewProps } from "@/components/PupilViews/PupilExperience";
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

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/index", () => {
  describe("getStaticProps", () => {
    it("Should call API:pupilLessonQuery", async () => {
      await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(curriculumApi2023.pupilLessonQuery).toHaveBeenCalledWith({
        lessonSlug: "lessonSlug",
      });
    });

    it("should return props", async () => {
      const curriculumData = {
        browseData: lessonBrowseDataFixture({
          isLegacy: true,
          unitSlug: "test-unit-slug",
        }),
        content: lessonContentFixture({}),
      };

      (curriculumApi2023.pupilLessonQuery as jest.Mock).mockResolvedValueOnce(
        curriculumData,
      );

      const res = (await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      })) as {
        props: PupilExperienceViewProps;
      };

      const backUrl = resolveOakHref({ page: "pupil-year-index" });

      expect(res.props.backUrl).toEqual(backUrl);
    });
    it("should return redirect if lesson not found", async () => {
      (curriculumApi2023.pupilLessonQuery as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        redirect: {
          destination: "/pupils/lessons/lessonSlug-redirected?redirected=true",
          statusCode: 301, // true = 308, false = 307
          basePath: false,
        },
      });
    });
    it("should return redirect if lesson not found", async () => {
      (curriculumApi2023.pupilLessonQuery as jest.Mock).mockResolvedValueOnce(
        null,
      );

      const res = await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });
      expect(res).toEqual({
        redirect: {
          destination: "/pupils/lessons/lessonSlug-redirected?redirected=true",
          statusCode: 301,
          basePath: false,
        },
      });
    });
    it("should return 404 if lesson not found and redirect not found", async () => {
      (curriculumApi2023.pupilLessonQuery as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (
        curriculumApi2023.pupilCanonicalLessonRedirectQuery as jest.Mock
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
    it("should return 404 if lesson not found and redirect not found", async () => {
      (curriculumApi2023.pupilLessonQuery as jest.Mock).mockResolvedValueOnce(
        null,
      );
      (
        curriculumApi2023.pupilCanonicalLessonRedirectQuery as jest.Mock
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
  });
});
