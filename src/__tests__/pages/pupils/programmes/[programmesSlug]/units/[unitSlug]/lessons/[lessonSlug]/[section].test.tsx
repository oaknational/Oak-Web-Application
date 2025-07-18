import { getStaticProps } from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/[section]";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import OakError from "@/errors/OakError";

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
    it("should return redirect if lesson not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        redirect: {
          destination: "/pupils/lessons/lessonSlug-redirected",
          permanent: true,
          basePath: false,
        },
      });
    });
    it("should return canonical redirect if lesson not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockResolvedValueOnce(null);

      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });
      expect(res).toEqual({
        redirect: {
          destination: "/pupils/lessons/lessonSlug-redirected",
          permanent: true,
          basePath: false,
        },
      });
    });
    it("should return 404 if lesson not found and redirect not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (
        curriculumApi2023.default.pupilBrowseLessonRedirectQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        notFound: true,
      });
    });
    it("should return 404 if lesson not found and redirect not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockResolvedValueOnce(null);
      (
        curriculumApi2023.default.pupilBrowseLessonRedirectQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
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
