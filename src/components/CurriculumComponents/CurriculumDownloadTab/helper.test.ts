import { renderHook } from "@testing-library/react";

import {
  defaultValueWhenThrown,
  saveDownloadsDataToLocalStorage,
  useDownloadsLocalStorage,
} from "./helper";

import {
  LS_KEY_EMAIL,
  LS_KEY_SCHOOL,
  LS_KEY_TERMS,
} from "@/config/localStorageKeys";

describe("CurriculumDownloadTab / helper", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("defaultValueWhenThrown", () => {
    it("valid", () => {
      const result = defaultValueWhenThrown(() => "testing", "NOPE");
      expect(result).toEqual("testing");
    });

    it("invalid", () => {
      const result = defaultValueWhenThrown(() => {
        throw "invalid";
      }, "NOPE");
      expect(result).toEqual("NOPE");
    });
  });

  describe("useDownloadsLocalStorage", () => {
    it("defaults", () => {
      const { result } = renderHook(() => useDownloadsLocalStorage());
      expect(result.current).toEqual({
        isLoading: false,
        data: {
          isComplete: false,
          schoolId: undefined,
          schoolName: undefined,
          schoolNotListed: false,
          email: undefined,
          termsAndConditions: false,
        },
      });
    });

    it("localstorage", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(
        (key: string) => {
          if (key === LS_KEY_EMAIL) {
            return JSON.stringify("test@example.com");
          }
          if (key === LS_KEY_SCHOOL) {
            return JSON.stringify({
              schoolId: "1",
              schoolName: "Acme Inc",
            });
          }
          if (key === LS_KEY_TERMS) {
            return JSON.stringify(true);
          }
          throw "Invalid";
        },
      );

      const { result } = renderHook(() => useDownloadsLocalStorage());
      expect(result.current).toEqual({
        isLoading: false,
        data: {
          isComplete: true,
          schoolId: "1",
          schoolName: "Acme Inc",
          schoolNotListed: false,
          email: "test@example.com",
          termsAndConditions: true,
        },
      });
    });
  });

  describe("saveDownloadsDataToLocalStorage", () => {
    it("valid", () => {
      const fn = vi.spyOn(Storage.prototype, "setItem");

      saveDownloadsDataToLocalStorage({
        schoolId: "VALID_ID",
        schoolName: "VALID_NAME",
        schoolNotListed: false,
        email: "VALID@example.com",
        termsAndConditions: true,
      });

      expect(fn).toHaveBeenCalledWith(
        LS_KEY_EMAIL,
        JSON.stringify("VALID@example.com"),
      );
      expect(fn).toHaveBeenCalledWith(LS_KEY_TERMS, JSON.stringify(true));
      expect(fn).toHaveBeenCalledWith(
        LS_KEY_SCHOOL,
        JSON.stringify({
          schoolId: "VALID_ID",
          schoolName: "VALID_NAME",
        }),
      );
    });
  });
});
