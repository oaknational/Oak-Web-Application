import { act, renderHook } from "@testing-library/react";

import "../../../__tests__/__helpers__/LocalStorageMock";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

describe("useLocalStorageForDownloads", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("schoolFromLocaleStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.schoolFromLocaleStorage).toBe("");
  });

  test("emailFromLocaleStorage should default to empty string", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    expect(result.current.emailFromLocaleStorage).toBe("");
  });

  test("calling setSchoolInLocaleStorage should set schoolFromLocaleStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setSchoolInLocaleStorage("Sample school");
    });
    expect(result.current.schoolFromLocaleStorage).toBe("Sample school");
  });

  test("calling setEmailInLocaleStorage should set emailFromLocaleStorage to correct value", () => {
    const { result } = renderHook(useLocalStorageForDownloads);
    act(() => {
      result.current.setEmailInLocaleStorage("test@test.com");
    });
    expect(result.current.emailFromLocaleStorage).toBe("test@test.com");
  });
});
