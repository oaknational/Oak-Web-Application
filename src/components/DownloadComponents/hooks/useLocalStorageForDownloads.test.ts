import { act, renderHook } from "@testing-library/react";

import "../../../__tests__/__helpers__/LocalStorageMock";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

describe("useLocalStorageForDownloads", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("schoolFromLocalStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.schoolFromLocalStorage).toBe("");
  });

  test("emailFromLocalStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.emailFromLocalStorage).toBe("");
  });

  test("termsFromLocalSotrage should default to false", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.termsFromLocalStorage).toBe(false);
  });

  test("calling setSchoolInLocalStorage should set schoolFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setSchoolInLocalStorage("Sample school");
    });
    expect(result.current.schoolFromLocalStorage).toBe("Sample school");
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
    expect(result.current.setTermsInLocalStorage).toBe(true);
  });
});
