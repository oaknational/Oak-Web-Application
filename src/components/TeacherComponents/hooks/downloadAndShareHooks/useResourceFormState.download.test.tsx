import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";

import {
  UseResourceFormStateProps,
  useResourceFormState,
} from "./useResourceFormState";

import { allResources as allDownloadResources } from "@/node-lib/curriculum-api-2023/fixtures/downloads.fixture";
import { allResources as allShareResources } from "@/node-lib/curriculum-api-2023/fixtures/shareableResources.fixture";

const downloadProps: UseResourceFormStateProps = {
  downloadResources: allDownloadResources,
  type: "download",
};

const shareProps: UseResourceFormStateProps = {
  shareResources: allShareResources,
  type: "share",
};

vi.mock("../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails");
vi.mock("../../OnboardingForm/onboardingActions");

const mockSetEmailInLocalStorageFn = vi.fn();
const mockSetSchoolInLocalStorageFn = vi.fn();
const mockSetTermsInLocalStorageFn = vi.fn();

vi.mock("./useLocalStorageForDownloads", () => ({
  default: () => ({
    setEmailInLocalStorage: mockSetEmailInLocalStorageFn,
    setSchoolInLocalStorage: mockSetSchoolInLocalStorageFn,
    setTermsInLocalStorage: mockSetTermsInLocalStorageFn,
    schoolFromLocalStorage: {
      schoolName: "test-school-local",
      schoolId: "1-local",
    },
    emailFromLocalStorage: "test-email-local",
    termsFromLocalStorage: true,
  }),
}));

describe("useResourceFormState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.setCurrentUrl("/");
  });
  describe("download", () => {
    test("useResourceFormState should return all downloads selected array if router.preselected is undefined ", async () => {
      await mockRouter.push({
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

    test("useResourceFormState should return presentation selected router.preselected 'slide deck", async () => {
      await mockRouter.push({
        pathname: "/",
        query: { preselected: "slide deck" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual(["presentation"]);
    });
    test("useResourceFormState should return worksheet array selected router.preselected 'worksheet", async () => {
      await mockRouter.push({
        pathname: "/",
        query: { preselected: "worksheet" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "worksheet-pdf",
        "worksheet-pptx",
      ]);
    });
    test("useResourceFormState should return quiz exit array selected router.preselected 'exit quiz", async () => {
      await mockRouter.push({
        pathname: "/",
        query: { preselected: "exit quiz" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "exit-quiz-questions",
        "exit-quiz-answers",
      ]);
    });
    test("useResourceFormState should return intro quiz array selected router.preselected 'starter quiz", async () => {
      await mockRouter.push({
        pathname: "/",
        query: { preselected: "starter quiz" },
      });
      const { result } = renderHook(() => useResourceFormState(downloadProps));
      expect(result.current.selectedResources).toEqual([
        "intro-quiz-questions",
        "intro-quiz-answers",
      ]);
    });
    test("useResourceFormState should return quiz array selected router.preselected 'quiz", async () => {
      await mockRouter.push({
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
        vi.clearAllMocks();
      });
      test("useResourceFormState should return all shared selected array if router.preselected is undefined ", async () => {
        await mockRouter.push({
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
      test("useResourceFormState should return correct string for video ", async () => {
        await mockRouter.push({
          pathname: "/",
          query: { preselected: "video" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual(["video"]);
      });
      test("useResourceFormState should return correct string for quiz ", async () => {
        await mockRouter.push({
          pathname: "/",
          query: { preselected: "starter quiz" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "intro-quiz-questions",
        ]);
      });
      test("useResourceFormState should return correct string for quiz exit ", async () => {
        await mockRouter.push({
          pathname: "/",
          query: { preselected: "exit quiz" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual([
          "exit-quiz-questions",
        ]);
      });
      test("useResourceFormState should return correct string for worksheet ", async () => {
        await mockRouter.push({
          pathname: "/",
          query: { preselected: "worksheet" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual(["worksheet-pdf"]);
      });
    });
  });
});
