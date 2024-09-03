import { renderHook, waitFor } from "@testing-library/react";

import useResourceFormSubmit from "./useResourceFormSubmit";

import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

const mockSetEmailInLocalStorageFn = jest.fn();
const mockSetSchoolInLocalStorageFn = jest.fn();
const mockSetTermsInLocalStorageFn = jest.fn();

jest.mock("./useLocalStorageForDownloads", () => {
  return jest.fn(() => ({
    setEmailInLocalStorage: mockSetEmailInLocalStorageFn,
    setSchoolInLocalStorage: mockSetSchoolInLocalStorageFn,
    setTermsInLocalStorage: mockSetTermsInLocalStorageFn,
  }));
});

const data: ResourceFormProps = {
  onSubmit: jest.fn(),
  email: "test@test.com",
  school: "222-Sample school",
  schoolName: "Sample school",
  terms: true,
  resources: ["intro-quiz-questions"],
};

describe("useResourceFormSubmit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });
  it("should set email in local storage if passed in props", async () => {
    const { result } = renderHook(() =>
      useResourceFormSubmit({ isLegacyDownload: true, type: "download" }),
    );
    result.current.onSubmit(data, "lesson");

    await waitFor(() => {
      expect(mockSetEmailInLocalStorageFn).toHaveBeenCalledWith(
        "test@test.com",
      );
    });
  });

  it("should set school in local storage if passed in props", async () => {
    const { result } = renderHook(() =>
      useResourceFormSubmit({ isLegacyDownload: true, type: "download" }),
    );
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
        schoolId: "222-Sample school",
        schoolName: "Sample school",
      });
    });
  });

  it("should correctly set school in local storage if 'homeschool' passed in props", async () => {
    const data: ResourceFormProps = {
      onSubmit: jest.fn(),
      email: "test@test.com",
      school: "homeschool",
      terms: true,
      resources: ["intro-quiz-questions"],
    };

    const { result } = renderHook(() =>
      useResourceFormSubmit({ isLegacyDownload: true, type: "download" }),
    );
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
        schoolId: "homeschool",
        schoolName: "homeschool",
      });
    });
  });

  it("should correctly set school in local storage if 'notListed' passed in props", async () => {
    const data: ResourceFormProps = {
      onSubmit: jest.fn(),
      email: "test@test.com",
      school: "notListed",
      terms: true,
      resources: ["intro-quiz-questions"],
    };

    const { result } = renderHook(() =>
      useResourceFormSubmit({ isLegacyDownload: true, type: "download" }),
    );
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
        schoolId: "notListed",
        schoolName: "notListed",
      });
    });
  });

  it("should set terms in local storage if passed in props", async () => {
    const { result } = renderHook(() =>
      useResourceFormSubmit({ isLegacyDownload: true, type: "download" }),
    );
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetTermsInLocalStorageFn).toHaveBeenCalledWith(true);
    });
  });

  it("should call downloadLessonResources with correct parameters", async () => {
    const { result } = renderHook(() =>
      useResourceFormSubmit({ isLegacyDownload: true, type: "download" }),
    );
    result.current.onSubmit(data, "lesson");

    await waitFor(() => {
      expect(downloadLessonResources).toHaveBeenCalledWith(
        "lesson",
        ["intro-quiz-questions"],
        true,
        false,
        null,
      );
    });
  });
});
