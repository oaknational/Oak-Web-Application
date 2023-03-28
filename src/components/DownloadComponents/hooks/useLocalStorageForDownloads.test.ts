import { act, renderHook } from "@testing-library/react";

import "../../../__tests__/__helpers__/LocalStorageMock";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

describe("useLocalStorageForDownloads", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("schoolFromLocalStorage should default to object with schoolId and schoolName as empty strings", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.schoolFromLocalStorage).toStrictEqual({
      schoolId: "",
      schoolName: "",
    });
  });

  test("emailFromLocalStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.emailFromLocalStorage).toBe("");
  });

  test("termsFromLocalSotrage should default to false", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.termsFromLocalStorage).toBe(false);
  });

  test("calling setSchoolInLocalStorage with schoolId should set schoolFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setSchoolInLocalStorage({
        schoolId: "222-Sample school",
        schoolName: "",
      });
    });
    expect(result.current.schoolFromLocalStorage).toStrictEqual({
      schoolId: "222-Sample school",
      schoolName: "",
    });
  });

  test("calling setSchoolInLocalStorage with schoolName should set schoolFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setSchoolInLocalStorage({
        schoolId: "",
        schoolName: "Sample school",
      });
    });
    expect(result.current.schoolFromLocalStorage).toStrictEqual({
      schoolId: "",
      schoolName: "Sample school",
    });
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
