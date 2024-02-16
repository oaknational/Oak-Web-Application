import {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/l/[redirectFrom]/lessons/[lessonSlug]";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import OakError from "@/errors/OakError";
import { resolveOakHref } from "@/common-lib/urls";

jest.mock(
  "@/components/PupilComponents/pupilUtils/requestLessonResources",
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
          redirectFrom: "redirectFrom",
        },
      });

      expect(
        curriculumApi2023.pupilLessonOverviewCanonical,
      ).toHaveBeenCalledWith({
        lessonSlug: "lessonSlug",
      });
    });
  });

  it("should return redirect if lesson not found", async () => {
    (
      curriculumApi2023.pupilLessonOverviewCanonical as jest.Mock
    ).mockRejectedValueOnce(new OakError({ code: "curriculum-api/not-found" }));

    const res = await getStaticProps({
      params: {
        lessonSlug: "lessonSlug",
        redirectFrom: "redirectFrom",
      },
    });

    const redirectUrl = `${resolveOakHref({
      page: "classroom",
    })}/lessons/lessonSlug`;

    expect(res).toEqual({
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    });
  });

  it("should return redirect if lesson not found", async () => {
    (
      curriculumApi2023.pupilLessonOverviewCanonical as jest.Mock
    ).mockResolvedValueOnce(null);

    const res = await getStaticProps({
      params: {
        lessonSlug: "lessonSlug",
        redirectFrom: "redirectFrom",
      },
    });

    const redirectUrl = `${resolveOakHref({
      page: "classroom",
    })}/lessons/lessonSlug`;

    expect(res).toEqual({
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    });
  });
});
