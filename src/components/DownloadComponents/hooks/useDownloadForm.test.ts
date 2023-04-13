import { renderHook } from "@testing-library/react";

import downloadLessonResources from "../helpers/downloadLessonResources";
import type { DownloadFormProps } from "../../../components/DownloadComponents/downloads.types";

import useDownloadForm from "./useDownloadForm";

jest.mock("../helpers/downloadLessonResources", () => ({
  __esModule: true,
  default: jest.fn(),
}));

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

const data: DownloadFormProps = {
  onSubmit: jest.fn(),
  email: "test@test.com",
  school: "222-Sample school",
  schoolName: "Sample school",
  terms: true,
  downloads: ["intro-quiz-questions"],
};

describe("useDownloadForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("should set email in local storage if passed in props", () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    expect(mockSetEmailInLocalStorageFn).toHaveBeenCalledWith("test@test.com");
  });

  it("should set school in local storage if passed in props", () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
      schoolId: "222-Sample school",
      schoolName: "Sample school",
    });
  });

  it("should correctly set school in local storage if 'homeschool' passed in props", () => {
    const data: DownloadFormProps = {
      onSubmit: jest.fn(),
      email: "test@test.com",
      school: "homeschool",
      terms: true,
      downloads: ["intro-quiz-questions"],
    };

    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
      schoolId: "homeschool",
      schoolName: "homeschool",
    });
  });

  it("should correctly set school in local storage if 'notListed' passed in props", () => {
    const data: DownloadFormProps = {
      onSubmit: jest.fn(),
      email: "test@test.com",
      school: "notListed",
      terms: true,
      downloads: ["intro-quiz-questions"],
    };

    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
      schoolId: "notListed",
      schoolName: "notListed",
    });
  });

  it("should set terms in local storage if passed in props", () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    expect(mockSetTermsInLocalStorageFn).toHaveBeenCalledWith(true);
  });

  it("should call downloadLessonResources with correct parameters", async () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    await expect(downloadLessonResources).toHaveBeenCalledWith("lesson", [
      "intro-quiz-questions",
    ]);
  });
});
