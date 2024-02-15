import {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/lessons/[lessonSlug]";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import OakError from "@/errors/OakError";
import pupilLessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/pupilLessonOverview.fixture";
import { resolveOakHref } from "@/common-lib/urls";
import { PupilExperienceViewProps } from "@/components/PupilViews/PupilExperience";

jest.mock(
  "@/components/pupilComponents/pupilUtils/requestLessonResources",
  () => ({
    requestLessonResources: jest
      .fn()
      .mockResolvedValue({ transcriptSentences: [], hasWorksheet: false }),
  }),
);

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
    it("Should call API:pupilLessonOverview", async () => {
      await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
        },
      });

      expect(
        curriculumApi2023.pupilLessonOverviewCanonical,
      ).toHaveBeenCalledWith({
        lessonSlug: "lessonSlug",
      });
    });

    it("should return props", async () => {
      const curriculumData = pupilLessonOverviewFixture({
        isLegacy: true,
        unitSlug: "test-unit-slug",
      });

      (
        curriculumApi2023.pupilLessonOverviewCanonical as jest.Mock
      ).mockResolvedValueOnce(curriculumData);

      const res = (await getStaticProps({
        params: {
          lessonSlug: "lessonSlug",
        },
      })) as {
        props: PupilExperienceViewProps;
      };

      const backUrl = `${resolveOakHref({
        page: "classroom",
      })}/units/${curriculumData.unitSlug}`;

      expect(res.props.backUrl).toEqual(backUrl);
    });

    it("should return 404 if lesson not found", async () => {
      (
        curriculumApi2023.pupilLessonOverviewCanonical as jest.Mock
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
        curriculumApi2023.pupilLessonOverviewCanonical as jest.Mock
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
