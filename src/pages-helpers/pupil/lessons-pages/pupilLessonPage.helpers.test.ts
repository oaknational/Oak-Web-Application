import {
  buildPupilLessonPageProps,
  hydrateLessonContentResources,
  isAvailablePupilLessonSection,
} from "./pupilLessonPage.helpers";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

const mockRequestLessonResources = jest.fn();
jest.mock(
  "@/components/PupilComponents/pupilUtils/requestLessonResources",
  () => ({
    requestLessonResources: (args: { lessonContent: LessonContent }) =>
      mockRequestLessonResources(args),
  }),
);

const mockGetWorksheetInfo = jest.fn();
jest.mock("@/components/PupilComponents/pupilUtils/getWorksheetInfo", () => ({
  getWorksheetInfo: (slug: string) => mockGetWorksheetInfo(slug),
}));

beforeEach(() => {
  mockRequestLessonResources.mockReset();
  mockGetWorksheetInfo.mockReset();
});

describe("pupilLessonPage.helpers", () => {
  describe("isAvailablePupilLessonSection", () => {
    it("returns true for non-review sections regardless of content", () => {
      const lessonContent = lessonContentFixture({});
      expect(isAvailablePupilLessonSection("overview", lessonContent)).toBe(
        true,
      );
    });

    it("returns true for a review section available in the lesson content", () => {
      const lessonContent = lessonContentFixture({});
      expect(isAvailablePupilLessonSection("starter-quiz", lessonContent)).toBe(
        true,
      );
    });

    it("returns false for a review section not available in the lesson content", () => {
      const lessonContent = lessonContentFixture({ starterQuiz: [] });
      expect(isAvailablePupilLessonSection("starter-quiz", lessonContent)).toBe(
        false,
      );
    });
  });

  describe("hydrateLessonContentResources", () => {
    it("returns lessonContent with transcript sentences from requestLessonResources", async () => {
      mockRequestLessonResources.mockResolvedValueOnce(["one", "two"]);
      const lessonContent = lessonContentFixture({});

      const result = await hydrateLessonContentResources({ lessonContent });

      expect(result.transcriptSentences).toEqual(["one", "two"]);
    });

    it("returns lessonContent with empty transcripts when requestLessonResources errors and suppressErrors is true", async () => {
      mockRequestLessonResources.mockRejectedValueOnce(new Error("nope"));
      const lessonContent = lessonContentFixture({});

      const result = await hydrateLessonContentResources({
        lessonContent,
        suppressErrors: true,
      });

      expect(result.transcriptSentences).toEqual([]);
    });

    it("re-throws when requestLessonResources errors and suppressErrors is false", async () => {
      mockRequestLessonResources.mockRejectedValueOnce(new Error("boom"));
      const lessonContent = lessonContentFixture({});

      await expect(
        hydrateLessonContentResources({ lessonContent }),
      ).rejects.toThrow("boom");
    });

    it("falls back to an empty transcript array when requestLessonResources resolves to undefined", async () => {
      mockRequestLessonResources.mockResolvedValueOnce(undefined);
      const lessonContent = lessonContentFixture({});

      const result = await hydrateLessonContentResources({ lessonContent });

      expect(result.transcriptSentences).toEqual([]);
    });
  });

  describe("buildPupilLessonPageProps", () => {
    it("fetches worksheet info when hasWorksheetAssetObject is true", async () => {
      mockRequestLessonResources.mockResolvedValueOnce([]);
      const worksheetInfo = [
        { item: "worksheet-pdf", exists: true, fileSize: "1kb", ext: "pdf" },
      ];
      mockGetWorksheetInfo.mockResolvedValueOnce(worksheetInfo);

      const browseData = lessonBrowseDataFixture({});
      const lessonContent = lessonContentFixture({
        hasWorksheetAssetObject: true,
        downloadableFiles: null,
      });

      const props = await buildPupilLessonPageProps({
        browseData,
        lessonContent,
        backUrl: "/back",
        initialSection: "overview",
        pageType: "canonical",
      });

      expect(mockGetWorksheetInfo).toHaveBeenCalledWith(browseData.lessonSlug);
      expect(props.hasWorksheet).toBe(true);
      expect(props.worksheetInfo).toEqual(worksheetInfo);
      expect(props.hasAdditionalFiles).toBe(false);
      expect(props.additionalFiles).toBeNull();
    });
  });
});
