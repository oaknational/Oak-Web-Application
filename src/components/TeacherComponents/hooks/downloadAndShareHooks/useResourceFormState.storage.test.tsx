import { Mock, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { fetchHubspotContactDetails } from "../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails";
import * as onboardingActions from "../../OnboardingForm/onboardingActions";

import {
  UseResourceFormStateProps,
  useResourceFormState,
} from "./useResourceFormState";

import { allResources as allDownloadResources } from "@/node-lib/curriculum-api-2023/fixtures/downloads.fixture";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockTeacherUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";

const downloadProps: UseResourceFormStateProps = {
  downloadResources: allDownloadResources,
  type: "download",
};

vi.mock("../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails");
vi.mock("../../OnboardingForm/onboardingActions");

const mockSetEmailInLocalStorageFn = vi.fn();
const mockSetSchoolInLocalStorageFn = vi.fn();
const mockSetTermsInLocalStorageFn = vi.fn();

const mockSetValue = vi.fn();

// Mock react-hook-form
vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useForm: () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(actual as any).useForm(),
      setValue: mockSetValue,
    }),
  };
});

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
  });

  describe("State local storage and auth", () => {
    test("should set email, school and terms from local storage if not logged in ", async () => {
      const { result } = renderHook(() =>
        useResourceFormState({ ...downloadProps }),
      );

      expect(mockSetValue).toHaveBeenCalledWith("email", "test-email-local");
      expect(result.current.emailFromLocalStorage).toEqual("test-email-local");
      expect(mockSetValue).toHaveBeenCalledWith("school", "1-local");
      expect(result.current.schoolIdFromLocalStorage).toEqual("1-local");
      expect(mockSetValue).toHaveBeenCalledWith("terms", true);
    });
    test("should set email and terms from hubspot and clerk user if logged in, school from local storage ", async () => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: mockTeacherUserWithDownloadAccess,
      });

      (fetchHubspotContactDetails as Mock).mockResolvedValue({
        schoolName: "test-school",
        schoolId: "1",
      });
      (onboardingActions.getSubscriptionStatus as Mock).mockResolvedValue(true);

      renderHook(() => useResourceFormState({ ...downloadProps }));

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("email", "test-email");
      });

      await waitFor(() =>
        expect(mockSetEmailInLocalStorageFn).toHaveBeenCalledWith("test-email"),
      );

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("school", "1-local");
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
