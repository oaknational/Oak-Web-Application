import { renderHook } from "@testing-library/react";
import mockRouter from 'next-router-mock';

import {
  UseResourceFormStateProps,
  useResourceFormState,
} from "./useResourceFormState";

import { allResources as allDownloadResources } from "@/node-lib/curriculum-api/fixtures/downloads.fixture";
import { allResources as allShareResources } from "@/node-lib/curriculum-api/fixtures/shareableResources.fixture";

const downloadProps: UseResourceFormStateProps = {
  downloadResources: allDownloadResources,
  type: "download",
};

const shareProps: UseResourceFormStateProps = {
  shareResources: allShareResources,
  type: "share",
};


describe("useResourceFormState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("download", () => {
    test("useResourceFormState should return all downloads selected array if router.preselected is undefined ", async () => {
      mockRouter.setCurrentUrl("/");

      const result = renderHook(() => useResourceFormState(downloadProps));

      expect(result.result.current.selectedResources).toEqual([
        "presentation",
        "intro-quiz-questions",
        "intro-quiz-answers",
        "exit-quiz-questions",
        "exit-quiz-answers",
        "worksheet-pdf",
        "worksheet-pptx",
      ]);
    });

    test("useResourceFormState should return presentation selected router.preselected 'slide deck", () => {
      mockRouter.setCurrentUrl("/?preselected=slide%20deck");
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual(["presentation"]);
    });
    test("useResourceFormState should return worksheet array selected router.preselected 'worksheet", () => {
      mockRouter.setCurrentUrl("/?preselected=worksheet");
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "worksheet-pdf",
        "worksheet-pptx",
      ]);
    });
    test("useResourceFormState should return quiz exit array selected router.preselected 'exit quiz", () => {
      mockRouter.setCurrentUrl("/?preselected=exit%20quiz");
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "exit-quiz-questions",
        "exit-quiz-answers",
      ]);
    });
    test("useResourceFormState should return intro quiz array selected router.preselected 'starter quiz", () => {
      mockRouter.setCurrentUrl("/?preselected=starter%20quiz");
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "intro-quiz-questions",
        "intro-quiz-answers",
      ]);
    });
    test("useResourceFormState should return quiz array selected router.preselected 'exit quiz", () => {
      mockRouter.setCurrentUrl("/?preselected=exit%20quiz");
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "exit-quiz-questions",
        "exit-quiz-answers",
      ]);
    });
    describe("share", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });
      test("useResourceFormState should return all shared selected array if router.preselected is undefined ", () => {
        mockRouter.setCurrentUrl("/");
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "video",
          "worksheet-pdf",
          "exit-quiz-questions",
          "intro-quiz-questions",
        ]);
      });
      test("useResourceFormState should return correct string for video ", () => {
        mockRouter.setCurrentUrl("/?preselected=video");
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual(["video"]);
      });
      test("useResourceFormState should return correct string for quiz ", () => {
        mockRouter.setCurrentUrl("/?preselected=starter%20quiz");
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "intro-quiz-questions",
          "intro-quiz-answers",
        ]);
      });
      test("useResourceFormState should return correct string for quiz exit ", () => {
        mockRouter.setCurrentUrl("/?preselected=exit%20quiz");
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "exit-quiz-questions",
          "exit-quiz-answers",
        ]);
      });
      test("useResourceFormState should return correct string for worksheet ", () => {
        mockRouter.setCurrentUrl("/?preselected=worksheet");
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "worksheet-pdf",
          "worksheet-pptx",
        ]);
      });
    });
  });
});
