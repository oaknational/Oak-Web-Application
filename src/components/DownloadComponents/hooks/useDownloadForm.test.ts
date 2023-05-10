import { renderHook, waitFor } from "@testing-library/react";

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

jest.mock("../../../browser-lib/hubspot/forms/hubspotSubmitForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("./useLocalStorageForDownloads", () => {
  return jest.fn(() => ({
    setEmailInLocalStorage: mockSetEmailInLocalStorageFn,
    setSchoolInLocalStorage: mockSetSchoolInLocalStorageFn,
    setTermsInLocalStorage: mockSetTermsInLocalStorageFn,
  }));
});

jest.mock("../../../hooks/useUtmParams", () => ({
  __esModule: true,
  default: () => ({ utm_source: "les_twitz" }),
}));

const data: DownloadFormProps = {
  onSubmit: jest.fn(),
  email: "test@test.com",
  school: "222-Sample school",
  schoolName: "Sample school",
  terms: true,
  downloads: ["intro-quiz-questions"],
};
const getHubspotUserToken = jest.fn(() => "hubspotutk value");
jest.mock("../../../browser-lib/hubspot/forms/getHubspotUserToken", () => ({
  __esModule: true,
  default: (...args: []) => getHubspotUserToken(...args),
}));

describe("useDownloadForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });
  it("should attempt to get the hubspotutk cookie", async () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    expect(getHubspotUserToken).toHaveBeenCalled();
  });
  it("should set email in local storage if passed in props", async () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    await waitFor(() => {
      expect(mockSetEmailInLocalStorageFn).toHaveBeenCalledWith(
        "test@test.com"
      );
    });
  });

  it("should set school in local storage if passed in props", async () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
        schoolId: "222-Sample school",
        schoolName: "Sample school",
      });
    });
  });

  it("should correctly set school in local storage if 'homeschool' passed in props", async () => {
    const data: DownloadFormProps = {
      onSubmit: jest.fn(),
      email: "test@test.com",
      school: "homeschool",
      terms: true,
      downloads: ["intro-quiz-questions"],
    };

    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
        schoolId: "homeschool",
        schoolName: "homeschool",
      });
    });
  });

  it("should correctly set school in local storage if 'notListed' passed in props", async () => {
    const data: DownloadFormProps = {
      onSubmit: jest.fn(),
      email: "test@test.com",
      school: "notListed",
      terms: true,
      downloads: ["intro-quiz-questions"],
    };

    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetSchoolInLocalStorageFn).toHaveBeenCalledWith({
        schoolId: "notListed",
        schoolName: "notListed",
      });
    });
  });

  it("should set terms in local storage if passed in props", async () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");
    await waitFor(() => {
      expect(mockSetTermsInLocalStorageFn).toHaveBeenCalledWith(true);
    });
  });

  it("should call downloadLessonResources with correct parameters", async () => {
    const { result } = renderHook(() => useDownloadForm());
    result.current.onSubmit(data, "lesson");

    await waitFor(() => {
      expect(downloadLessonResources).toHaveBeenCalledWith("lesson", [
        "intro-quiz-questions",
      ]);
    });
  });
});
