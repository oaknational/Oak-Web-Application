"use client";
import { waitFor } from "@testing-library/dom";

import { useEyfsSchoolData } from "./useEyfsSchoolData";

import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";

const mockUseLocalStorageForDownloads = jest.fn().mockReturnValue({
  setEmailInLocalStorage: jest.fn(),
  setSchoolInLocalStorage: jest.fn(),
  setTermsInLocalStorage: jest.fn(),
  schoolFromLocalStorage: {
    schoolName: "test-school-local",
    schoolId: "1-local",
  },
  emailFromLocalStorage: "test-email-local",
  termsFromLocalStorage: true,
});

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads",
  () => ({
    __esModule: true,
    default: () => mockUseLocalStorageForDownloads(),
  }),
);

const mockUseSWR = jest.fn().mockReturnValue({
  data: {
    schoolId: "SCHOOL_ID",
    schoolName: "SCHOOL_NAME",
    email: "EMAIL",
  },
  isLoading: false,
});

jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

describe("useEyfsSchoolData", () => {
  it("gets school from hubspot", async () => {
    const { result } = renderHookWithProviders()(() => useEyfsSchoolData());

    await waitFor(() => {
      expect(result.current.schoolId).toEqual("SCHOOL_ID-SCHOOL_NAME");
      expect(result.current.schoolName).toEqual("SCHOOL_NAME");
    });
  });
  it("gets schoool from local storage when unavailable from hubspot", async () => {
    mockUseSWR.mockReturnValue({ isLoading: false, data: undefined });
    const { result } = renderHookWithProviders()(() => useEyfsSchoolData());
    await waitFor(() => {
      expect(result.current.schoolId).toEqual("1-local");
      expect(result.current.schoolName).toEqual("test-school-local");
    });
  });
});
