import { renderHook } from "@testing-library/react";

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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("useResourceFormState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("download", () => {
    test("useResourceFormState should return all downloads selected array if router.preselected is undefined ", async () => {
      useRouter.mockReturnValue({
        pathname: "/",
        query: { preselected: [] },
      });

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
      useRouter.mockReturnValue({
        pathname: "/",
        query: { preselected: "slide deck" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual(["presentation"]);
    });
    test("useResourceFormState should return worksheet array selected router.preselected 'worksheet", () => {
      useRouter.mockReturnValue({
        pathname: "/",
        query: { preselected: "worksheet" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "worksheet-pdf",
        "worksheet-pptx",
      ]);
    });
    test("useResourceFormState should return quiz exit array selected router.preselected 'exit quiz", () => {
      useRouter.mockReturnValue({
        pathname: "/",
        query: { preselected: "exit quiz" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "exit-quiz-questions",
        "exit-quiz-answers",
      ]);
    });
    test("useResourceFormState should return intro quiz array selected router.preselected 'starter quiz", () => {
      useRouter.mockReturnValue({
        pathname: "/",
        query: { preselected: "starter quiz" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "intro-quiz-questions",
        "intro-quiz-answers",
      ]);
    });
    test("useResourceFormState should return quiz array selected router.preselected 'quiz", () => {
      useRouter.mockReturnValue({
        pathname: "/",
        query: { preselected: "exit quiz" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "exit-quiz-questions",
        "exit-quiz-answers",
      ]);
    });
    describe("share", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      test("useResourceFormState should return all shared selected array if router.preselected is undefined ", () => {
        useRouter.mockReturnValue({
          pathname: "/",
          query: { preselected: [] },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "video",
          "worksheet-pdf",
          "exit-quiz-questions",
          "intro-quiz-questions",
        ]);
      });
      test("useResourceFormState should return correct string for video ", () => {
        useRouter.mockReturnValue({
          pathname: "/",
          query: { preselected: "video" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual(["video"]);
      });
      test("useResourceFormState should return correct string for quiz ", () => {
        useRouter.mockReturnValue({
          pathname: "/",
          query: { preselected: "starter quiz" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "intro-quiz-questions",
          "intro-quiz-answers",
        ]);
      });
      test("useResourceFormState should return correct string for quiz exit ", () => {
        useRouter.mockReturnValue({
          pathname: "/",
          query: { preselected: "exit quiz" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "exit-quiz-questions",
          "exit-quiz-answers",
        ]);
      });
      test("useResourceFormState should return correct string for worksheet ", () => {
        useRouter.mockReturnValue({
          pathname: "/",
          query: { preselected: "worksheet" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "worksheet-pdf",
          "worksheet-pptx",
        ]);
      });
    });
  });
});
