import { renderHook } from "@testing-library/react";

import downloadLessonResources from "../helpers/downloadLessonResources";
import type {
  DownloadFormProps,
  DownloadResourceType,
} from "../../../components/DownloadComponents/downloads.types";

import useDownloadForm from "./useDownloadForm";

jest.mock("../helpers/downloadLessonResources", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockSetEmailInLocalStorageFn = jest.fn();
const mockSetSchoolIdInLocalStorageFn = jest.fn();
const mockSetTermsInLocalStorageFn = jest.fn();

jest.mock("./useLocalStorageForDownloads", () => {
  return jest.fn(() => ({
    setEmailInLocalStorage: mockSetEmailInLocalStorageFn,
    setSchoolIdInLocalStorage: mockSetSchoolIdInLocalStorageFn,
    setTermsInLocalStorage: mockSetTermsInLocalStorageFn,
  }));
});

const data: DownloadFormProps = {
  onSubmit: jest.fn(),
  email: "test@test.com",
  school: "Sample school",
  terms: true,
  downloads: ["intro-quiz-questions"],
};

const resourcesToDownload: DownloadResourceType[] = ["intro-quiz-questions"];

describe("useDownloadForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should set email in local storage if passed in props", () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson", resourcesToDownload);

    expect(mockSetEmailInLocalStorageFn).toHaveBeenCalledWith("test@test.com");
  });

  it("should set school in local storage if passed in props", () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson", resourcesToDownload);

    expect(mockSetSchoolIdInLocalStorageFn).toHaveBeenCalledWith(
      "Sample school"
    );
  });

  it("should set terms in local storage if passed in props", () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson", resourcesToDownload);

    expect(mockSetTermsInLocalStorageFn).toHaveBeenCalledWith(true);
  });

  it("should call downloadLessonResources with correct parameters", async () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson", resourcesToDownload);

    await expect(downloadLessonResources).toHaveBeenCalledWith("lesson", [
      "intro-quiz-questions",
    ]);
  });
});
