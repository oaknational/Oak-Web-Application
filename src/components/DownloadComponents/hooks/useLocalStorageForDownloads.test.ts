import { act, renderHook } from "@testing-library/react";

import "../../../__tests__/__helpers__/LocalStorageMock";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

describe("useLocalStorageForDownloads", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("schoolIdFromLocalStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.schoolIdFromLocalStorage).toBe("");
  });

  test("schoolNameFromLocalStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.schoolNameFromLocalStorage).toBe("");
  });

  test("emailFromLocalStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.emailFromLocalStorage).toBe("");
  });

  test("termsFromLocalSotrage should default to false", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.termsFromLocalStorage).toBe(false);
  });

  test("calling setSchoolIdInLocalStorage should set schoolFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setSchoolIdInLocalStorage("222-Sample school");
    });
    expect(result.current.schoolIdFromLocalStorage).toBe("222-Sample school");
  });

  test("calling setSchoolNameInLocalStorage should set schoolNameFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setSchoolNameInLocalStorage("Sample school");
    });
    expect(result.current.schoolNameFromLocalStorage).toBe("Sample school");
  });

  test("calling setEmailInLocalStorage should set emailFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setEmailInLocalStorage("test@test.com");
    });
    expect(result.current.emailFromLocalStorage).toBe("test@test.com");
  });

  test("calling setTermsInLocalSotrage should set termsFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setTermsInLocalStorage(true);
    });
    expect(result.current.termsFromLocalStorage).toBe(true);
  });
});
