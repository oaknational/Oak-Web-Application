import { renderHook, waitFor } from "@testing-library/react";

import { fetchHubspotContactDetails } from "../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails";
import * as onboardingActions from "../../OnboardingForm/onboardingActions";

import {
  UseResourceFormStateProps,
  useResourceFormState,
} from "./useResourceFormState";

import { allResources as allDownloadResources } from "@/node-lib/curriculum-api-2023/fixtures/downloads.fixture";
import { allResources as allShareResources } from "@/node-lib/curriculum-api-2023/fixtures/shareableResources.fixture";
import {
  enableMockClerk,
  setUseUserReturn,
} from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockTeacherUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";

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

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(() => true),
}));

jest.mock("../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails");
jest.mock("../../OnboardingForm/onboardingActions");

const mockSetEmailInLocalStorageFn = jest.fn();
const mockSetSchoolInLocalStorageFn = jest.fn();
const mockSetTermsInLocalStorageFn = jest.fn();

const mockSetValue = jest.fn();

const actualUseForm = jest.requireActual("react-hook-form").useForm;

jest.mock("./useLocalStorageForDownloads", () => {
  return jest.fn(() => ({
    setEmailInLocalStorage: mockSetEmailInLocalStorageFn,
    setSchoolInLocalStorage: mockSetSchoolInLocalStorageFn,
    setTermsInLocalStorage: mockSetTermsInLocalStorageFn,
    schoolFromLocalStorage: {
      schoolName: "test-school-local",
      schoolId: "1-local",
    },
    emailFromLocalStorage: "test-email-local",
    termsFromLocalStorage: true,
  }));
});

describe("useResourceFormState", () => {
  beforeEach(() => {
    enableMockClerk();
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
        ]);
      });
      test("useResourceFormState should return correct string for worksheet ", () => {
        useRouter.mockReturnValue({
          pathname: "/",
          query: { preselected: "worksheet" },
        });
        const { result } = renderHook(() => useResourceFormState(shareProps));

        expect(result.current.selectedResources).toEqual(["worksheet-pdf"]);
      });
    });
  });
  describe("State local storage and auth", () => {
    test("should set email, school and terms from local storage if not logged in ", async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const useFormSpy = jest.spyOn(require("react-hook-form"), "useForm");

      useFormSpy.mockImplementation(() => {
        const result = actualUseForm(); // Use the actual useForm without recursion
        return {
          ...result,
          setValue: mockSetValue, // Mock only setValue
        };
      });
      const { result } = renderHook(() =>
        useResourceFormState({ ...downloadProps }),
      );
      expect(mockSetValue).toHaveBeenCalledWith("email", "test-email-local");
      expect(result.current.emailFromLocalStorage).toEqual("test-email-local");
      expect(mockSetValue).toHaveBeenCalledWith("school", "1-local");
      expect(result.current.schoolIdFromLocalStorage).toEqual("1-local");
      expect(mockSetValue).toHaveBeenCalledWith("terms", true);
    });
    test("should set email, school and terms from hubspot and clerk user if logged in ", async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const useFormSpy = jest.spyOn(require("react-hook-form"), "useForm");
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockTeacherUserWithDownloadAccess,
      });

      (fetchHubspotContactDetails as jest.Mock).mockResolvedValue({
        schoolName: "test-school",
        schoolId: "1",
      });
      (onboardingActions.getSubscriptionStatus as jest.Mock).mockResolvedValue(
        true,
      );

      useFormSpy.mockImplementation(() => {
        const result = actualUseForm();
        return {
          ...result,
          setValue: mockSetValue,
        };
      });
      renderHook(() => useResourceFormState({ ...downloadProps }));

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("email", "test-email");
      });

      await waitFor(() =>
        expect(mockSetEmailInLocalStorageFn).toHaveBeenCalledWith("test-email"),
      );

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("school", "1");
      });

      await waitFor(() =>
        expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
          schoolId: "1",
          schoolName: "test-school",
        }),
      );

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("terms", true);
      });

      await waitFor(() =>
        expect(mockSetTermsInLocalStorageFn).toHaveBeenCalledWith(true),
      );
    });
  });
});
