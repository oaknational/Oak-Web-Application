import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import "@/__tests__/__helpers__/LocalStorageMock";

describe("useLocalStorageForDownloads", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("schoolFromLocalStorage should default to object with schoolId and schoolName as empty strings", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.schoolFromLocalStorage).toStrictEqual({
      schoolId: "",
      schoolName: "",
    });
  });

  it("emailFromLocalStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.emailFromLocalStorage).toBe("");
  });

  it("termsFromLocalSotrage should default to false", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.termsFromLocalStorage).toBe(false);
  });

  it("calling setSchoolInLocalStorage with schoolId should set schoolFromLocalStorage to correct value", () => {
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

  it("calling setSchoolInLocalStorage with schoolName should set schoolFromLocalStorage to correct value", () => {
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

  it("calling setEmailInLocalStorage should set emailFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setEmailInLocalStorage("test@test.com");
    });
    expect(result.current.emailFromLocalStorage).toBe("test@test.com");
  });

  it("calling setTermsInLocalSotrage should set termsFromLocalStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setTermsInLocalStorage(true);
    });
    expect(result.current.termsFromLocalStorage).toBe(true);
  });
});
